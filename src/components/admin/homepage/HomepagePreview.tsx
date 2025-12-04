'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HomepageRenderer } from '@/components/homepage/HomepageRenderer';

interface HomepagePreviewProps {
  config: any;
}

export function HomepagePreview({ config }: HomepagePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="space-y-4">
      {/* Preview Toolbar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {/* Device Selector */}
          <div className="flex gap-2">
            <Button
              variant={device === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice('desktop')}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Desktop
            </Button>
            <Button
              variant={device === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice('tablet')}
            >
              <Tablet className="mr-2 h-4 w-4" />
              Tablet
            </Button>
            <Button
              variant={device === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevice('mobile')}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Mobile
            </Button>
          </div>

          {/* Open in New Tab */}
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={`/?preview=${config._id}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </a>
          </Button>
        </div>
      </Card>

      {/* Preview Frame */}
      <Card className="p-4">
        <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
          <div
            className={cn(
              'bg-white shadow-lg transition-all duration-300 overflow-hidden',
              device === 'mobile' && 'rounded-3xl'
            )}
            style={{
              width: deviceWidths[device],
              maxWidth: '100%',
            }}
          >
            {/* Preview Content */}
            <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <HomepageRenderer
                config={config}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Preview Info */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Preview Mode:</strong> Showing {device} view with{' '}
            {config.sections?.filter((s: any) => s.enabled).length || 0} enabled sections
          </p>
          <p className="mt-1">
            Changes are saved automatically and reflected in real-time
          </p>
        </div>
      </Card>
    </div>
  );
}

