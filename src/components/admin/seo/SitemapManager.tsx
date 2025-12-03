/**
 * Sitemap Manager Component
 * 
 * Provides UI for manual generation, submission, and validation
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import { Alert, AlertDescription } from '@/components/admin/ui/alert';
import { 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface SitemapManagerProps {
  sitemapUrl?: string;
}

export default function SitemapManager({ sitemapUrl = '/sitemap.xml' }: SitemapManagerProps) {
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [bingApiKey, setBingApiKey] = useState('');

  useEffect(() => {
    loadLastGenerated();
  }, []);

  const loadLastGenerated = async () => {
    try {
      const response = await fetch('/api/admin/seo/sitemap/regenerate');
      if (response.ok) {
        const data = await response.json();
        if (data.lastGenerated) {
          setLastGenerated(new Date(data.lastGenerated));
        }
      }
    } catch (error) {
      console.error('Error loading last generated:', error);
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const response = await fetch('/api/admin/seo/sitemap/regenerate', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to regenerate sitemap');
      }

      const data = await response.json();
      setLastGenerated(new Date());
      alert('Sitemap đã được regenerate thành công!');
    } catch (error) {
      console.error('Error regenerating sitemap:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi regenerate sitemap');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitResult(null);

      const engines = [];
      if (googleAccessToken) engines.push('google');
      if (bingApiKey) engines.push('bing');

      if (engines.length === 0) {
        alert('Vui lòng nhập ít nhất một API key/token');
        return;
      }

      const response = await fetch('/api/admin/seo/sitemap/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          engines,
          googleAccessToken,
          bingApiKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit sitemap');
      }

      const data = await response.json();
      setSubmitResult(data);
      
      if (data.success) {
        alert('Sitemap đã được submit thành công!');
      } else {
        alert('Một số search engines submit thất bại. Vui lòng kiểm tra kết quả.');
      }
    } catch (error) {
      console.error('Error submitting sitemap:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi submit sitemap');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidate = async () => {
    try {
      setIsValidating(true);
      setValidationResult(null);

      const response = await fetch('/api/admin/seo/sitemap/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'all',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to validate sitemap');
      }

      const data = await response.json();
      setValidationResult(data);
    } catch (error) {
      console.error('Error validating sitemap:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi validate sitemap');
    } finally {
      setIsValidating(false);
    }
  };

  const fullSitemapUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${sitemapUrl}`;

  return (
    <div className="space-y-6">
      {/* Sitemap Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Management</CardTitle>
          <CardDescription>
            Quản lý và tối ưu hóa sitemap.xml
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sitemap URL</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={fullSitemapUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(fullSitemapUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {lastGenerated && (
            <div>
              <Label>Lần cuối generate</Label>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(lastGenerated).toLocaleString('vi-VN')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Generation</CardTitle>
          <CardDescription>
            Tạo lại sitemap thủ công
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="w-full"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang generate...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Sitemap
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Validation</CardTitle>
          <CardDescription>
            Kiểm tra tính hợp lệ của sitemap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleValidate}
            disabled={isValidating}
            variant="outline"
            className="w-full"
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang validate...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Validate Sitemap
              </>
            )}
          </Button>

          {validationResult && (
            <div className="space-y-2">
              <Alert
                variant={validationResult.success ? 'default' : 'destructive'}
                className={validationResult.success ? 'border-green-200 bg-green-50' : ''}
              >
                <div className="flex items-start gap-2">
                  {validationResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription>
                      {validationResult.success ? (
                        <span className="text-green-800">Sitemap hợp lệ</span>
                      ) : (
                        <span className="text-red-800">Sitemap có lỗi</span>
                      )}
                      {validationResult.summary && (
                        <div className="mt-2 text-sm">
                          <p>Errors: {validationResult.summary.totalErrors}</p>
                          <p>Warnings: {validationResult.summary.totalWarnings}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {validationResult.results && (
                <div className="space-y-2">
                  {Object.entries(validationResult.results).map(([key, result]: [string, any]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium text-sm capitalize">{key}</p>
                      <p className="text-xs text-gray-600">
                        URLs: {result.stats?.totalUrls || 0} | 
                        Products: {result.stats?.products || 0} | 
                        Posts: {result.stats?.posts || 0} | 
                        Pages: {result.stats?.pages || 0}
                      </p>
                      {result.errors.length > 0 && (
                        <ul className="mt-2 text-xs text-red-600">
                          {result.errors.map((error: any, index: number) => (
                            <li key={index}>• {error.message}</li>
                          ))}
                        </ul>
                      )}
                      {result.warnings.length > 0 && (
                        <ul className="mt-2 text-xs text-yellow-600">
                          {result.warnings.map((warning: any, index: number) => (
                            <li key={index}>• {warning.message}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Engine Submission */}
      <Card>
        <CardHeader>
          <CardTitle>Submit to Search Engines</CardTitle>
          <CardDescription>
            Gửi sitemap lên Google Search Console và Bing Webmaster Tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="google-token">Google Access Token (OAuth2)</Label>
            <Input
              id="google-token"
              type="password"
              value={googleAccessToken}
              onChange={(e) => setGoogleAccessToken(e.target.value)}
              placeholder="Nhập Google OAuth2 access token"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Cần setup OAuth2 với Google Search Console API
            </p>
          </div>

          <div>
            <Label htmlFor="bing-key">Bing Webmaster Tools API Key</Label>
            <Input
              id="bing-key"
              type="password"
              value={bingApiKey}
              onChange={(e) => setBingApiKey(e.target.value)}
              placeholder="Nhập Bing API key"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lấy từ Bing Webmaster Tools → Settings → API Key
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!googleAccessToken && !bingApiKey)}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang submit...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit to Search Engines
              </>
            )}
          </Button>

          {submitResult && (
            <div className="space-y-2">
              {Object.entries(submitResult.results || {}).map(([engine, result]: [string, any]) => (
                <Alert
                  key={engine}
                  variant={result.success ? 'default' : 'destructive'}
                  className={result.success ? 'border-green-200 bg-green-50' : ''}
                >
                  <div className="flex items-start gap-2">
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <AlertDescription>
                        <span className="font-medium capitalize">{engine}:</span>{' '}
                        <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                          {result.message}
                        </span>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

