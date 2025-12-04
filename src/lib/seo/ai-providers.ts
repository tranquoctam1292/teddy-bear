/**
 * AI Providers Integration
 * Supports OpenAI, Claude, and Gemini APIs
 */

export type AIProvider = 'openai' | 'claude' | 'gemini' | 'rule-based';

export interface AIGenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIGenerationResponse {
  content: string;
  provider: AIProvider;
  tokensUsed?: number;
  model?: string;
}

/**
 * OpenAI Provider
 */
export class OpenAIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt },
          ],
          max_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return {
        content,
        provider: 'openai',
        tokensUsed: data.usage?.total_tokens,
        model: this.model,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

/**
 * Claude Provider (Anthropic)
 */
export class ClaudeProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    this.model = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7,
          system: request.systemPrompt || 'You are a helpful SEO assistant.',
          messages: [
            {
              role: 'user',
              content: request.prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude API error');
      }

      const data = await response.json();
      const content = data.content[0]?.text || '';

      return {
        content,
        provider: 'claude',
        tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
        model: this.model,
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
}

/**
 * Gemini Provider (Google)
 */
export class GeminiProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || 'gemini-pro';
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${request.systemPrompt || 'You are a helpful SEO assistant.'}\n\n${request.prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: request.maxTokens || 500,
            temperature: request.temperature || 0.7,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API error');
      }

      const data = await response.json();
      const content = data.candidates[0]?.content?.parts[0]?.text || '';

      return {
        content,
        provider: 'gemini',
        tokensUsed: data.usageMetadata?.totalTokenCount,
        model: this.model,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

/**
 * Get AI Provider instance
 */
export function getAIProvider(provider: AIProvider = 'rule-based'): {
  generate: (request: AIGenerationRequest) => Promise<AIGenerationResponse>;
  provider: AIProvider;
} | null {
  // Check which providers are available
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;

  // Auto-select provider if not specified
  if (provider === 'rule-based') {
    if (hasOpenAI) provider = 'openai';
    else if (hasClaude) provider = 'claude';
    else if (hasGemini) provider = 'gemini';
    else return null; // Fall back to rule-based
  }

  switch (provider) {
    case 'openai':
      if (!hasOpenAI) return null;
      return new OpenAIProvider();
    case 'claude':
      if (!hasClaude) return null;
      return new ClaudeProvider();
    case 'gemini':
      if (!hasGemini) return null;
      return new GeminiProvider();
    default:
      return null;
  }
}

/**
 * Generate content with AI (with fallback)
 */
export async function generateWithAI(
  prompt: string,
  options: {
    provider?: AIProvider;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
    fallbackToRuleBased?: boolean;
  } = {}
): Promise<AIGenerationResponse> {
  const {
    provider = 'rule-based',
    maxTokens = 500,
    temperature = 0.7,
    systemPrompt,
    fallbackToRuleBased = true,
  } = options;

  const aiProvider = getAIProvider(provider);

  if (!aiProvider) {
    if (fallbackToRuleBased) {
      // Fallback to rule-based generation
      return {
        content: '', // Will be handled by rule-based generator
        provider: 'rule-based',
      };
    }
    throw new Error(`AI provider ${provider} not available`);
  }

  try {
    return await aiProvider.generate({
      prompt,
      maxTokens,
      temperature,
      systemPrompt,
    });
  } catch (error) {
    console.error(`Error with ${provider}:`, error);
    if (fallbackToRuleBased && provider !== 'rule-based') {
      // Fallback to rule-based
      return {
        content: '',
        provider: 'rule-based',
      };
    }
    throw error;
  }
}



