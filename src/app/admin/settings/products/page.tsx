'use client';

// Admin Products Settings Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import CategoryManager from '@/components/admin/CategoryManager';
import CategoryForm from '@/components/admin/CategoryForm';
import TagManager from '@/components/admin/TagManager';
import TagForm from '@/components/admin/TagForm';
import AttributeManager from '@/components/admin/AttributeManager';
import AttributeForm from '@/components/admin/AttributeForm';
import type { ProductCategory } from '@/lib/schemas/product-settings';
import type { ProductTag } from '@/lib/schemas/product-settings';
import type { ProductAttribute } from '@/lib/schemas/product-settings';

export default function AdminProductsSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Categories state
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | undefined>();
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Tags state
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | undefined>();
  const [isSavingTag, setIsSavingTag] = useState(false);

  // Attributes state
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [attributesLoading, setAttributesLoading] = useState(true);
  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ProductAttribute | undefined>();
  const [isSavingAttribute, setIsSavingAttribute] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCategories();
      fetchTags();
      fetchAttributes();
    }
  }, [status]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/admin/settings/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      setTagsLoading(true);
      const response = await fetch('/api/admin/settings/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setTagsLoading(false);
    }
  };

  const fetchAttributes = async () => {
    try {
      setAttributesLoading(true);
      const response = await fetch('/api/admin/settings/attributes');
      if (!response.ok) throw new Error('Failed to fetch attributes');
      const data = await response.json();
      setAttributes(data.attributes || []);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    } finally {
      setAttributesLoading(false);
    }
  };

  // Category handlers
  const handleCreateCategory = () => {
    setEditingCategory(undefined);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleSaveCategory = async (data: any) => {
    try {
      setIsSavingCategory(true);
      const url = editingCategory
        ? `/api/admin/settings/categories/${editingCategory.id}`
        : '/api/admin/settings/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      setShowCategoryForm(false);
      setEditingCategory(undefined);
      await fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (category: ProductCategory) => {
    try {
      const response = await fetch(`/api/admin/settings/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa danh mục');
      throw error;
    }
  };

  // Tag handlers
  const handleCreateTag = () => {
    setEditingTag(undefined);
    setShowTagForm(true);
  };

  const handleEditTag = (tag: ProductTag) => {
    setEditingTag(tag);
    setShowTagForm(true);
  };

  const handleSaveTag = async (data: any) => {
    try {
      setIsSavingTag(true);
      const url = editingTag
        ? `/api/admin/settings/tags/${editingTag.id}`
        : '/api/admin/settings/tags';
      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save tag');
      }

      setShowTagForm(false);
      setEditingTag(undefined);
      await fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu tag');
    } finally {
      setIsSavingTag(false);
    }
  };

  const handleDeleteTag = async (tag: ProductTag) => {
    try {
      const response = await fetch(`/api/admin/settings/tags/${tag.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete tag');
      }

      await fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa tag');
      throw error;
    }
  };

  // Attribute handlers
  const handleCreateAttribute = () => {
    setEditingAttribute(undefined);
    setShowAttributeForm(true);
  };

  const handleEditAttribute = (attribute: ProductAttribute) => {
    setEditingAttribute(attribute);
    setShowAttributeForm(true);
  };

  const handleSaveAttribute = async (data: any) => {
    try {
      setIsSavingAttribute(true);
      const url = editingAttribute
        ? `/api/admin/settings/attributes/${editingAttribute.id}`
        : '/api/admin/settings/attributes';
      const method = editingAttribute ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save attribute');
      }

      setShowAttributeForm(false);
      setEditingAttribute(undefined);
      await fetchAttributes();
    } catch (error) {
      console.error('Error saving attribute:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu thuộc tính');
    } finally {
      setIsSavingAttribute(false);
    }
  };

  const handleDeleteAttribute = async (attribute: ProductAttribute) => {
    try {
      const response = await fetch(`/api/admin/settings/attributes/${attribute.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete attribute');
      }

      await fetchAttributes();
    } catch (error) {
      console.error('Error deleting attribute:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa thuộc tính');
      throw error;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/settings">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt Sản phẩm</h1>
            <p className="text-sm text-gray-600 mt-1">
              Cài đặt danh mục, tags, và thuộc tính sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Categories Section */}
        <Card>
          <CardHeader>
            <CardTitle>Danh mục sản phẩm</CardTitle>
            <CardDescription>
              Quản lý các danh mục sản phẩm của cửa hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showCategoryForm ? (
              <CategoryForm
                category={editingCategory}
                categories={categories}
                onSubmit={handleSaveCategory}
                onCancel={() => {
                  setShowCategoryForm(false);
                  setEditingCategory(undefined);
                }}
                isLoading={isSavingCategory}
              />
            ) : (
              <CategoryManager
                categories={categories}
                onCreate={handleCreateCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                isLoading={categoriesLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Tags Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tags sản phẩm</CardTitle>
            <CardDescription>
              Quản lý các tags để phân loại và tìm kiếm sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showTagForm ? (
              <TagForm
                tag={editingTag}
                onSubmit={handleSaveTag}
                onCancel={() => {
                  setShowTagForm(false);
                  setEditingTag(undefined);
                }}
                isLoading={isSavingTag}
              />
            ) : (
              <TagManager
                tags={tags}
                onCreate={handleCreateTag}
                onEdit={handleEditTag}
                onDelete={handleDeleteTag}
                isLoading={tagsLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Attributes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Thuộc tính sản phẩm</CardTitle>
            <CardDescription>
              Cấu hình các thuộc tính như kích thước, màu sắc, chất liệu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showAttributeForm ? (
              <AttributeForm
                attribute={editingAttribute}
                onSubmit={handleSaveAttribute}
                onCancel={() => {
                  setShowAttributeForm(false);
                  setEditingAttribute(undefined);
                }}
                isLoading={isSavingAttribute}
              />
            ) : (
              <AttributeManager
                attributes={attributes}
                onCreate={handleCreateAttribute}
                onEdit={handleEditAttribute}
                onDelete={handleDeleteAttribute}
                isLoading={attributesLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

