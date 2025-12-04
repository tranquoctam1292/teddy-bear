'use client';

/**
 * Auto-fix Panel Component
 * Shows fixable issues and allows auto-fixing
 */
import { useState } from 'react';
import { Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Badge } from '@/components/admin/ui/badge';
import type { SEOIssue } from '@/lib/schemas/seo-analysis';
import { getFixableIssuesCount } from '@/lib/seo/auto-fix';

interface AutoFixPanelProps {
  issues: SEOIssue[];
  entityType: string;
  entityId: string;
  onFixed?: () => void;
}

export default function AutoFixPanel({
  issues,
  entityType,
  entityId,
  onFixed,
}: AutoFixPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fixableCount = getFixableIssuesCount(issues);
  const fixableIssues = issues.filter(issue => {
    if (!issue.fixable) return false;
    // Check if issue can be auto-fixed
    return issue.field === 'title.length' || issue.field === 'description.length';
  });

  const handleAutoFix = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch('/api/admin/seo/auto-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          entityIds: [entityId],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data.results[0]);
        onFixed?.();
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      console.error('Error auto-fixing:', error);
      setResult({ success: false, error: 'Failed to auto-fix issues' });
    } finally {
      setLoading(false);
    }
  };

  if (fixableCount === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Auto-fix Issues
        </CardTitle>
        <CardDescription>
          {fixableCount} issue(s) có thể tự động sửa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Fixable Issues List */}
          <div className="space-y-2">
            {fixableIssues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-yellow-200 text-yellow-800">
                      {issue.type}
                    </Badge>
                    <span className="text-sm font-medium">{issue.field}</span>
                  </div>
                  <p className="text-sm text-gray-700">{issue.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {result.success
                    ? `Đã sửa ${result.fixed || 0} issue(s)`
                    : 'Lỗi khi sửa'}
                </span>
              </div>
              {result.error && (
                <p className="text-sm text-red-700">{result.error}</p>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleAutoFix}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang sửa...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Tự động sửa {fixableCount} issue(s)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}




