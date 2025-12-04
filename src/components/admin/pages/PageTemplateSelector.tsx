'use client';

import { PAGE_TEMPLATES, PageTemplate } from '@/lib/types/page';
import { Check } from 'lucide-react';

interface PageTemplateSelectorProps {
  selected: string;
  onChange: (templateId: string) => void;
}

export default function PageTemplateSelector({
  selected,
  onChange,
}: PageTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PAGE_TEMPLATES.map((template) => {
        const isSelected = selected === template.id;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={`relative p-4 rounded-lg border-2 text-left transition-all ${
              isSelected
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}

            <div className="mb-2">
              <h4
                className={`font-medium ${
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                }`}
              >
                {template.name}
              </h4>
            </div>

            {template.description && (
              <p
                className={`text-sm ${
                  isSelected ? 'text-blue-700' : 'text-gray-600'
                }`}
              >
                {template.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}



