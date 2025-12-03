# 🧪 Testing Checklist - Teddy Shop Admin

## Pre-Testing Setup

### 1. Environment Check
- [ ] MongoDB connection working
- [ ] `.env` file configured correctly
- [ ] `npm install` completed without errors
- [ ] Development server running (`npm run dev`)

### 2. Admin Access
- [ ] Admin user created
- [ ] Can login at `/admin/login`
- [ ] Session persists correctly

---

## Phase 6: Media Management 📸

### Media Library (`/admin/media`)
- [ ] Page loads without errors
- [ ] Empty state displays correctly (if no media)
- [ ] Storage indicator shows

### Upload Functionality
- [ ] Click "Tải lên" opens uploader
- [ ] Drag & drop zone works
- [ ] Single file upload works
- [ ] Multiple files upload works
- [ ] File size validation (max 10MB)
- [ ] Upload progress shows
- [ ] Success notification appears

### Media Grid/List View
- [ ] Toggle between Grid and List views
- [ ] Images display correctly
- [ ] File info shows (name, size, date)
- [ ] Thumbnails load properly

### Filters & Search
- [ ] Filter by type (image/video/document) works
- [ ] Filter by date range works
- [ ] Search by filename works
- [ ] Filters can be reset

### Media Preview & Edit
- [ ] Click image opens preview modal
- [ ] Image preview shows full size
- [ ] Can edit alt text
- [ ] Can edit title, caption, description
- [ ] Copy URL to clipboard works
- [ ] Save changes updates database
- [ ] Delete file works
- [ ] Modal closes properly

### Bulk Actions
- [ ] Select multiple files works
- [ ] "Select all" checkbox works
- [ ] Bulk delete confirmation appears
- [ ] Bulk delete removes files
- [ ] Selection clears after action

---

## Phase 7: Pages Management 📄

### Pages List (`/admin/pages`)
- [ ] Page loads without errors
- [ ] Empty state displays (if no pages)
- [ ] Status tabs work (All/Published/Draft/Trash)

### Create New Page (`/admin/pages/new`)
- [ ] Form loads correctly
- [ ] Title input works
- [ ] Slug auto-generates from title
- [ ] Can manually edit slug
- [ ] Rich text editor loads
- [ ] Can format text (bold, italic, etc.)
- [ ] Can insert links
- [ ] Can insert images
- [ ] Excerpt field works

### Page Templates
- [ ] Template selector shows all 5 templates
- [ ] Can select different templates
- [ ] Selected template is highlighted

### Page Attributes
- [ ] Parent page dropdown loads
- [ ] Can select parent page
- [ ] Order field accepts numbers
- [ ] Template selector works

### SEO Settings
- [ ] SEO title field works
- [ ] SEO description field works
- [ ] Character count displays
- [ ] Warning shows when over limit
- [ ] Google preview updates

### Featured Image
- [ ] Click to upload image
- [ ] Image preview shows
- [ ] Can remove image

### Save & Publish
- [ ] "Lưu nháp" saves as draft
- [ ] "Xuất bản" publishes page
- [ ] Success notification appears
- [ ] Redirects to pages list

### Edit Page (`/admin/pages/[id]/edit`)
- [ ] Page loads with existing data
- [ ] All fields are populated
- [ ] Can update content
- [ ] Can change status
- [ ] Can delete page
- [ ] Delete confirmation works
- [ ] Update saves changes

### Page Hierarchy
- [ ] Tree view shows parent/child
- [ ] Hierarchy displays correctly
- [ ] Can filter by parent

---

## Phase 8: Comments System 💬

### Comments List (`/admin/comments`)
- [ ] Page loads without errors
- [ ] Empty state displays
- [ ] Status tabs work
- [ ] Stats show correct counts

### Comment Display
- [ ] Comments render correctly
- [ ] Author info shows
- [ ] Comment content displays
- [ ] Related post/product shows
- [ ] Timestamp displays

### Comment Actions
- [ ] "Duyệt" (Approve) works
- [ ] "Spam" marks as spam
- [ ] "Xóa" (Delete) works
- [ ] Delete confirmation appears

### Reply Functionality
- [ ] Click "Trả lời" opens modal
- [ ] Original comment shows in modal
- [ ] Can type reply
- [ ] Reply submits successfully
- [ ] Reply appears in thread
- [ ] Modal closes after submit

### Filters
- [ ] Filter by status works
- [ ] Filter by post works
- [ ] Search comments works

### Bulk Actions
- [ ] Select multiple comments
- [ ] Bulk approve works
- [ ] Bulk spam works
- [ ] Bulk delete works

### Threaded Comments
- [ ] Replies show indented
- [ ] Reply count displays
- [ ] Thread structure correct

---

## Phase 9: Payments & Transactions 💳

### Transactions List (`/admin/payments`)
- [ ] Page loads without errors
- [ ] Stats cards display
- [ ] Revenue stats correct
- [ ] Status tabs work

### Transaction Display
- [ ] Transaction cards render
- [ ] Amount displays correctly
- [ ] Payment method shows
- [ ] Customer info displays
- [ ] Transaction date shows

### Filters
- [ ] Filter by status works
- [ ] Filter by payment method works
- [ ] Date range filter works
- [ ] Search works

### Refund Functionality
- [ ] Click "Hoàn tiền" opens modal
- [ ] Transaction details show
- [ ] Can enter refund amount
- [ ] Amount validation works
- [ ] Can enter refund reason
- [ ] "Hoàn toàn bộ" fills max amount
- [ ] Refund submits successfully
- [ ] Transaction status updates

### Payment Gateways (`/admin/payments/gateways`)
- [ ] Page loads gateway cards
- [ ] All 5 gateways display (VNPay, MoMo, PayPal, Stripe, COD)
- [ ] Gateway status shows correctly
- [ ] Toggle enable/disable works
- [ ] Click "Cấu hình" opens modal

### Gateway Configuration
- [ ] Config modal opens
- [ ] Gateway info displays
- [ ] Test mode toggle works
- [ ] Can enter API keys
- [ ] Form validation works
- [ ] Save config works
- [ ] Configuration persists

---

## Phase 10: Analytics Dashboard 📊

### Dashboard (`/admin/analytics`)
- [ ] Page loads without errors
- [ ] Loading state shows
- [ ] All 4 stat cards display

### Stats Cards
- [ ] Total revenue displays correctly
- [ ] Revenue change % shows
- [ ] Total orders displays
- [ ] Average order value calculates correctly
- [ ] Conversion rate shows

### Revenue Chart (Recharts)
- [ ] Chart renders correctly
- [ ] Line chart displays data
- [ ] X-axis shows dates
- [ ] Y-axis shows amounts
- [ ] Tooltip works on hover
- [ ] Data points are clickable

### Top Products
- [ ] Top 5 products display
- [ ] Product images show
- [ ] Sales count displays
- [ ] Revenue shows per product
- [ ] Ranking order correct

### Traffic Sources (Pie Chart)
- [ ] Pie chart renders
- [ ] All sources show
- [ ] Percentages display
- [ ] Colors differentiate sources
- [ ] Tooltip shows details

### Customer Metrics
- [ ] New customers count shows
- [ ] Returning customers shows
- [ ] Customer LTV calculates
- [ ] Retention rate displays

### Date Range Filter
- [ ] From date picker works
- [ ] To date picker works
- [ ] Data updates on date change
- [ ] "Làm mới" reloads data

---

## Phase 11: Marketing Tools 🎯

### Coupons (`/admin/marketing/coupons`)
- [ ] Page loads without errors
- [ ] Empty state displays
- [ ] Coupon cards render

### Create Coupon
- [ ] Click "Tạo coupon mới" opens form
- [ ] Code input works (auto-uppercase)
- [ ] Type selector works (3 types)
- [ ] Value field accepts numbers
- [ ] Min purchase field works
- [ ] Usage limit field works
- [ ] Date pickers work
- [ ] Description field works
- [ ] Form validation works
- [ ] Duplicate code check works
- [ ] Create submits successfully

### Coupon Display
- [ ] Coupon code displays large
- [ ] Copy code button works
- [ ] Status badge shows correctly
- [ ] Discount value displays
- [ ] Usage count shows
- [ ] Date range displays

### Coupon Actions
- [ ] Edit button opens form
- [ ] Form pre-populates data
- [ ] Update saves changes
- [ ] Delete button works
- [ ] Delete confirmation shows

### Filters
- [ ] Status filter works
- [ ] Search coupons works

### Email Campaigns (`/admin/marketing/campaigns`)
- [ ] Page loads without errors
- [ ] Empty state displays
- [ ] Campaign cards render

### Campaign Display
- [ ] Campaign name shows
- [ ] Subject displays
- [ ] Status badge correct
- [ ] Sent date shows (if sent)
- [ ] Stats display (opens, clicks)
- [ ] Open rate calculates
- [ ] Click rate calculates

---

## Phase 12: SEO Tools 🔍

### SEO Dashboard (`/admin/seo`)
- [ ] Page loads without errors
- [ ] Section cards display
- [ ] Navigation links work

### SEO Tools (`/admin/seo/tools`)
- [ ] Page loads correctly
- [ ] All 3 tool cards display

### Image Alt Text Audit
- [ ] Click "Quét Images" works
- [ ] Scanning shows loading
- [ ] Results display after scan
- [ ] Stats show correctly
- [ ] Issues list displays
- [ ] Severity badges show
- [ ] Issue details clear

### Broken Links Checker
- [ ] Click "Quét Links" works
- [ ] Scanning works
- [ ] Results display
- [ ] Broken links list shows
- [ ] Link details display
- [ ] Issue type shows

### XML Sitemap Generator
- [ ] Click "Xem Sitemap" works
- [ ] Opens in new tab
- [ ] XML format correct
- [ ] All pages included
- [ ] URLs are valid
- [ ] Last modified dates show

---

## Phase 13: Appearance 🎨

### Theme Settings (`/admin/settings/appearance`)
- [ ] Page loads correctly
- [ ] Theme selector works (light/dark/auto)
- [ ] Color picker works
- [ ] Border radius slider works
- [ ] Logo upload works
- [ ] Logo preview shows
- [ ] Favicon upload works
- [ ] Save settings works
- [ ] Changes apply site-wide

### Navigation Builder (`/admin/settings/navigation`)
- [ ] Page loads correctly
- [ ] Menu items list displays
- [ ] Add menu item works
- [ ] Edit menu item works
- [ ] Delete menu item works
- [ ] Reorder items works (if implemented)
- [ ] Menu locations work
- [ ] Save changes persists

---

## General Functionality Tests

### UI/UX
- [ ] All pages are responsive (mobile, tablet, desktop)
- [ ] Loading states show appropriately
- [ ] Empty states display with helpful text
- [ ] Error messages are clear
- [ ] Success notifications appear
- [ ] Modals open and close correctly
- [ ] Forms have proper validation
- [ ] Buttons have hover states
- [ ] Icons display correctly

### Navigation
- [ ] Sidebar navigation works
- [ ] All menu links work
- [ ] Breadcrumbs display (if any)
- [ ] Back buttons work
- [ ] Active menu item highlighted

### Performance
- [ ] Pages load in < 3 seconds
- [ ] Images load progressively
- [ ] No console errors
- [ ] No console warnings (or minimal)
- [ ] Charts render smoothly
- [ ] Filters respond quickly

### Security
- [ ] Unauthenticated users redirected to login
- [ ] Protected routes require auth
- [ ] CSRF protection works
- [ ] XSS protection in place
- [ ] SQL injection prevented (using parameterized queries)

### Data Integrity
- [ ] All CRUD operations work
- [ ] Data persists correctly
- [ ] Database updates immediately
- [ ] No orphaned records
- [ ] Relationships maintain integrity

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Samsung Internet

---

## API Testing

### Test All Endpoints
- [ ] GET requests return correct data
- [ ] POST requests create records
- [ ] PATCH requests update records
- [ ] DELETE requests remove records
- [ ] Error responses are appropriate (4xx, 5xx)
- [ ] Success responses include data
- [ ] Rate limiting works (if implemented)

---

## Final Checks

### Code Quality
- [ ] No linter errors
- [ ] No TypeScript errors
- [ ] Consistent code style
- [ ] Comments where needed
- [ ] No unused imports
- [ ] No console.logs in production code

### Documentation
- [ ] README is up to date
- [ ] API documentation complete
- [ ] Component documentation exists
- [ ] Deployment guide ready

### Database
- [ ] All collections exist
- [ ] Indexes created (if needed)
- [ ] Backup strategy in place
- [ ] Migration scripts work

---

## Bug Tracking

Found bugs? Document them here:

| Bug # | Page/Feature | Description | Severity | Status |
|-------|--------------|-------------|----------|--------|
| 1 | | | | |
| 2 | | | | |

**Severity Levels:**
- **Critical:** Breaks core functionality
- **High:** Major feature doesn't work
- **Medium:** Minor feature issue
- **Low:** UI/UX improvement

---

## Testing Status

- **Total Tests:** ~150+
- **Passed:** ___
- **Failed:** ___
- **Skipped:** ___

**Testing Completion:** ___% 

---

## Notes

Add any additional notes, observations, or recommendations here:

---

**Tested By:** ___________
**Date:** ___________
**Environment:** Development / Staging / Production

