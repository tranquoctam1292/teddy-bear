'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { HomepageSection, SectionType } from '@/lib/types/homepage';
import { SECTION_METADATA, getDefaultSectionContent } from '@/components/homepage/sections';
import { Search } from 'lucide-react';

interface AddSectionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (section: HomepageSection) => void;
}

export function AddSectionModal({ open, onClose, onAdd }: AddSectionModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'hero', 'products', 'content', 'marketing', 'misc'];

  // Filter sections
  const filteredSections = Object.entries(SECTION_METADATA).filter(
    ([type, meta]) => {
      const matchesCategory = selectedCategory === 'all' || meta.category === selectedCategory;
      const matchesSearch = search === '' || 
        meta.name.toLowerCase().includes(search.toLowerCase()) ||
        meta.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    }
  );

  function handleSelectSection(type: SectionType) {
    const metadata = SECTION_METADATA[type];
    const defaultContent = getDefaultSectionContent(type);

    const newSection: HomepageSection = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: metadata.name,
      order: 0,
      enabled: true,
      layout: {
        type: 'contained',
        columns: 1,
        gap: 24,
        padding: {
          top: 48,
          bottom: 48,
          left: 16,
          right: 16,
        },
      },
      content: defaultContent,
    };

    onAdd(newSection);
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>
            Choose a section type to add to your homepage
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filteredSections.map(([type, meta]) => (
                <Card
                  key={type}
                  className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                  onClick={() => handleSelectSection(type as SectionType)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{meta.icon}</div>
                    <h4 className="font-semibold mb-1">{meta.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {meta.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSections.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No sections found matching your criteria
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

