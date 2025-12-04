'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
      <div className="text-sm text-gray-600">
        {total} mục
      </div>

      <div className="flex items-center gap-2">
        {/* First Page */}
        <Button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous Page */}
        <Button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page Info */}
        <span className="text-sm text-gray-700 px-3">
          <span className="font-medium">{currentPage}</span>
          {' '}trên{' '}
          <span className="font-medium">{totalPages}</span>
        </span>

        {/* Next Page */}
        <Button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last Page */}
        <Button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}


