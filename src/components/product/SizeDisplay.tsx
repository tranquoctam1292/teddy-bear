'use client';

// Component hiển thị danh sách kích thước có sẵn
interface SizeDisplayProps {
  sizes: string[];
  maxDisplay?: number; // Số lượng sizes tối đa hiển thị
  className?: string;
  selectedSize?: string; // Size đang được chọn
  onSizeSelect?: (size: string) => void; // Callback khi click vào size
}

export default function SizeDisplay({ 
  sizes, 
  maxDisplay = 4,
  className = '',
  selectedSize,
  onSizeSelect
}: SizeDisplayProps) {
  if (!sizes || sizes.length === 0) return null;

  const displaySizes = sizes.slice(0, maxDisplay);
  const remainingCount = sizes.length - maxDisplay;

  const handleClick = (size: string, e: React.MouseEvent) => {
    if (onSizeSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSizeSelect(size);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {displaySizes.map((size, index) => {
        const isSelected = selectedSize === size;
        return (
          <button
            key={index}
            type="button"
            onClick={(e) => handleClick(size, e)}
            className={`
              inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border transition-all
              ${isSelected 
                ? 'bg-pink-100 text-pink-700 border-pink-400 font-semibold' 
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }
              ${onSizeSelect ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            {size}
          </button>
        );
      })}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

