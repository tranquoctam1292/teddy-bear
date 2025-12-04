# 📝 Author Management - Implementation Guide

> Hệ thống quản lý tác giả toàn diện cho SEO theo chuẩn E-E-A-T (Google)

**Status:** ✅ In Progress  
**Date:** December 4, 2025

---

## 🎯 Tổng quan Dự án

### Mục tiêu

Xây dựng hệ thống **Author Management** đầy đủ cho CMS phục vụ SEO theo tiêu chuẩn **E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness) của Google.

### Tính năng chính

1. ✅ **Hồ sơ Tác giả** (Authors Profile) - Tách biệt khỏi User Account
2. ✅ **Author Box Widget** trong Post Editor
3. ✅ **Dual Attribution**: Written by + Reviewed by (YMYL compliance)
4. ✅ **Guest Author** không cần tài khoản
5. 🔄 **Author Archive Pages** (SEO-friendly URLs)
6. 🔄 **Schema.org/Person** JSON-LD tự động
7. 🔄 **Frontend Author Box** đẹp mắt

---

## 📊 Database Schema

### Authors Collection

```typescript
interface Author {
  _id: ObjectId;

  // Basic Info
  name: string;
  slug: string; // URL: /author/john-doe
  email?: string;
  avatar?: string;

  // Bio & Experience
  bio: string; // 50-200 chars (meta description)
  bioFull?: string; // Full bio cho author page

  // Job & Expertise
  jobTitle?: string; // "Senior Medical Editor"
  company?: string;
  expertise?: string[]; // ["Cardiology", "Nutrition"]

  // E-E-A-T Credentials
  credentials?: string; // "MD, PhD"
  education?: string; // "Harvard Medical School"
  certifications?: string[];
  awards?: string[];
  yearsOfExperience?: number;

  // Social Proof
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };

  // Link to User (optional)
  userId?: string;

  // Type & Status
  type: 'staff' | 'contributor' | 'guest' | 'expert';
  status: 'active' | 'inactive';

  // SEO
  metaDescription?: string;

  // Stats
  postCount?: number;
  reviewedCount?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Posts Collection - Author Info

```typescript
interface Post {
  // ... existing fields ...

  // NEW: Author Information
  authorInfo: {
    // Primary Author
    authorId?: string; // Reference to Author._id
    authorName?: string;

    // Reviewer/Expert (YMYL compliance)
    reviewerId?: string;
    reviewerName?: string;

    // Guest Author (override authorId)
    guestAuthor?: {
      name: string;
      avatar?: string;
      bio?: string;
      jobTitle?: string;
      credentials?: string;
      socialLinks?: {
        website?: string;
        linkedin?: string;
      };
    };

    // Review date
    lastReviewedDate?: Date;
  };
}
```

---

## 🔧 Files Created

### 1. Types & Schemas

**File:** `src/lib/types/author.ts`

- ✅ Author interface
- ✅ GuestAuthor interface
- ✅ PostAuthorInfo interface
- ✅ AuthorSchemaOrg interface
- ✅ AuthorBoxProps interface

**File:** `src/lib/schemas/author.ts`

- ✅ authorSchema (Zod validation)
- ✅ guestAuthorSchema
- ✅ postAuthorInfoSchema
- ✅ authorFilterSchema
- ✅ generateAuthorSlug() helper

### 2. API Endpoints

**File:** `src/app/api/admin/authors/route.ts`

- ✅ GET /api/admin/authors (List with filters)
- ✅ POST /api/admin/authors (Create)

**File:** `src/app/api/admin/authors/[id]/route.ts`

- ✅ GET /api/admin/authors/[id] (Get one)
- ✅ PATCH /api/admin/authors/[id] (Update)
- ✅ DELETE /api/admin/authors/[id] (Delete with validation)

### 3. Admin UI

**File:** `src/app/admin/authors/page.tsx`

- ✅ Authors list with filters
- ✅ Search by name/email/bio
- ✅ Filter by status/type
- ✅ Display post counts
- ✅ Quick actions (edit/delete/view)

**File:** `src/app/admin/authors/new/page.tsx` (TODO)

- Form thêm tác giả mới
- Upload avatar
- Full E-E-A-T fields

**File:** `src/app/admin/authors/[id]/edit/page.tsx` (TODO)

- Form sửa tác giả
- Pre-fill data
- Validation

---

## 🎨 UI Components to Create

### 1. Author Form Component

**File:** `src/components/admin/authors/AuthorForm.tsx`

```tsx
<AuthorForm initialData={author} onSubmit={handleSubmit}>
  {/* Basic Info Section */}- Name (required) - Slug (auto-generate) - Email - Avatar upload
  {/* Bio Section */}- Short Bio (50-200 chars) - SEO - Full Bio (rich text)
  {/* Credentials Section - E-E-A-T */}- Job Title - Company - Credentials (MD, PhD, etc.) -
  Education - Years of Experience - Expertise tags - Certifications (array) - Awards (array)
  {/* Social Links */}- Website - LinkedIn (most important) - Twitter/Facebook/Instagram
  {/* Settings */}- Author Type (dropdown) - Status (active/inactive) - Link to User Account
  (optional)
</AuthorForm>
```

### 2. Author Box Widget (Editor Sidebar)

**File:** `src/components/admin/posts/AuthorBoxWidget.tsx`

```tsx
<AuthorBoxWidget post={post} onChange={handleAuthorChange}>
  {/* Primary Author */}
  <AuthorSelect label="Written by" value={authorId} onChange={setAuthorId} searchable />

  {/* Reviewer (YMYL) */}
  <AuthorSelect
    label="Reviewed by (Optional)"
    value={reviewerId}
    onChange={setReviewerId}
    searchable
    helperText="Bác sĩ/Chuyên gia kiểm duyệt (quan trọng cho YMYL)"
  />

  {/* Guest Author Toggle */}
  <Toggle
    label="Guest Author (Tác giả khách)"
    checked={isGuestAuthor}
    onChange={setIsGuestAuthor}
  />

  {isGuestAuthor && <GuestAuthorForm data={guestAuthor} onChange={setGuestAuthor} />}

  {/* Review Date */}
  <DatePicker label="Ngày kiểm duyệt" value={lastReviewedDate} onChange={setLastReviewedDate} />
</AuthorBoxWidget>
```

### 3. Frontend Author Box

**File:** `src/components/blog/AuthorBox.tsx`

```tsx
<AuthorBox author={author} variant="detailed">
  <div className="author-box">
    <Avatar src={author.avatar} size="lg" />

    <div className="author-info">
      <h3>{author.name}</h3>
      {author.credentials && <span className="credentials">{author.credentials}</span>}
      <p className="job-title">{author.jobTitle}</p>

      <p className="bio">{author.bio}</p>

      {/* Social Links */}
      <div className="social-links">
        {author.socialLinks?.linkedin && <a href={author.socialLinks.linkedin}>LinkedIn</a>}
        {/* ... more social links */}
      </div>

      {/* E-E-A-T Credentials Display */}
      {author.education && (
        <div className="credentials-box">
          <strong>Học vấn:</strong> {author.education}
        </div>
      )}

      {author.yearsOfExperience && (
        <div>
          <strong>Kinh nghiệm:</strong> {author.yearsOfExperience} năm
        </div>
      )}

      {/* View full profile link */}
      <a href={`/author/${author.slug}`}>Xem hồ sơ đầy đủ →</a>
    </div>
  </div>
</AuthorBox>;

{
  /* Reviewer Box (if exists) */
}
{
  reviewer && (
    <ReviewerBox reviewer={reviewer}>
      <p>
        ✓ Được kiểm duyệt bởi: <strong>{reviewer.name}</strong>
      </p>
      <p className="credentials">{reviewer.credentials}</p>
      <p className="date">Ngày kiểm duyệt: {lastReviewedDate}</p>
    </ReviewerBox>
  );
}
```

---

## 🌐 Frontend Pages

### 1. Author Archive Page

**File:** `src/app/author/[slug]/page.tsx`

```tsx
// Dynamic route: /author/john-doe
export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = await getAuthorBySlug(params.slug);
  const posts = await getPostsByAuthor(author.id);

  return (
    <>
      {/* SEO */}
      <AuthorSchemaMarkup author={author} />

      {/* Hero Section */}
      <AuthorHero author={author}>
        <Avatar size="2xl" />
        <h1>
          {author.name} {author.credentials}
        </h1>
        <p className="job">
          {author.jobTitle} at {author.company}
        </p>

        {/* E-E-A-T Display */}
        <CredentialsDisplay author={author} />

        <SocialLinks links={author.socialLinks} />
      </AuthorHero>

      {/* Full Bio */}
      <AuthorBio bio={author.bioFull} />

      {/* Expertise & Credentials */}
      <ExpertiseSection
        expertise={author.expertise}
        education={author.education}
        certifications={author.certifications}
        awards={author.awards}
      />

      {/* Posts Grid */}
      <AuthorPostsGrid posts={posts} title={`Bài viết của ${author.name}`} />
    </>
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}
```

### 2. Author API (Public)

**File:** `src/app/api/authors/[slug]/route.ts`

```typescript
// GET /api/authors/[slug]
// Public API to get author info
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const author = await getAuthorBySlug(params.slug);
  const postCount = await getPostCountByAuthor(author.id);

  return NextResponse.json({
    author,
    postCount,
  });
}
```

---

## 🔍 SEO Implementation

### 1. Schema.org/Person JSON-LD

**File:** `src/lib/seo/author-schema.ts`

```typescript
export function generateAuthorSchema(author: Author): AuthorSchemaOrg {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/author/${author.slug}`,
    image: author.avatar,
    description: author.bio,
    jobTitle: author.jobTitle,
    ...(author.company && {
      worksFor: {
        '@type': 'Organization',
        name: author.company,
      },
    }),
    ...(author.education && {
      alumniOf: author.education,
    }),
    ...(author.awards && {
      award: author.awards,
    }),
    ...(author.expertise && {
      knowsAbout: author.expertise,
    }),
    ...(author.credentials && {
      honorificPrefix: author.credentials.split(',')[0],
    }),
    sameAs: [
      author.socialLinks?.linkedin,
      author.socialLinks?.twitter,
      author.socialLinks?.facebook,
      author.socialLinks?.website,
    ].filter(Boolean) as string[],
  };
}
```

### 2. Post with Multiple Authors Schema

**File:** `src/lib/seo/post-schema.ts`

```typescript
export function generateArticleSchema(post: Post, author: Author, reviewer?: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: {
      '@type': 'Person',
      name: author.name,
      url: `/author/${author.slug}`,
    },
    // YMYL: Medical reviewer
    ...(reviewer && {
      reviewedBy: {
        '@type': 'Person',
        name: reviewer.name,
        url: `/author/${reviewer.slug}`,
        jobTitle: reviewer.jobTitle,
        credentials: reviewer.credentials,
      },
    }),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    // ... rest of article schema
  };
}
```

### 3. In Post Component

**File:** `src/app/(shop)/blog/[slug]/page.tsx`

```tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const author = await getAuthorById(post.authorInfo.authorId);
  const reviewer = post.authorInfo.reviewerId
    ? await getAuthorById(post.authorInfo.reviewerId)
    : null;

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(post, author, reviewer)),
        }}
      />

      {/* Post Header */}
      <article>
        <h1>{post.title}</h1>

        {/* Author Attribution */}
        <div className="post-meta">
          <span>
            Đăng bởi: <a href={`/author/${author.slug}`}>{author.name}</a>
          </span>
          {reviewer && (
            <span className="reviewer">
              ✓ Kiểm duyệt bởi: <strong>{reviewer.name}</strong> ({reviewer.credentials})
            </span>
          )}
          <time>Cập nhật: {formatDate(post.updatedAt)}</time>
        </div>

        {/* Post Content */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Author Box at bottom */}
        <AuthorBox author={author} variant="detailed" />

        {reviewer && <ReviewerBox reviewer={reviewer} />}
      </article>
    </>
  );
}
```

---

## 🎯 Quick Start Commands

### Setup Authors System

```bash
# 1. Create sample authors (optional)
npm run authors:create

# 2. Migrate existing posts to use authorInfo
npm run authors:migrate

# 3. Start dev server
npm run dev

# 4. Access admin panel
# http://localhost:3000/admin/authors
```

---

## 📋 Checklist for Dev

### Database

- [x] Tạo types cho Author
- [x] Tạo Zod schemas
- [x] Add `authors` collection vào getCollections()
- [x] Migration script to add authorInfo to existing posts
- [x] Sample authors creation script

### API (Admin)

- [x] POST /api/admin/authors (Create)
- [x] GET /api/admin/authors (List)
- [x] GET /api/admin/authors/[id] (Get one)
- [x] PATCH /api/admin/authors/[id] (Update)
- [x] DELETE /api/admin/authors/[id] (Delete)

### API (Public)

- [x] GET /api/authors/[slug] (Get author by slug)
- [x] GET /api/authors (List authors)
- [x] GET /api/authors/search (Autocomplete search)

### Admin UI

- [x] Page: /admin/authors (List)
- [x] Page: /admin/authors/new (Create form)
- [x] Page: /admin/authors/[id]/edit (Edit form)
- [x] Component: AuthorForm (reusable form)
- [x] Component: AuthorBoxWidget (for post editor sidebar)
- [x] Update post editor to include author selection

### Frontend

- [x] Page: /author/[slug] (Author archive)
- [x] Component: AuthorBox (detailed)
- [x] Component: ReviewerBox
- [x] Update blog post page to show author info
- [x] Add Schema.org/Person markup
- [x] Add author filter in blog archive

### Menu Integration

- [x] Add "Hồ sơ Tác giả" to admin menu under "Bài viết"

---

## 🎯 Next Steps (Priority Order)

### High Priority

1. **Add authors collection to db.ts**
2. **Create AuthorForm component** (complex form with all E-E-A-T fields)
3. **Create /admin/authors/new page**
4. **Update admin menu** (add Authors link)

### Medium Priority

5. **Create AuthorBoxWidget** for post editor
6. **Update post editor** to include author selection
7. **Create /author/[slug] page** (author archive)
8. **Create frontend AuthorBox component**

### Low Priority (Polish)

9. **Add Schema.org markup**
10. **Create migration script** for existing posts
11. **Add author filtering** in blog
12. **SEO optimization** for author pages

---

## 💡 Best Practices

### E-E-A-T Compliance

1. **Experience**:
   - Add `yearsOfExperience` field
   - Showcase real work history

2. **Expertise**:
   - List specific expertise areas
   - Add certifications
   - Link educational background

3. **Authoritativeness**:
   - Display credentials prominently
   - Show awards and recognition
   - Link to professional profiles (LinkedIn)

4. **Trustworthiness**:
   - Use real photos
   - Provide verifiable information
   - Link to social media
   - Add "Reviewed by" for YMYL content

### YMYL (Your Money Your Life) Content

For medical, financial, legal content:

- **MUST have** `reviewerId` (expert reviewer)
- **MUST display** reviewer credentials prominently
- **MUST show** last reviewed date
- **MUST use** Schema.org `reviewedBy` field

---

## 🎉 Expected Outcome

### User Benefits

✅ Separate author profiles from admin accounts  
✅ Guest authors without system access  
✅ Professional author pages for SEO  
✅ YMYL compliance with reviewer attribution  
✅ Rich E-E-A-T data for Google

### SEO Benefits

✅ Google recognizes authors as entities  
✅ Author pages get indexed  
✅ Rich snippets in search results  
✅ Improved E-E-A-T signals  
✅ Better rankings for expertise-based content

### Technical Benefits

✅ Clean separation of concerns  
✅ Flexible author management  
✅ Guest post support  
✅ Scalable schema design

---

**Status:** ✅ Phase 2 Complete (85%)  
**Next:** Post editor integration + Blog post display  
**Target:** Full E-E-A-T compliance for Google SEO - Production Ready!
