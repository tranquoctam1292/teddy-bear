'use client';

/**
 * Social Media Preview Component
 * Preview how content will appear on social media platforms
 */
import { useState, useEffect } from 'react';
import {
  Facebook,
  Twitter,
  Linkedin,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Badge } from '@/components/admin/ui/badge';
import { Alert } from '@/components/admin/ui/alert';
import {
  generateOpenGraphData,
  generateTwitterCardData,
  validateOpenGraph,
  validateTwitterCard,
  generateSocialPreviewUrl,
} from '@/lib/seo/social-preview';

interface SocialPreviewProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  publishedTime?: string;
  author?: string;
}

export default function SocialPreview({
  title = '',
  description = '',
  image = '',
  url = '',
  type = 'website',
  siteName = 'The Emotional House',
  publishedTime,
  author,
}: SocialPreviewProps) {
  const [ogData, setOgData] = useState(generateOpenGraphData({
    title,
    description,
    image,
    url,
    type,
    siteName,
    publishedTime,
    author,
  }));
  const [twitterData, setTwitterData] = useState(generateTwitterCardData({
    title,
    description,
    image,
    url,
    type,
    siteName,
    publishedTime,
    author,
  }));
  const [ogValidation, setOgValidation] = useState<any>(null);
  const [twitterValidation, setTwitterValidation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'facebook' | 'twitter' | 'linkedin'>('facebook');

  useEffect(() => {
    const og = generateOpenGraphData({
      title,
      description,
      image,
      url,
      type,
      siteName,
      publishedTime,
      author,
    });
    const twitter = generateTwitterCardData({
      title,
      description,
      image,
      url,
      type,
      siteName,
      publishedTime,
      author,
    });

    setOgData(og);
    setTwitterData(twitter);
    setOgValidation(validateOpenGraph(og));
    setTwitterValidation(validateTwitterCard(twitter));
  }, [title, description, image, url, type, siteName, publishedTime, author]);

  const handleTest = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (url) {
      const testUrl = generateSocialPreviewUrl(url, platform);
      window.open(testUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Open Graph Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Open Graph</CardTitle>
          </CardHeader>
          <CardContent>
            {ogValidation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {ogValidation.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">
                    {ogValidation.valid ? 'Valid' : `${ogValidation.errors.length} errors`}
                  </span>
                </div>
                {ogValidation.errors.length > 0 && (
                  <ul className="text-xs text-red-600 space-y-1">
                    {ogValidation.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
                {ogValidation.warnings.length > 0 && (
                  <ul className="text-xs text-yellow-600 space-y-1">
                    {ogValidation.warnings.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Twitter Card Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Twitter Card</CardTitle>
          </CardHeader>
          <CardContent>
            {twitterValidation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {twitterValidation.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">
                    {twitterValidation.valid ? 'Valid' : `${twitterValidation.errors.length} errors`}
                  </span>
                </div>
                {twitterValidation.errors.length > 0 && (
                  <ul className="text-xs text-red-600 space-y-1">
                    {twitterValidation.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
                {twitterValidation.warnings.length > 0 && (
                  <ul className="text-xs text-yellow-600 space-y-1">
                    {twitterValidation.warnings.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Previews */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Preview</CardTitle>
          <CardDescription>
            Xem trước cách nội dung sẽ hiển thị trên các nền tảng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b">
            <button
              onClick={() => setActiveTab('facebook')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'facebook'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Facebook className="h-4 w-4 inline mr-2" />
              Facebook
            </button>
            <button
              onClick={() => setActiveTab('twitter')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'twitter'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Twitter className="h-4 w-4 inline mr-2" />
              Twitter
            </button>
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'linkedin'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Linkedin className="h-4 w-4 inline mr-2" />
              LinkedIn
            </button>
          </div>

          {/* Preview Content */}
          <div className="space-y-4">
            {/* Facebook Preview */}
            {activeTab === 'facebook' && (
              <div className="border rounded-lg p-4 bg-white max-w-md">
                {image && (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-2 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 uppercase">
                    {ogData.ogSiteName || siteName}
                  </div>
                  <div className="font-semibold text-base text-gray-900 line-clamp-2">
                    {ogData.ogTitle || title}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {ogData.ogDescription || description}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => handleTest('facebook')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Test trên Facebook
                </Button>
              </div>
            )}

            {/* Twitter Preview */}
            {activeTab === 'twitter' && (
              <div className="border rounded-lg p-4 bg-white max-w-md">
                {image && (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-2 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="font-semibold text-base text-gray-900 line-clamp-2">
                    {twitterData.twitterTitle || title}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {twitterData.twitterDescription || description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {twitterData.twitterSite || '@emotionalhouse'}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => handleTest('twitter')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Test trên Twitter
                </Button>
              </div>
            )}

            {/* LinkedIn Preview */}
            {activeTab === 'linkedin' && (
              <div className="border rounded-lg p-4 bg-white max-w-md">
                {image && (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-2 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 uppercase">
                    {ogData.ogSiteName || siteName}
                  </div>
                  <div className="font-semibold text-base text-gray-900 line-clamp-2">
                    {ogData.ogTitle || title}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {ogData.ogDescription || description}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => handleTest('linkedin')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Test trên LinkedIn
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



