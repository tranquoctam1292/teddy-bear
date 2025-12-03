/**
 * Robots.txt Visual Editor Component
 * 
 * Provides a visual interface for editing robots.txt content
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Textarea } from '@/components/admin/ui/textarea';
import { Label } from '@/components/admin/ui/label';
import { Switch } from '@/components/admin/ui/switch';
import { Alert, AlertDescription } from '@/components/admin/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Save, RefreshCw, Eye } from 'lucide-react';
import { validateRobotsTxt, generateDefaultRobotsConfig, generateRobotsTxt } from '@/lib/seo/robots-generator';

interface RobotsEditorProps {
  onSave?: (content: string, isCustom: boolean) => void;
}

export default function RobotsEditor({ onSave }: RobotsEditorProps) {
  const [content, setContent] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load robots.txt content on mount
  useEffect(() => {
    loadRobotsTxt();
  }, []);

  // Validate content when it changes
  useEffect(() => {
    if (content) {
      const result = validateRobotsTxt(content);
      setValidation(result);
    }
  }, [content]);

  const loadRobotsTxt = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/seo/robots');
      
      if (!response.ok) {
        throw new Error('Failed to load robots.txt');
      }

      const data = await response.json();
      setContent(data.content || '');
      setIsCustom(data.isCustom || false);
    } catch (error) {
      console.error('Error loading robots.txt:', error);
      // Load default content
      const defaultConfig = generateDefaultRobotsConfig();
      const defaultContent = generateRobotsTxt(defaultConfig);
      setContent(defaultContent);
      setIsCustom(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validation || !validation.isValid) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/seo/robots', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          isCustom,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save robots.txt');
      }

      const data = await response.json();
      setValidation(data.validation);
      
      if (onSave) {
        onSave(content, isCustom);
      }

      alert('Robots.txt đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving robots.txt:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu robots.txt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultConfig = generateDefaultRobotsConfig();
    const defaultContent = generateRobotsTxt(defaultConfig);
    setContent(defaultContent);
    setIsCustom(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Robots.txt Editor</CardTitle>
              <CardDescription>
                Chỉnh sửa nội dung file robots.txt
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Ẩn' : 'Xem'} Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!validation?.isValid || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Custom Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="custom-mode">Chế độ tùy chỉnh</Label>
              <p className="text-sm text-gray-500">
                Bật để chỉnh sửa trực tiếp nội dung robots.txt
              </p>
            </div>
            <Switch
              id="custom-mode"
              checked={isCustom}
              onCheckedChange={setIsCustom}
            />
          </div>

          {/* Validation Status */}
          {validation && (
            <Alert
              variant={validation.isValid ? 'default' : 'destructive'}
              className={validation.isValid ? 'border-green-200 bg-green-50' : ''}
            >
              <div className="flex items-start gap-2">
                {validation.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    {validation.isValid ? (
                      <span className="text-green-800">Robots.txt hợp lệ</span>
                    ) : (
                      <span className="text-red-800">Robots.txt có lỗi</span>
                    )}
                    {validation.errors.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-sm">
                        {validation.errors.map((error, index) => (
                          <li key={index} className="text-red-700">{error}</li>
                        ))}
                      </ul>
                    )}
                    {validation.warnings.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-sm">
                        {validation.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-700 flex items-start gap-1">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          {/* Editor */}
          <div>
            <Label htmlFor="robots-content">Nội dung Robots.txt</Label>
            <Textarea
              id="robots-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 font-mono text-sm"
              rows={15}
              placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;&#10;Sitemap: https://yoursite.com/sitemap.xml"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.split('\n').length} dòng, {content.length} ký tự
            </p>
          </div>

          {/* Preview */}
          {showPreview && (
            <div>
              <Label>Preview</Label>
              <div className="mt-1 p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm whitespace-pre-wrap">
                {content || '(Trống)'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

