'use client';

// Keyword Data Source Badge Component
import { Badge } from '@/components/admin/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Database,
  Globe,
  TrendingUp 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface KeywordDataSourceBadgeProps {
  source: 'serpapi' | 'dataforseo' | 'internal' | 'gsc' | 'estimated' | 'manual';
  confidence?: 'high' | 'medium' | 'low';
  showIcon?: boolean;
  showTooltip?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export default function KeywordDataSourceBadge({
  source,
  confidence = 'medium',
  showIcon = true,
  showTooltip = true,
  variant = 'default',
  className = '',
}: KeywordDataSourceBadgeProps) {
  const sourceConfig = {
    serpapi: {
      label: 'SerpAPI',
      description: 'Real-time SERP data from Google with high accuracy',
      icon: Globe,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      badgeVariant: 'default' as const,
      confidenceIcon: CheckCircle2,
      confidenceColor: 'text-green-600',
    },
    dataforseo: {
      label: 'DataForSEO',
      description: 'Professional SEO data API with verified metrics',
      icon: Database,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      badgeVariant: 'default' as const,
      confidenceIcon: CheckCircle2,
      confidenceColor: 'text-blue-600',
    },
    internal: {
      label: 'Internal Analysis',
      description: 'Calculated from your historical performance data',
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      badgeVariant: 'secondary' as const,
      confidenceIcon: AlertCircle,
      confidenceColor: 'text-yellow-600',
    },
    gsc: {
      label: 'Google Search Console',
      description: 'Data directly from Google Search Console API',
      icon: CheckCircle2,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      badgeVariant: 'default' as const,
      confidenceIcon: CheckCircle2,
      confidenceColor: 'text-blue-600',
    },
    estimated: {
      label: 'Estimated',
      description: 'Basic estimation based on keyword characteristics',
      icon: HelpCircle,
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      badgeVariant: 'outline' as const,
      confidenceIcon: HelpCircle,
      confidenceColor: 'text-gray-600',
    },
    manual: {
      label: 'Manual Entry',
      description: 'Manually entered data',
      icon: Database,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      badgeVariant: 'secondary' as const,
      confidenceIcon: AlertCircle,
      confidenceColor: 'text-purple-600',
    },
  };

  const config = sourceConfig[source] || sourceConfig.estimated;
  const Icon = config.icon;
  const ConfidenceIcon = config.confidenceIcon;

  const confidenceLabels = {
    high: 'High Confidence',
    medium: 'Medium Confidence',
    low: 'Low Confidence',
  };

  const confidenceColors = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-red-600',
  };

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={config.badgeVariant} 
              className={`${config.color} cursor-help ${className}`}
            >
              {showIcon && <Icon className="h-3 w-3 mr-1" />}
              {config.label}
            </Badge>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent className="max-w-xs">
              <div className="space-y-2">
                <p className="font-medium">{config.label}</p>
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <ConfidenceIcon className={`h-4 w-4 ${confidenceColors[confidence]}`} />
                  <span className="text-sm font-medium">
                    {confidenceLabels[confidence]}
                  </span>
                </div>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default variant - more detailed
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={config.badgeVariant} 
              className={`${config.color} cursor-help`}
            >
              {showIcon && <Icon className="h-3 w-3 mr-1" />}
              {config.label}
            </Badge>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent className="max-w-xs">
              <p className="font-medium mb-1">{config.label}</p>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center gap-1.5">
        <ConfidenceIcon className={`h-4 w-4 ${confidenceColors[confidence]}`} />
        <span className="text-sm text-muted-foreground">
          {confidenceLabels[confidence]}
        </span>
      </div>
    </div>
  );
}

// Helper component for displaying multiple sources
export function KeywordDataSources({ 
  sources 
}: { 
  sources: Array<{ source: KeywordDataSourceBadgeProps['source']; confidence?: KeywordDataSourceBadgeProps['confidence'] }> 
}) {
  if (sources.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((src, index) => (
        <KeywordDataSourceBadge
          key={index}
          source={src.source}
          confidence={src.confidence}
          variant="compact"
        />
      ))}
    </div>
  );
}

// Inline badge for use in tables
export function InlineSourceBadge({ 
  source,
  confidence 
}: Pick<KeywordDataSourceBadgeProps, 'source' | 'confidence'>) {
  const icons = {
    serpapi: '🌐',
    dataforseo: '📊',
    internal: '📈',
    gsc: '✓',
    estimated: '≈',
    manual: '✏️',
  };

  const colors = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-gray-500',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`text-xs cursor-help ${colors[confidence || 'medium']}`}>
            {icons[source] || '?'}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs capitalize">{source}</p>
          <p className="text-xs text-muted-foreground">
            {confidence || 'medium'} confidence
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

