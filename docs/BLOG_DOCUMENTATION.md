# 📚 Blog System Documentation

**Project:** Teddy Shop  
**Version:** 2.0 (Dec 2025)  
**Last Updated:** December 2025

---

## 📋 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Template System](#2-template-system)
3. [Product Linking](#3-product-linking)
4. [Environment Variables](#4-environment-variables)
5. [Quick Start Guide](#5-quick-start-guide)
6. [API Reference](#6-api-reference)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Architecture Overview

### 1.1 Blog System Architecture (2025)

Blog System của Teddy Shop được xây dựng với kiến trúc modular, hỗ trợ nhiều template types và tích hợp sâu với Product System.

**Core Components:**

```
┌─────────────────────────────────────────────────────────┐
│                    Blog System                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │   CMS Editor │──────│   Database   │                │
│  │  (Admin)     │      │  (MongoDB)   │                │
│  └──────────────┘      └──────────────┘                │
│         │                      │                        │
│         │                      │                        │
│         ▼                      ▼                        │
│  ┌──────────────┐      ┌──────────────┐                │
│  │  Template    │──────│  Product     │                │
│  │  System      │      │  Linking     │                │
│  └──────────────┘      └──────────────┘                │
│         │                                               │
│         ▼                                               │
│  ┌──────────────┐                                       │
│  │   Frontend   │                                       │
│  │  Renderer    │                                       │
│  └──────────────┘                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Data Flow:**

1. **Admin creates post** → CMS Editor (`PostEditorV3`)
2. **Select template** → Template Builder (Gift Guide, Review, etc.)
3. **Link products** → Product Picker Widget
4. **Save to DB** → MongoDB `posts` collection
5. **Frontend renders** → `BlogPostRenderer` component
6. **Template-specific UI** → GiftGuideView, ProductComparisonView, etc.

---

### 1.2 Key Features

- ✅ **Template System**: 5 template types (default, gift-guide, review, care-guide, story)
- ✅ **Product Linking**: Link products inline, sidebar, or bottom
- ✅ **Spam Filter**: Automatic spam detection with configurable rules
- ✅ **Comment System**: Nested comments with CAPTCHA protection
- ✅ **SEO Tools**: Schema.org, Meta tags, Open Graph
- ✅ **E-E-A-T Compliance**: Author & Reviewer system

---

## 2. Template System

### 2.1 Available Templates

| Template ID  | Name       | Use Case                     | Special Features                |
| ------------ | ---------- | ---------------------------- | ------------------------------- |
| `default`    | Default    | Standard blog posts          | Basic content rendering         |
| `gift-guide` | Gift Guide | Gift recommendation articles | Occasion selector, Price range  |
| `review`     | Review     | Product reviews              | Comparison table, Rating system |
| `care-guide` | Care Guide | Product care instructions    | Step-by-step guide              |
| `story`      | Story      | Brand stories, narratives    | Timeline, Visual storytelling   |

### 2.2 Template Data Structure

Mỗi template có `templateData` object riêng:

**Gift Guide:**

```typescript
{
  occasion: 'birthday' | 'wedding' | 'anniversary' | 'graduation',
  priceRange: { min: number, max: number },
  deliveryOptions: string[],
  customMessage?: string
}
```

**Review:**

```typescript
{
  rating: number, // 1-5
  pros: string[],
  cons: string[],
  comparisonTable?: ComparisonTable
}
```

**Care Guide:**

```typescript
{
  steps: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
}
```

### 2.3 Creating a Gift Guide Post

**Step-by-step:**

1. **Access CMS Editor:**

   ```
   Admin Panel → Blog → Posts → New Post
   ```

2. **Select Template:**

   - Click "Template" dropdown
   - Select "Gift Guide"

3. **Fill Basic Info:**

   - Title: "Quà tặng sinh nhật cho bé gái"
   - Category: "Gift Ideas"
   - Featured Image: Upload image

4. **Configure Gift Guide Data:**

   - Occasion: Select "Birthday"
   - Price Range: Min 100,000₫ - Max 500,000₫
   - Delivery Options: Check "Express Delivery", "Gift Wrapping"

5. **Link Products:**

   - Click "Link Products" button
   - Search and select products
   - Choose position: "Bottom" (hiển thị ở cuối bài)

6. **Write Content:**

   - Use Tiptap editor
   - Add headings, images, lists

7. **SEO Settings:**

   - Meta Title: "Quà tặng sinh nhật cho bé gái 2025"
   - Meta Description: "Gợi ý quà tặng sinh nhật..."
   - Keywords: "quà tặng, sinh nhật, bé gái"

8. **Publish:**
   - Click "Publish" button
   - Post goes live!

---

## 3. Product Linking

### 3.1 Linking Products to Posts

**Three Positions:**

1. **Inline**: Product card xuất hiện trong nội dung bài viết
2. **Sidebar**: Product card ở sidebar bên phải
3. **Bottom**: Product grid ở cuối bài viết

**How to Link:**

1. In CMS Editor, click "Link Products" button
2. Search products by name
3. Select products
4. Choose position for each product
5. (Optional) Add custom message

**Example:**

```typescript
linkedProducts: [
  {
    productId: 'product-123',
    position: 'inline',
    displayType: 'card',
    customMessage: 'Sản phẩm được đề xuất cho dịp này',
  },
  {
    productId: 'product-456',
    position: 'bottom',
    displayType: 'cta',
    customMessage: 'Xem thêm sản phẩm tương tự',
  },
];
```

### 3.2 Product Display Types

- **Card**: Standard product card with image, name, price
- **Spotlight**: Highlighted card with larger image
- **CTA**: Call-to-action button style

---

## 4. Environment Variables

### 4.1 Required Variables

**Database:**

```env
MONGODB_URI=mongodb://localhost:27017/teddy-shop
```

**Authentication:**

```env
AUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**Site Configuration:**

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4.2 Blog-Specific Variables

**Cloudflare Turnstile (Comment System):**

```env
# Development: Use test key (always passes)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# Production: Get real key from https://dash.cloudflare.com/
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-real-site-key-here
```

**Spam Detection (Optional):**

```env
# Customize spam detection thresholds (if needed)
SPAM_AUTO_THRESHOLD=50
SPAM_AUTO_APPROVE_THRESHOLD=20
```

### 4.3 Vercel Deployment

**Set in Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Set different values for Production/Preview/Development

**Important:**

- ✅ Use real Turnstile keys in Production
- ✅ Never commit `.env.local` to git
- ✅ Use Vercel's environment variable encryption

---

## 5. Quick Start Guide

### 5.1 Creating Your First Blog Post

**5 minutes setup:**

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup environment:**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your values
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

4. **Access admin panel:**

   ```
   http://localhost:3000/admin/login
   ```

5. **Create post:**
   - Navigate to Blog → Posts → New Post
   - Fill in title, content
   - Publish!

### 5.2 Creating a Gift Guide (Example)

See [Section 2.3](#23-creating-a-gift-guide-post) for detailed steps.

---

## 6. API Reference

### 6.1 Public APIs

**Get Blog Posts:**

```
GET /api/posts?slug=post-slug
GET /api/posts?category=Gift%20Ideas&limit=10
```

**Get Comments:**

```
GET /api/comments/post/{postId}
```

**Create Comment:**

```
POST /api/comments
Body: {
  postId: string,
  authorName: string,
  authorEmail: string,
  content: string,
  parentId?: string
}
```

### 6.2 Admin APIs

**Get All Posts (Admin):**

```
GET /api/admin/posts?status=published&limit=20
```

**Create/Update Post:**

```
POST /api/admin/posts
PUT /api/admin/posts/{id}
```

**Comment Moderation:**

```
GET /api/admin/comments?status=pending
PATCH /api/admin/comments/{id}
Body: { status: 'approved' | 'spam' }
```

---

## 7. Troubleshooting

### 7.1 Common Issues

**Issue: "Post not found" when previewing**

**Solution:**

- Check if post exists in database
- Verify `slug` is correct
- Check if using `?preview=true` for draft posts
- Ensure admin session is active

---

**Issue: "CAPTCHA not working"**

**Solution:**

- Verify `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
- Use test key for development: `1x00000000000000000000AA`
- Check browser console for errors
- Ensure Turnstile script is loaded

---

**Issue: "Comments not showing"**

**Solution:**

- Check comment status (must be 'approved')
- Verify postId matches
- Check API response in Network tab
- Ensure comments collection exists in MongoDB

---

**Issue: "Template not rendering correctly"**

**Solution:**

- Verify `template` field in post document
- Check `templateData` structure matches template
- Review `BlogPostRenderer` component logs
- Ensure template component exists

---

### 7.2 Performance Issues

**Slow page load:**

- Check bundle size (should be < 250KB for public pages)
- Verify images are optimized (WebP, proper sizing)
- Check if Tiptap is loaded on public pages (shouldn't be)
- Use Lighthouse to identify bottlenecks

**Large bundle size:**

- Ensure dynamic imports for heavy libraries
- Check if unused code is being imported
- Use `next/dynamic` for admin-only components

---

## 📚 Additional Resources

- **Blog Upgrade Plan**: `docs/guides/BLOG_UPGRADE_PLAN_TEDDY_SHOP.md`
- **Phase 2 QA Checklist**: `docs/reports/PHASE2_BLOG_QA_CHECKLIST.md`
- **Phase 3 QA Checklist**: `docs/reports/PHASE3_BLOG_QA_CHECKLIST.md`
- **Phase 4 QA Checklist**: `docs/reports/PHASE4_QA_CHECKLIST.md`
- **Optimization Checklist**: `docs/reports/BLOG_OPTIMIZATION_CHECKLIST.md`

---

**Version:** 1.0  
**Last Updated:** December 2025  
**Maintainer:** Development Team
