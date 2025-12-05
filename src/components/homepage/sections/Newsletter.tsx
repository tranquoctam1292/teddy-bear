// Newsletter Subscription Section Component - Phase 5: Marketing Sections Redesign
// Client Component handling email subscription form
'use client';

import { useState, FormEvent } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import type { NewsletterContent } from '@/lib/mock-data';
import { NEWSLETTER_CONTENT } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface NewsletterProps {
  content?: NewsletterContent;
  heading?: string;
  subheading?: string;
  placeholder?: string;
  buttonText?: string;
  privacyText?: string;
}

export function Newsletter({
  content,
  heading,
  subheading,
  placeholder,
  buttonText,
  privacyText,
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Use content prop or individual props
  const finalHeading = content?.heading || heading || NEWSLETTER_CONTENT.heading;
  const finalSubheading = content?.subheading || subheading || NEWSLETTER_CONTENT.subheading;
  const finalPlaceholder = content?.placeholder || placeholder || NEWSLETTER_CONTENT.placeholder;
  const finalButtonText = content?.buttonText || buttonText || NEWSLETTER_CONTENT.buttonText;
  const finalPrivacyText = content?.privacyText || privacyText || NEWSLETTER_CONTENT.privacyText;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    setLoading(true);

    // Simulate API call (1 second delay)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with actual API call
    // await fetch('/api/newsletter/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });

    setLoading(false);
    setSuccess(true);
    setEmail('');

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <Container variant="standard" padding="desktop">
      {/* Section Header */}
      <SectionHeader
        heading={finalHeading}
        subheading={finalSubheading}
        alignment="center"
      />

      {/* Newsletter Form */}
      <div className="max-w-2xl mx-auto">
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900 mb-2">
              Đăng ký thành công!
            </p>
            <p className="text-gray-600">
              Cảm ơn bạn đã đăng ký. Chúng tôi sẽ gửi email cho bạn sớm nhất.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input & Button Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder={finalPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-base focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !email}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  finalButtonText
                )}
              </Button>
            </div>

            {/* Privacy Note */}
            {finalPrivacyText && (
              <p className="text-xs md:text-sm text-gray-500 text-center">
                {finalPrivacyText}
              </p>
            )}
          </form>
        )}
      </div>
    </Container>
  );
}
