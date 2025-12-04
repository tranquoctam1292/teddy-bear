// Countdown Timer Section Component
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionComponentProps } from '@/lib/types/homepage';
import { cn } from '@/lib/utils';

interface CountdownTimerContent {
  heading: string;
  description?: string;
  targetDate: string; // ISO date string
  
  // CTA
  buttonText?: string;
  buttonLink?: string;
  
  // Display options
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  
  // Labels
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  
  // Expired state
  expiredMessage?: string;
  
  // Design
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({
  content,
  layout,
  isPreview,
}: SectionComponentProps<CountdownTimerContent>) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const showDays = content.showDays !== false;
  const showHours = content.showHours !== false;
  const showMinutes = content.showMinutes !== false;
  const showSeconds = content.showSeconds !== false;

  const daysLabel = content.daysLabel || 'Days';
  const hoursLabel = content.hoursLabel || 'Hours';
  const minutesLabel = content.minutesLabel || 'Minutes';
  const secondsLabel = content.secondsLabel || 'Seconds';
  const expiredMessage = content.expiredMessage || 'This offer has ended';

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(content.targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setTimeLeft(null);
        setIsExpired(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [content.targetDate]);

  return (
    <div
      className="py-16 text-center"
      style={{
        backgroundColor: content.backgroundColor || '#f9fafb',
        color: content.textColor || '#111827',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {content.heading}
        </h2>

        {/* Description */}
        {content.description && (
          <p className="text-lg md:text-xl opacity-80 mb-8 max-w-2xl mx-auto">
            {content.description}
          </p>
        )}

        {/* Countdown Display */}
        {!isExpired && timeLeft ? (
          <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
            {showDays && (
              <TimeUnit
                value={timeLeft.days}
                label={daysLabel}
                accentColor={content.accentColor}
              />
            )}
            {showHours && (
              <TimeUnit
                value={timeLeft.hours}
                label={hoursLabel}
                accentColor={content.accentColor}
              />
            )}
            {showMinutes && (
              <TimeUnit
                value={timeLeft.minutes}
                label={minutesLabel}
                accentColor={content.accentColor}
              />
            )}
            {showSeconds && (
              <TimeUnit
                value={timeLeft.seconds}
                label={secondsLabel}
                accentColor={content.accentColor}
              />
            )}
          </div>
        ) : (
          <div className="text-2xl font-semibold text-red-600 mb-8">
            {expiredMessage}
          </div>
        )}

        {/* CTA Button */}
        {content.buttonText && content.buttonLink && !isExpired && (
          <Button asChild size="lg">
            <Link href={content.buttonLink}>
              {content.buttonText}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

// Time Unit Component
function TimeUnit({
  value,
  label,
  accentColor,
}: {
  value: number;
  label: string;
  accentColor?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg flex items-center justify-center shadow-lg"
        style={{
          backgroundColor: accentColor || '#ec4899',
          color: '#ffffff',
        }}
      >
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-sm md:text-base font-medium opacity-70">
        {label}
      </span>
    </div>
  );
}

