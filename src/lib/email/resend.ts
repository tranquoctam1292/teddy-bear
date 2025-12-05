/**
 * Resend Email Service Integration
 * 
 * Documentation: https://resend.com/docs
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface ResendResponse {
  id: string;
}

export class ResendService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@emotionalhouse.vn';
    this.fromName = process.env.RESEND_FROM_NAME || 'The Emotional House';

    if (!this.apiKey) {
      console.warn('⚠️  RESEND_API_KEY not configured. Emails will not be sent.');
    }
  }

  /**
   * Send email using Resend API
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Resend API key not configured',
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from || `${this.fromName} <${this.fromEmail}>`,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          reply_to: options.replyTo,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Resend API error: ${response.statusText}`);
      }

      const data: ResendResponse = await response.json();

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }
}

// Export singleton instance
let resendInstance: ResendService | null = null;

export function getResendService(): ResendService {
  if (!resendInstance) {
    resendInstance = new ResendService();
  }
  return resendInstance;
}





