'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface AdvancedSEOSettingsProps {
  seo: any;
  onChange: (seo: any) => void;
}

export function AdvancedSEOSettings({ seo, onChange }: AdvancedSEOSettingsProps) {
  const [keywords, setKeywords] = useState<string[]>(seo.keywords || []);
  const [keywordInput, setKeywordInput] = useState('');

  // Add keyword
  function handleAddKeyword() {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      onChange({ ...seo, keywords: newKeywords });
      setKeywordInput('');
    }
  }

  // Remove keyword
  function handleRemoveKeyword(keyword: string) {
    const newKeywords = keywords.filter((k) => k !== keyword);
    setKeywords(newKeywords);
    onChange({ ...seo, keywords: newKeywords });
  }

  return (
    <div className="space-y-6">
      {/* Basic SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Basic SEO</CardTitle>
          <CardDescription>Essential SEO settings for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="seo-title">
              Page Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="seo-title"
              value={seo.title || ''}
              onChange={(e) => onChange({ ...seo, title: e.target.value })}
              placeholder="Best Teddy Shop - Quality Toys for Kids"
              maxLength={60}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Appears in search results and browser tab</span>
              <span className={seo.title?.length > 60 ? 'text-red-500' : ''}>
                {seo.title?.length || 0}/60
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="seo-description">
              Meta Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="seo-description"
              value={seo.description || ''}
              onChange={(e) => onChange({ ...seo, description: e.target.value })}
              placeholder="Shop our collection of high-quality teddy bears..."
              maxLength={160}
              rows={3}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Appears below title in search results</span>
              <span className={seo.description?.length > 160 ? 'text-red-500' : ''}>
                {seo.description?.length || 0}/160
              </span>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="Enter keyword and press Enter"
              />
              <Button type="button" variant="secondary" onClick={handleAddKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Canonical URL */}
          <div className="space-y-2">
            <Label htmlFor="canonical">Canonical URL (Optional)</Label>
            <Input
              id="canonical"
              value={seo.canonicalUrl || ''}
              onChange={(e) => onChange({ ...seo, canonicalUrl: e.target.value })}
              placeholder="https://yoursite.com/"
            />
            <p className="text-sm text-muted-foreground">
              Specify if this page has a preferred URL
            </p>
          </div>

          {/* Robots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="noindex">No Index</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent search engines from indexing
                </p>
              </div>
              <Switch
                id="noindex"
                checked={seo.noindex || false}
                onCheckedChange={(checked) => onChange({ ...seo, noindex: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="nofollow">No Follow</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent search engines from following links
                </p>
              </div>
              <Switch
                id="nofollow"
                checked={seo.nofollow || false}
                onCheckedChange={(checked) => onChange({ ...seo, nofollow: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Optimize how your homepage appears when shared on social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OG Image */}
          <ImageUploadField
            label="Social Media Image"
            value={seo.ogImage || ''}
            onChange={(url) => onChange({ ...seo, ogImage: url })}
            aspectRatio="1200/630"
          />
          <p className="text-sm text-muted-foreground">
            Recommended: 1200x630px (Facebook, LinkedIn, WhatsApp)
          </p>

          {/* OG Title */}
          <div className="space-y-2">
            <Label htmlFor="og-title">Social Media Title (Optional)</Label>
            <Input
              id="og-title"
              value={seo.ogTitle || ''}
              onChange={(e) => onChange({ ...seo, ogTitle: e.target.value })}
              placeholder="Leave empty to use page title"
              maxLength={60}
            />
            <p className="text-sm text-muted-foreground">
              {seo.ogTitle?.length || 0}/60 characters
            </p>
          </div>

          {/* OG Description */}
          <div className="space-y-2">
            <Label htmlFor="og-description">Social Media Description (Optional)</Label>
            <Textarea
              id="og-description"
              value={seo.ogDescription || ''}
              onChange={(e) => onChange({ ...seo, ogDescription: e.target.value })}
              placeholder="Leave empty to use meta description"
              maxLength={160}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              {seo.ogDescription?.length || 0}/160 characters
            </p>
          </div>

          {/* Twitter Card */}
          <div className="space-y-2">
            <Label>Twitter Card Type</Label>
            <Select
              value={seo.twitterCard || 'summary_large_image'}
              onValueChange={(value) => onChange({ ...seo, twitterCard: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
          <CardDescription>
            Track homepage performance and user behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Analytics */}
          <div className="space-y-2">
            <Label htmlFor="ga-id">Google Analytics ID</Label>
            <Input
              id="ga-id"
              value={seo.analytics?.googleAnalyticsId || ''}
              onChange={(e) =>
                onChange({
                  ...seo,
                  analytics: {
                    ...seo.analytics,
                    googleAnalyticsId: e.target.value,
                  },
                })
              }
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
            />
            <p className="text-sm text-muted-foreground">
              Track page views, events, and conversions
            </p>
          </div>

          {/* Facebook Pixel */}
          <div className="space-y-2">
            <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
            <Input
              id="fb-pixel"
              value={seo.analytics?.facebookPixelId || ''}
              onChange={(e) =>
                onChange({
                  ...seo,
                  analytics: {
                    ...seo.analytics,
                    facebookPixelId: e.target.value,
                  },
                })
              }
              placeholder="XXXXXXXXXXXXXXX"
            />
            <p className="text-sm text-muted-foreground">
              Track conversions and optimize ads
            </p>
          </div>

          {/* Event Tracking Info */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Automatic Events</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• page_view - Tracks homepage visits</li>
              <li>• section_view - Tracks section impressions</li>
              <li>• section_click - Tracks section interactions</li>
              <li>• cta_click - Tracks CTA button clicks</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Schema.org */}
      <Card>
        <CardHeader>
          <CardTitle>Structured Data (Schema.org)</CardTitle>
          <CardDescription>
            Help search engines understand your content better
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Schema Type */}
          <div className="space-y-2">
            <Label>Schema Type</Label>
            <Select
              value={seo.schemaMarkup?.['@type'] || 'WebPage'}
              onValueChange={(value) =>
                onChange({
                  ...seo,
                  schemaMarkup: {
                    ...seo.schemaMarkup,
                    '@type': value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WebPage">WebPage</SelectItem>
                <SelectItem value="CollectionPage">CollectionPage</SelectItem>
                <SelectItem value="ItemPage">ItemPage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto-generated Info */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="font-semibold text-green-900">Auto-generated Markup</h4>
            <ul className="mt-2 space-y-1 text-sm text-green-800">
              <li>✓ WebPage/Organization schema</li>
              <li>✓ Breadcrumb navigation</li>
              <li>✓ ItemList (for product sections)</li>
              <li>✓ Publisher information</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

