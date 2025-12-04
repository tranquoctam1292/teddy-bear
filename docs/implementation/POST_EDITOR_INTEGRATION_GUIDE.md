# 📝 Post Editor - Author Integration Guide

> Hướng dẫn tích hợp AuthorBoxWidget vào Post Editor

**Created:** December 4, 2025  
**Status:** ✅ Widget Ready - Integration Needed

---

## ✅ Đã hoàn thành

### AuthorBoxWidget Component

**File:** `src/components/admin/posts/AuthorBoxWidget.tsx`

**Features:**
- ✅ Author selection với autocomplete search
- ✅ Reviewer selection (YMYL compliance)
- ✅ Guest author toggle + inline form
- ✅ Review date picker
- ✅ Real-time search với debounce
- ✅ Avatar display
- ✅ Credentials display
- ✅ Clear selection buttons
- ✅ Validation & error handling

---

## 🔧 Cách Integration

### Step 1: Import Widget vào Post Editor

**Files cần update:**
- `src/app/admin/posts/new/page.tsx` (Create post)
- `src/app/admin/posts/[id]/edit/page.tsx` (Edit post)

**Import:**
```typescript
import AuthorBoxWidget from '@/components/admin/posts/AuthorBoxWidget';
import { PostAuthorInfo } from '@/lib/types/author';
```

### Step 2: Add State Management

**Trong component function, thêm state:**
```typescript
const [authorInfo, setAuthorInfo] = useState<PostAuthorInfo | undefined>(
  initialPost?.authorInfo
);
```

### Step 3: Add Widget vào Sidebar

**Thêm vào sidebar section (thường ở bên phải):**
```tsx
{/* Author Information */}
<AuthorBoxWidget
  value={authorInfo}
  onChange={setAuthorInfo}
/>
```

### Step 4: Save authorInfo khi Submit

**Trong handleSubmit function:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const postData = {
    title,
    content,
    slug,
    // ... other fields ...
    authorInfo, // ← ADD THIS
  };

  // Send to API...
};
```

---

## 📝 Example Implementation (New Post)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthorBoxWidget from '@/components/admin/posts/AuthorBoxWidget';
import { PostAuthorInfo } from '@/lib/types/author';

export default function NewPostPage() {
  const router = useRouter();
  
  // Post fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  // ... other fields ...
  
  // Author info
  const [authorInfo, setAuthorInfo] = useState<PostAuthorInfo | undefined>();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postData = {
        title,
        content,
        slug,
        status: 'draft',
        authorInfo, // Include author info
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        alert('✅ Post created successfully!');
        router.push('/admin/posts');
      } else {
        alert('❌ Failed to create post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error creating post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            required
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post content..."
            required
          />
          
          {/* ... other fields ... */}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Author Widget */}
          <AuthorBoxWidget
            value={authorInfo}
            onChange={setAuthorInfo}
          />
          
          {/* ... other sidebar widgets ... */}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {isLoading ? 'Saving...' : 'Publish Post'}
          </button>
        </div>
      </div>
    </form>
  );
}
```

---

## 📝 Example Implementation (Edit Post)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthorBoxWidget from '@/components/admin/posts/AuthorBoxWidget';
import { PostAuthorInfo } from '@/lib/types/author';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorInfo, setAuthorInfo] = useState<PostAuthorInfo | undefined>();
  
  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${params.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setAuthorInfo(data.authorInfo); // ← Load existing author info
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        ...post,
        title,
        content,
        authorInfo, // ← Include updated author info
        updatedAt: new Date(),
      };

      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        alert('✅ Post updated successfully!');
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error updating post');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {/* ... form fields ... */}
      
      {/* Sidebar */}
      <AuthorBoxWidget
        value={authorInfo}
        onChange={setAuthorInfo}
      />
      
      <button type="submit">Update Post</button>
    </form>
  );
}
```

---

## 🎯 Widget API

### Props

```typescript
interface AuthorBoxWidgetProps {
  value?: PostAuthorInfo;        // Current author info
  onChange: (info: PostAuthorInfo) => void;  // Callback when changed
}
```

### PostAuthorInfo Structure

```typescript
interface PostAuthorInfo {
  // Option 1: Regular author
  authorId?: string;
  authorName?: string;
  
  // Option 2: Guest author
  guestAuthor?: {
    name: string;
    avatar?: string;
    bio?: string;
    jobTitle?: string;
    credentials?: string;
  };
  
  // Reviewer (YMYL)
  reviewerId?: string;
  reviewerName?: string;
  
  // Review date
  lastReviewedDate?: Date;
}
```

---

## 🧪 Testing

### Test Cases

1. **Author Selection:**
   - [ ] Can search authors
   - [ ] Can select author from dropdown
   - [ ] Can clear selection
   - [ ] Selected author displays correctly

2. **Reviewer Selection:**
   - [ ] Can search reviewers
   - [ ] Can select reviewer
   - [ ] Review date picker appears
   - [ ] Can clear reviewer

3. **Guest Author:**
   - [ ] Toggle works
   - [ ] Can enter guest author info
   - [ ] All fields save correctly

4. **Save to Database:**
   - [ ] authorInfo saves on create
   - [ ] authorInfo saves on update
   - [ ] Loads correctly on edit

---

## 🔗 Related Files

### Types
- `src/lib/types/author.ts` - Author interfaces
- `src/lib/schemas/author.ts` - Validation schemas

### API Endpoints
- `GET /api/authors/search?q=query` - Author autocomplete
- `POST /api/admin/posts` - Create post (with authorInfo)
- `PATCH /api/admin/posts/[id]` - Update post (with authorInfo)

### Components
- `src/components/admin/posts/AuthorBoxWidget.tsx` - The widget

---

## 📊 Database Schema

**posts collection needs to include:**

```typescript
{
  _id: ObjectId,
  title: string,
  content: string,
  // ... other fields ...
  
  // NEW: Author Information
  authorInfo?: {
    authorId?: string,
    authorName?: string,
    reviewerId?: string,
    reviewerName?: string,
    guestAuthor?: {
      name: string,
      avatar?: string,
      bio?: string,
      jobTitle?: string,
      credentials?: string,
    },
    lastReviewedDate?: Date,
  },
}
```

---

## 🎨 UI Preview

The widget displays:

```
┌─────────────────────────────────┐
│ 📝 Tác giả     [E-E-A-T SEO]   │
├─────────────────────────────────┤
│ Guest Author Toggle    [OFF]    │
├─────────────────────────────────┤
│ Tác giả chính *                 │
│ [Search authors...]             │
│ ✓ Dr. Nguyễn Văn An  [Clear]   │
├─────────────────────────────────┤
│ Người kiểm duyệt (Optional)    │
│ [Search reviewers...]           │
│ (For YMYL content)              │
├─────────────────────────────────┤
│ Ngày kiểm duyệt                 │
│ [2025-12-04]                    │
├─────────────────────────────────┤
│ 💡 E-E-A-T SEO info...          │
└─────────────────────────────────┘
```

---

## ✅ Checklist

### Pre-Integration
- [x] AuthorBoxWidget component created
- [x] Types & interfaces defined
- [x] API endpoints working (`/api/authors/search`)

### Integration Steps
- [ ] Import widget into new post page
- [ ] Add authorInfo state
- [ ] Place widget in sidebar
- [ ] Update handleSubmit to include authorInfo
- [ ] Test create post flow

- [ ] Import widget into edit post page
- [ ] Load existing authorInfo
- [ ] Update handleSubmit
- [ ] Test update post flow

### Testing
- [ ] Author search works
- [ ] Reviewer search works
- [ ] Guest author form works
- [ ] Data saves correctly
- [ ] Data loads on edit

---

## 🚀 Next Steps

After integration:

1. **Test thoroughly** with sample data
2. **Update blog post display** to show author info
3. **Add Schema.org markup** to blog posts
4. **Deploy** and monitor

---

## 💡 Tips

### For Development

1. **Use sample authors:**
   ```bash
   npm run authors:create
   ```

2. **Test search:**
   ```
   http://localhost:3000/api/authors/search?q=nguyen
   ```

3. **Check data structure:**
   Use MongoDB Compass to verify authorInfo field

### For Production

1. **Validate author exists** before saving
2. **Handle deleted authors** gracefully
3. **Update post counts** when author assigned
4. **Cache author data** for performance

---

**Status:** ✅ Widget Complete - Ready for Integration  
**Next:** Integrate into post editor pages  
**Estimated Time:** 15-20 minutes

**🎉 AuthorBoxWidget is production-ready!**

