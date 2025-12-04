'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/admin/ui/input';
import { Select } from '@/components/admin/ui/select';

interface CommentFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPost: string;
  setFilterPost: (id: string) => void;
  posts?: Array<{ _id: string; title: string }>;
}

export default function CommentFilterBar({
  searchQuery,
  setSearchQuery,
  filterPost,
  setFilterPost,
  posts = [],
}: CommentFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 border-b border-gray-200">
      <span className="text-sm font-medium text-gray-700">Bộ lọc:</span>

      {posts.length > 0 && (
        <Select
          value={filterPost}
          onChange={(e) => setFilterPost(e.target.value)}
          className="w-64"
        >
          <option value="">Tất cả bài viết</option>
          {posts.map((post) => (
            <option key={post._id} value={post._id}>
              {post.title}
            </option>
          ))}
        </Select>
      )}

      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Tìm kiếm bình luận..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}


