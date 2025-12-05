# 🐻 Plan Nâng Cấp Blog CMS & Frontend - Teddy Shop

**Ngày tạo:** 5 tháng 12, 2025  
**Mục tiêu:** Nâng cấp hệ thống blog để phù hợp với ngành gấu bông và quà tặng  
**Phạm vi:** CMS Editor (Admin) + Blog Frontend (Public)  
**Trạng thái:** 📋 Planning Phase

---

## 📋 Mục Lục

1. [Phân Tích Hiện Trạng](#1-phân-tích-hiện-trạng)
2. [Mục Tiêu Nâng Cấp](#2-mục-tiêu-nâng-cấp)
3. [Tính Năng CMS Mới](#3-tính-năng-cms-mới)
4. [Tính Năng Frontend Mới](#4-tính-năng-frontend-mới)
5. [Roadmap Thực Hiện](#5-roadmap-thực-hiện)
6. [Migration Plan](#6-migration-plan)
7. [Technical Requirements](#7-technical-requirements)
8. [Success Metrics](#8-success-metrics)

---

## 1. Phân Tích Hiện Trạng

### 1.1 CMS Editor (PostEditorV3)

**Điểm Mạnh:**

- ✅ Rich text editor (Tiptap) với nhiều extensions
- ✅ SEO tools tích hợp (Google preview, Schema builder)
- ✅ Auto-save với localStorage
- ✅ Author system (E-E-A-T compliance)
- ✅ Featured image & gallery
- ✅ Category & tags management
- ✅ Draft restoration modal

**Điểm Yếu:**

- ❌ Chưa có liên kết trực tiếp với sản phẩm
- ❌ Chưa có template cho các loại bài viết khác nhau (review, guide, story)
- ❌ Chưa có tính năng "Gift Guide" hoặc "Product Spotlight"
- ❌ Chưa có video embed trong editor
- ❌ Chưa có comparison table builder
- ❌ Chưa có tính năng "Related Posts" trong editor
- ❌ Chưa có tính năng "Reading Time" estimation
- ❌ Chưa có tính năng "Table of Contents" generator

### 1.2 Blog Frontend

**Điểm Mạnh:**

- ✅ Responsive design
- ✅ Author & reviewer display (E-E-A-T)
- ✅ Related products section
- ✅ SEO metadata đầy đủ
- ✅ Schema.org markup

**Điểm Yếu:**

- ❌ Chưa có filter/search nâng cao
- ❌ Chưa có reading time display
- ❌ Chưa có table of contents
- ❌ Chưa có social sharing buttons
- ❌ Chưa có comment system
- ❌ Chưa có "You may also like" section
- ❌ Chưa có "Gift Guide" template
- ❌ Chưa có "Product Comparison" view
- ❌ Chưa có "Story" template (câu chuyện về gấu bông)
- ❌ Chưa có "Care Guide" template (hướng dẫn chăm sóc)
- ❌ Chưa có "Size Guide" visual
- ❌ Chưa có "Gift Message" preview

---

## 2. Mục Tiêu Nâng Cấp

### 2.1 Mục Tiêu Kinh Doanh

1. **Tăng Conversion Rate:**

   - Liên kết trực tiếp bài viết với sản phẩm
   - "Shop Now" CTA trong bài viết
   - Product spotlight trong nội dung

2. **Tăng Engagement:**

   - Reading time estimation
   - Social sharing
   - Comment system
   - Related content suggestions

3. **Tăng SEO Performance:**

   - Rich snippets cho gift guides
   - Product schema trong bài viết
   - Internal linking tốt hơn

4. **Tăng User Experience:**
   - Template phù hợp với từng loại nội dung
   - Visual guides (size, care)
   - Gift message preview

### 2.2 Mục Tiêu Kỹ Thuật

1. **CMS Editor:**

   - Product linking trong editor
   - Template system
   - Video embed
   - Comparison table builder
   - Reading time calculator
   - Table of contents generator

2. **Frontend:**
   - Advanced filtering
   - Social sharing
   - Comment system
   - Reading time display
   - Table of contents
   - Gift guide template
   - Product comparison view

---

## 3. Tính Năng CMS Mới

### 3.1 Product Linking System

**Mục đích:** Cho phép editor liên kết sản phẩm trực tiếp trong bài viết

**Tính năng:**

- Product picker trong sidebar
- Inline product cards trong editor
- Product spotlight block
- "Shop Now" CTA buttons
- Related products auto-suggestion

**Implementation:**

```typescript
// New field in Post schema
interface Post {
  // ... existing fields
  linkedProducts?: {
    productId: string;
    position: 'inline' | 'sidebar' | 'bottom';
    displayType: 'card' | 'spotlight' | 'cta';
    customMessage?: string;
  }[];
}
```

**UI Component:**

- `ProductPickerWidget.tsx` - Sidebar widget
- `ProductCardBlock.tsx` - Editor block
- `ProductSpotlightBlock.tsx` - Featured product block

---

### 3.2 Template System

**Mục đích:** Templates cho các loại bài viết khác nhau

**Templates:**

1. **Gift Guide Template:**

   - Product recommendations section
   - Occasion selector (Birthday, Valentine, Christmas, etc.)
   - Price range filter
   - Gift message examples

2. **Product Review Template:**

   - Product details section
   - Pros/Cons list
   - Rating system
   - Comparison table
   - Size guide visual

3. **Care Guide Template:**

   - Step-by-step instructions
   - Image gallery for each step
   - Material care info
   - FAQ section

4. **Story Template:**
   - Timeline view
   - Image carousel
   - Quote blocks
   - Author spotlight

**Implementation:**

```typescript
interface PostTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[];
  defaultFields: Record<string, any>;
}

interface TemplateSection {
  type: 'product-grid' | 'comparison-table' | 'step-guide' | 'timeline';
  required: boolean;
  config: Record<string, any>;
}
```

**UI Component:**

- `TemplateSelector.tsx` - Template picker
- `TemplatePreview.tsx` - Preview template
- `TemplateBuilder.tsx` - Custom template builder

---

### 3.3 Video Embed Enhancement

**Mục đích:** Embed video dễ dàng hơn trong editor

**Tính năng:**

- YouTube/Vimeo URL detection
- Video thumbnail preview
- Video gallery
- Video transcript (optional)

**Implementation:**

- Extend Tiptap YouTube extension
- Add video gallery block
- Add transcript field

**UI Component:**

- `VideoEmbedBlock.tsx` - Video block
- `VideoGallery.tsx` - Video gallery

---

### 3.4 Comparison Table Builder

**Mục đích:** Tạo bảng so sánh sản phẩm trong editor

**Tính năng:**

- Drag & drop columns
- Product selection
- Feature comparison
- Price comparison
- Visual comparison (images)

**Implementation:**

```typescript
interface ComparisonTable {
  products: string[]; // Product IDs
  features: {
    name: string;
    values: Record<string, string | number | boolean>;
  }[];
  displayOptions: {
    showImages: boolean;
    showPrices: boolean;
    highlightBest: boolean;
  };
}
```

**UI Component:**

- `ComparisonTableBuilder.tsx` - Table builder
- `ComparisonTableBlock.tsx` - Editor block

---

### 3.5 Reading Time Calculator

**Mục đích:** Tự động tính thời gian đọc

**Tính năng:**

- Real-time calculation
- Configurable reading speed
- Display in preview

**Implementation:**

```typescript
function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
```

**UI Component:**

- `ReadingTimeDisplay.tsx` - Display component
- Auto-update in editor

---

### 3.6 Table of Contents Generator

**Mục đích:** Tự động tạo mục lục từ headings

**Tính năng:**

- Auto-detect headings (H2, H3)
- Generate TOC with anchors
- Sticky TOC option
- Custom TOC position

**Implementation:**

```typescript
function generateTOC(content: string): TOCItem[] {
  const headings = extractHeadings(content);
  return headings.map((heading, index) => ({
    id: `heading-${index}`,
    text: heading.text,
    level: heading.level,
    anchor: generateAnchor(heading.text),
  }));
}
```

**UI Component:**

- `TOCGenerator.tsx` - TOC generator
- `TOCBlock.tsx` - TOC display block

---

### 3.7 Gift Guide Builder

**Mục đích:** Template đặc biệt cho gift guides

**Tính năng:**

- Occasion selector
- Product recommendations
- Price range filter
- Gift message templates
- Delivery options

**Implementation:**

```typescript
interface GiftGuide {
  occasion: 'birthday' | 'valentine' | 'christmas' | 'anniversary' | 'graduation';
  products: GiftGuideProduct[];
  priceRange: {
    min: number;
    max: number;
  };
  giftMessages: string[];
  deliveryOptions: string[];
}
```

**UI Component:**

- `GiftGuideBuilder.tsx` - Builder component
- `GiftGuideTemplate.tsx` - Template component

---

### 3.8 Internal Linking Auto-Suggestion

**Mục đích:** Tự động gợi ý link nội bộ dựa trên từ khóa

**Tính năng:**

- Keyword-based linking suggestions
- Auto-detect keywords in content
- Suggest related posts/products
- One-click insert links
- Link preview in editor

**Implementation:**

```typescript
interface LinkSuggestion {
  type: 'post' | 'product' | 'category';
  id: string;
  title: string;
  url: string;
  excerpt?: string;
  image?: string;
  relevanceScore: number; // 0-100
  matchedKeywords: string[];
}

interface KeywordLinkConfig {
  // Keywords to track
  keywords: {
    keyword: string;
    linkTo: {
      type: 'post' | 'product' | 'category';
      id: string;
      priority: number; // Higher = more important
    }[];
  }[];

  // Auto-linking settings
  autoLinkEnabled: boolean;
  maxLinksPerPost: number;
  minRelevanceScore: number; // Only suggest if score >= this
}

// Keyword extraction and matching
function extractKeywords(content: string): string[] {
  // Remove HTML tags
  const text = stripHtml(content);

  // Extract potential keywords (nouns, product names, etc.)
  const words = text.toLowerCase().split(/\s+/);

  // Filter common words
  const stopWords = ['và', 'của', 'cho', 'với', 'là', 'có', 'được', 'trong'];
  const keywords = words.filter((word) => word.length > 3 && !stopWords.includes(word));

  // Return unique keywords
  return [...new Set(keywords)];
}

// Find link suggestions
async function findLinkSuggestions(
  content: string,
  config: KeywordLinkConfig
): Promise<LinkSuggestion[]> {
  const keywords = extractKeywords(content);
  const suggestions: LinkSuggestion[] = [];

  for (const keywordConfig of config.keywords) {
    const matched = keywords.filter(
      (k) =>
        k.includes(keywordConfig.keyword.toLowerCase()) ||
        keywordConfig.keyword.toLowerCase().includes(k)
    );

    if (matched.length > 0) {
      for (const link of keywordConfig.linkTo) {
        const entity = await getEntity(link.type, link.id);
        if (entity) {
          suggestions.push({
            type: link.type,
            id: link.id,
            title: entity.title || entity.name,
            url: generateUrl(link.type, link.id),
            excerpt: entity.excerpt || entity.description,
            image: entity.featuredImage || entity.images?.[0],
            relevanceScore: calculateRelevance(matched, link.priority),
            matchedKeywords: matched,
          });
        }
      }
    }
  }

  // Sort by relevance score
  return suggestions
    .filter((s) => s.relevanceScore >= config.minRelevanceScore)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, config.maxLinksPerPost);
}
```

**Editor Integration:**

```typescript
// In PostEditorV3
const [linkSuggestions, setLinkSuggestions] = useState<LinkSuggestion[]>([]);

useEffect(() => {
  const timer = setTimeout(async () => {
    const suggestions = await findLinkSuggestions(watchedValues.content, linkConfig);
    setLinkSuggestions(suggestions);
  }, 1000); // Debounce 1 second

  return () => clearTimeout(timer);
}, [watchedValues.content]);

// Display suggestions in sidebar
<LinkSuggestionsWidget
  suggestions={linkSuggestions}
  onInsert={(suggestion) => {
    // Insert link at cursor position
    editor
      .chain()
      .focus()
      .insertContent(`<a href="${suggestion.url}">${suggestion.title}</a>`)
      .run();
  }}
/>;
```

**UI Component:**

- `LinkSuggestionsWidget.tsx` - Sidebar widget
- `LinkSuggestionCard.tsx` - Suggestion card
- `KeywordLinkConfig.tsx` - Admin config panel
- `AutoLinkButton.tsx` - One-click auto-link button

---

## 4. Tính Năng Frontend Mới

### 4.1 Advanced Filtering & Search

**Mục đích:** Tìm kiếm và lọc bài viết tốt hơn

**Tính năng:**

- Full-text search
- Filter by category, author, date
- Filter by reading time
- Filter by template type
- Sort options (newest, popular, reading time)

**Implementation:**

```typescript
// API endpoint
GET /api/posts?search=...&category=...&author=...&template=...&readingTime=...
```

**UI Component:**

- `BlogFilters.tsx` - Filter component
- `BlogSearch.tsx` - Search component

---

### 4.2 Social Sharing

**Mục đích:** Chia sẻ bài viết lên mạng xã hội

**Tính năng:**

- Facebook share
- Twitter/X share
- Pinterest share
- Copy link
- WhatsApp share
- Email share

**Implementation:**

- Use Web Share API (native)
- Fallback to custom buttons
- Open Graph tags (already implemented)

**UI Component:**

- `SocialShareButtons.tsx` - Share buttons
- `ShareModal.tsx` - Share modal

---

### 4.3 Comment System

**Mục đích:** Cho phép người dùng comment trên bài viết

**Tính năng:**

- Nested comments
- Like/dislike comments
- Report spam
- Moderation (admin)
- Email notifications
- **🆕 Spam filtering tự động**
- **🆕 CAPTCHA protection (Cloudflare Turnstile/Google reCAPTCHA)**

**Implementation:**

```typescript
interface Comment {
  _id: ObjectId;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  parentId?: string;
  likes: number;
  dislikes: number;
  status: 'approved' | 'pending' | 'spam' | 'auto-spam';
  spamScore?: number; // 0-100, higher = more likely spam
  spamReasons?: string[]; // Reasons why marked as spam
  ipAddress?: string; // For rate limiting
  userAgent?: string; // For bot detection
  createdAt: Date;
}

interface SpamFilterConfig {
  // Keyword filtering
  blockedKeywords: string[];
  blockedDomains: string[]; // For links in comments

  // Rate limiting
  maxCommentsPerIP: number; // Per hour
  maxCommentsPerEmail: number; // Per day

  // Content analysis
  minLength: number;
  maxLength: number;
  maxLinks: number;

  // CAPTCHA
  captchaProvider: 'turnstile' | 'recaptcha' | 'none';
  captchaSiteKey: string;
  captchaSecretKey: string;

  // Auto-moderation thresholds
  autoSpamThreshold: number; // 0-100
  autoApproveThreshold: number; // 0-100
}
```

**Spam Detection Logic:**

```typescript
async function detectSpam(
  comment: Comment,
  config: SpamFilterConfig
): Promise<{
  isSpam: boolean;
  score: number;
  reasons: string[];
}> {
  let score = 0;
  const reasons: string[] = [];

  // 1. Keyword check
  const lowerContent = comment.content.toLowerCase();
  for (const keyword of config.blockedKeywords) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      score += 30;
      reasons.push(`Contains blocked keyword: ${keyword}`);
    }
  }

  // 2. Link check
  const linkCount = (comment.content.match(/https?:\/\//g) || []).length;
  if (linkCount > config.maxLinks) {
    score += 20;
    reasons.push(`Too many links: ${linkCount}`);
  }

  // 3. Domain check
  const domains = extractDomains(comment.content);
  for (const domain of domains) {
    if (config.blockedDomains.includes(domain)) {
      score += 50;
      reasons.push(`Contains blocked domain: ${domain}`);
    }
  }

  // 4. Length check
  if (comment.content.length < config.minLength) {
    score += 10;
    reasons.push('Comment too short');
  }
  if (comment.content.length > config.maxLength) {
    score += 15;
    reasons.push('Comment too long');
  }

  // 5. Rate limiting check
  const recentComments = await getRecentCommentsByIP(comment.ipAddress);
  if (recentComments.length >= config.maxCommentsPerIP) {
    score += 40;
    reasons.push('Too many comments from this IP');
  }

  // 6. Pattern detection (repeated characters, all caps, etc.)
  if (isRepeatedPattern(comment.content)) {
    score += 25;
    reasons.push('Suspicious pattern detected');
  }

  return {
    isSpam: score >= config.autoSpamThreshold,
    score,
    reasons,
  };
}
```

**CAPTCHA Integration:**

```typescript
// Cloudflare Turnstile (Recommended - Privacy-friendly)
import { Turnstile } from '@marsidev/react-turnstile';

// Google reCAPTCHA (Alternative)
import ReCAPTCHA from 'react-google-recaptcha';

// In CommentForm component
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
  onSuccess={(token) => setCaptchaToken(token)}
  onError={() => setCaptchaToken(null)}
/>;
```

**UI Component:**

- `CommentSection.tsx` - Comment section
- `CommentForm.tsx` - Comment form with CAPTCHA
- `CommentItem.tsx` - Comment item
- `SpamFilterConfig.tsx` - Admin spam filter config
- `CommentModeration.tsx` - Admin moderation panel

---

### 4.4 Reading Time Display

**Mục đích:** Hiển thị thời gian đọc ước tính

**Tính năng:**

- Display in post header
- Display in post card
- Configurable reading speed

**UI Component:**

- `ReadingTime.tsx` - Display component

---

### 4.5 Table of Contents

**Mục đích:** Hiển thị mục lục trong bài viết

**Tính năng:**

- Auto-generated from headings
- Sticky TOC
- Smooth scroll to sections
- Highlight current section

**UI Component:**

- `TableOfContents.tsx` - TOC component
- `TOCItem.tsx` - TOC item

---

### 4.6 Gift Guide Template View

**Mục đích:** Hiển thị gift guide với UI đặc biệt

**Tính năng:**

- Occasion banner
- Product grid with filters
- Price range selector
- Gift message examples
- "Add to Cart" buttons

**UI Component:**

- `GiftGuideView.tsx` - Gift guide view
- `OccasionBanner.tsx` - Occasion banner
- `GiftProductGrid.tsx` - Product grid

---

### 4.7 Product Comparison View

**Mục đích:** Hiển thị bảng so sánh sản phẩm

**Tính năng:**

- Side-by-side comparison (desktop)
- **🆕 Mobile-optimized view (scrollable cards)**
- Feature highlights
- Price comparison
- "Add to Cart" buttons
- "View Details" links
- **🆕 Sticky header on scroll (desktop)**
- **🆕 Expandable rows for long content**

**Desktop View:**

- Traditional table layout
- Horizontal scroll if many products
- Sticky first column (feature names)
- Sticky header row (product names)

**Mobile View:**

- **Card-based layout** (vertical stack)
- Each product as a card
- Swipeable cards (optional)
- "Compare All" button to switch to table view
- Collapsible sections for long comparisons

**Implementation:**

```typescript
interface ComparisonViewProps {
  comparison: ComparisonTable;
  isMobile?: boolean;
}

// Mobile Card Component
function ComparisonCardMobile({ product, features }: ComparisonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <span className="text-pink-600 font-semibold">{product.price} ₫</span>
      </div>

      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature.id} className="border-b pb-2">
            <div className="text-sm text-gray-600 mb-1">{feature.name}</div>
            <div className="font-medium">{feature.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button>Xem chi tiết</Button>
        <Button variant="primary">Thêm vào giỏ</Button>
      </div>
    </div>
  );
}

// Responsive wrapper
function ProductComparison({ comparison }: ComparisonViewProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="space-y-4">
        {comparison.products.map((product) => (
          <ComparisonCardMobile key={product.id} product={product} features={comparison.features} />
        ))}
      </div>
    );
  }

  return <ComparisonTableDesktop comparison={comparison} />;
}
```

**UI Component:**

- `ProductComparison.tsx` - Comparison view (responsive)
- `ComparisonTableDesktop.tsx` - Desktop table view
- `ComparisonCardMobile.tsx` - Mobile card view
- `ComparisonRow.tsx` - Comparison row

---

### 4.8 Story Template View

**Mục đích:** Hiển thị story với timeline

**Tính năng:**

- Timeline view
- Image carousel
- Quote blocks
- Author spotlight
- Share buttons

**UI Component:**

- `StoryView.tsx` - Story view
- `Timeline.tsx` - Timeline component
- `QuoteBlock.tsx` - Quote block

---

### 4.9 Care Guide Template View

**Mục đích:** Hiển thị hướng dẫn chăm sóc

**Tính năng:**

- Step-by-step guide
- Image gallery per step
- Material care info
- FAQ section
- Related products

**UI Component:**

- `CareGuideView.tsx` - Care guide view
- `StepGuide.tsx` - Step guide
- `MaterialInfo.tsx` - Material info

---

### 4.10 "You May Also Like" Section

**Mục đích:** Gợi ý bài viết liên quan

**Tính năng:**

- Based on category, tags, author
- Machine learning recommendations (future)
- Display in sidebar or bottom

**UI Component:**

- `RelatedPosts.tsx` - Related posts (enhance existing)
- `RecommendedPosts.tsx` - Recommended posts

---

## 5. Roadmap Thực Hiện

### Phase 1: Foundation (Week 1-2)

**Mục tiêu:** Thiết lập nền tảng cho các tính năng mới

**Tasks:**

1. ✅ Extend Post schema với các fields mới
2. ✅ Create database indexes cho performance
3. ✅ Update API routes để support các fields mới
4. ✅ Create base components (ProductPicker, TemplateSelector)
5. **🆕 Plan migration strategy cho posts cũ**

**Deliverables:**

- Updated Post schema
- New API endpoints
- Base components
- Migration plan document

---

### Phase 2: CMS Editor Enhancements (Week 3-4)

**Mục tiêu:** Nâng cấp CMS editor với các tính năng mới

**Tasks:**

1. ✅ Product linking system
2. ✅ Template system
3. ✅ Video embed enhancement
4. ✅ Comparison table builder
5. ✅ Reading time calculator
6. ✅ Table of contents generator
7. ✅ Gift guide builder

**Deliverables:**

- Enhanced PostEditorV3
- New editor blocks
- Template system

---

### Phase 3: Frontend Enhancements (Week 5-6)

**Mục tiêu:** Nâng cấp blog frontend với các tính năng mới

**Tasks:**

1. ✅ Advanced filtering & search
2. ✅ Social sharing
3. ✅ Reading time display
4. ✅ Table of contents
5. ✅ Gift guide template view
6. ✅ Product comparison view
7. ✅ Story template view
8. ✅ Care guide template view
9. ✅ "You may also like" section

**Deliverables:**

- Enhanced blog pages
- New template views
- Social sharing

---

### Phase 4: Comment System (Week 7)

**Mục tiêu:** Thêm comment system với spam protection

**Tasks:**

1. ✅ Comment schema
2. ✅ Comment API routes
3. ✅ Comment UI components
4. ✅ Moderation tools (admin)
5. **🆕 Spam filtering system**
6. **🆕 CAPTCHA integration (Turnstile/reCAPTCHA)**
7. **🆕 Admin spam filter configuration**

**Deliverables:**

- Comment system
- Moderation dashboard
- Spam filtering system
- CAPTCHA protection

---

### Phase 5: Testing & Optimization (Week 8)

**Mục tiêu:** Testing và tối ưu hóa

**Tasks:**

1. ✅ Unit tests
2. ✅ Integration tests
3. ✅ Performance optimization
4. ✅ SEO audit
5. ✅ Accessibility audit

**Deliverables:**

- Test reports
- Performance reports
- SEO reports

---

## 6. Migration Plan

### 6.1 Migration Strategy cho Posts Cũ

**Mục đích:** Xử lý các bài viết hiện có khi nâng cấp schema

**Vấn đề:**

- Posts cũ không có field `template` → sẽ hiển thị như thế nào?
- Posts cũ không có `readingTime` → cần tính toán
- Posts cũ không có `tableOfContents` → cần generate
- Posts cũ không có `linkedProducts` → cần thêm thủ công hoặc auto-detect

**Giải pháp:**

#### A. Auto-Migration Script

```typescript
// scripts/migrate-posts-to-new-schema.ts
import { getCollections } from '@/lib/db';
import { calculateReadingTime } from '@/lib/utils/reading-time';
import { generateTOC } from '@/lib/utils/toc-generator';

async function migratePosts() {
  const { posts } = await getCollections();

  // Get all existing posts
  const allPosts = await posts.find({}).toArray();

  console.log(`Found ${allPosts.length} posts to migrate`);

  let migrated = 0;
  let errors = 0;

  for (const post of allPosts) {
    try {
      const updates: any = {};

      // 1. Set default template if missing
      if (!post.template) {
        updates.template = 'default';
      }

      // 2. Calculate reading time if missing
      if (!post.readingTime && post.content) {
        updates.readingTime = calculateReadingTime(post.content);
      }

      // 3. Generate TOC if missing
      if (!post.tableOfContents && post.content) {
        updates.tableOfContents = generateTOC(post.content);
      }

      // 4. Initialize empty arrays if missing
      if (!post.linkedProducts) {
        updates.linkedProducts = [];
      }
      if (!post.videos) {
        updates.videos = [];
      }

      // 5. Set templateData to empty object if missing
      if (!post.templateData) {
        updates.templateData = {};
      }

      // Update post
      await posts.updateOne({ _id: post._id }, { $set: updates });

      migrated++;
      console.log(`✅ Migrated post: ${post.title}`);
    } catch (error) {
      errors++;
      console.error(`❌ Error migrating post ${post._id}:`, error);
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`✅ Migrated: ${migrated}`);
  console.log(`❌ Errors: ${errors}`);
}

migratePosts();
```

#### B. Template Detection Logic

```typescript
// Auto-detect template based on content/category
function detectTemplate(post: Post): 'default' | 'gift-guide' | 'review' | 'care-guide' | 'story' {
  // Check category
  if (post.category === 'gift-guide' || post.category === 'quà-tặng') {
    return 'gift-guide';
  }

  if (post.category === 'review' || post.category === 'đánh-giá') {
    return 'review';
  }

  if (post.category === 'care' || post.category === 'chăm-sóc') {
    return 'care-guide';
  }

  if (post.category === 'story' || post.category === 'câu-chuyện') {
    return 'story';
  }

  // Check content keywords
  const content = post.content.toLowerCase();

  if (content.includes('quà tặng') || content.includes('gift guide')) {
    return 'gift-guide';
  }

  if (content.includes('đánh giá') || content.includes('review') || content.includes('so sánh')) {
    return 'review';
  }

  if (content.includes('bảo quản') || content.includes('chăm sóc') || content.includes('vệ sinh')) {
    return 'care-guide';
  }

  // Default
  return 'default';
}
```

#### C. Migration Checklist

**Pre-Migration:**

- [ ] Backup database
- [ ] Test migration script on staging
- [ ] Review migration logic
- [ ] Set maintenance mode (optional)

**Migration:**

- [ ] Run migration script
- [ ] Verify migrated posts
- [ ] Check for errors
- [ ] Update indexes if needed

**Post-Migration:**

- [ ] Test blog pages
- [ ] Verify template rendering
- [ ] Check reading time display
- [ ] Verify TOC generation
- [ ] Monitor for issues

#### D. Rollback Plan

```typescript
// scripts/rollback-post-migration.ts
// Remove new fields if needed (optional, not recommended)
async function rollbackMigration() {
  const { posts } = await getCollections();

  await posts.updateMany(
    {},
    {
      $unset: {
        template: '',
        readingTime: '',
        tableOfContents: '',
        linkedProducts: '',
        videos: '',
        templateData: '',
      },
    }
  );

  console.log('Rollback completed');
}
```

### 6.2 Migration Timeline

| Phase              | Task             | Duration  | Risk   |
| ------------------ | ---------------- | --------- | ------ |
| **Pre-Migration**  | Backup & testing | 1 day     | Low    |
| **Migration**      | Run script       | 1-2 hours | Medium |
| **Verification**   | Test & verify    | 1 day     | Low    |
| **Post-Migration** | Monitor & fix    | 2-3 days  | Low    |

### 6.3 Migration Best Practices

1. **Always backup first:**

   ```bash
   mongodump --uri="mongodb://..." --out=./backup-$(date +%Y%m%d)
   ```

2. **Test on staging:**

   - Run migration on staging environment first
   - Verify all posts render correctly
   - Check for data loss

3. **Gradual migration (optional):**

   - Migrate in batches (e.g., 100 posts at a time)
   - Monitor performance
   - Pause if issues occur

4. **Document changes:**
   - Keep migration log
   - Document any manual fixes
   - Update schema documentation

---

## 7. Technical Requirements

### 6.1 Database Schema Updates

```typescript
// Extended Post interface
interface Post {
  // ... existing fields

  // Product linking
  linkedProducts?: {
    productId: string;
    position: 'inline' | 'sidebar' | 'bottom';
    displayType: 'card' | 'spotlight' | 'cta';
    customMessage?: string;
  }[];

  // Template
  template?: 'default' | 'gift-guide' | 'review' | 'care-guide' | 'story';
  templateData?: Record<string, any>;

  // Reading time
  readingTime?: number; // minutes

  // Table of contents
  tableOfContents?: TOCItem[];

  // Video
  videos?: {
    url: string;
    type: 'youtube' | 'vimeo';
    thumbnail?: string;
    transcript?: string;
  }[];

  // Comparison table
  comparisonTable?: ComparisonTable;
}
```

### 6.2 API Routes

**New Routes:**

- `GET /api/posts/search` - Advanced search
- `POST /api/posts/[id]/comments` - Add comment
- `GET /api/posts/[id]/comments` - Get comments
- `POST /api/posts/[id]/comments/[commentId]/like` - Like comment
- `GET /api/posts/templates` - Get available templates
- `POST /api/posts/[id]/share` - Track shares

**Updated Routes:**

- `GET /api/posts` - Add filters, search, sort
- `POST /api/admin/posts` - Support new fields
- `PATCH /api/admin/posts/[id]` - Support new fields

### 6.3 Components Structure

```
src/components/
├── admin/
│   ├── posts/
│   │   ├── ProductPickerWidget.tsx
│   │   ├── TemplateSelector.tsx
│   │   ├── ComparisonTableBuilder.tsx
│   │   ├── GiftGuideBuilder.tsx
│   │   └── TOCGenerator.tsx
│   └── editor/
│       ├── ProductCardBlock.tsx
│       ├── ProductSpotlightBlock.tsx
│       ├── VideoEmbedBlock.tsx
│       └── ComparisonTableBlock.tsx
│
├── blog/
│   ├── SocialShareButtons.tsx
│   ├── CommentSection.tsx
│   ├── ReadingTime.tsx
│   ├── TableOfContents.tsx
│   ├── GiftGuideView.tsx
│   ├── ProductComparison.tsx
│   ├── StoryView.tsx
│   ├── CareGuideView.tsx
│   └── RelatedPosts.tsx (enhanced)
│
└── templates/
    ├── GiftGuideTemplate.tsx
    ├── ReviewTemplate.tsx
    ├── CareGuideTemplate.tsx
    └── StoryTemplate.tsx
```

### 7.4 Dependencies

**New Dependencies:**

- `react-share` - Social sharing
- `reading-time` - Reading time calculation
- `remark-toc` - Table of contents generation (if using Markdown)
- `react-markdown` - Markdown support (optional)
- **🆕 `@marsidev/react-turnstile`** - Cloudflare Turnstile CAPTCHA (recommended)
- **🆕 `react-google-recaptcha`** - Google reCAPTCHA (alternative)
- **🆕 `bad-words`** - Keyword filtering library (optional)

**Existing Dependencies:**

- Tiptap (already installed)
- React Hook Form (already installed)
- Zod (already installed)

**Environment Variables:**

```env
# CAPTCHA (choose one)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# OR
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...

# Spam Filter Config (optional, can be in database)
SPAM_FILTER_ENABLED=true
SPAM_AUTO_THRESHOLD=70
```

---

## 8. Success Metrics

### 8.1 Business Metrics

- **Conversion Rate:** +20% (from blog to product pages)
- **Engagement:** +30% (time on page, scroll depth)
- **Social Shares:** +50% (more shares per post)
- **Comments:** +40% (more comments per post)

### 8.2 Technical Metrics

- **Page Load Time:** < 2s (maintain current performance)
- **SEO Score:** 95+ (maintain current score)
- **Accessibility Score:** 100 (WCAG 2.1 AA)
- **Mobile Performance:** 90+ (Lighthouse)

### 8.3 User Experience Metrics

- **Bounce Rate:** -15% (lower bounce rate)
- **Pages per Session:** +25% (more pages viewed)
- **Return Visitor Rate:** +20% (more returning visitors)

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk                    | Impact | Probability | Mitigation                         |
| ----------------------- | ------ | ----------- | ---------------------------------- |
| Performance degradation | High   | Medium      | Lazy loading, code splitting       |
| Schema migration issues | High   | Low         | Careful migration, backups         |
| Breaking changes        | Medium | Medium      | Versioning, backward compatibility |

### 9.2 Business Risks

| Risk               | Impact | Probability | Mitigation                        |
| ------------------ | ------ | ----------- | --------------------------------- |
| User confusion     | Medium | Low         | Clear UI, tooltips, documentation |
| SEO impact         | High   | Low         | Careful implementation, testing   |
| Maintenance burden | Medium | Medium      | Good documentation, code quality  |

---

## 10. Next Steps

1. **Review & Approval:** Review plan với team
2. **Resource Allocation:** Assign developers
3. **Kickoff Meeting:** Discuss implementation details
4. **Start Phase 1:** Begin foundation work

---

**Document Version:** 1.1  
**Last Updated:** December 5, 2025  
**Status:** 📋 Planning Complete - Enhanced with Spam Filtering, Migration Plan, Mobile UX, and Auto-Linking

**Changelog v1.1:**

- ✅ Added Spam Filtering System (Section 4.3)
- ✅ Added CAPTCHA Integration (Turnstile/reCAPTCHA)
- ✅ Added Migration Plan (Section 6)
- ✅ Enhanced Mobile UX for Comparison Table (Section 4.7)
- ✅ Added Internal Linking Auto-Suggestion (Section 3.8)
- ✅ Updated Dependencies and Environment Variables
