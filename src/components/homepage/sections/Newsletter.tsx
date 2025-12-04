// Newsletter Subscription Section Component
'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface NewsletterContent {
  heading: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
  
  // Design options
  layout?: 'horizontal' | 'vertical' | 'inline';
  backgroundColor?: string;
  textColor?: string;
  
  // Privacy
  showPrivacyNote?: boolean;
  privacyText?: string;
  
  // Visual elements
  showIcon?: boolean;
  backgroundImage?: string;
}

export function Newsletter({
  content,
  layout,
  isPreview,
}: SectionComponentProps<NewsletterContent>) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const layoutType = content.layout || 'horizontal';
  const placeholder = content.placeholder || 'Enter your email';
  const buttonText = content.buttonText || 'Subscribe';
  const successMessage = content.successMessage || 'Thank you for subscribing!';
  const errorMessage = content.errorMessage || 'Something went wrong. Please try again.';
  const showIcon = content.showIcon !== false;
  const showPrivacyNote = content.showPrivacyNote !== false;
  const privacyText = content.privacyText || 'We respect your privacy. Unsubscribe at any time.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage(successMessage);
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: content.backgroundColor || '#f9fafb',
        color: content.textColor || '#111827',
      }}
    >
      {/* Background Image */}
      {content.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        />
      )}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={cn(
            'max-w-4xl mx-auto',
            layoutType === 'vertical' && 'text-center',
            layoutType === 'horizontal' && 'flex flex-col md:flex-row items-center gap-8',
            layoutType === 'inline' && 'text-center'
          )}
        >
          {/* Content */}
          <div className={cn(
            layoutType === 'horizontal' && 'md:flex-1 text-left md:text-left'
          )}>
            {showIcon && (
              <div className={cn(
                'inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4',
                layoutType === 'vertical' && 'mx-auto'
              )}>
                <Mail className="w-8 h-8 text-pink-600" />
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {content.heading}
            </h2>
            
            {content.description && (
              <p className="text-lg opacity-80 mb-6">
                {content.description}
              </p>
            )}
          </div>

          {/* Form */}
          <div className={cn(
            layoutType === 'horizontal' && 'md:flex-1',
            layoutType === 'inline' && 'max-w-md mx-auto w-full'
          )}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                className={cn(
                  'flex gap-2',
                  layoutType === 'vertical' && 'flex-col',
                  (layoutType === 'horizontal' || layoutType === 'inline') && 'flex-col sm:flex-row'
                )}
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  disabled={loading || status === 'success'}
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading || status === 'success'}
                  className="whitespace-nowrap"
                >
                  {loading ? 'Subscribing...' : buttonText}
                </Button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{message}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{message}</span>
                </div>
              )}

              {/* Privacy Note */}
              {showPrivacyNote && status !== 'success' && (
                <p className="text-xs opacity-60">
                  {privacyText}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

