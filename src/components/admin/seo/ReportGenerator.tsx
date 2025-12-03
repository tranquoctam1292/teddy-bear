'use client';

/**
 * Report Generator Component
 * Generate and export SEO reports
 */
import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';
import { Label } from '@/components/admin/ui/label';
import { Badge } from '@/components/admin/ui/badge';
import type { ReportType } from '@/lib/seo/report-generator';

interface ReportGeneratorProps {
  onReportGenerated?: (report: any) => void;
}

export default function ReportGenerator({ onReportGenerated }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entityType, setEntityType] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  // Load templates on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/seo/reports/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const calculateDateRange = (period: string) => {
    const end = new Date();
    let start = new Date();

    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        return { start: startDate || start.toISOString().split('T')[0], end: endDate || end.toISOString().split('T')[0] };
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const handleGenerate = async () => {
    if (!reportType) {
      alert('Vui lòng chọn loại báo cáo');
      return;
    }

    try {
      setLoading(true);
      const dateRange = period === 'custom'
        ? { start: startDate, end: endDate }
        : calculateDateRange(period);

      const response = await fetch('/api/admin/seo/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          startDate: dateRange.start,
          endDate: dateRange.end,
          entityType: entityType || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReport(data.data.report);
        onReportGenerated?.(data.data.report);
      } else {
        alert(data.error || 'Lỗi khi tạo báo cáo');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Lỗi khi tạo báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!report) {
      alert('Vui lòng tạo báo cáo trước');
      return;
    }

    try {
      const response = await fetch('/api/admin/seo/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, format }),
      });

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-report-${report.reportId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        alert(data.data.message || 'PDF export requires additional setup');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Lỗi khi xuất báo cáo');
    }
  };

  const selectedTemplate = templates.find(t => t.type === reportType);

  return (
    <div className="space-y-4">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tạo Báo cáo SEO
          </CardTitle>
          <CardDescription>
            Chọn loại báo cáo và thời gian để tạo báo cáo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Report Type */}
            <div>
              <Label htmlFor="reportType">Loại Báo cáo *</Label>
              <Select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <option value="">-- Chọn loại báo cáo --</option>
                {templates.map((template) => (
                  <option key={template.type} value={template.type}>
                    {template.name}
                  </option>
                ))}
              </Select>
              {selectedTemplate && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTemplate.description}
                </p>
              )}
            </div>

            {/* Period */}
            <div>
              <Label htmlFor="period">Thời gian</Label>
              <Select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
              >
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
                <option value="quarter">3 tháng qua</option>
                <option value="year">1 năm qua</option>
                <option value="custom">Tùy chỉnh</option>
              </Select>
            </div>

            {/* Custom Date Range */}
            {period === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Từ ngày</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Đến ngày</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Entity Type Filter */}
            <div>
              <Label htmlFor="entityType">Lọc theo Loại</Label>
              <Select
                id="entityType"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="product">Sản phẩm</option>
                <option value="post">Bài viết</option>
                <option value="page">Trang</option>
              </Select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !reportType}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo báo cáo...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Tạo Báo cáo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {report && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Kết quả Báo cáo</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ReportDisplay report={report} reportType={reportType} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Report Display Component
 */
function ReportDisplay({ report, reportType }: { report: any; reportType: string }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {report.summary && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Tóm tắt</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(report.summary).map(([key, value]) => {
              if (typeof value === 'object') return null;
              return (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-lg font-semibold">{String(value)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Issues */}
      {report.topIssues && report.topIssues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Vấn đề Hàng đầu</h3>
          <div className="space-y-2">
            {report.topIssues.map((issue: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  issue.type === 'error'
                    ? 'bg-red-50 border-red-200'
                    : issue.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          issue.type === 'error'
                            ? 'bg-red-200 text-red-800'
                            : issue.type === 'warning'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }
                      >
                        {issue.type}
                      </Badge>
                      <span className="text-sm font-medium">{issue.message}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {issue.affectedPages} trang bị ảnh hưởng • Field: {issue.field}
                    </p>
                    {issue.suggestion && (
                      <p className="text-xs text-gray-700 mt-1">
                        Gợi ý: {issue.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performers / Decliners */}
      {report.topPerformers && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Từ khóa Tốt nhất</h3>
          <div className="space-y-2">
            {report.topPerformers.map((performer: any, index: number) => (
              <div
                key={index}
                className="p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{performer.keyword}</span>
                    <span className="text-xs text-gray-600 ml-2">
                      ({performer.entityType})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-700">
                      +{performer.rankChange} vị trí
                    </div>
                    <div className="text-xs text-gray-600">
                      {performer.previousRank} → {performer.currentRank}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.topDecliners && report.topDecliners.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Từ khóa Giảm hạng</h3>
          <div className="space-y-2">
            {report.topDecliners.map((decliner: any, index: number) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{decliner.keyword}</span>
                    <span className="text-xs text-gray-600 ml-2">
                      ({decliner.entityType})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-700">
                      {decliner.rankChange} vị trí
                    </div>
                    <div className="text-xs text-gray-600">
                      {decliner.previousRank} → {decliner.currentRank}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations && report.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Khuyến nghị</h3>
          <div className="space-y-2">
            {report.recommendations.map((rec: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

