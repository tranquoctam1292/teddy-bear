'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  initialColor?: string;
}

export default function ColorPickerModal({
  isOpen,
  onClose,
  onSelect,
  initialColor = '#000000',
}: ColorPickerModalProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hex, setHex] = useState('000000');
  
  const gradientRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  };

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Update color from HSL
  useEffect(() => {
    const newRgb = hslToRgb(hue, saturation, lightness);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }, [hue, saturation, lightness]);

  // Handle gradient click/drag
  const handleGradientInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return;
    
    const rect = gradientRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    const newSaturation = (x / rect.width) * 100;
    const newLightness = 100 - (y / rect.height) * 100;
    
    setSaturation(newSaturation);
    setLightness(newLightness);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handleGradientInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      handleGradientInteraction(e);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Handle RGB input change
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [channel]: numValue };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  // Handle Hex input change
  const handleHexChange = (value: string) => {
    const cleanHex = value.replace('#', '');
    if (/^[0-9A-Fa-f]{0,6}$/.test(cleanHex)) {
      setHex(cleanHex);
      if (cleanHex.length === 6) {
        const newRgb = hexToRgb(cleanHex);
        setRgb(newRgb);
      }
    }
  };

  const handleApply = () => {
    onSelect(`#${hex}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Màu sắc</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            {/* Gradient Selector */}
            <div
              ref={gradientRef}
              className="relative w-64 h-64 rounded cursor-crosshair"
              style={{
                background: `linear-gradient(to bottom, transparent, #000),
                           linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Picker Circle */}
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                }}
              />
            </div>

            {/* Hue Slider */}
            <div className="flex flex-col gap-3">
              <div
                className="relative w-8 h-64 rounded cursor-pointer"
                style={{
                  background: 'linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
                  const newHue = (y / rect.height) * 360;
                  setHue(newHue);
                }}
              >
                {/* Hue Picker */}
                <div
                  className="absolute left-0 right-0 h-1 border-2 border-white shadow-lg transform -translate-y-1/2"
                  style={{ top: `${(hue / 360) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Color Values */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">R</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => handleRgbChange('r', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">G</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => handleRgbChange('g', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">B</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => handleRgbChange('b', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">#</label>
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm uppercase"
                maxLength={6}
              />
            </div>
          </div>

          {/* Current Color Preview */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border-2 border-gray-300"
              style={{ backgroundColor: `#${hex}` }}
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Màu hiện tại</p>
              <p className="text-gray-600">#{hex.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-4 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Đồng ý
          </Button>
        </div>
      </div>
    </div>
  );
}







