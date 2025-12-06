'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Folder, Plus, Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoryBoxProps {
  categories: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onCreateNew?: (name: string) => void;
  allowMultiple?: boolean;
  title?: string;
}

export default function CategoryBox({
  categories,
  selected,
  onChange,
  onCreateNew,
  allowMultiple = false,
  title = 'Danh mục',
}: CategoryBoxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (categoryId: string) => {
    if (allowMultiple) {
      if (selected.includes(categoryId)) {
        onChange(selected.filter(id => id !== categoryId));
      } else {
        onChange([...selected, categoryId]);
      }
    } else {
      onChange([categoryId]);
    }
  };

  const handleCreate = () => {
    if (newCategoryName.trim() && onCreateNew) {
      onCreateNew(newCategoryName.trim());
      setNewCategoryName('');
      setShowCreate(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Folder className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search */}
        {categories.length > 5 && (
          <div className="relative">
            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
        )}

        {/* Category List */}
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filteredCategories.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">
              Không tìm thấy danh mục
            </p>
          ) : (
            filteredCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type={allowMultiple ? 'checkbox' : 'radio'}
                  checked={selected.includes(category.id)}
                  onChange={() => handleToggle(category.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex-1">
                  {category.name}
                </span>
                {category.count !== undefined && (
                  <span className="text-xs text-gray-500">
                    ({category.count})
                  </span>
                )}
              </label>
            ))
          )}
        </div>

        {/* Create New */}
        {onCreateNew && (
          <div className="pt-2 border-t">
            {showCreate ? (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Tên danh mục mới"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                  className="text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleCreate}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Tạo
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowCreate(false);
                      setNewCategoryName('');
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setShowCreate(true)}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Tạo danh mục mới
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}







