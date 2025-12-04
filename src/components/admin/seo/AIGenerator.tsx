'use client';

/**
 * AI Generator Component
 * Generate meta descriptions, titles, and content suggestions
 */
import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';
import { Label } from '@/components/admin/ui/label';

interface AIGeneratorProps {
  content?: string;
  keyword?: string;
  onGenerated?: (type: string, value: string) => void;
}

export default function AIGenerator({
  content = '',
  keyword = '',
  onGenerated,
}: AIGeneratorProps) {
  const [type, setType] = useState<'meta-description' | 'title' | 'optimize-title' | 'content-suggestions' | 'keyword-variations'>('meta-description');
  const [inputContent, setInputContent] = useState(content);
  const [inputKeyword, setInputKeyword] = useState(keyword);
  const [inputTitle, setInputTitle] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'claude' | 'gemini' | 'auto'>('auto');
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Check available AI providers
    fetch('/api/admin/seo/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'meta-description', content: 'test', useAI: false }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.ai?.availableProviders) {
          setAvailableProviders(data.ai.availableProviders);
          if (data.ai.availableProviders.length > 0) {
            setUseAI(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResult(null);

      const body: any = {
        type,
        keyword: inputKeyword || undefined,
        useAI: useAI && (type === 'meta-description' || type === 'title'),
        aiProvider: useAI && aiProvider !== 'auto' ? aiProvider : undefined,
      };

      if (type === 'optimize-title') {
        body.title = inputTitle;
      } else {
        body.content = inputContent;
      }

      const response = await fetch('/api/admin/seo/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        const value = data.data.metaDescription || data.data.title || data.data.optimizedTitle || '';
        if (value) {
          onGenerated?.(type, value);
        }
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      console.error('Error generating:', error);
      setResult({ error: 'Failed to generate content' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Tạo meta description, title, và suggestions tự động
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Type Selector */}
          <div>
            <Label htmlFor="type">Loại</Label>
            <Select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="meta-description">Meta Description</option>
              <option value="title">Title</option>
              <option value="optimize-title">Optimize Title</option>
              <option value="content-suggestions">Content Suggestions</option>
              <option value="keyword-variations">Keyword Variations</option>
            </Select>
          </div>

          {/* AI Provider Selection */}
          {availableProviders.length > 0 && (type === 'meta-description' || type === 'title') && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="useAI" className="cursor-pointer">
                  Sử dụng AI (OpenAI/Claude/Gemini)
                </Label>
              </div>
              {useAI && (
                <div>
                  <Label htmlFor="aiProvider">AI Provider</Label>
                  <Select
                    id="aiProvider"
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value as any)}
                  >
                    <option value="auto">Tự động chọn</option>
                    {availableProviders.includes('openai') && (
                      <option value="openai">OpenAI</option>
                    )}
                    {availableProviders.includes('claude') && (
                      <option value="claude">Claude (Anthropic)</option>
                    )}
                    {availableProviders.includes('gemini') && (
                      <option value="gemini">Gemini (Google)</option>
                    )}
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Keyword Input */}
          <div>
            <Label htmlFor="keyword">Từ khóa (tùy chọn)</Label>
            <Input
              id="keyword"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              placeholder="Nhập từ khóa..."
            />
          </div>

          {/* Content Input */}
          {(type === 'meta-description' || type === 'title' || type === 'content-suggestions') && (
            <div>
              <Label htmlFor="content">Nội dung</Label>
              <textarea
                id="content"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Nhập nội dung..."
              />
            </div>
          )}

          {/* Title Input for optimize-title */}
          {type === 'optimize-title' && (
            <div>
              <Label htmlFor="title">Title hiện tại</Label>
              <Input
                id="title"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="Nhập title cần tối ưu..."
              />
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading || (!inputContent && type !== 'optimize-title' && type !== 'keyword-variations') || (type === 'optimize-title' && !inputTitle) || (type === 'keyword-variations' && !inputKeyword)}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Tạo {type === 'meta-description' ? 'Meta Description' : type === 'title' ? 'Title' : type === 'optimize-title' ? 'Optimized Title' : type === 'content-suggestions' ? 'Suggestions' : 'Variations'}
              </>
            )}
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-3">
              {result.metaDescription && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Meta Description</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result.metaDescription, 'meta')}
                    >
                      {copied === 'meta' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{result.metaDescription}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {result.metaDescription.length} / 160 ký tự
                  </p>
                </div>
              )}

              {(result.title || result.optimizedTitle) && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Title</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result.title || result.optimizedTitle, 'title')}
                    >
                      {copied === 'title' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{result.title || result.optimizedTitle}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(result.title || result.optimizedTitle).length} / 60 ký tự
                  </p>
                </div>
              )}

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm font-medium mb-2 block">Suggestions</span>
                  <ul className="list-disc list-inside space-y-1">
                    {result.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.variations && result.variations.length > 0 && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="text-sm font-medium mb-2 block">Keyword Variations</span>
                  <div className="flex flex-wrap gap-2">
                    {result.variations.map((variation: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-sm"
                      >
                        {variation}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{result.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Note */}
          {result && result.ai && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="font-medium text-blue-900">
                {result.ai.used === 'ai'
                  ? `✓ Đã sử dụng ${result.ai.availableProviders.find((p: string) => p === aiProvider) || result.ai.availableProviders[0]} AI`
                  : 'Sử dụng rule-based generation'}
              </p>
              {result.ai.availableProviders.length === 0 && (
                <p className="text-blue-700 mt-1">
                  Để sử dụng AI, set environment variables: OPENAI_API_KEY, ANTHROPIC_API_KEY, hoặc GEMINI_API_KEY
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

