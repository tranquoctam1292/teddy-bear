'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tag, X, TrendingUp } from 'lucide-react';

interface TagBoxProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  title?: string;
}

export default function TagBox({
  tags,
  onChange,
  suggestions = [],
  title = 'Thẻ',
}: TagBoxProps) {
  const [tagInput, setTagInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const addSuggestion = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onChange([...tags, suggestion]);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Tag className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Tag Input */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Thêm thẻ..."
            className="flex-1 text-sm"
          />
          <Button
            type="button"
            onClick={() => addTag(tagInput)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Thêm
          </Button>
        </div>

        {/* Selected Tags */}
        {tags.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">
              Đã chọn:
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 pl-2 pr-1 py-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {tags.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-2">
            Chưa có thẻ nào
          </p>
        )}

        {/* Popular Tags Suggestions */}
        {suggestions.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Thẻ phổ biến:
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestions
                .filter(s => !tags.includes(s))
                .slice(0, 6)
                .map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSuggestion(suggestion)}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}




