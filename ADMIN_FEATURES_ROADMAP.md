# 🚀 Kế Hoạch Triển Khai Tính Năng Admin CMS

> **Trạng thái:** Đã hoàn thành Phase 1-5 (WordPress-style Editor & Sidebar)  
> **Tiếp theo:** Triển khai các trang còn thiếu trong sidebar menu

---

## ✅ Đã Hoàn Thành

### Phase 1-5: Core Infrastructure
- ✅ WordPress-style Rich Text Editor (Tiptap)
- ✅ SEO Schema Builder
- ✅ Media Upload & Gallery
- ✅ WordPress-style Sidebar Menu (hover flyout + click-to-pin)
- ✅ Badge notifications (messages, comments, orders)
- ✅ Mobile responsive sidebar (hamburger menu)
- ✅ Filter, Draft, Trash functionality cho Posts & Products
- ✅ Status tabs, bulk actions, pagination
- ✅ Fixed scrollbar issues in sidebar

---

## 🎯 Phase 6: Media Management (Ưu tiên cao)

### 6.1 Media Library Page (`/admin/media`)
**File:** `src/app/admin/media/page.tsx`

**Tính năng:**
- [ ] Grid view / List view toggle
- [ ] Upload multiple files (drag & drop)
- [ ] Filter by type (images, videos, documents)
- [ ] Search by filename
- [ ] Bulk actions (delete, download)
- [ ] Image preview modal
- [ ] Edit image metadata (alt text, caption, description)
- [ ] Copy URL to clipboard
- [ ] Storage usage indicator

**Components cần tạo:**
```
src/components/admin/media/
├── MediaGrid.tsx          # Grid layout
├── MediaListView.tsx      # List layout
├── MediaUploader.tsx      # Drag & drop uploader
├── MediaPreviewModal.tsx  # Preview & edit modal
├── MediaFilterBar.tsx     # Filter controls
└── StorageIndicator.tsx   # Storage usage bar
```

**API Endpoints:**
- `GET /api/admin/media` - List all media
- `POST /api/admin/media` - Upload files
- `PATCH /api/admin/media/[id]` - Update metadata
- `DELETE /api/admin/media/[id]` - Delete file

**Thời gian:** 2-3 ngày

---

## 🎯 Phase 7: Pages Management (Ưu tiên cao)

### 7.1 Pages List (`/admin/pages`)
**File:** `src/app/admin/pages/page.tsx`

**Tính năng:**
- [ ] List all pages (similar to posts)
- [ ] Status tabs (All, Published, Draft, Trash)
- [ ] Bulk actions
- [ ] Hierarchical page structure (parent/child)
- [ ] Page templates selector
- [ ] Reorder pages (drag & drop)

### 7.2 Add/Edit Page (`/admin/pages/new`, `/admin/pages/[id]`)
**File:** `src/app/admin/pages/new/page.tsx`

**Tính năng:**
- [ ] Reuse `RichTextEditor` component
- [ ] Page attributes sidebar:
  - Parent page selector
  - Template selector
  - Order/position
  - Featured image
- [ ] SEO settings
- [ ] Custom CSS/JS per page

**Components:**
```
src/components/admin/pages/
├── PageEditor.tsx         # Main editor (reuse EditorLayout)
├── PageAttributesBox.tsx  # Parent, template, order
├── PageTemplateSelector.tsx
└── PageHierarchyTree.tsx  # Visual tree view
```

**Database Schema:**
```prisma
model Page {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?
  status      String   @default("draft")
  parentId    String?
  parent      Page?    @relation("PageHierarchy", fields: [parentId], references: [id])
  children    Page[]   @relation("PageHierarchy")
  template    String   @default("default")
  order       Int      @default(0)
  seoTitle    String?
  seoDescription String?
  featuredImage String?
  customCSS   String?  @db.Text
  customJS    String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Thời gian:** 3-4 ngày

---

## 🎯 Phase 8: Comments System (Ưu tiên trung bình)

### 8.1 Comments List (`/admin/comments`)
**File:** `src/app/admin/comments/page.tsx`

**Tính năng:**
- [ ] Status tabs (All, Pending, Approved, Spam, Trash)
- [ ] Filter by post/product
- [ ] Quick actions (approve, spam, trash, reply)
- [ ] Bulk moderation
- [ ] Comment thread view (parent/child)
- [ ] Real-time badge count updates

### 8.2 Comment Moderation
**Components:**
```
src/components/admin/comments/
├── CommentList.tsx
├── CommentItem.tsx        # Single comment with actions
├── CommentReplyModal.tsx  # Quick reply
├── CommentThread.tsx      # Nested comments
└── CommentFilterBar.tsx
```

**Database Schema:**
```prisma
model Comment {
  id          String   @id @default(cuid())
  content     String   @db.Text
  authorName  String
  authorEmail String
  authorIP    String?
  status      String   @default("pending") // pending, approved, spam, trash
  postId      String?
  productId   String?
  post        Post?    @relation(fields: [postId], references: [id])
  product     Product? @relation(fields: [productId], references: [id])
  parentId    String?
  parent      Comment? @relation("CommentThread", fields: [parentId], references: [id])
  replies     Comment[] @relation("CommentThread")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**API Endpoints:**
- `GET /api/admin/comments` - List with filters
- `PATCH /api/admin/comments/[id]` - Update status
- `POST /api/admin/comments/[id]/reply` - Reply to comment
- `DELETE /api/admin/comments/[id]` - Delete

**Thời gian:** 2-3 ngày

---

## 🎯 Phase 9: Payments & Transactions (Ưu tiên trung bình)

### 9.1 Transactions List (`/admin/payments`)
**File:** `src/app/admin/payments/page.tsx`

**Tính năng:**
- [ ] List all transactions
- [ ] Filter by status (pending, completed, failed, refunded)
- [ ] Filter by payment method
- [ ] Date range filter
- [ ] Export to CSV/Excel
- [ ] Transaction details modal
- [ ] Refund functionality

### 9.2 Payment Gateways (`/admin/payments/gateways`)
**Tính năng:**
- [ ] List available gateways (VNPay, MoMo, PayPal, Stripe)
- [ ] Enable/disable gateways
- [ ] Configure API keys
- [ ] Test mode toggle
- [ ] Webhook logs

**Components:**
```
src/components/admin/payments/
├── TransactionList.tsx
├── TransactionDetails.tsx
├── RefundModal.tsx
├── GatewayCard.tsx        # Gateway config card
├── GatewayConfigForm.tsx  # API keys, settings
└── WebhookLogViewer.tsx
```

**Database Schema:**
```prisma
model Transaction {
  id              String   @id @default(cuid())
  orderId         String
  order           Order    @relation(fields: [orderId], references: [id])
  amount          Float
  currency        String   @default("VND")
  status          String   // pending, completed, failed, refunded
  paymentMethod   String   // vnpay, momo, paypal, stripe
  gatewayTxnId    String?  // External transaction ID
  gatewayResponse Json?    // Raw response from gateway
  refundAmount    Float?
  refundReason    String?
  refundedAt      DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PaymentGateway {
  id          String   @id @default(cuid())
  name        String   // vnpay, momo, paypal, stripe
  enabled     Boolean  @default(false)
  testMode    Boolean  @default(true)
  config      Json     // API keys, secrets, etc.
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Thời gian:** 3-4 ngày

---

## 🎯 Phase 10: Analytics Dashboard (Ưu tiên trung bình)

### 10.1 Overview Dashboard (`/admin/analytics`)
**File:** `src/app/admin/analytics/page.tsx`

**Tính năng:**
- [ ] Revenue chart (daily, weekly, monthly)
- [ ] Orders statistics
- [ ] Top selling products
- [ ] Traffic sources
- [ ] Conversion rate
- [ ] Customer demographics
- [ ] Date range picker
- [ ] Export reports

### 10.2 Sales Reports (`/admin/analytics/sales`)
**Tính năng:**
- [ ] Revenue breakdown by product/category
- [ ] Sales trends
- [ ] Profit margins
- [ ] Discount usage
- [ ] Tax reports

### 10.3 Customer Analytics (`/admin/analytics/customers`)
**Tính năng:**
- [ ] New vs returning customers
- [ ] Customer lifetime value
- [ ] Purchase frequency
- [ ] Geographic distribution
- [ ] Customer segments

**Components:**
```
src/components/admin/analytics/
├── RevenueChart.tsx       # Line/bar chart
├── StatsCard.tsx          # Metric cards
├── TopProductsTable.tsx
├── TrafficSourcesPie.tsx
├── ConversionFunnel.tsx
├── DateRangePicker.tsx
└── ExportButton.tsx
```

**Libraries:**
- `recharts` or `chart.js` for charts
- `date-fns` for date manipulation
- `react-to-print` for PDF export

**Thời gian:** 4-5 ngày

---

## 🎯 Phase 11: Marketing Tools (Ưu tiên thấp)

### 11.1 Campaigns (`/admin/marketing/campaigns`)
**Tính năng:**
- [ ] Create marketing campaigns
- [ ] Track campaign performance
- [ ] A/B testing
- [ ] UTM parameter generator

### 11.2 Email Marketing (`/admin/marketing/emails`)
**Tính năng:**
- [ ] Email template builder
- [ ] Subscriber list management
- [ ] Send bulk emails
- [ ] Email analytics (open rate, click rate)

### 11.3 Coupons (`/admin/marketing/coupons`)
**Tính năng:**
- [ ] Create discount codes
- [ ] Usage limits
- [ ] Expiration dates
- [ ] Coupon performance tracking

### 11.4 Promotions (`/admin/marketing/promotions`)
**Tính năng:**
- [ ] Flash sales
- [ ] Bundle deals
- [ ] Free shipping rules
- [ ] Loyalty programs

**Database Schema:**
```prisma
model Coupon {
  id              String   @id @default(cuid())
  code            String   @unique
  type            String   // percentage, fixed_amount, free_shipping
  value           Float
  minPurchase     Float?
  maxDiscount     Float?
  usageLimit      Int?
  usageCount      Int      @default(0)
  perUserLimit    Int?
  validFrom       DateTime
  validTo         DateTime
  status          String   @default("active")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model EmailCampaign {
  id          String   @id @default(cuid())
  name        String
  subject     String
  content     String   @db.Text
  recipients  Json     // Array of emails or segment criteria
  status      String   @default("draft") // draft, scheduled, sent
  scheduledAt DateTime?
  sentAt      DateTime?
  openRate    Float?
  clickRate   Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Thời gian:** 5-6 ngày

---

## 🎯 Phase 12: SEO Tools (Ưu tiên trung bình)

### 12.1 SEO Overview (`/admin/seo`)
**Tính năng:**
- [ ] Site-wide SEO score
- [ ] Meta tags checker
- [ ] Broken links detector
- [ ] Image alt text audit
- [ ] Page speed insights

### 12.2 Keywords (`/admin/seo/keywords`)
**Tính năng:**
- [ ] Keyword research tool
- [ ] Ranking tracker
- [ ] Competitor analysis
- [ ] Keyword suggestions

### 12.3 Redirects (`/admin/seo/redirects`)
**Tính năng:**
- [ ] 301/302 redirect manager
- [ ] Import/export redirects
- [ ] Redirect logs
- [ ] Auto-redirect for deleted pages

### 12.4 Sitemap (`/admin/seo/sitemap`)
**Tính năng:**
- [ ] Auto-generate XML sitemap
- [ ] Submit to Google Search Console
- [ ] Exclude pages from sitemap
- [ ] Sitemap preview

**Database Schema:**
```prisma
model Redirect {
  id          String   @id @default(cuid())
  fromPath    String   @unique
  toPath      String
  type        Int      @default(301) // 301 or 302
  hits        Int      @default(0)
  enabled     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SeoKeyword {
  id          String   @id @default(cuid())
  keyword     String
  postId      String?
  productId   String?
  post        Post?    @relation(fields: [postId], references: [id])
  product     Product? @relation(fields: [productId], references: [id])
  ranking     Int?
  searchVolume Int?
  difficulty  Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Thời gian:** 3-4 ngày

---

## 🎯 Phase 13: Appearance Customization (Ưu tiên thấp)

### 13.1 Theme Customizer (`/admin/appearance/customize`)
**Tính năng:**
- [ ] Live preview
- [ ] Color scheme picker
- [ ] Typography settings
- [ ] Logo upload
- [ ] Favicon upload
- [ ] Custom CSS editor

### 13.2 Widgets (`/admin/appearance/widgets`)
**Tính năng:**
- [ ] Drag & drop widget areas
- [ ] Available widgets (search, categories, recent posts, etc.)
- [ ] Widget settings

### 13.3 Menu Builder (`/admin/settings/navigation`)
**Tính năng:**
- [ ] Drag & drop menu builder
- [ ] Multi-level menus
- [ ] Custom links
- [ ] Menu locations (header, footer, mobile)

### 13.4 Background (`/admin/appearance/background`)
**Tính năng:**
- [ ] Upload background image
- [ ] Background color picker
- [ ] Pattern library
- [ ] Parallax effects

**Components:**
```
src/components/admin/appearance/
├── ThemeCustomizer.tsx
├── ColorPicker.tsx
├── TypographySettings.tsx
├── WidgetArea.tsx
├── WidgetLibrary.tsx
├── MenuBuilder.tsx
└── BackgroundUploader.tsx
```

**Thời gian:** 4-5 ngày

---

## 📊 Tổng Kết Thời Gian Ước Tính

| Phase | Tính năng | Thời gian | Ưu tiên |
|-------|-----------|-----------|---------|
| Phase 6 | Media Management | 2-3 ngày | 🔴 Cao |
| Phase 7 | Pages Management | 3-4 ngày | 🔴 Cao |
| Phase 8 | Comments System | 2-3 ngày | 🟡 Trung bình |
| Phase 9 | Payments & Transactions | 3-4 ngày | 🟡 Trung bình |
| Phase 10 | Analytics Dashboard | 4-5 ngày | 🟡 Trung bình |
| Phase 11 | Marketing Tools | 5-6 ngày | 🟢 Thấp |
| Phase 12 | SEO Tools | 3-4 ngày | 🟡 Trung bình |
| Phase 13 | Appearance Customization | 4-5 ngày | 🟢 Thấp |

**Tổng thời gian:** 26-34 ngày (khoảng 5-7 tuần)

---

## 🎯 Đề Xuất Lộ Trình

### Sprint 1 (Tuần 1-2): Core Content Management
1. **Media Management** (Phase 6)
2. **Pages Management** (Phase 7)

### Sprint 2 (Tuần 3-4): User Engagement
3. **Comments System** (Phase 8)
4. **SEO Tools** (Phase 12)

### Sprint 3 (Tuần 5-6): E-commerce Enhancement
5. **Payments & Transactions** (Phase 9)
6. **Analytics Dashboard** (Phase 10)

### Sprint 4 (Tuần 7+): Advanced Features
7. **Marketing Tools** (Phase 11)
8. **Appearance Customization** (Phase 13)

---

## 🔧 Technical Stack

### Frontend
- **React 19** + **Next.js 15**
- **TypeScript**
- **Tailwind CSS**
- **Tiptap** (Rich text editor)
- **Recharts** (Analytics charts)
- **React Hook Form** + **Zod** (Form validation)
- **SWR** or **React Query** (Data fetching)

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL** (hoặc MySQL)
- **NextAuth.js** (Authentication)
- **Vercel Blob Storage** (Media files)

### External Services
- **VNPay/MoMo** (Payment gateways)
- **Resend** or **SendGrid** (Email)
- **Google Analytics** (Tracking)
- **Google Search Console** (SEO)

---

## 📝 Notes

### Reusable Components
Tận dụng các components đã có:
- ✅ `RichTextEditor` - Dùng cho Pages, Email templates
- ✅ `EditorLayout` - Dùng cho tất cả editor pages
- ✅ `StatusTabs` - Dùng cho Comments, Media, Pages
- ✅ `BulkActions` - Dùng cho tất cả list pages
- ✅ `FilterBar` - Dùng cho tất cả list pages
- ✅ `Pagination` - Dùng cho tất cả list pages

### Database Migrations
Mỗi phase cần:
1. Tạo Prisma schema
2. Generate migration
3. Seed initial data (nếu cần)

### Testing Strategy
- Unit tests cho utility functions
- Integration tests cho API endpoints
- E2E tests cho critical flows (checkout, order management)

### Performance Optimization
- Lazy load components
- Image optimization (Next.js Image)
- API response caching
- Database query optimization (indexes)

---

## 🚀 Bắt Đầu

**Để bắt đầu Phase 6 (Media Management), chạy:**
```bash
# Tạo database schema
npx prisma migrate dev --name add_media_table

# Tạo component structure
mkdir -p src/components/admin/media
mkdir -p src/app/admin/media/upload

# Tạo API endpoints
mkdir -p src/app/api/admin/media
```

**Hoặc yêu cầu AI:**
> "Hãy triển khai Phase 6: Media Management theo roadmap"

---

**Cập nhật:** 2025-12-03  
**Trạng thái:** 🟢 Sẵn sàng triển khai

