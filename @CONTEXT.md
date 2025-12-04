Teddy Shop - Project Context & Architecture

Last Updated: December 2025
Status: Production Ready (Phase 13 Complete)

1. Project Overview

Teddy Shop is a full-stack E-commerce platform combined with a headless CMS. It focuses heavily on SEO (E-E-A-T standards), performance (Next.js 16), and administrative control.

Core Domains

Shop (Public): Product browsing, cart, checkout, payment gateways.

CMS (Admin): Blog posts (Tiptap editor), Page builder, Media library.

Author Management (New): Advanced author profiles compliant with Google E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness).

SEO Tools: Keyword tracking, Schema.org generator, Audit tools.

2. Tech Stack & Libraries

Core

Framework: Next.js 16 (App Router).

Language: TypeScript 5+.

Database: MongoDB (Native Driver v6.3) - No Mongoose Models used.

Auth: NextAuth v5 (Auth.js) - Session strategy.

State & Logic

Global State: Zustand (Cart, UI state).

Forms: React Hook Form + Zod Resolvers.

Validation: Zod schemas (src/lib/schemas).

Date Handling: date-fns.

UI/UX

Styling: Tailwind CSS + tailwindcss-animate.

Components: Radix UI Primitives (Headless) + Shadcn/UI implementation.

Icons: Lucide React.

Editor: Tiptap (Rich text for blogs).

Drag & Drop: @hello-pangea/dnd.

Animations: Framer Motion.

Infrastructure

Storage: Vercel Blob (for images/media).

Deployment: Vercel compatible.

3. Database Architecture (Native Driver)

Crucial Pattern: The project uses a Repository Pattern via a helper function getCollections() in src/lib/db.ts. It exports direct MongoDB collection accessors.

// Usage Pattern
const { users, posts, authors } = await getCollections();
const user = await users.findOne({ \_id: new ObjectId(id) });

Key Collections & Schemas

authors (E-E-A-T System)

Stores content creators with detailed metadata for SEO.

\_id: ObjectId

name: string

slug: string (unique)

type: 'staff' | 'contributor' | 'guest' | 'expert'

bio: string (Short bio)

bioFull: string (Long HTML bio)

credentials: string (e.g., "MD, PhD")

socialLinks: Object { linkedin, twitter, ... }

status: 'active' | 'inactive'

postCount: number (Syncs with published posts)

posts

Blog content.

title, slug, content (HTML from Tiptap)

status: 'draft' | 'published' | 'archived'

authorInfo: Object (Embedded for quick access)

authorId: string (Ref to authors.\_id)

reviewerId: string (Ref to authors.\_id - for YMYL content)

guestAuthor: Object (For authors without DB profile)

products

E-commerce items.

name, slug, price, salePrice

stock: number

sku: string

variants: Array (Colors, Sizes)

users

System users (Admin/Editors).

role: 'admin' | 'editor' | 'user'

password: Bcrypt hash (Never store plain text)

4. Key Business Logic

Authentication Flow

Login: /login -> calls NextAuth authorize.

Verification: Checks email exists -> Compares bcrypt password.

Session: JWT strategy. Token contains id, role, avatar.

Protection: Middleware matches paths; API routes check await auth() manually.

Author & Content Logic

Author Selection: When writing a post, admins can select an existing Author OR input a Guest Author manually.

Reviewer System: For "Your Money Your Life" (YMYL) content, a reviewer (Medical/Financial expert) can be assigned.

Row Actions: Admin tables support "Quick Edit", "Duplicate", and "Trash" actions without leaving the page.

Media Handling

Images are uploaded to Vercel Blob.

URLs are stored in DB.

Frontend uses next/image with remotePatterns configured for blob domain.

5. Folder Structure Map

src/
├── app/
│ ├── (shop)/ # Public e-commerce routes
│ ├── admin/ # Protected dashboard routes
│ │ ├── authors/ # Author CRUD
│ │ ├── posts/ # Blog CRUD
│ │ └── products/ # Product CRUD
│ └── api/ # REST Endpoints (Route Handlers)
│ ├── admin/ # Admin-only APIs
│ └── ...
├── components/
│ ├── admin/ # Dashboard specific widgets (AuthorBoxWidget, RowActions)
│ ├── blog/ # Blog frontend components (AuthorBox)
│ └── ui/ # Reusable atoms (Buttons, Inputs - Shadcn)
├── lib/
│ ├── db.ts # Database connection singleton
│ ├── auth.ts # NextAuth config
│ ├── types/ # TS Interfaces (Author, Post, Product)
│ └── schemas/ # Zod Validation schemas
└── scripts/ # Maintenance scripts (Migration, Seeding)

6. Development Guidelines

IDs: Always cast string IDs to ObjectId before querying MongoDB.

Validation: Always validate API bodies using zod schemas from @/lib/schemas.

Security: Never commit secrets. Use .env.local.

---

## 🆕 RECENT MAJOR UPDATES (December 2025)

### 1. Homepage Configuration System ✅ 100% Complete

**Status:** Production ready  
**Date:** December 4, 2025

**Schema Changes:**
- New collection: `homepage_configs`
- 15 section types fully implemented
- Version control & A/B testing support

**Key Features:**
- Dynamic homepage rendering from database config
- 15 section components: Hero Banner, Hero Slider, Featured Products, Product Grid, Category Showcase, Blog Posts, Testimonials, Features List, CTA Banner, Newsletter, Video Embed, Image Gallery, Countdown Timer, Social Feed, Custom HTML
- Live preview & drag-drop section builder
- SEO optimization (meta tags, Schema.org, Open Graph)
- Scheduled publishing & version history

**API Routes Added:**
- `GET /api/homepage` - Public endpoint for active config
- `GET /api/admin/homepage/configs` - List configs
- `POST /api/admin/homepage/configs` - Create config
- `GET /api/admin/homepage/configs/[id]` - Get single
- `PATCH /api/admin/homepage/configs/[id]` - Update
- `DELETE /api/admin/homepage/configs/[id]` - Delete
- `POST /api/admin/homepage/configs/[id]/publish` - Publish
- `POST /api/admin/homepage/configs/[id]/duplicate` - Clone
- `POST /api/admin/homepage/configs/[id]/schedule` - Schedule
- `POST /api/admin/homepage/configs/[id]/variant` - A/B testing
- `GET /api/admin/homepage/configs/[id]/versions` - Version history
- `POST /api/admin/homepage/configs/[id]/restore` - Rollback

**Components Added:**
- `src/components/homepage/HomepageRenderer.tsx` - Main renderer
- `src/components/homepage/sections/*` - 15 section components
- `src/components/admin/homepage/*` - 12 admin UI components

**Files:** `docs/implementation/🎨_HOMEPAGE_CONFIGURATION_PLAN.md`

---

### 2. MongoDB Indexes Optimization ⚡

**Status:** Implemented  
**Date:** December 4, 2025

**Authors Collection Indexes (7 new):**
```javascript
✅ slug (unique) - SEO URLs performance
✅ email (unique, sparse) - Validation
✅ status - Filtering
✅ status + type - Compound filtering
✅ status + name - Sorted lists
✅ text search - Full-text search (weighted)
✅ createdAt - Date sorting
```

**Posts Collection Indexes (3 new):**
```javascript
✅ authorInfo.authorId + status - Post counts
✅ authorInfo.reviewerId + status - Review counts
✅ authorInfo.authorId + status + publishedAt - Recent posts
```

**Performance Impact:**
- Slug lookups: 100ms → 9.9ms (10x faster)
- Text search: 500ms → 7.3ms (70x faster)
- Post counts: 200ms → 5.8ms (35x faster)

**Script:** `npm run authors:indexes`  
**Files:** `scripts/create-author-indexes.ts`, `docs/reports/DATABASE_SCHEMA.md`

---

### 3. Security Patches (Critical) 🔒

**Status:** Applied  
**Date:** December 4, 2025

**CVE Fixes:**
- ✅ CVE-2025-55182 (React Server Components)
- ✅ CVE-2025-66478 (Next.js)

**Version Updates:**
- React: 19.0.0 → **19.2.1** (patched)
- React-DOM: 19.0.0 → **19.2.1** (patched)
- Next.js: 15.0.3 → **15.5.7** (patched)

**Security Audit:** 0 vulnerabilities found ✅

---

### 4. Layout Architecture Separation 🎨

**Status:** Implemented  
**Date:** December 4, 2025

**Problem:** Admin panel was showing public header/footer

**Solution:**
```
Root Layout (layout.tsx)
├── (shop)/layout.tsx          [Header + Footer]
│   ├── Public pages
│   └── Blog pages
├── author/layout.tsx          [Header + Footer]
│   └── Author profile pages
└── admin/layout.tsx           [Sidebar only]
    └── Admin dashboard (clean UI)
```

**Impact:** Clean separation between CMS and frontend

---

### 5. UI Components Library 🧩

**Status:** Complete  
**Date:** December 4, 2025

**New Components Added (11):**
- `table.tsx` - Data tables with sorting
- `card.tsx` - Card containers
- `dialog.tsx` - Modal dialogs
- `skeleton.tsx` - Loading states
- `label.tsx` - Form labels
- `select.tsx` - Dropdown selects
- `dropdown-menu.tsx` - Context menus
- `textarea.tsx` - Multi-line inputs
- `switch.tsx` - Toggle switches
- `button.tsx` - Buttons (updated)
- `input.tsx` - Text inputs (updated)

**Based on:** Radix UI primitives + Tailwind styling

---

### 6. Checkout Flow Documentation 📋

**Status:** Documented  
**Date:** December 4, 2025

**New Documentation:**
- `FLOW.md` - Complete checkout data flow
  - Mermaid sequence diagram
  - ASCII flow diagram
  - 9-phase breakdown
  - Error handling & rollback strategies
  - Security measures
  - Performance metrics (20-320ms)

**Collections Involved:**
- `products` - Stock verification
- `stockReservations` - Temporary locks (15 min TTL)
- `orders` - Final order storage
- `carts` - User cart state

**Services:**
- Stock Service - Reserve/release stock
- Payment Service - MoMo, VNPay, VietQR
- Email Service - Order confirmation

---

### 7. Dependencies Updates 📦

**New Packages Added:**
```json
{
  "@hookform/resolvers": "^5.2.2",
  "framer-motion": "^12.23.25",
  "zustand": "^5.0.9",
  "recharts": "^3.5.1",
  "@tiptap/extension-placeholder": "^2.27.1",
  "@tiptap/extension-highlight": "^2.27.1",
  "@tiptap/extension-table": "^2.27.1",
  "@tiptap/extension-table-row": "^2.27.1",
  "@tiptap/extension-table-cell": "^2.27.1",
  "@tiptap/extension-table-header": "^2.27.1",
  "@tiptap/extension-font-family": "^2.27.1",
  "@tiptap/extension-youtube": "^2.27.1",
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-tooltip": "^1.2.8",
  "dotenv": "^17.0.0"
}
```

**Configuration:**
- `.npmrc` - Added `legacy-peer-deps=true` for React 19 compatibility
- `.eslintrc.json` - Migrated from eslint.config.mjs
- `tailwind.config.ts` - Created with full theme config

---

### 8. CI/CD & Build Improvements 🚀

**Status:** All checks passing  
**Date:** December 4, 2025

**Fixes Applied:**
- ✅ Suspense boundaries for useSearchParams (5 pages)
- ✅ ESLint errors fixed (Label, Loader2, useEffect order)
- ✅ Production build: Compiled successfully (24s, 183 pages)
- ✅ GitHub Actions: Updated with --legacy-peer-deps
- ✅ Vercel deployment: Fixed peer dependency conflicts

**Build Metrics:**
- Build time: 24-29 seconds
- Pages generated: 183
- Bundle size: 102-229 KB first load
- Exit code: 0 (success)

---

### 9. Documentation Reorganization 📚

**Status:** Complete  
**Date:** December 4, 2025

**New Structure:**
```
docs/
├── guides/        [7 files] - User & developer guides
├── reports/       [9 files] - Status & analysis
├── completed/     [12 files] - Milestone achievements
└── implementation/ [5 files] - Technical details
```

**Key Documents:**
- `FLOW.md` - Checkout data flow (1,175 lines)
- `DATABASE_SCHEMA.md` - Schema + indexes analysis (676 lines)
- `DOCUMENTATION_INDEX.md` - Master navigation (220 lines)
- `🔒_SECURITY_AUDIT_REPORT.md` - Security audit (99/100)

**Total:** 33 documents organized into logical structure

---

## 📊 SCHEMA UPDATES SUMMARY

### New Collections:
1. **homepage_configs** - Homepage configuration storage
2. **stockReservations** - Temporary stock locks (TTL: 15 min)

### Updated Collections:
1. **authors** - Added 7 indexes for performance
2. **posts** - Added 3 author-related indexes

### Schema Enhancements:
1. **HomepageConfig interface** - 15 section types support
2. **HomepageSection interface** - Layout, visibility, analytics
3. **Order schema** - Enhanced upsellServices tracking
4. **Author schema** - E-E-A-T compliant fields

---

## 🔌 API ROUTES SUMMARY

### New Admin APIs (12):
- Homepage configs CRUD + publish/schedule/variant/versions
- All with authentication, validation, error handling

### New Public APIs (1):
- `GET /api/homepage` - Fetch active config (ISR cached 1 hour)

### Enhanced APIs:
- `/api/checkout` - Full rollback support
- `/api/authors/*` - Optimized with indexes
- All routes using `await params` for Next.js 15 compatibility

---

## 🎯 BUSINESS LOGIC UPDATES

### Checkout Flow:
1. Multi-layer validation (client + server)
2. Stock reservation with auto-expiry
3. Server-side price recalculation (security)
4. Rollback mechanism for failures
5. Async email notifications

### Homepage System:
1. Dynamic content from database
2. Section visibility rules (date, device)
3. Version control & rollback
4. A/B testing variants
5. SEO-optimized rendering

### Author Management:
1. E-E-A-T compliance
2. Post count synchronization
3. Reviewer assignment for YMYL
4. Fast search with text indexes

---

**Last Major Update:** December 4, 2025  
**Current Phase:** Phase 13 - Production Ready  
**Build Status:** ✅ All checks passing  
**Security Status:** ✅ CVEs patched, 0 vulnerabilities  
**Performance:** ✅ Optimized with indexes (10-70x faster)  
**Documentation:** ✅ 33 files organized
