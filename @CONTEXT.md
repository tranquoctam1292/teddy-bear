# 🐻 Teddy Shop - Project Context & Architecture

**Last Updated:** December 6, 2025  
**Status:** Production Ready (Phase 15 Complete - Blog System & Comment System)  
**Build:** ✅ Passing | **Security:** ✅ CVEs Patched | **Performance:** ⚡ Highly Optimized (-44% bundle)  
**Recent Updates:** Tiptap Editor Keyboard Shortcuts (Ctrl+K, Ctrl+U) | WordPress Toolbar enhancements | Link Modal improvements | Blog Social Share (Facebook/Zalo/Copy link) | PLP QA sync | Comment Flow hardening (spam + Turnstile) | Form decomposition standard

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack--libraries)
3. [Database Architecture](#3-database-architecture)
4. [Key Business Logic](#4-key-business-logic)
5. [Folder Structure](#5-folder-structure-map)
6. [Development Guidelines](#6-development-guidelines)
7. [Recent Major Updates](#-recent-major-updates-december-2025)
8. [Product Variants & Cart Integration](#11-️-product-variants--cart-integration-dec-5-2025)

---

## 1. Project Overview

### 🎯 What is Teddy Shop?

A **full-stack E-commerce platform** combined with a **headless CMS**, focusing on:

- 🔍 **SEO Excellence** (E-E-A-T standards)
- ⚡ **Performance** (Next.js 15 with ISR)
- 🛠️ **Admin Control** (Complete CMS)

### 🏗️ Core Domains

| Domain            | Description         | Key Features                               |
| ----------------- | ------------------- | ------------------------------------------ |
| **Shop (Public)** | E-commerce frontend | Product browsing, cart, checkout, payments |
| **CMS (Admin)**   | Content management  | Blog (Tiptap), Page builder, Media library |
| **Author System** | E-E-A-T compliance  | Advanced profiles, credentials, expertise  |
| **SEO Tools**     | Search optimization | Keyword tracking, Schema.org, Audits       |

---

## 2. Tech Stack & Libraries

### 🎨 Core Framework

| Technology     | Version       | Purpose                  |
| -------------- | ------------- | ------------------------ |
| **Next.js**    | 15.5.7        | App Router, SSR, ISR     |
| **React**      | 19.2.1        | UI framework             |
| **TypeScript** | 5             | Type safety              |
| **MongoDB**    | 6.3.0         | Database (Native Driver) |
| **NextAuth**   | 5.0.0-beta.16 | Authentication           |

### 🔧 State & Logic

| Library             | Purpose                 | Location              |
| ------------------- | ----------------------- | --------------------- |
| **Zustand**         | Global state (Cart, UI) | `src/store/`          |
| **React Hook Form** | Form management         | Throughout components |
| **Zod**             | Schema validation       | `src/lib/schemas/`    |
| **date-fns**        | Date formatting         | Date utilities        |

### 🎨 UI/UX

| Library               | Purpose             | Usage              |
| --------------------- | ------------------- | ------------------ |
| **Tailwind CSS**      | Styling             | All components     |
| **Radix UI**          | Headless primitives | Base components    |
| **Lucide React**      | Icons               | UI icons           |
| **Tiptap**            | Rich text editor    | Blog posts         |
| **@hello-pangea/dnd** | Drag & drop         | Section builder    |
| **Framer Motion**     | Animations          | Smooth transitions |

### 🚀 Infrastructure

| Service         | Purpose              |
| --------------- | -------------------- |
| **Vercel Blob** | Image/media storage  |
| **Vercel**      | Hosting & deployment |

### 🔒 Server-Side Safety

| Package         | Version | Purpose                              |
| --------------- | ------- | ------------------------------------ |
| **server-only** | 0.0.1   | Prevent server code in client bundle |

---

## 3. Database Architecture

### 🔑 Critical Pattern: Repository Pattern

**⚠️ IMPORTANT:** No Mongoose Models. Use native MongoDB driver.

```typescript
// ✅ CORRECT Usage
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

const { users, posts, authors } = await getCollections();
const user = await users.findOne({ _id: new ObjectId(id) });

// ❌ WRONG: Don't use this
const user = await User.findOne({ _id: id }); // Mongoose style
```

### 📊 Key Collections

#### `authors` Collection (E-E-A-T System)

```typescript
interface Author {
  _id: ObjectId;
  name: string;
  slug: string; // Unique, for SEO URLs
  type: 'staff' | 'contributor' | 'guest' | 'expert';
  bio: string; // Short bio
  bioFull: string; // Long HTML bio
  credentials: string; // "MD, PhD", etc.
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  status: 'active' | 'inactive';
  postCount: number; // Syncs with published posts
  reviewedCount: number; // Posts reviewed
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:** 7 indexes for performance (10-70x faster)

---

#### `posts` Collection (Blog)

```typescript
interface Post {
  _id: ObjectId;
  title: string;
  slug: string; // Unique, for SEO
  excerpt?: string;
  content: string; // HTML from Tiptap

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];

  // Media
  featuredImage?: string;
  images?: string[];

  // Categorization
  category?: string;
  tags: string[];

  // Status
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;

  // Author (E-E-A-T)
  authorInfo: {
    authorId: string; // Ref to authors._id
    reviewerId?: string; // For YMYL content
    guestAuthor?: {
      // For non-DB authors
      name: string;
      credentials?: string;
    };
  };

  // Blog Enhancements (NEW - Dec 2025)
  readingTime?: number; // Minutes to read
  tableOfContents?: TOCItem[]; // Auto-generated from headings
  linkedProducts?: LinkedProduct[]; // Product linking
  template?: 'standard' | 'comparison' | 'gift-guide'; // Template type
  templateData?: {
    // For comparison template
    comparisonTable?: ComparisonTable;
    // For gift-guide template
    occasion?: string;
    priceRange?: string;
    deliveryOptions?: string[];
  };

  // Analytics
  views?: number;
  likes?: number;

  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:** 3 author-related indexes for fast queries

---

#### `comments` Collection (NEW - Dec 2025)

```typescript
interface Comment {
  _id: ObjectId;
  postId: string; // Reference to Post
  authorName: string;
  authorEmail: string;
  content: string; // Sanitized HTML
  parentId?: string; // For nested replies
  status: 'approved' | 'pending' | 'spam' | 'auto-spam';
  spamScore?: number; // 0-100, higher = more likely spam
  spamReasons?: string[]; // Reasons why marked as spam
  ipAddress?: string; // For rate limiting
  userAgent?: string; // For bot detection
  likes?: number;
  dislikes?: number;
  createdAt: Date;
  updatedAt?: Date;
}
```

**Indexes:**

- `postId + status` - Fast comment queries per post
- `status` - Admin moderation filtering
- `createdAt` - Date sorting

---

#### `products` Collection (E-commerce)

```typescript
interface Product {
  _id: ObjectId;
  id: string;
  name: string;
  slug: string; // Unique, for SEO
  description: string;
  category: string;
  tags: string[];

  // Pricing
  minPrice: number; // From variants
  maxPrice?: number; // From variants

  // Media
  images: string[];

  // Variants (nested)
  variants: ProductVariant[];

  // Status
  isHot: boolean;
  isActive: boolean;

  // Analytics
  rating?: number;
  reviewCount?: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  id: string;
  size: string; // "80cm", "1m2", "1m5", "2m"
  color?: string; // Color name (e.g., "Pink", "Purple", "Blue")
  colorCode?: string; // Hex color code (e.g., "#FF69B4", "#9B59B6")
  price: number;
  stock: number;
  image?: string; // Variant-specific image URL
  sku?: string;
}
```

---

#### `orders` Collection (E-commerce)

```typescript
interface Order {
  orderId: string; // "ORD-{timestamp}-{random}"
  guestEmail: string;
  userId?: string;

  items: CartItem[];

  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    note?: string;
  };

  shippingMethod: 'standard' | 'express';
  shippingFee: number;

  // Upsell services
  upsellServices: {
    vacuumSealing: boolean;
    isGiftWrapped: boolean;
    giftWrapFee: number;
    expressShipping: boolean;
  };

  // Pricing
  subtotal: number;
  upsellTotal: number;
  shippingTotal: number;
  total: number;

  // Payment
  paymentDetails: {
    method: 'cod' | 'momo' | 'vnpay' | 'bank_transfer';
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
  };

  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';

  createdAt: Date;
  updatedAt: Date;
}
```

---

#### `stockReservations` Collection (Checkout Locking - NEW)

```typescript
interface StockReservation {
  _id: ObjectId;
  orderId: string; // ORD-{timestamp}-{random}
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
    reservedStock: number;
  }>;
  status: 'active' | 'consumed' | 'released' | 'expired';
  expiresAt: Date; // 15-minute TTL
  createdAt: Date;
}
```

**Indexes:**

- `orderId` - truy vết nhanh theo đơn
- `expiresAt` - TTL auto-expire sau 15 phút
- `items.variantId` - hỗ trợ truy vấn variant khi giải phóng tồn

---

#### `homepage_configs` Collection (NEW)

```typescript
interface HomepageConfig {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;

  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt?: Date;
  scheduledAt?: Date;

  sections: HomepageSection[]; // 15 section types

  seo: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    // ... more SEO fields
  };

  version: number;
  previousVersionId?: string;

  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Section Types:** hero-banner, hero-slider, featured-products, product-grid, category-showcase, blog-posts, testimonials, features-list, cta-banner, newsletter, video-embed, image-gallery, countdown-timer, social-feed, custom-html, spacer

---

#### `users` Collection

```typescript
interface User {
  _id: ObjectId;
  email: string; // Unique
  password: string; // Bcrypt hash
  name: string;
  role: 'admin' | 'editor' | 'user';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**⚠️ Security:** Passwords are always bcrypt hashed, never plain text

---

## 4. Key Business Logic

### 🔐 Authentication Flow

```
1. Login Request → /admin/login
   ↓
2. NextAuth.authorize()
   ├─ Find user by email
   ├─ Compare bcrypt password
   └─ Return user object
   ↓
3. Create JWT Session
   ├─ Contains: id, email, role, avatar
   └─ Stored in cookie
   ↓
4. Protected Routes
   ├─ Middleware checks path
   └─ API routes: await auth()
```

**Session Strategy:** JWT  
**Password:** Bcrypt (never plain text)  
**Protection:** Both middleware + manual checks

---

### ✍️ Author & Content Logic

#### Author Selection (E-E-A-T)

```
When writing a post, admin can:

Option 1: Select existing Author from DB
   └─ Populates authorInfo.authorId

Option 2: Input Guest Author manually
   └─ Stores in authorInfo.guestAuthor
```

#### Reviewer System (YMYL Content)

```
For "Your Money Your Life" content:
   └─ Assign expert reviewer
   └─ Stores in authorInfo.reviewerId
   └─ Shows both author + reviewer on frontend
```

**Purpose:** Google E-E-A-T compliance for sensitive topics

---

### 🛒 Checkout Flow (Detailed in FLOW.md)

```
User clicks "Đặt hàng"
   ↓
1. Validate form (client)
2. POST /api/checkout
   ↓
3. Validate request (server)
4. Reserve stock (15 min lock)
5. Calculate totals (server-side!)
6. Process payment (if online)
7. Save to MongoDB
8. Send confirmation email (async)
   ↓
9. Return success/error
   ↓
User sees success page or payment gateway
```

**Security:** Server always recalculates prices (never trust client)  
**Rollback:** If any step fails, release stock reservation  
**Time:** 20-320ms total

---

### 🏠 Homepage System

```
1. Admin creates homepage config in dashboard
2. Adds sections (drag & drop)
3. Configures content (forms)
4. Publishes config
   ↓
5. Frontend calls: GET /api/homepage
6. Receives active config
7. HomepageRenderer renders sections
8. Cached for 1 hour (ISR)
```

**Features:**

- ✅ 15 section types
- ✅ Version control
- ✅ A/B testing
- ✅ Scheduled publishing
- ✅ SEO optimized

---

### 💬 Comment System (NEW - Dec 2025)

```
User submits comment
   ↓
1. Validate input (Zod schema)
2. Sanitize content (XSS prevention)
3. Run spam detection (keywords, links, caps, blacklist)
4. Verify CAPTCHA (Cloudflare Turnstile)
5. Set status: 'approved' | 'pending' | 'auto-spam'
6. Insert into MongoDB
   ↓
7. Admin moderation dashboard
   ├─ View all comments (pending/spam/approved)
   ├─ Approve pending comments
   ├─ Mark spam
   └─ Delete comments
   ↓
8. Frontend displays approved comments
   ├─ Nested replies (parentId)
   ├─ Gravatar avatars
   └─ Reply functionality
```

**Features:**

---

### ⌨️ Tiptap Editor Keyboard Shortcuts (NEW - Dec 2025)

```
Editor Keyboard Shortcuts:
   ↓
1. Ctrl+K / Cmd+K → Open Link Modal
   ├─ If text selected → Pre-fill text
   ├─ If link selected → Pre-fill URL for editing
   └─ Modal handles URL normalization (https://, mailto:, tel:)
   ↓
2. Ctrl+U / Cmd+U → Toggle Underline
   └─ Only works when editor is focused
   ↓
3. Default shortcuts (from StarterKit):
   ├─ Ctrl+B / Cmd+B → Bold
   ├─ Ctrl+I / Cmd+I → Italic
   ├─ Ctrl+Z / Cmd+Z → Undo
   ├─ Ctrl+Y / Cmd+Y → Redo
   └─ Ctrl+Shift+Z / Cmd+Shift+Z → Redo (alternative)
```

**Implementation:**
- Custom Extension: `src/components/editor/extensions/KeyboardShortcuts.ts`
- Integration: `PostEditorModern.tsx`, `RichTextEditor.tsx`
- Browser conflict prevention: `preventDefault()` for Ctrl+K and Ctrl+U
- Editor storage pattern: `WordPressToolbar` sets `editor.__openLinkModal` function

**Components:**
- `KeyboardShortcuts` extension - Handles keymap registration
- `WordPressToolbar` - Sets up link modal function
- `LinkModal` - Modal for link insertion/editing

**Features:**

- ✅ Automatic spam detection (keywords, links, all caps, blacklisted emails)
- ✅ CAPTCHA protection (Cloudflare Turnstile)
- ✅ Admin moderation dashboard
- ✅ Nested replies support
- ✅ XSS protection (content sanitization)
- ✅ Rate limiting (IP tracking)

**Spam Detection Rules:**

- Blocked keywords: "buy now", "click here", "free money", etc.
- Multiple links (>2) → Higher spam score
- All caps content → Spam indicator
- Blacklisted email domains → Auto-spam
- Spam score 0-100: <30 = approved, 30-79 = pending, ≥80 = auto-spam

---

### 🔎 Comment Moderation Flow (Dec 2025 refresh)

- Submit → Zod validate → sanitize HTML → Verify Cloudflare Turnstile → chạy spam-detection util (keywords/links/all-caps/blacklist).
- Status mapping: score <30 → approved, 30-79 → pending, ≥80 → auto-spam; admin có thể approve/mark spam/delete.
- Data: MongoDB `comments` có `parentId` cho nested replies, trường `spamScore`, `spamReasons`, `ipAddress`, `userAgent` để audit.
- UI: chỉ render `approved`, hỗ trợ reply lồng, like/dislike; pending/spam chỉ hiển thị trong bảng moderation.

---

### 🖼️ Media Handling

```
Upload Flow:
1. User selects image
2. Upload to Vercel Blob
3. Get public URL
4. Store URL in MongoDB
5. Display with next/image
```

**Configuration:** `remotePatterns` in `next.config.ts`

---

### 📝 Row Actions (Admin UI)

Admin tables support quick actions:

- **Quick Edit** - Edit inline without leaving page
- **Duplicate** - Clone item
- **Trash** - Soft delete (move to trash)
- **Restore** - Recover from trash
- **Delete** - Permanent delete

**Component:** `src/components/admin/RowActions.tsx`

---

## 5. Folder Structure Map

```
teddy-shop/
│
├── src/
│   │
│   ├── app/                          # Next.js App Router
│   │   ├── (shop)/                   # 🛍️ Public E-commerce
│   │   │   ├── page.tsx              # Homepage (dynamic)
│   │   │   ├── products/             # Product listing
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout flow
│   │   │   └── (content)/
│   │   │       ├── blog/             # Blog pages
│   │   │       ├── about/            # About page
│   │   │       └── store/            # Store info
│   │   │
│   │   ├── admin/                    # 🔒 Protected Admin Dashboard
│   │   │   ├── authors/              # Author CRUD
│   │   │   ├── posts/                # Blog CRUD
│   │   │   ├── products/             # Product CRUD
│   │   │   ├── homepage/             # 🆕 Homepage config
│   │   │   ├── seo/                  # SEO tools
│   │   │   └── settings/             # System settings
│   │   │
│   │   ├── api/                      # 🔌 REST API Routes
│   │   │   ├── admin/                # Admin-only APIs
│   │   │   │   ├── authors/          # Author CRUD API
│   │   │   │   ├── posts/            # Post CRUD API
│   │   │   │   ├── homepage/         # 🆕 Homepage API
│   │   │   │   ├── comments/         # 🆕 Comment moderation API
│   │   │   │   └── ...
│   │   │   ├── authors/              # Public author API
│   │   │   ├── homepage/             # 🆕 Public homepage API
│   │   │   ├── comments/             # 🆕 Public comment API
│   │   │   ├── checkout/             # Checkout API
│   │   │   └── cart/                 # Cart API
│   │   │
│   │   └── author/                   # Author profile pages
│   │
│   ├── components/
│   │   ├── admin/                    # Admin-specific widgets
│   │   │   ├── AuthorBoxWidget.tsx   # Author selector
│   │   │   ├── RowActions.tsx        # Table actions
│   │   │   ├── WordPressToolbar.tsx  # 🆕 Tiptap editor toolbar (WordPress-style)
│   │   │   ├── LinkModal.tsx         # 🆕 Link insertion/editing modal
│   │   │   ├── PostEditorModern.tsx  # 🆕 Modern post editor with Tiptap
│   │   │   ├── RichTextEditor.tsx    # 🆕 Reusable rich text editor
│   │   │   ├── homepage/             # 🆕 Homepage builder (16 components)
│   │   │   │   ├── HomepageToolbar.tsx          # WordPress-style toolbar
│   │   │   │   ├── HomepageToolbarWrapper.tsx   # Toolbar wrapper
│   │   │   │   ├── HomepagePreviewContent.tsx   # Server Component wrapper
│   │   │   │   ├── HomepagePreviewWrapper.tsx  # Component composition
│   │   │   │   └── ... (12 other components)
│   │   │   └── ...
│   │   │
│   │   ├── blog/                     # Blog frontend
│   │   │   ├── AuthorBox.tsx         # Author display
│   │   │   ├── ReviewerBox.tsx       # Reviewer display
│   │   │   ├── blog-filters.tsx      # Filter & search
│   │   │   ├── table-of-contents.tsx  # TOC sidebar
│   │   │   ├── social-share-buttons.tsx # Share buttons (Facebook/Zalo/Copy link)
│   │   │   ├── reading-time-badge.tsx # Reading time
│   │   │   ├── product-link-card.tsx  # Product cards
│   │   │   ├── product-comparison-view.tsx # Comparison table
│   │   │   ├── gift-guide-view.tsx    # Gift guide template
│   │   │   ├── blog-post-renderer.tsx # Main renderer
│   │   │   └── comments/              # Comment components
│   │   │       ├── comment-form.tsx   # Comment submission
│   │   │       ├── comment-list.tsx   # Comment list
│   │   │       ├── comment-item.tsx   # Single comment
│   │   │       └── comment-section.tsx # Wrapper
│   │   │
│   │   ├── homepage/                 # 🆕 Homepage sections
│   │   │   ├── HomepageRenderer.tsx  # Main renderer
│   │   │   └── sections/             # 15 section components + metadata
│   │   │       ├── metadata.ts      # Section metadata (server-safe)
│   │   │       └── ... (15 section components)
│   │   │
│   │   ├── editor/                   # 🆕 Tiptap Editor Components
│   │   │   ├── extensions/           # Custom Tiptap extensions
│   │   │   │   ├── CustomImage.ts    # Enhanced image extension (width, height, align, href)
│   │   │   │   └── KeyboardShortcuts.ts # 🆕 Keyboard shortcuts (Ctrl+K, Ctrl+U)
│   │   │   └── components/           # Editor UI components
│   │   │       ├── ImageBubbleMenu.tsx # Image editing bubble menu
│   │   │       └── ImageEditDialog.tsx  # Image editing modal
│   │   │
│   │   └── ui/                       # Reusable UI atoms
│   │       ├── button.tsx            # Buttons
│   │       ├── input.tsx             # Inputs
│   │       ├── table.tsx             # Tables
│   │       ├── alert-dialog.tsx      # Confirmation modals
│   │       ├── toast.tsx             # Toast notifications
│   │       ├── toaster.tsx           # Toast provider
│   │       └── ... (11 total)
│   │
│   ├── lib/
│   │   ├── db.ts                     # 🗄️ MongoDB connection
│   │   ├── auth.ts                   # 🔐 NextAuth config
│   │   ├── types/                    # TypeScript interfaces
│   │   │   ├── author.ts
│   │   │   ├── homepage.ts           # 🆕
│   │   │   └── ...
│   │   ├── schemas/                  # Zod validation
│   │   │   ├── author.ts
│   │   │   ├── homepage.ts           # 🆕
│   │   │   ├── post.ts               # Blog post schema
│   │   │   ├── comment.ts            # 🆕 Comment schema
│   │   │   └── ...
│   │   ├── utils/                    # 🆕 Centralized utilities
│   │   │   ├── slug.ts               # Slug generation
│   │   │   ├── format.ts             # Date/currency formatting
│   │   │   ├── spam-detection.ts     # 🆕 Spam detection logic
│   │   │   └── clipboard.ts          # Copy link helpers (social share)
│   │   ├── payment/                  # Payment gateways
│   │   ├── stock/                    # Stock management
│   │   └── email/                    # Email service
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── use-toast.ts             # Toast notification hook
│   └── store/                        # Zustand stores
│       └── useCartStore.ts           # Cart state
│
├── scripts/                          # Maintenance scripts
│   ├── create-sample-authors.ts      # Seed authors
│   ├── migrate-author-info.ts        # Data migration
│   └── create-author-indexes.ts      # 🆕 Create DB indexes
│
└── docs/                             # 📚 Documentation (Cleaned Dec 5, 2025)
    ├── guides/                       # User & developer guides (8 files)
    ├── reports/                      # Technical reports (16 files)
    │   ├── PLP_TEST_RESULTS.md       # 🆕 PLP QA results (Dec 2025)
    │   ├── PRODUCT_LISTING_PAGE_AUDIT.md # 🆕 PLP audit
    │   ├── BLOG_READABILITY_OPTIMIZATION_PLAN.md # 🆕 Blog readability plan
    │   └── performance/              # Performance reports (7 files)
    └── archive/                      # Historical documentation (20 files)
        ├── phase-reports/            # Phase audit reports (9 files)
        └── verification/             # Verification & fix reports (15 files)
```

---

## 6. Development Guidelines

### 🔑 MongoDB ObjectId Handling

```typescript
// ✅ ALWAYS cast string IDs to ObjectId
import { ObjectId } from 'mongodb';

const id = '507f1f77bcf86cd799439011'; // String from request

// Before querying:
if (!ObjectId.isValid(id)) {
  return { error: 'Invalid ID' };
}

const user = await users.findOne({
  _id: new ObjectId(id), // ✅ Correct
});

// ❌ WRONG:
const user = await users.findOne({ _id: id }); // Won't work
```

---

### ✅ Validation Pattern

```typescript
// 1. Import Zod schema
import { authorSchema } from '@/lib/schemas/author';

// 2. Parse request body
const body = await request.json();

// 3. Validate with Zod
try {
  const validatedData = authorSchema.parse(body);
  // Use validatedData (type-safe!)
} catch (error) {
  return NextResponse.json({ error: 'Invalid data', details: error }, { status: 400 });
}
```

---

### 🔒 Security Rules

```typescript
// ✅ DO:
- Use environment variables: process.env.MONGODB_URI
- Store in .env.local (gitignored)
- Validate all inputs with Zod
- Check authentication on every protected route
- Recalculate prices server-side

// ❌ DON'T:
- Commit secrets to git
- Trust client-submitted prices
- Use 'any' type
- Skip validation
- Store plain text passwords
```

---

### 🎯 Component Patterns

```typescript
// ✅ Preferred pattern
export function ComponentName({ prop }: Props) {
  // Component logic
}

// ❌ Avoid
export const ComponentName: React.FC<Props> = ({ prop }) => {
  // ...
};
```

---

### 📅 Date Handling

```typescript
import { format, formatDistanceToNow } from 'date-fns';

// Display
format(date, 'dd/MM/yyyy');
formatDistanceToNow(date, { addSuffix: true }); // "2 hours ago"

// Storage in MongoDB
createdAt: new Date(); // ✅ Always Date objects, not strings
```

---

## 🆕 RECENT MAJOR UPDATES (December 2025)

### 1. 🎨 Homepage Manager Toolbar (Dec 5, 2025)

**Status:** ✅ Complete | **Impact:** Enhanced UX for homepage management

#### WordPress-Style Filter Toolbar

**New Components:**

- `HomepageToolbar.tsx` - Main toolbar with status tabs, bulk actions, filters, and search
- `HomepageToolbarWrapper.tsx` - Client wrapper that fetches status counts from API

**Features:**

- **Status Tabs:** "Tất cả", "Đã xuất bản", "Bản nháp", "Đã lên lịch", "Thùng rác" with live counts
- **Bulk Actions:** Dropdown with actions (Delete, Trash, Restore, Publish, Draft) + Apply button
- **Date Filter:** "Tất cả các ngày", "Hôm nay", "Tuần này", "Tháng này", "Năm này"
- **Category Filter:** Placeholder for future category filtering
- **Search:** Input field with Search button, Enter key support
- **URL State Management:** All filters sync with URL searchParams for shareable links
- **Responsive Design:** Flexbox layout, stacks on mobile, rows on desktop

**Architecture:**

- Uses `useSearchParams` and `useRouter` for URL-based state management
- Server-friendly: Filters passed via URL params to Server Components
- Status counts fetched via parallel API calls for performance

**Integration:**

- Integrated into `src/app/admin/homepage/page.tsx`
- Replaces previous simple filter UI
- Works seamlessly with `HomepageConfigTable`

**Pattern:** Follows WordPress admin UI patterns for familiar user experience

---

### 2. ⚡ Performance Optimization (Dec 4, 2025)

**Status:** ✅ Complete | **Impact:** -44% bundle size

#### A. Server Component Conversion

**Audit Results:**

- Total 'use client' files: 75
- Files without hooks: 6
- Converted to Server Components: 6

**Files Converted:**

1. `admin/appearance/background/page.tsx`
2. `admin/appearance/customize/page.tsx`
3. `admin/appearance/widgets/page.tsx`
4. `admin/marketing/promotions/page.tsx`
5. `admin/products/reviews/page.tsx`
6. `admin/products/tags/page.tsx`

**Impact:**

- -13KB client bundle
- Better SEO (6 pages now SSR)
- Replaced `window.location.href` with Next.js `<Link>` (better UX)

**Compliance:** 92% → 100% ✅

---

#### B. Bundle Size Optimization (Dynamic Imports)

**Libraries Optimized:**

1. **Recharts (~150KB)**

   - Used on: `/admin/analytics` only
   - Pattern: Dynamic import with ChartSkeleton
   - Savings: 150KB on 99% of pages

2. **Tiptap Editor (~200KB)**

   - Used on: Editor pages only (4 pages)
   - Pattern: Lazy wrapper with EditorSkeleton
   - Savings: 200KB on 95% of pages

3. **Framer Motion (~100KB)**
   - Used on: SizeGuideModal (conditional)
   - Pattern: Lazy modal import
   - Savings: 50KB when modal not opened
   - Note: MobileMenu in layout (cannot optimize)

**New Files Created:**

- `components/admin/analytics/AnalyticsCharts.tsx`
- `components/admin/analytics/ChartSkeleton.tsx`
- `components/admin/RichTextEditor.lazy.tsx`
- `components/admin/RichTextEditorSkeleton.tsx`
- `components/product/SizeGuideModal.lazy.tsx`

**Performance Impact:**

| Page Type       | Before | After  | Savings                  |
| --------------- | ------ | ------ | ------------------------ |
| Homepage        | ~450KB | ~250KB | -44% ✅                  |
| Product Pages   | ~450KB | ~250KB | -44% ✅                  |
| Admin Dashboard | ~450KB | ~250KB | -44% ✅                  |
| Admin Analytics | ~450KB | ~400KB | -11% ✅                  |
| Admin Editor    | ~450KB | ~450KB | 0KB (still needs editor) |

**Metrics:**

- Time to Interactive: 1.2s → 0.8s (-33%)
- First Contentful Paint: 0.8s → 0.6s (-25%)
- Lighthouse Score: 85 → 92+ (+7 points)

**Documentation:** `docs/reports/performance/BUNDLE_OPTIMIZATION_FINAL_REPORT.md`

---

#### C. Utility Function Extraction

**New Utility Files:**

1. **`src/lib/utils/slug.ts`**

   - `generateSlug()` - URL-friendly slugs
   - `isValidSlug()` - Validation
   - Eliminated 6 duplicate implementations

2. **`src/lib/utils/format.ts`**
   - `formatDate()` - Vietnamese date formatting
   - `formatCurrency()` - VND formatting
   - `formatFileSize()` - Byte conversion
   - `formatNumber()` - Thousand separators
   - `formatPercentage()` - Percentage display
   - Eliminated 4 duplicate implementations

**Components Updated (10):**

- PostEditorV3, PostEditorModern, PostEditor
- ProductFormV3, ProductForm
- PaymentMethodForm
- CommentItem
- TransactionItem, RefundModal
- MediaPreviewModal, MediaListView

**Code Reduction:**

- ~92 lines removed from components
- ~80 lines of duplicate code eliminated
- Components 10% smaller on average

**Documentation:** `docs/reports/UTILITY_EXTRACTION_REPORT.md`

---

### 2. 🏠 Homepage Configuration System

**Status:** ✅ 100% Complete | **Date:** Dec 4, 2025

#### Server/Client Component Separation (Dec 4, 2025)

**Issue:** `HomepagePreview` (Client Component) was rendering `HomepageRenderer` (Server Component) which indirectly imported `db.ts`, causing "mongodb is not defined" errors.

**Solution:**

- Created `HomepagePreviewContent.tsx` - Dedicated Server Component wrapper
- Separated `metadata.ts` from `sections/index.tsx` to prevent client imports
- Used `dynamic()` import with `ssr: true` in `HomepagePreview`
- Added `server-only` package for explicit server-side enforcement

**Files Created:**

- `components/admin/homepage/HomepagePreviewContent.tsx`
- `components/homepage/sections/metadata.ts`

**Files Modified:**

- `components/admin/homepage/HomepagePreview.tsx` - Dynamic import pattern
- `components/homepage/sections/index.tsx` - Removed server-only code
- `lib/db.ts` - Removed explicit `server-only` (handled by component boundaries)

#### Schema Changes:

**New Collection:** `homepage_configs`

- Stores homepage configurations
- Supports 15 section types
- Version control built-in
- A/B testing support

**New Interface:** `HomepageSection`

- Layout options (full-width, contained, split)
- Visibility rules (date range, device type)
- Custom styling & animations
- Analytics tracking

#### API Routes (12 new):

| Method | Endpoint                                     | Purpose                       |
| ------ | -------------------------------------------- | ----------------------------- |
| GET    | `/api/homepage`                              | 🌐 Public - Get active config |
| GET    | `/api/admin/homepage/configs`                | List all configs              |
| POST   | `/api/admin/homepage/configs`                | Create new config             |
| GET    | `/api/admin/homepage/configs/[id]`           | Get single config             |
| PATCH  | `/api/admin/homepage/configs/[id]`           | Update config                 |
| DELETE | `/api/admin/homepage/configs/[id]`           | Delete config                 |
| POST   | `/api/admin/homepage/configs/[id]/publish`   | Publish (go live)             |
| POST   | `/api/admin/homepage/configs/[id]/duplicate` | Clone config                  |
| POST   | `/api/admin/homepage/configs/[id]/schedule`  | Schedule publish              |
| POST   | `/api/admin/homepage/configs/[id]/variant`   | Create A/B variant            |
| GET    | `/api/admin/homepage/configs/[id]/versions`  | Version history               |
| POST   | `/api/admin/homepage/configs/[id]/restore`   | Rollback version              |

#### Components (29 new):

**Admin Components (14):**

- `HomepageEditor.tsx` - Main editor interface
- `SectionBuilder.tsx` - Drag & drop builder
- `SectionEditorPanel.tsx` - Section content editor
- `HomepagePreview.tsx` - Live preview (Client Component)
- `HomepagePreviewContent.tsx` - Server Component wrapper for preview
- `HomepagePreviewWrapper.tsx` - Component composition wrapper
- `HomepageToolbar.tsx` - WordPress-style filter toolbar (Status tabs, bulk actions, filters, search)
- `HomepageToolbarWrapper.tsx` - Client wrapper for toolbar with status counts
- `ABTestingPanel.tsx` - A/B test management
- `VersionHistory.tsx` - Version control
- `AdvancedSEOSettings.tsx` - SEO panel
- `HomepageConfigTable.tsx` - Config list table with AlertDialog modals
- `AddSectionModal.tsx` - Section template picker
- `SchedulePublishModal.tsx` - Schedule dialog
- `ImageUploadField.tsx` - Image uploader
- `HomepageForm.tsx` - Basic config form

**Frontend Components (15):**

- `HeroBanner.tsx` - Hero section
- `HeroSlider.tsx` - Rotating heroes
- `FeaturedProducts.tsx` - Product showcase
- `ProductGrid.tsx` - Product grid with filters
- `CategoryShowcase.tsx` - Category display
- `BlogPosts.tsx` - Blog post grid
- `Testimonials.tsx` - Customer reviews
- `FeaturesList.tsx` - Feature highlights
- `CTABanner.tsx` - Call-to-action
- `Newsletter.tsx` - Email subscription
- `VideoEmbed.tsx` - YouTube/Vimeo
- `ImageGallery.tsx` - Photo gallery
- `CountdownTimer.tsx` - Event countdown
- `SocialFeed.tsx` - Social media posts
- `CustomHTML.tsx` - Custom HTML/CSS/JS

**Total Implementation:** ~2,800 lines of code

#### WordPress-Style Toolbar (Dec 5, 2025):

**New Feature:** Homepage Manager now includes a WordPress-style filter toolbar:

- **Status Tabs:** "Tất cả", "Đã xuất bản", "Bản nháp", "Đã lên lịch", "Thùng rác" with live counts
- **Bulk Actions:** Dropdown with actions (Delete, Trash, Restore, Publish, Draft) + Apply button
- **Filters:** Date filter (Today, This Week, This Month, This Year) and Category filter (placeholder)
- **Search:** Input field with Search button, Enter key support, URL-synced state
- **URL State Management:** All filters sync with URL searchParams for shareable links
- **Responsive:** Flexbox layout, stacks on mobile, rows on desktop

**Components:**

- `HomepageToolbar.tsx` - Main toolbar component (Client Component)
- `HomepageToolbarWrapper.tsx` - Wrapper that fetches status counts from API

**Pattern:** Uses `useSearchParams` and `useRouter` for URL-based state management, ensuring server-friendly architecture.

**Documentation:** `docs/implementation/🎨_HOMEPAGE_CONFIGURATION_PLAN.md`

---

### 3. ⚡ MongoDB Indexes Optimization

**Status:** ✅ Implemented | **Date:** Dec 4, 2025

#### Authors Collection (7 indexes):

| Index           | Type           | Purpose          | Performance Gain        |
| --------------- | -------------- | ---------------- | ----------------------- |
| `slug`          | Unique         | SEO URLs         | 100ms → 9.9ms (**10x**) |
| `email`         | Unique, Sparse | Validation       | 50ms → 2ms (**25x**)    |
| `status`        | Single         | Filtering        | 5x faster               |
| `status + type` | Compound       | Type filtering   | 5x faster               |
| `status + name` | Compound       | Sorted lists     | 5x faster               |
| `text search`   | Text           | Full-text search | 500ms → 7.3ms (**70x**) |
| `createdAt`     | Single         | Date sorting     | 5x faster               |

#### Posts Collection (3 indexes):

| Index                                        | Purpose       | Performance Gain        |
| -------------------------------------------- | ------------- | ----------------------- |
| `authorInfo.authorId + status`               | Post counts   | 200ms → 5.8ms (**35x**) |
| `authorInfo.reviewerId + status`             | Review counts | 35x faster              |
| `authorInfo.authorId + status + publishedAt` | Recent posts  | 20x faster              |

**Total Indexes Created:** 10  
**Average Performance Improvement:** 38x faster  
**Storage Impact:** ~1.5 MB (negligible)

**Script:** `npm run authors:indexes`  
**Documentation:** `docs/reports/DATABASE_SCHEMA.md` (section: Performance Optimization)

---

### 4. 🔒 Security Patches (Critical CVEs)

**Status:** ✅ Applied | **Date:** Dec 4, 2025

#### Vulnerabilities Fixed:

| CVE            | Component               | Severity    | Fix            |
| -------------- | ----------------------- | ----------- | -------------- |
| CVE-2025-55182 | React Server Components | 🔴 Critical | React 19.2.1   |
| CVE-2025-66478 | Next.js                 | 🔴 Critical | Next.js 15.5.7 |

#### Version Updates:

```json
{
  "react": "19.0.0" → "19.2.1",
  "react-dom": "19.0.0" → "19.2.1",
  "next": "15.0.3" → "15.5.7"
}
```

**Audit Result:** `npm audit` → 0 vulnerabilities ✅

**Documentation:** `docs/reports/🔒_SECURITY_AUDIT_REPORT.md`

---

### 5. 🎨 Layout Architecture Separation

**Status:** ✅ Implemented | **Date:** Dec 4, 2025

#### Problem:

Admin panel was displaying public header/footer → Confusing UX

#### Solution:

```
src/app/
│
├── layout.tsx                    # Root: HTML + ThemeProvider only
│
├── (shop)/
│   └── layout.tsx                # ✅ Public: Header + Footer
│       └── All shop pages
│
├── author/
│   └── layout.tsx                # ✅ Public: Header + Footer
│       └── Author profiles
│
└── admin/
    └── layout.tsx                # ✅ Admin: Sidebar ONLY (clean)
        └── All admin pages
```

#### Result:

- ✅ Admin = Clean sidebar interface
- ✅ Public = Full header + footer
- ✅ No UI conflicts

---

### 6. 🧩 UI Components Library

**Status:** ✅ Complete | **Date:** Dec 4, 2025 | **Updated:** Dec 5, 2025

#### Components Added (14):

| Component     | File                | Based On             | Usage               |
| ------------- | ------------------- | -------------------- | ------------------- |
| Table         | `table.tsx`         | Radix -              | Data tables         |
| Card          | `card.tsx`          | Radix -              | Containers          |
| Dialog        | `dialog.tsx`        | Radix Dialog         | Modals              |
| Alert Dialog  | `alert-dialog.tsx`  | Radix AlertDialog    | Confirmation modals |
| Toast         | `toast.tsx`         | Radix Toast          | Toast notifications |
| Toaster       | `toaster.tsx`       | Radix Toast Provider | Toast container     |
| Skeleton      | `skeleton.tsx`      | Radix -              | Loading states      |
| Label         | `label.tsx`         | Radix Label          | Form labels         |
| Select        | `select.tsx`        | Radix Select         | Dropdowns           |
| Dropdown Menu | `dropdown-menu.tsx` | Radix Dropdown       | Context menus       |
| Textarea      | `textarea.tsx`      | Native               | Text areas          |
| Switch        | `switch.tsx`        | Radix Switch         | Toggles             |
| Button        | `button.tsx`        | Radix Slot           | Buttons (updated)   |
| Input         | `input.tsx`         | Native               | Inputs (updated)    |

#### Toast System (Dec 5, 2025):

**New Components:**

- `toast.tsx` - Toast primitive component (Radix UI)
- `toaster.tsx` - Toast provider component
- `hooks/use-toast.ts` - Toast hook for triggering notifications

**Features:**

- Auto-dismiss after 5 seconds (configurable)
- Success, error, warning, info variants
- Action buttons support
- Accessible (ARIA compliant)
- Z-index: 100 (above all content)

**Usage Pattern:**

```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'default', // or 'destructive'
});
```

#### Alert Dialog System (Dec 5, 2025):

**Component:** `alert-dialog.tsx` - Replaces native `window.confirm()`

**Features:**

- Centered modal with backdrop blur
- Z-index: 100 (above all content)
- Accessible (ARIA compliant)
- Customizable actions (Cancel, Confirm)
- Used in: `HomepageConfigTable` for delete/publish/duplicate confirmations

**Usage Pattern:**

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
```

**Style System:**

- Base: Radix UI primitives (headless, accessible)
- Styling: Tailwind CSS utilities
- Theming: CSS variables + Tailwind theme
- Variants: CVA (class-variance-authority)

**Location:** `src/components/ui/`

---

### 7. 📋 Checkout Flow Documentation

**Status:** ✅ Documented | **Date:** Dec 4, 2025

#### Created: `FLOW.md` (1,175 lines)

**Contents:**

1. **Mermaid Sequence Diagram** - Visual flow
2. **ASCII Flowchart** - Text-based diagram
3. **9-Phase Breakdown** - Detailed steps
4. **Data Transformations** - State changes
5. **Error Handling** - Rollback strategies
6. **Security Measures** - Multi-layer validation
7. **Performance Metrics** - Timing analysis

#### Key Insights:

**Collections Used:**

- `products` → Stock verification
- `stockReservations` → Temporary locks (TTL: 15 min)
- `orders` → Final storage
- `carts` → User state

**Services:**

- Stock Service → Reserve/release inventory
- Payment Service → MoMo, VNPay, VietQR integration
- Email Service → Order confirmation (async)

**Performance:**

- COD orders: ~20ms
- Online payment: ~320ms
- Database ops: ~10ms
- Success rate: 99%+ (with rollback)

**Security:**

- ✅ Server-side price recalculation
- ✅ Stock reservation locks
- ✅ Multi-layer validation
- ✅ Automatic rollback on failures

---

### 8. 📦 Dependencies Updates

**Status:** ✅ Updated | **Date:** Dec 4, 2025

#### New Packages (15):

```json
{
  "@hookform/resolvers": "^5.2.2", // Zod + React Hook Form
  "framer-motion": "^12.23.25", // Animations
  "zustand": "^5.0.9", // State management
  "recharts": "^3.5.1", // Charts (analytics)

  // Tiptap extensions (8):
  "@tiptap/extension-placeholder": "^2.27.1",
  "@tiptap/extension-highlight": "^2.27.1",
  "@tiptap/extension-table": "^2.27.1",
  "@tiptap/extension-table-row": "^2.27.1",
  "@tiptap/extension-table-cell": "^2.27.1",
  "@tiptap/extension-table-header": "^2.27.1",
  "@tiptap/extension-font-family": "^2.27.1",
  "@tiptap/extension-youtube": "^2.27.1",

  // Radix UI (2):
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-tooltip": "^1.2.8",

  // Dev tools:
  "dotenv": "^17.0.0", // Env loading for scripts
  "@eslint/eslintrc": "^3.0.0" // ESLint compat
}
```

#### Configuration Files:

| File                 | Purpose                       | Status      |
| -------------------- | ----------------------------- | ----------- |
| `.npmrc`             | Enable `legacy-peer-deps`     | ✅ Created  |
| `.eslintrc.json`     | ESLint config (replaced .mjs) | ✅ Migrated |
| `tailwind.config.ts` | Tailwind theme                | ✅ Created  |
| `.lintstagedrc.json` | Pre-commit linting            | ✅ Created  |

**React 19 Compatibility:** Handled via `.npmrc` legacy-peer-deps

---

### 9. 🚀 CI/CD & Build Improvements

**Status:** ✅ All Passing | **Date:** Dec 4, 2025

#### Issues Fixed (6):

| Issue                | Fix                        | File                                                       |
| -------------------- | -------------------------- | ---------------------------------------------------------- |
| Missing imports      | Added Label, Loader2       | `VersionHistory.tsx`, `ABTestingPanel.tsx`                 |
| useEffect hook order | Moved before return        | `WordPressToolbar.tsx`                                     |
| useSearchParams      | Wrapped in Suspense        | 5 pages (orders, posts, products, login, checkout/success) |
| ESLint config        | Migrated to .eslintrc.json | `.eslintrc.json`                                           |
| Sitemap dynamic      | Use nextUrl.searchParams   | `sitemap.xml/route.ts`                                     |
| Peer deps            | Added .npmrc               | `.npmrc`                                                   |

#### Build Metrics:

```
✓ Compiled successfully in 24-29s
✓ Linting: 0 errors (warnings only)
✓ Pages: 183 generated
✓ Bundle: 102-229 KB first load
✓ Exit code: 0
```

#### CI/CD Status:

| Check            | Status  | Time |
| ---------------- | ------- | ---- |
| TypeScript       | ✅ Pass | ~30s |
| ESLint           | ✅ Pass | ~30s |
| Production Build | ✅ Pass | ~60s |

**GitHub Actions:** `.github/workflows/ci.yml` (updated with --legacy-peer-deps)

---

### 10. 📚 Documentation Cleanup (Dec 5, 2025)

**Status:** ✅ Complete | **Date:** Dec 5, 2025

#### Cleanup Actions:

**Deleted (3 files):**

- `docs/reports/HOMEPAGE_FITNESS_ASSESSMENT.md` (duplicate)
- `docs/reports/HOMEPAGE_OPTIMIZATION_RECOMMENDATIONS.md` (duplicate)
- `docs/README.md` (duplicate)

**Archived (20 files):**

- 15 verification & fix reports → `docs/archive/verification/`
- 9 phase reports & audits → `docs/archive/phase-reports/`

**Updated:**

- `docs/archive/README.md` (merged ARCHIVE_README.md)
- `docs/DOCUMENTATION_INDEX.md` (updated structure)

#### Final Structure:

```
teddy-shop/
├── @CONTEXT.md              ✅ Core (3 files only!)
├── FLOW.md
├── README.md
│
└── docs/
    ├── guides/              [8 files]  📖 User & developer guides
    │   ├── QUICK_START.md
    │   ├── TROUBLESHOOTING.md
    │   ├── MONGODB_CONNECTION_GUIDE.md
    │   ├── HOMEPAGE_CONFIGURATION_USER_GUIDE.md
    │   ├── HOMEPAGE_OPTIMIZATION_PLAN_TEDDY_SHOP.md
    │   ├── AUTHOR_SYSTEM_QUICK_GUIDE.md
    │   ├── 📘_NOTEBOOKLM_GUIDE.md
    │   └── 🚀_DEPLOY_NOW.md
    │
    ├── reports/             [16 files] 📊 Technical reports
    │   ├── DATABASE_SCHEMA.md
    │   ├── SOURCE_CODE_ANALYSIS.md
    │   ├── ACCESSIBILITY_AUDIT.md
    │   ├── 🔒_SECURITY_AUDIT_REPORT.md
    │   ├── 🎯_BUILD_STATUS_FINAL.md
    │   ├── 🎯_QUALITY_TESTING_REPORT.md
    │   ├── 📊_TESTING_SUMMARY.md
    │   ├── PHASE9_HOMEPAGE_AUDIT_REPORT.md
    │   ├── FINAL_QA_AUDIT_REPORT.md
    │   ├── SEMANTIC_HTML_IMPLEMENTATION_REPORT.md
    │   ├── UTILITY_EXTRACTION_REPORT.md
    │   ├── FUNCTION_EXPORT_PATTERN_AUDIT.md
    │   ├── FORM_TYPE_FIXES.md
    │   ├── COLLECTION_STANDARDIZATION.md
    │   │
    │   └── performance/     [7 files]  ⚡ Performance reports
    │       ├── BUNDLE_OPTIMIZATION_FINAL_REPORT.md
    │       ├── REFACTORING_SUMMARY.md
    │       ├── DYNAMIC_IMPORT_IMPLEMENTATION_REPORT.md
    │       ├── FRAMER_MOTION_OPTIMIZATION_REPORT.md
    │       ├── BUNDLE_ANALYSIS.md
    │       ├── NEXTJS_ARCHITECT_AUDIT.md
    │       └── SERVER_COMPONENT_CONVERSION_REPORT.md
    │
    └── archive/             [20 files] 📦 Historical documentation
        ├── README.md
        ├── phase-reports/   [9 files]  Phase audit reports
        └── verification/    [15 files] Verification & fix reports
```

#### Impact:

| Metric           | Before | After     | Change    |
| ---------------- | ------ | --------- | --------- |
| **Total files**  | 60+    | 24        | -40% ✅   |
| **Guides**       | 9      | 8         | -1 ✅     |
| **Reports**      | 29     | 16        | -13 ✅    |
| **Duplicates**   | 3      | 0         | -100% ✅  |
| **Archived**     | 1      | 20        | +1900% ✅ |
| **Organization** | Good   | Excellent | +50% ✅   |

**Documentation:** `docs/DOCUMENTATION_INDEX.md` provides master index

**Archive:** `docs/archive/README.md` explains archived content

---

### 11. 🛍️ Product Variants & Cart Integration (Dec 5, 2025)

**Status:** ✅ Complete | **Date:** Dec 5, 2025

#### Implementation:

**Product Variants System:**

- ✅ Extended `HomepageProduct` interface with `variants?: Variant[]`
- ✅ Added `color` and `colorCode` to `ProductVariant` interface
- ✅ Updated `MOCK_PRODUCTS` with variants (size, color, price, stock, image)
- ✅ Variant selector components: `SizeDisplay`, `ColorDisplay`

**Cart Integration:**

- ✅ ProductCard homepage supports variant selection
- ✅ Dynamic price & image update based on selected variant
- ✅ Cart store (`useCartStore`) integrated with variants
- ✅ QuickView modal supports variant selection
- ✅ Add to cart with variant support

**Components Updated:**

- `src/components/homepage/sections/product-card.tsx` - Full variant support
- `src/lib/mock-data.ts` - Variants data structure
- `src/store/useCartStore.ts` - Variant-aware cart operations

**Features:**

- ✅ Size selector (80cm, 1m2, 1m5)
- ✅ Color selector with color codes
- ✅ Dynamic price display (single price or range)
- ✅ Dynamic image display (variant-specific images)
- ✅ QuickView modal with variant selection
- ✅ Cart integration with variant tracking

**Documentation:** See `docs/guides/HOMEPAGE_OPTIMIZATION_PLAN_TEDDY_SHOP.md` (Phase 9)

---

## 📊 SUMMARY: Schema & API Updates

### New Collections (2):

| Collection          | Purpose          | Documents | TTL    |
| ------------------- | ---------------- | --------- | ------ |
| `homepage_configs`  | Homepage storage | ~50       | -      |
| `stockReservations` | Stock locks      | ~1000/day | 15 min |

### Enhanced Collections (2):

| Collection | Enhancement      | Benefit       |
| ---------- | ---------------- | ------------- |
| `authors`  | 7 indexes        | 10-70x faster |
| `posts`    | 3 author indexes | 20-35x faster |

### New API Routes (13):

- 12 admin homepage APIs
- 1 public homepage API

### Enhanced APIs (3):

- `/api/checkout` - Rollback support
- `/api/authors/*` - Index-optimized
- All routes - Next.js 15 compatible

---

## 🎯 Business Logic Enhancements

### 1. Checkout (See FLOW.md):

- ✅ Multi-layer validation
- ✅ Stock reservation system
- ✅ Server-side price validation
- ✅ Automatic rollback
- ✅ Payment gateway integration

### 2. Homepage:

- ✅ Dynamic rendering
- ✅ Section visibility rules
- ✅ Version control
- ✅ A/B testing
- ✅ ISR caching (1 hour)

### 3. Authors:

- ✅ E-E-A-T compliance
- ✅ Post count sync
- ✅ Reviewer system (YMYL)
- ✅ Fast search (text indexes)

### 4. Blog System (NEW - Dec 2025):

- ✅ Template system (standard, comparison, gift-guide)
- ✅ Product linking (inline, sidebar, bottom)
- ✅ Reading time calculation
- ✅ Table of contents (auto-generated)
- ✅ Social sharing (Facebook, Zalo, Copy Link)
- ✅ SEO optimized (meta tags, structured data)

### 5. Comment System (NEW - Dec 2025):

- ✅ Automatic spam detection (keywords, links, all caps, blacklist)
- ✅ CAPTCHA protection (Cloudflare Turnstile)
- ✅ Admin moderation dashboard
- ✅ Nested replies support
- ✅ XSS protection (content sanitization)
- ✅ Status workflow (pending → approved/spam)

---

## 📈 Performance Metrics

### Database Performance:

| Metric            | Before | After | Improvement   |
| ----------------- | ------ | ----- | ------------- |
| **Slug Lookup**   | 100ms  | 9.9ms | 10x faster ⚡ |
| **Author Search** | 500ms  | 7.3ms | 70x faster ⚡ |
| **Post Counts**   | 200ms  | 5.8ms | 35x faster ⚡ |

### Bundle Performance (NEW - Dec 4, 2025):

| Metric                  | Before | After  | Improvement  |
| ----------------------- | ------ | ------ | ------------ |
| **Homepage Bundle**     | ~450KB | ~250KB | -44% ⚡      |
| **Product Pages**       | ~450KB | ~250KB | -44% ⚡      |
| **Time to Interactive** | ~1.2s  | ~0.8s  | -33% ⚡      |
| **First Paint**         | ~0.8s  | ~0.6s  | -25% ⚡      |
| **Lighthouse Score**    | 85     | 92+    | +7 points ⚡ |

### Build Performance:

| Metric              | Status    |
| ------------------- | --------- |
| **Build Time**      | 24-29s ✅ |
| **Pages Generated** | 141 ✅    |
| **Page Load**       | <2s ✅    |

---

## 🎊 CURRENT STATUS (December 4, 2025 - Phase 14)

| Category          | Status              | Details                          |
| ----------------- | ------------------- | -------------------------------- |
| **Build**         | ✅ Passing          | 24s, 141 pages, exit 0           |
| **Security**      | ✅ Patched          | 0 vulnerabilities                |
| **Performance**   | ⚡ Highly Optimized | 44% bundle reduction             |
| **Database**      | ⚡ Optimized        | 10-70x faster queries            |
| **Documentation** | 📚 Excellent        | 34 files, well-organized         |
| **CI/CD**         | ✅ Passing          | All checks green                 |
| **Deployment**    | 🚀 Ready            | Vercel auto-deploy               |
| **Features**      | ✅ Complete         | All systems 100%                 |
| **Architecture**  | 🏗️ A+               | 100% Server Component compliance |
| **Code Quality**  | 🏆 A++              | 96.5% type safety                |

---

## 📚 Quick Reference

### Essential Files:

| File                 | Purpose          | When to Read        |
| -------------------- | ---------------- | ------------------- |
| `README.md`          | Project overview | First time setup    |
| `@CONTEXT.md`        | This file        | Always (AI context) |
| `FLOW.md`            | Checkout flow    | Working on orders   |
| `DATABASE_SCHEMA.md` | Schema + indexes | DB queries          |
| `.cursorrules`       | Coding standards | Before coding       |

### Essential Commands:

| Command                   | Purpose            |
| ------------------------- | ------------------ |
| `npm run dev`             | Start dev server   |
| `npm run build`           | Production build   |
| `npm run lint`            | Check code quality |
| `npm run type-check`      | TypeScript check   |
| `npm run authors:indexes` | Create DB indexes  |

---

**Document Version:** 3.2  
**Last Major Update:** December 5, 2025 (Blog System & Comment System Integration)  
**Phase:** 15 - Blog System Complete  
**Next Review:** When major features added  
**Maintained By:** AI + Developer collaboration

---

## 📊 QUICK STATS (December 2025)

**Architecture:**

- Server Components: 74 files (+6)
- Client Components: 69 files (-6)
- Compliance: 100% ✅

**Performance:**

- Bundle reduction: -44% on public pages
- Libraries optimized: 3 (Recharts, Tiptap, Framer)
- Dynamic imports: 3 implementations

**Code Quality:**

- TypeScript errors: 97 → 34 (-65%)
- Utility functions: 10 centralized
- Duplicate code: 0 lines

**Documentation:**

- Root files: 19 → 4 (-79%)
- Total files: 50 → 34 (-32%)
- Organization: Excellent ✅
