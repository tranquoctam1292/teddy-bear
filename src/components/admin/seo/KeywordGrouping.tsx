'use client';

/**
 * Keyword Grouping Component
 * Group keywords by tags or custom groups
 */
import { useState, useEffect } from 'react';
import { Folder, Tag, X, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Badge } from '@/components/admin/ui/badge';

interface KeywordGroupingProps {
  keywords: any[];
  onGroupChange?: (grouped: Record<string, any[]>) => void;
}

export default function KeywordGrouping({ keywords, onGroupChange }: KeywordGroupingProps) {
  const [groupBy, setGroupBy] = useState<'tags' | 'entityType' | 'status' | 'custom'>('tags');
  const [customGroups, setCustomGroups] = useState<Record<string, string[]>>({});
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    const grouped = groupKeywords();
    onGroupChange?.(grouped);
  }, [groupBy, customGroups, keywords]);

  const groupKeywords = (): Record<string, any[]> => {
    const grouped: Record<string, any[]> = {};

    if (groupBy === 'tags') {
      keywords.forEach((keyword) => {
        const tags = keyword.tags || [];
        if (tags.length === 0) {
          if (!grouped['No Tags']) grouped['No Tags'] = [];
          grouped['No Tags'].push(keyword);
        } else {
          tags.forEach((tag: string) => {
            if (!grouped[tag]) grouped[tag] = [];
            grouped[tag].push(keyword);
          });
        }
      });
    } else if (groupBy === 'entityType') {
      keywords.forEach((keyword) => {
        const type = keyword.entityType || 'unknown';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(keyword);
      });
    } else if (groupBy === 'status') {
      keywords.forEach((keyword) => {
        const status = keyword.status || 'unknown';
        if (!grouped[status]) grouped[status] = [];
        grouped[status].push(keyword);
      });
    } else if (groupBy === 'custom') {
      Object.entries(customGroups).forEach(([groupName, keywordIds]) => {
        if (!grouped[groupName]) grouped[groupName] = [];
        keywordIds.forEach((id) => {
          const keyword = keywords.find((k) => k.id === id);
          if (keyword) grouped[groupName].push(keyword);
        });
      });

      // Add ungrouped keywords
      const groupedIds = new Set(Object.values(customGroups).flat());
      const ungrouped = keywords.filter((k) => !groupedIds.has(k.id));
      if (ungrouped.length > 0) {
        grouped['Ungrouped'] = ungrouped;
      }
    }

    return grouped;
  };

  const createCustomGroup = () => {
    if (!newGroupName.trim()) return;
    setCustomGroups((prev) => ({
      ...prev,
      [newGroupName.trim()]: [],
    }));
    setNewGroupName('');
  };

  const addKeywordToGroup = (groupName: string, keywordId: string) => {
    setCustomGroups((prev) => ({
      ...prev,
      [groupName]: [...(prev[groupName] || []), keywordId],
    }));
  };

  const removeKeywordFromGroup = (groupName: string, keywordId: string) => {
    setCustomGroups((prev) => ({
      ...prev,
      [groupName]: (prev[groupName] || []).filter((id) => id !== keywordId),
    }));
  };

  const deleteGroup = (groupName: string) => {
    setCustomGroups((prev) => {
      const newGroups = { ...prev };
      delete newGroups[groupName];
      return newGroups;
    });
  };

  const grouped = groupKeywords();

  return (
    <div className="space-y-4">
      {/* Group By Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Nhóm theo:</label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="tags">Tags</option>
          <option value="entityType">Loại Entity</option>
          <option value="status">Trạng thái</option>
          <option value="custom">Tùy chỉnh</option>
        </select>

        {groupBy === 'custom' && (
          <div className="flex gap-2">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Tên nhóm mới..."
              className="w-48"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  createCustomGroup();
                }
              }}
            />
            <Button onClick={createCustomGroup} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tạo nhóm
            </Button>
          </div>
        )}
      </div>

      {/* Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(grouped).map(([groupName, groupKeywords]) => (
          <Card key={groupName}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-gray-500" />
                  <CardTitle className="text-lg">{groupName}</CardTitle>
                  <Badge variant="outline">{groupKeywords.length}</Badge>
                </div>
                {groupBy === 'custom' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGroup(groupName)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupKeywords.map((keyword) => (
                  <div
                    key={keyword.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {keyword.keyword}
                      </div>
                      {keyword.currentRank !== undefined && (
                        <div className="text-xs text-gray-500">
                          #{keyword.currentRank}
                        </div>
                      )}
                    </div>
                    {groupBy === 'custom' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeywordFromGroup(groupName, keyword.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Không có từ khóa nào</p>
        </div>
      )}
    </div>
  );
}


