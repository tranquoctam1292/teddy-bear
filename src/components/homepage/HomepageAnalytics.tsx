// Homepage Analytics Integration
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

interface HomepageAnalyticsProps {
  config: any;
}

export function HomepageAnalytics({ config }: HomepageAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        homepage_config_id: config._id,
        homepage_config_name: config.name,
      });
    }
  }, [pathname, searchParams, config._id, config.name]);

  // Track section views
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.gtag) {
            const sectionId = entry.target.id;
            const section = config.sections?.find((s: any) => s.id === sectionId);
            
            if (section) {
              window.gtag('event', 'section_view', {
                section_id: section.id,
                section_type: section.type,
                section_name: section.name,
                homepage_config_id: config._id,
              });
            }
          }
        });
      },
      { threshold: 0.5 } // 50% visible
    );

    // Observe all sections
    document.querySelectorAll('.homepage-section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [config]);

  return (
    <>
      {/* Google Analytics */}
      {config.analytics?.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.analytics.googleAnalyticsId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {config.analytics?.facebookPixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${config.analytics.facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Custom Tracking Scripts */}
      {config.analytics?.trackingScripts &&
        config.analytics.trackingScripts.map((script: string, index: number) => (
          <Script
            key={index}
            id={`custom-tracking-${index}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: script }}
          />
        ))}
    </>
  );
}

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

