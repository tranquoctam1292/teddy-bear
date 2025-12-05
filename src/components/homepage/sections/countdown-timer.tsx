// Countdown Timer Section Component - Phase 5: Marketing Sections Redesign
// Client Component displaying countdown timer for sales/events
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import type { CountdownTarget } from '@/lib/mock-data';
import { COUNTDOWN_TARGET } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  content?: CountdownTarget;
  heading?: string;
  description?: string;
  targetDate?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-mono tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-sm md:text-base text-white/80 font-medium">{label}</span>
    </div>
  );
}

export function CountdownTimer({
  content,
  heading,
  description,
  targetDate,
  buttonText,
  buttonLink,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // Use content prop or individual props
  const finalTargetDate = content?.targetDate || targetDate || COUNTDOWN_TARGET.targetDate;
  const finalHeading = content?.heading || heading || COUNTDOWN_TARGET.heading || 'Khuyến mãi kết thúc sau';
  const finalDescription =
    content?.description || description || COUNTDOWN_TARGET.description;
  const finalButtonText = content?.buttonText || buttonText || COUNTDOWN_TARGET.buttonText || 'Xem ngay';
  const finalButtonLink = content?.buttonLink || buttonLink || COUNTDOWN_TARGET.buttonLink || '/products';

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = new Date(finalTargetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [finalTargetDate]);

  return (
    <div className="relative bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 py-16 md:py-20">
      <Container variant="standard" padding="desktop" className="relative z-10">
        {/* Section Header */}
        <SectionHeader
          heading={finalHeading}
          subheading={finalDescription}
          alignment="center"
          className="text-white"
        />

        {/* Countdown Display */}
        {isExpired ? (
          <div className="text-center py-8">
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              Đã kết thúc
            </p>
            {finalButtonLink && (
              <Button
                asChild
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold shadow-xl"
              >
                <Link href={finalButtonLink}>{finalButtonText}</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Timer Boxes */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
              <CountdownBox value={timeLeft.days} label="Ngày" />
              <div className="text-white/50 text-2xl md:text-3xl font-bold">:</div>
              <CountdownBox value={timeLeft.hours} label="Giờ" />
              <div className="text-white/50 text-2xl md:text-3xl font-bold">:</div>
              <CountdownBox value={timeLeft.minutes} label="Phút" />
              <div className="text-white/50 text-2xl md:text-3xl font-bold">:</div>
              <CountdownBox value={timeLeft.seconds} label="Giây" />
            </div>

            {/* CTA Button */}
            {finalButtonLink && (
              <Button
                asChild
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Link href={finalButtonLink}>
                  <Clock className="mr-2 w-5 h-5" />
                  {finalButtonText}
                </Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

