'use client';

// Component hiển thị danh sách màu sắc có sẵn
interface ColorDisplayProps {
  colors: Array<{
    name?: string;
    code?: string;
  }>;
  maxDisplay?: number; // Số lượng colors tối đa hiển thị
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Kích thước color circle
  selectedColor?: string; // Color code đang được chọn
  onColorSelect?: (color: { name?: string; code?: string }) => void; // Callback khi click vào color
}

export default function ColorDisplay({ 
  colors, 
  maxDisplay = 3,
  className = '',
  size = 'md',
  selectedColor,
  onColorSelect
}: ColorDisplayProps) {
  if (!colors || colors.length === 0) return null;

  const displayColors = colors.slice(0, maxDisplay);
  const remainingCount = colors.length - maxDisplay;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (color: { name?: string; code?: string }, e: React.MouseEvent) => {
    if (onColorSelect) {
      e.preventDefault();
      e.stopPropagation();
      onColorSelect(color);
    }
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {displayColors.map((color, index) => {
        const bgColor = color.code || '#CCCCCC';
        const borderColor = color.code || '#999999';
        const colorKey = color.code || color.name || `default-${index}`;
        const isSelected = selectedColor === color.code || selectedColor === color.name;
        
        return (
          <button
            key={index}
            type="button"
            onClick={(e) => handleClick(color, e)}
            className={`
              ${sizeClasses[size]} rounded-full border-2 shadow-sm transition-all
              ${isSelected 
                ? 'ring-2 ring-pink-500 ring-offset-2 scale-110' 
                : 'border-white hover:scale-105'
              }
              ${onColorSelect ? 'cursor-pointer' : 'cursor-default'}
            `}
            style={{
              backgroundColor: bgColor,
              borderColor: isSelected ? '#ec4899' : borderColor,
            }}
            title={color.name || `Color ${index + 1}`}
            aria-label={color.name || `Color ${index + 1}`}
          />
        );
      })}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

