'use client';

/**
 * Link Suggestions Panel Component
 * Displays internal linking opportunities and analysis
 */
import { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { Button } from '@/components/admin/ui/button';

interface LinkOpportunity {
  text: string;
  position: number;
  context: string;
  suggestedLink: {
    type: 'product' | 'post' | 'page';
    title: string;
    url: string;
    slug: string;
    relevance: number;
  };
  anchorText: string;
  priority: 'high' | 'medium' | 'low';
}

interface LinkDistribution {
  internal: {
    count: number;
    byType: {
      product: number;
      post: number;
      page: number;
    };
    anchorTexts: Array<{
      text: string;
      count: number;
    }>;
  };
  external: {
    count: number;
    domains: Array<{
      domain: string;
      count: number;
    }>;
  };
  issues: string[];
}

interface BrokenLink {
  url: string;
  anchorText: string;
  position: number;
  context: string;
  status: '404' | 'timeout' | 'error';
}

interface LinkSuggestionsPanelProps {
  content: string;
  entityType?: 'product' | 'post' | 'page';
  entityId?: string;
  onLinkAdd?: (opportunity: LinkOpportunity) => void;
}

export default function LinkSuggestionsPanel({
  content,
  entityType,
  entityId,
  onLinkAdd,
}: LinkSuggestionsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<LinkOpportunity[]>([]);
  const [distribution, setDistribution] = useState<LinkDistribution | null>(null);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    opportunities: true,
    distribution: false,
    broken: false,
  });

  useEffect(() => {
    if (content) {
      fetchLinkSuggestions();
    }
  }, [content, entityType, entityId]);

  const fetchLinkSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/link-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          entityType,
          entityId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOpportunities(data.data.opportunities || []);
        setDistribution(data.data.distribution || null);
        setBrokenLinks(data.data.brokenLinks || []);
      }
    } catch (error) {
      console.error('Error fetching link suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-600">Đang phân tích links...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Link Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Cơ hội Internal Linking ({opportunities.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('opportunities')}
            >
              {expandedSections.opportunities ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Gợi ý các từ/cụm từ có thể liên kết đến sản phẩm hoặc bài viết khác
          </CardDescription>
        </CardHeader>
        {expandedSections.opportunities && (
          <CardContent>
            {opportunities.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-gray-600">Không tìm thấy cơ hội linking nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {opportunities.map((opportunity, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getPriorityColor(opportunity.priority)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPriorityColor(opportunity.priority)}>
                            {opportunity.priority}
                          </Badge>
                          <span className="text-sm font-medium">
                            Độ liên quan: {opportunity.suggestedLink.relevance}%
                          </span>
                        </div>
                        <p className="text-sm mb-2">
                          <strong>"{opportunity.text}"</strong> →{' '}
                          <a
                            href={opportunity.suggestedLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {opportunity.suggestedLink.title}
                          </a>
                        </p>
                        <p className="text-xs text-gray-600 italic mb-2">
                          "{opportunity.context.substring(0, 150)}..."
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Loại: {opportunity.suggestedLink.type}</span>
                          <span>•</span>
                          <span>Anchor text: "{opportunity.anchorText}"</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onLinkAdd?.(opportunity)}
                      >
                        Thêm Link
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Link Distribution */}
      {distribution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Phân tích Links
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('distribution')}
              >
                {expandedSections.distribution ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.distribution && (
            <CardContent>
              <div className="space-y-4">
                {/* Internal Links */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Internal Links</h4>
                  <div className="text-sm space-y-1">
                    <div>Tổng: {distribution.internal.count} links</div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>Sản phẩm: {distribution.internal.byType.product}</div>
                      <div>Bài viết: {distribution.internal.byType.post}</div>
                      <div>Trang: {distribution.internal.byType.page}</div>
                    </div>
                    {distribution.internal.anchorTexts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Anchor texts phổ biến:</p>
                        <div className="flex flex-wrap gap-1">
                          {distribution.internal.anchorTexts.slice(0, 5).map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item.text} ({item.count})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* External Links */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">External Links</h4>
                  <div className="text-sm">
                    <div>Tổng: {distribution.external.count} links</div>
                    {distribution.external.domains.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Domains:</p>
                        <div className="space-y-1">
                          {distribution.external.domains.slice(0, 5).map((item, index) => (
                            <div key={index} className="text-xs">
                              {item.domain} ({item.count})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Issues */}
                {distribution.issues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-yellow-800">Vấn đề</h4>
                    <div className="space-y-1">
                      {distribution.issues.map((issue, index) => (
                        <div key={index} className="text-xs text-yellow-700 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Broken Links */}
      {brokenLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Broken Links ({brokenLinks.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('broken')}
              >
                {expandedSections.broken ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.broken && (
            <CardContent>
              <div className="space-y-3">
                {brokenLinks.map((link, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-red-200 bg-red-50"
                  >
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">
                          {link.anchorText || link.url}
                        </p>
                        <p className="text-xs text-red-600 mt-1">{link.url}</p>
                        <p className="text-xs text-gray-600 italic mt-1">
                          "{link.context.substring(0, 100)}..."
                        </p>
                        <Badge className="mt-2 bg-red-200 text-red-800">
                          {link.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}

