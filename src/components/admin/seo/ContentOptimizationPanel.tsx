'use client';

/**
 * Content Optimization Panel Component
 * Displays content optimization suggestions
 */
import { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  FileText,
  Link as LinkIcon,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { Button } from '@/components/admin/ui/button';

interface ContentOptimizationSuggestion {
  type: 'keyword' | 'readability' | 'structure' | 'length' | 'links';
  priority: 'high' | 'medium' | 'low';
  field: string;
  message: string;
  suggestion: string;
  currentValue?: string | number;
  targetValue?: string | number;
}

interface KeywordPlacementSuggestion {
  keyword: string;
  position: number;
  context: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

interface ContentStructureAnalysis {
  hasIntroduction: boolean;
  hasConclusion: boolean;
  headingStructure: {
    hasH1: boolean;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    issues: string[];
  };
  paragraphStructure: {
    total: number;
    averageLength: number;
    tooLong: number;
    tooShort: number;
    issues: string[];
  };
  listUsage: {
    hasLists: boolean;
    listCount: number;
    suggestion: string;
  };
}

interface ContentOptimizationPanelProps {
  content: string;
  keyword?: string;
  readabilityScore?: number;
  onSuggestionClick?: (suggestion: ContentOptimizationSuggestion) => void;
}

export default function ContentOptimizationPanel({
  content,
  keyword,
  readabilityScore,
  onSuggestionClick,
}: ContentOptimizationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentOptimizationSuggestion[]>([]);
  const [keywordPlacement, setKeywordPlacement] = useState<KeywordPlacementSuggestion[]>([]);
  const [structure, setStructure] = useState<ContentStructureAnalysis | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    suggestions: true,
    keyword: true,
    structure: false,
  });

  useEffect(() => {
    if (content) {
      fetchSuggestions();
    }
  }, [content, keyword, readabilityScore]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo/content-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          keyword,
          readabilityScore,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data.suggestions || []);
        setKeywordPlacement(data.data.keywordPlacement || []);
        setStructure(data.data.structure || null);
      }
    } catch (error) {
      console.error('Error fetching optimization suggestions:', error);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword':
        return <TrendingUp className="h-4 w-4" />;
      case 'readability':
        return <FileText className="h-4 w-4" />;
      case 'structure':
        return <LinkIcon className="h-4 w-4" />;
      case 'length':
        return <FileText className="h-4 w-4" />;
      case 'links':
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
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
            <span className="ml-3 text-sm text-gray-600">Đang phân tích...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
  const mediumPrioritySuggestions = suggestions.filter(s => s.priority === 'medium');
  const lowPrioritySuggestions = suggestions.filter(s => s.priority === 'low');

  return (
    <div className="space-y-4">
      {/* Suggestions Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Gợi ý Tối ưu Hóa Nội dung
          </CardTitle>
          <CardDescription>
            {suggestions.length > 0
              ? `${suggestions.length} gợi ý để cải thiện SEO`
              : 'Không có gợi ý nào - nội dung đã được tối ưu tốt!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-gray-600">Nội dung của bạn đã được tối ưu tốt!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* High Priority */}
              {highPrioritySuggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Ưu tiên cao ({highPrioritySuggestions.length})
                  </h3>
                  <div className="space-y-2">
                    {highPrioritySuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)} cursor-pointer hover:shadow-sm transition-shadow`}
                        onClick={() => onSuggestionClick?.(suggestion)}
                      >
                        <div className="flex items-start gap-2">
                          {getTypeIcon(suggestion.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{suggestion.message}</p>
                            <p className="text-xs mt-1 opacity-90">{suggestion.suggestion}</p>
                            {suggestion.currentValue !== undefined && (
                              <div className="text-xs mt-1 opacity-75">
                                Hiện tại: {suggestion.currentValue}
                                {suggestion.targetValue && ` → Mục tiêu: ${suggestion.targetValue}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Priority */}
              {mediumPrioritySuggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Ưu tiên trung bình ({mediumPrioritySuggestions.length})
                  </h3>
                  <div className="space-y-2">
                    {mediumPrioritySuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)} cursor-pointer hover:shadow-sm transition-shadow`}
                        onClick={() => onSuggestionClick?.(suggestion)}
                      >
                        <div className="flex items-start gap-2">
                          {getTypeIcon(suggestion.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{suggestion.message}</p>
                            <p className="text-xs mt-1 opacity-90">{suggestion.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Priority */}
              {lowPrioritySuggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Gợi ý bổ sung ({lowPrioritySuggestions.length})
                  </h3>
                  <div className="space-y-2">
                    {lowPrioritySuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)} cursor-pointer hover:shadow-sm transition-shadow`}
                        onClick={() => onSuggestionClick?.(suggestion)}
                      >
                        <div className="flex items-start gap-2">
                          {getTypeIcon(suggestion.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{suggestion.message}</p>
                            <p className="text-xs mt-1 opacity-90">{suggestion.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keyword Placement */}
      {keyword && keywordPlacement.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Vị trí Từ khóa
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('keyword')}
              >
                {expandedSections.keyword ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.keyword && (
            <CardContent>
              <div className="space-y-3">
                {keywordPlacement.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getPriorityColor(item.priority)}`}
                  >
                    <div className="flex items-start gap-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.suggestion}</p>
                        <p className="text-xs mt-1 text-gray-600">
                          Từ khóa: <strong>{item.keyword}</strong>
                        </p>
                        {item.context && (
                          <p className="text-xs mt-1 italic text-gray-500">
                            "{item.context.substring(0, 100)}..."
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Structure Analysis */}
      {structure && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Phân tích Cấu trúc
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('structure')}
              >
                {expandedSections.structure ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.structure && (
            <CardContent>
              <div className="space-y-4">
                {/* Introduction & Conclusion */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {structure.hasIntroduction ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm">
                      {structure.hasIntroduction ? 'Có phần giới thiệu' : 'Thiếu phần giới thiệu'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {structure.hasConclusion ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm">
                      {structure.hasConclusion ? 'Có phần kết luận' : 'Thiếu phần kết luận'}
                    </span>
                  </div>
                </div>

                {/* Headings */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Headings</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>H1: {structure.headingStructure.h1Count}</div>
                    <div>H2: {structure.headingStructure.h2Count}</div>
                    <div>H3: {structure.headingStructure.h3Count}</div>
                  </div>
                  {structure.headingStructure.issues.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {structure.headingStructure.issues.map((issue, index) => (
                        <p key={index} className="text-xs text-red-600">• {issue}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Paragraphs */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Đoạn văn</h4>
                  <div className="text-sm space-y-1">
                    <div>Tổng: {structure.paragraphStructure.total} đoạn</div>
                    <div>
                      Trung bình: {structure.paragraphStructure.averageLength.toFixed(1)} từ/đoạn
                    </div>
                    {structure.paragraphStructure.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {structure.paragraphStructure.issues.map((issue, index) => (
                          <p key={index} className="text-xs text-yellow-600">• {issue}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lists */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Danh sách</h4>
                  <div className="text-sm">
                    {structure.listUsage.hasLists ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Có {structure.listUsage.listCount} danh sách</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-yellow-500" />
                        <span>{structure.listUsage.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}



