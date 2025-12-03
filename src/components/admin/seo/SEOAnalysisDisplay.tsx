'use client';

/**
 * SEO Analysis Display Component
 * 
 * Displays real-time SEO analysis results in a user-friendly format.
 * Used in ProductForm and PostEditor.
 */
import { AlertCircle, CheckCircle2, Info, XCircle, TrendingUp } from 'lucide-react';
import type { SEOAnalysisResult } from '@/lib/seo/analysis-client';

interface SEOAnalysisDisplayProps {
  analysis: SEOAnalysisResult | null;
  isLoading?: boolean;
}

export default function SEOAnalysisDisplay({ analysis, isLoading }: SEOAnalysisDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-sm text-gray-600">Đang phân tích...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-500 text-center py-4">
          Nhập thông tin để xem phân tích SEO
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header with Scores */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Phân tích SEO
        </h3>
        
        {/* Overall Score */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              {getScoreIcon(analysis.overallScore)}
            </div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.overallScore).split(' ')[0]}`}>
              {analysis.overallScore}
            </div>
            <div className="text-xs text-gray-600">Tổng điểm</div>
          </div>
          
          <div className="text-center p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              {getScoreIcon(analysis.seoScore)}
            </div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.seoScore).split(' ')[0]}`}>
              {analysis.seoScore}
            </div>
            <div className="text-xs text-gray-600">SEO Score</div>
          </div>
          
          <div className="text-center p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              {getScoreIcon(analysis.readabilityScore)}
            </div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.readabilityScore).split(' ')[0]}`}>
              {analysis.readabilityScore}
            </div>
            <div className="text-xs text-gray-600">Readability</div>
          </div>
        </div>
      </div>

      {/* Focus Keyword Analysis */}
      {analysis.focusKeyword && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Focus Keyword: <span className="text-gray-700 font-normal">"{analysis.focusKeyword.keyword}"</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              {analysis.focusKeyword.inTitle ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={analysis.focusKeyword.inTitle ? 'text-gray-700' : 'text-gray-500'}>
                Trong Title
              </span>
            </div>
            <div className="flex items-center gap-2">
              {analysis.focusKeyword.inDescription ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={analysis.focusKeyword.inDescription ? 'text-gray-700' : 'text-gray-500'}>
                Trong Meta Description
              </span>
            </div>
            <div className="flex items-center gap-2">
              {analysis.focusKeyword.inContent ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={analysis.focusKeyword.inContent ? 'text-gray-700' : 'text-gray-500'}>
                Trong Nội dung
              </span>
            </div>
            <div className="flex items-center gap-2">
              {analysis.focusKeyword.inUrl ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={analysis.focusKeyword.inUrl ? 'text-gray-700' : 'text-gray-500'}>
                Trong URL
              </span>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Mật độ từ khóa: <strong>{analysis.focusKeyword.density.toFixed(2)}%</strong>
            {analysis.focusKeyword.density < 0.5 && (
              <span className="ml-2 text-yellow-600">(Quá thấp, nên &gt; 0.5%)</span>
            )}
            {analysis.focusKeyword.density > 3 && (
              <span className="ml-2 text-red-600">(Quá cao, nên &lt; 3%)</span>
            )}
          </div>
        </div>
      )}

      {/* Detailed Analysis */}
      <div className="border-t border-gray-200 pt-4 space-y-4">
        {/* Title Analysis */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Title ({analysis.titleAnalysis.length} ký tự)
          </h4>
          <div className="text-xs text-gray-600 mb-2">
            Độ rộng pixel: ~{analysis.titleAnalysis.pixelWidth}px
            {analysis.titleAnalysis.pixelWidth > 600 && (
              <span className="ml-2 text-yellow-600">(Có thể bị cắt trong kết quả tìm kiếm)</span>
            )}
          </div>
          {analysis.titleAnalysis.issues.length > 0 && (
            <div className="space-y-1">
              {analysis.titleAnalysis.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
          {analysis.titleAnalysis.issues.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Title tối ưu</span>
            </div>
          )}
        </div>

        {/* Meta Description Analysis */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Meta Description ({analysis.metaDescriptionAnalysis.length} ký tự)
          </h4>
          <div className="text-xs text-gray-600 mb-2">
            Độ rộng pixel: ~{analysis.metaDescriptionAnalysis.pixelWidth}px
            {analysis.metaDescriptionAnalysis.pixelWidth > 920 && (
              <span className="ml-2 text-yellow-600">(Có thể bị cắt trong kết quả tìm kiếm)</span>
            )}
          </div>
          {analysis.metaDescriptionAnalysis.issues.length > 0 && (
            <div className="space-y-1">
              {analysis.metaDescriptionAnalysis.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
          {analysis.metaDescriptionAnalysis.issues.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Meta Description tối ưu</span>
            </div>
          )}
        </div>

        {/* Content Analysis */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Nội dung ({analysis.contentAnalysis.wordCount} từ)
            {analysis.contentAnalysis.qualityScore !== undefined && (
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                analysis.contentAnalysis.qualityScore >= 80
                  ? 'bg-green-100 text-green-700'
                  : analysis.contentAnalysis.qualityScore >= 60
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                Quality: {analysis.contentAnalysis.qualityScore}/100
              </span>
            )}
          </h4>
          
          {/* Content Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs text-gray-600">
            {analysis.contentAnalysis.paragraphCount !== undefined && (
              <div>
                <span className="font-medium">Đoạn văn:</span> {analysis.contentAnalysis.paragraphCount}
              </div>
            )}
            {analysis.contentAnalysis.headingCount && (
              <div>
                <span className="font-medium">Headings:</span> H1:{analysis.contentAnalysis.headingCount.h1} H2:{analysis.contentAnalysis.headingCount.h2} H3:{analysis.contentAnalysis.headingCount.h3}
              </div>
            )}
            {analysis.contentAnalysis.imageCount !== undefined && (
              <div>
                <span className="font-medium">Hình ảnh:</span> {analysis.contentAnalysis.imageCount}
                {analysis.contentAnalysis.imagesWithoutAlt !== undefined && analysis.contentAnalysis.imagesWithoutAlt > 0 && (
                  <span className="text-red-600 ml-1">({analysis.contentAnalysis.imagesWithoutAlt} thiếu alt)</span>
                )}
              </div>
            )}
            {analysis.contentAnalysis.internalLinksCount !== undefined && (
              <div>
                <span className="font-medium">Internal links:</span> {analysis.contentAnalysis.internalLinksCount}
                {analysis.contentAnalysis.externalLinksCount !== undefined && analysis.contentAnalysis.externalLinksCount > 0 && (
                  <span className="ml-1">/ External: {analysis.contentAnalysis.externalLinksCount}</span>
                )}
              </div>
            )}
          </div>
          
          {analysis.contentAnalysis.issues.length > 0 && (
            <div className="space-y-1">
              {analysis.contentAnalysis.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
          {analysis.contentAnalysis.issues.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Nội dung đạt yêu cầu</span>
            </div>
          )}
        </div>

        {/* URL Analysis */}
        {analysis.urlAnalysis && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              URL ({analysis.urlAnalysis.length} ký tự)
            </h4>
            {analysis.urlAnalysis.issues.length > 0 && (
              <div className="space-y-1">
                {analysis.urlAnalysis.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-yellow-600">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
            {analysis.urlAnalysis.issues.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>URL tối ưu</span>
              </div>
            )}
          </div>
        )}

        {/* Readability Analysis */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Độ dễ đọc ({analysis.readabilityAnalysis.score}/100)
            <span className="ml-2 text-xs text-gray-500">
              {analysis.readabilityAnalysis.score >= 80 && '(Rất dễ đọc)'}
              {analysis.readabilityAnalysis.score >= 60 && analysis.readabilityAnalysis.score < 80 && '(Dễ đọc)'}
              {analysis.readabilityAnalysis.score >= 50 && analysis.readabilityAnalysis.score < 60 && '(Khá khó)'}
              {analysis.readabilityAnalysis.score < 50 && '(Khó đọc)'}
            </span>
          </h4>
          {analysis.readabilityAnalysis.issues.length > 0 && (
            <div className="space-y-1">
              {analysis.readabilityAnalysis.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-blue-600">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Analysis */}
        {analysis.imageAnalysis && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Hình ảnh ({analysis.imageAnalysis.total} hình)
            </h4>
            <div className="text-xs text-gray-600 mb-2">
              Có alt text: {analysis.imageAnalysis.withAlt} / {analysis.imageAnalysis.total}
            </div>
            {analysis.imageAnalysis.issues.length > 0 && (
              <div className="space-y-1">
                {analysis.imageAnalysis.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-yellow-600">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
            {analysis.imageAnalysis.issues.length === 0 && analysis.imageAnalysis.total > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Tất cả hình ảnh đều có alt text</span>
              </div>
            )}
          </div>
        )}

        {/* Link Analysis */}
        {analysis.linkAnalysis && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Liên kết
            </h4>
            <div className="text-xs text-gray-600 mb-2">
              Internal: {analysis.linkAnalysis.internal} | External: {analysis.linkAnalysis.external}
            </div>
            {analysis.linkAnalysis.issues.length > 0 && (
              <div className="space-y-1">
                {analysis.linkAnalysis.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-yellow-600">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
            {analysis.linkAnalysis.issues.length === 0 && analysis.linkAnalysis.internal > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Có internal links tốt</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Issues Summary */}
      {analysis.issues.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Tổng hợp vấn đề ({analysis.issues.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {analysis.issues.map((issue, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 p-2 rounded text-sm ${
                  issue.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : issue.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {getIssueIcon(issue.type)}
                <div className="flex-1">
                  <div className="font-medium">{issue.field}</div>
                  <div>{issue.message}</div>
                  {issue.suggestion && (
                    <div className="text-xs mt-1 opacity-75">{issue.suggestion}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.issues.length === 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Không có vấn đề nào! SEO đã được tối ưu tốt.</span>
          </div>
        </div>
      )}
    </div>
  );
}

