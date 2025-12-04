'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HomepageSection, HeroBannerContent, FeaturedProductsContent } from '@/lib/types/homepage';
import { Trash2, Copy } from 'lucide-react';

interface SectionEditorPanelProps {
  section: HomepageSection;
  onChange: (section: HomepageSection) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function SectionEditorPanel({
  section,
  onChange,
  onDelete,
  onDuplicate,
}: SectionEditorPanelProps) {
  // Update section content
  function updateContent(updates: Partial<typeof section.content>) {
    onChange({
      ...section,
      content: {
        ...section.content,
        ...updates,
      },
    });
  }

  // Update section layout
  function updateLayout(updates: Partial<typeof section.layout>) {
    onChange({
      ...section,
      layout: {
        ...section.layout,
        ...updates,
      },
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{section.name}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="content">
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="layout" className="flex-1">Layout</TabsTrigger>
            <TabsTrigger value="visibility" className="flex-1">Visibility</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            {/* Section Name */}
            <div className="space-y-2">
              <Label>Section Name</Label>
              <Input
                value={section.name}
                onChange={(e) => onChange({ ...section, name: e.target.value })}
              />
            </div>

            {/* Enabled Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                id="enabled"
                checked={section.enabled}
                onCheckedChange={(checked) =>
                  onChange({ ...section, enabled: checked })
                }
              />
            </div>

            {/* Dynamic Content Editor based on section type */}
            {section.type === 'hero-banner' && (
              <HeroBannerEditor
                content={section.content as HeroBannerContent}
                onChange={updateContent}
              />
            )}

            {section.type === 'featured-products' && (
              <FeaturedProductsEditor
                content={section.content as FeaturedProductsContent}
                onChange={updateContent}
              />
            )}

            {/* Add more type-specific editors as needed */}
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4 mt-4">
            {/* Layout Type */}
            <div className="space-y-2">
              <Label>Layout Type</Label>
              <Select
                value={section.layout.type}
                onValueChange={(value: any) => updateLayout({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-width">Full Width</SelectItem>
                  <SelectItem value="contained">Contained</SelectItem>
                  <SelectItem value="split">Split</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={section.layout.backgroundColor || '#ffffff'}
                  onChange={(e) =>
                    updateLayout({ backgroundColor: e.target.value })
                  }
                  className="w-20"
                />
                <Input
                  value={section.layout.backgroundColor || ''}
                  onChange={(e) =>
                    updateLayout({ backgroundColor: e.target.value })
                  }
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Padding Controls */}
            <div className="space-y-2">
              <Label>Padding (px)</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    type="number"
                    value={section.layout.padding?.top || 48}
                    onChange={(e) =>
                      updateLayout({
                        padding: {
                          ...section.layout.padding,
                          top: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    value={section.layout.padding?.bottom || 48}
                    onChange={(e) =>
                      updateLayout({
                        padding: {
                          ...section.layout.padding,
                          bottom: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    type="number"
                    value={section.layout.padding?.left || 16}
                    onChange={(e) =>
                      updateLayout({
                        padding: {
                          ...section.layout.padding,
                          left: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    value={section.layout.padding?.right || 16}
                    onChange={(e) =>
                      updateLayout({
                        padding: {
                          ...section.layout.padding,
                          right: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Visibility Tab */}
          <TabsContent value="visibility" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Control when and where this section appears
            </p>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date (Optional)</Label>
                <Input
                  type="date"
                  value={
                    section.visibility?.startDate
                      ? new Date(section.visibility.startDate)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    onChange({
                      ...section,
                      visibility: {
                        ...section.visibility,
                        startDate: e.target.value ? new Date(e.target.value) : undefined,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Input
                  type="date"
                  value={
                    section.visibility?.endDate
                      ? new Date(section.visibility.endDate)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    onChange({
                      ...section,
                      visibility: {
                        ...section.visibility,
                        endDate: e.target.value ? new Date(e.target.value) : undefined,
                      },
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Hero Banner specific editor
function HeroBannerEditor({
  content,
  onChange,
}: {
  content: HeroBannerContent;
  onChange: (updates: Partial<HeroBannerContent>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Heading *</Label>
        <Input
          value={content.heading}
          onChange={(e) => onChange({ heading: e.target.value })}
          placeholder="Welcome to Our Store"
        />
      </div>

      <div className="space-y-2">
        <Label>Subheading</Label>
        <Input
          value={content.subheading || ''}
          onChange={(e) => onChange({ subheading: e.target.value })}
          placeholder="Find amazing products"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={content.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Additional description text..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Background Image URL *</Label>
        <Input
          value={content.image}
          onChange={(e) => onChange({ image: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label>Image Alt Text *</Label>
        <Input
          value={content.imageAlt}
          onChange={(e) => onChange({ imageAlt: e.target.value })}
          placeholder="Describe the image"
        />
      </div>

      {/* Primary Button */}
      <div className="space-y-2">
        <Label>Primary Button</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={content.primaryButton?.text || ''}
            onChange={(e) =>
              onChange({
                primaryButton: {
                  ...content.primaryButton,
                  text: e.target.value,
                  link: content.primaryButton?.link || '',
                },
              })
            }
            placeholder="Button text"
          />
          <Input
            value={content.primaryButton?.link || ''}
            onChange={(e) =>
              onChange({
                primaryButton: {
                  ...content.primaryButton,
                  text: content.primaryButton?.text || '',
                  link: e.target.value,
                },
              })
            }
            placeholder="/link"
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-2">
        <Label>Text Alignment</Label>
        <Select
          value={content.textAlign || 'center'}
          onValueChange={(value: any) => onChange({ textAlign: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Featured Products specific editor
function FeaturedProductsEditor({
  content,
  onChange,
}: {
  content: FeaturedProductsContent;
  onChange: (updates: Partial<FeaturedProductsContent>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input
          value={content.heading || ''}
          onChange={(e) => onChange({ heading: e.target.value })}
          placeholder="Featured Products"
        />
      </div>

      <div className="space-y-2">
        <Label>Product Selection</Label>
        <Select
          value={content.productSelection}
          onValueChange={(value: any) => onChange({ productSelection: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatic">Automatic (Latest)</SelectItem>
            <SelectItem value="manual">Manual Selection</SelectItem>
            <SelectItem value="category">By Category</SelectItem>
            <SelectItem value="tag">By Tag</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Columns</Label>
          <Input
            type="number"
            min={1}
            max={6}
            value={content.columns || 4}
            onChange={(e) => onChange({ columns: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Limit</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={content.limit || 8}
            onChange={(e) => onChange({ limit: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Show Price</Label>
          <Switch
            checked={content.showPrice !== false}
            onCheckedChange={(checked) => onChange({ showPrice: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Rating</Label>
          <Switch
            checked={content.showRating !== false}
            onCheckedChange={(checked) => onChange({ showRating: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Add to Cart</Label>
          <Switch
            checked={content.showAddToCart !== false}
            onCheckedChange={(checked) => onChange({ showAddToCart: checked })}
          />
        </div>
      </div>
    </div>
  );
}

