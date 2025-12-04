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
