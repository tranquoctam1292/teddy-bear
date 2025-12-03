'use client';

import { useState } from 'react';
import { X, Info, Code, Download, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/tabs';
import { Select } from '../ui/select';

interface SchemaBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (schema: any) => void;
}

// Schema Templates
const SCHEMA_TEMPLATES = {
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "",
    "description": "",
    "image": "",
    "author": {
      "@type": "Person",
      "name": ""
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Emotional House",
      "logo": {
        "@type": "ImageObject",
        "url": ""
      }
    },
    "datePublished": "",
    "dateModified": ""
  },
  Product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "",
    "image": "",
    "description": "",
    "brand": {
      "@type": "Brand",
      "name": "The Emotional House"
    },
    "offers": {
      "@type": "Offer",
      "price": "",
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock"
    }
  },
  Organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Emotional House",
    "url": "",
    "logo": "",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service"
    }
  },
  BreadcrumbList: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": ""
      }
    ]
  },
  FAQPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ""
        }
      }
    ]
  }
};

export default function SchemaBuilder({
  isOpen,
  onClose,
  onApply,
}: SchemaBuilderProps) {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof SCHEMA_TEMPLATES>('Article');
  const [importSource, setImportSource] = useState('url');
  const [importUrl, setImportUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [schemaCode, setSchemaCode] = useState(JSON.stringify(SCHEMA_TEMPLATES.Article, null, 2));

  if (!isOpen) return null;

  const handleTemplateSelect = (template: keyof typeof SCHEMA_TEMPLATES) => {
    setSelectedTemplate(template);
    setSchemaCode(JSON.stringify(SCHEMA_TEMPLATES[template], null, 2));
  };

  const handleImport = async () => {
    if (importSource === 'url' && importUrl) {
      // TODO: Implement URL scraping
      alert('Tính năng import từ URL đang được phát triển');
    } else if (importSource === 'code' && customCode) {
      try {
        JSON.parse(customCode);
        setSchemaCode(customCode);
        setActiveTab('custom');
      } catch (e) {
        alert('Mã JSON không hợp lệ');
      }
    }
  };

  const handleApply = () => {
    try {
      const schema = JSON.parse(schemaCode);
      onApply(schema);
      onClose();
    } catch (e) {
      alert('Mã schema không hợp lệ');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaCode);
    alert('Đã sao chép vào clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Trình tạo Schema</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-12 bg-transparent border-0 gap-4">
                <TabsTrigger 
                  value="templates" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
                >
                  Mẫu Schema
                </TabsTrigger>
                <TabsTrigger 
                  value="import" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
                >
                  Import
                </TabsTrigger>
                <TabsTrigger 
                  value="custom" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4"
                >
                  Custom Schema
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {/* Templates Tab */}
              <TabsContent value="templates" className="mt-0 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Chọn một mẫu schema phổ biến để bắt đầu. Bạn có thể chỉnh sửa sau khi chọn.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.keys(SCHEMA_TEMPLATES).map((template) => (
                    <button
                      key={template}
                      onClick={() => handleTemplateSelect(template as keyof typeof SCHEMA_TEMPLATES)}
                      className={`p-4 border-2 rounded-lg text-left hover:border-blue-500 transition-colors ${
                        selectedTemplate === template ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <Code className="w-6 h-6 text-gray-600 mb-2" />
                      <h3 className="font-medium text-gray-900">{template}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Schema.org {template}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Xem trước mã:</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-64">
                    {schemaCode}
                  </pre>
                </div>
              </TabsContent>

              {/* Import Tab */}
              <TabsContent value="import" className="mt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import Schema Code from
                  </label>
                  <Select 
                    value={importSource} 
                    onChange={(e) => setImportSource(e.target.value)}
                    className="mb-4"
                  >
                    <option value="url">URL / Online Page</option>
                    <option value="html">HTML Code</option>
                    <option value="code">JSON-LD/Custom Code</option>
                  </Select>

                  {importSource === 'url' && (
                    <div className="space-y-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/page"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Nhập URL của trang web để trích xuất schema tự động
                      </p>
                    </div>
                  )}

                  {(importSource === 'html' || importSource === 'code') && (
                    <div className="space-y-2">
                      <textarea
                        className="w-full h-64 px-4 py-2 border border-gray-300 rounded-md font-mono text-sm"
                        placeholder={importSource === 'html' ? 'Dán mã HTML ở đây...' : 'Dán mã JSON-LD ở đây...'}
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleImport}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Import
                  </Button>
                </div>
              </TabsContent>

              {/* Custom Schema Tab */}
              <TabsContent value="custom" className="mt-0 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    Chỉnh sửa mã JSON-LD schema. Đảm bảo cú pháp JSON hợp lệ.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Schema Code (JSON-LD)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  <textarea
                    className="w-full h-96 px-4 py-2 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
                    value={schemaCode}
                    onChange={(e) => setSchemaCode(e.target.value)}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between bg-gray-50">
          <div className="text-xs text-gray-600">
            <a 
              href="https://schema.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Tìm hiểu thêm về Schema.org
            </a>
          </div>
          <div className="flex gap-2">
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
              Áp dụng Schema
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
