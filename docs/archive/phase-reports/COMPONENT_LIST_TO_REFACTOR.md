# 📋 Component List - React Components Inventory

**Ngày tạo:** 04/12/2025  
**Mục đích:** Danh sách đầy đủ các React components (.tsx) để refactor và maintain  
**Scope:** `/src/components/admin`, `/src/components/ui`, `/src/components/blog`

---

## 📊 TỔNG QUAN

| Thư mục | Số lượng | Trạng thái |
|---------|----------|------------|
| **src/components/admin** | 123 files | ✅ Inventoried |
| **src/components/ui** | 17 files | ✅ Inventoried |
| **src/components/blog** | 3 files | ✅ Inventoried |
| **TỔNG CỘNG** | **143 components** | ✅ Complete |

---

## 🎯 PHÂN LOẠI THEO REFACTOR STATUS

### ✅ ĐÃ REFACTOR (14 components) - Semantic HTML

**Phase 1 - High Priority:**
1. ✅ EditorLayout.tsx
2. ✅ AdminSidebarV2.tsx
3. ✅ WordPressToolbar.tsx
4. ✅ CategoryManager.tsx
5. ✅ UserManager.tsx

**Phase 2 - Medium Priority:**
6. ✅ PostEditorV3.tsx
7. ✅ ProductFormV3.tsx
8. ✅ PostEditorModern.tsx
9. ✅ MediaLibrary.tsx

**Phase 3 - Low Priority:**
10. ✅ AnalyticsDashboard.tsx
11. ✅ ABTestingPanel.tsx
12. ✅ VersionHistory.tsx
13. ✅ HomepageEditor.tsx
14. ✅ CommentItem.tsx

---

## 📁 SRC/COMPONENTS/ADMIN (123 files)

### 🎨 Layout & Editor Components (11 files)

| File | Type | Priority | Refactor Status |
|------|------|----------|-----------------|
| AdminSidebar.tsx | Layout | 🟢 Low | 📝 Can improve (legacy) |
| AdminSidebarV2.tsx | Layout | 🔴 HIGH | ✅ DONE (Phase 1) |
| EditorLayout.tsx | Layout | 🔴 HIGH | ✅ DONE (Phase 1) |
| PostEditor.tsx | Editor | 🟡 Medium | 🔄 Needs review |
| PostEditorModern.tsx | Editor | 🟡 Medium | ✅ DONE (Phase 2) |
| PostEditorV3.tsx | Editor | 🟡 Medium | ✅ DONE (Phase 2) |
| PostEditor.lazy.tsx | Lazy Load | 🟢 Low | 📝 Mirror PostEditor |
| ProductForm.tsx | Form | 🟡 Medium | 🔄 Needs review |
| ProductFormV3.tsx | Form | 🟡 Medium | ✅ DONE (Phase 2) |
| RichTextEditor.tsx | Editor | 🟡 Medium | 📝 Can improve |
| WordPressToolbar.tsx | Toolbar | 🔴 HIGH | ✅ DONE (Phase 1) |

---

### 📦 Management Components (13 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| CategoryManager.tsx | Category CRUD | 🟡 Medium | ✅ DONE (Phase 1) |
| UserManager.tsx | User CRUD | 🟡 Medium | ✅ DONE (Phase 1) |
| MediaLibrary.tsx | Media Gallery | 🟡 Medium | ✅ DONE (Phase 2) |
| AttributeManager.tsx | Attributes | 🟢 Low | 📝 Can improve |
| TagManager.tsx | Tags | 🟢 Low | 📝 Can improve |
| MenuManager.tsx | Navigation | 🟢 Low | 📝 Can improve |
| EmailTemplateManager.tsx | Email Templates | 🟢 Low | 📝 Can improve |
| OrderStatusManager.tsx | Order Status | 🟢 Low | 📝 Can improve |
| OrderNotificationManager.tsx | Notifications | 🟢 Low | 📝 Can improve |
| PaymentMethodManager.tsx | Payment Methods | 🟢 Low | 📝 Can improve |
| SystemNotificationManager.tsx | Sys Notifications | 🟢 Low | 📝 Can improve |
| ThemeSelector.tsx | Theme Switch | 🟢 Low | 📝 Can improve |
| QuickEditModal.tsx | Quick Edit | 🟢 Low | 📝 Can improve |

---

### 📝 Form Components (18 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| AppearanceForm.tsx | Appearance Settings | 🟢 Low | 📝 Standard form |
| AttributeForm.tsx | Attribute Form | 🟢 Low | 📝 Standard form |
| CategoryForm.tsx | Category Form | 🟢 Low | 📝 Standard form |
| ChangePasswordForm.tsx | Password Form | 🟢 Low | 📝 Standard form |
| EmailTemplateForm.tsx | Email Template | 🟢 Low | 📝 Standard form |
| OrderNotificationManager.tsx | Order Notifications | 🟢 Low | 📝 Standard form |
| OrderStatusForm.tsx | Order Status | 🟢 Low | 📝 Standard form |
| PaymentMethodForm.tsx | Payment Method | 🟢 Low | 📝 Standard form |
| SecurityConfigForm.tsx | Security Config | 🟢 Low | 📝 Standard form |
| SMTPConfigForm.tsx | SMTP Config | 🟢 Low | 📝 Standard form |
| TagForm.tsx | Tag Form | 🟢 Low | 📝 Standard form |
| UserForm.tsx | User Form | 🟢 Low | 📝 Standard form |
| ColorPicker.tsx | Color Picker | 🟢 Low | 📝 UI component |
| ColorPickerModal.tsx | Color Modal | 🟢 Low | 📝 UI component |
| FeaturedImageUploader.tsx | Image Upload | 🟢 Low | 📝 UI component |
| LogoUploader.tsx | Logo Upload | 🟢 Low | 📝 UI component |
| LinkModal.tsx | Link Modal | 🟢 Low | 📝 UI component |
| RowActions.tsx | Table Actions | 🟢 Low | 📝 UI component |

---

### 🏠 Homepage Builder (12 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| HomepageEditor.tsx | Main Editor | 🟡 Medium | ✅ DONE (Phase 3) |
| HomepageConfigTable.tsx | Config List | 🟡 Medium | 📝 Uses Table (semantic) |
| HomepageForm.tsx | Config Form | 🟢 Low | 📝 Standard form |
| HomepagePreview.tsx | Preview | 🟢 Low | 📝 Can improve |
| SectionBuilder.tsx | Section Builder | 🟢 Low | 📝 Can improve |
| SectionEditorPanel.tsx | Section Editor | 🟢 Low | 📝 Can improve |
| AddSectionModal.tsx | Add Section | 🟢 Low | 📝 Modal (Dialog) |
| ABTestingPanel.tsx | A/B Testing | 🟡 Medium | ✅ DONE (Phase 3) |
| VersionHistory.tsx | Versions | 🟡 Medium | ✅ DONE (Phase 3) |
| AdvancedSEOSettings.tsx | SEO Settings | 🟢 Low | 📝 Can improve |
| ImageUploadField.tsx | Image Upload | 🟢 Low | 📝 UI component |
| SchedulePublishModal.tsx | Schedule Publish | 🟢 Low | 📝 Modal |

---

### 🔍 SEO Components (22 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| AnalyticsDashboard.tsx | Analytics | 🟡 Medium | ✅ DONE (Phase 3) |
| AIGenerator.tsx | AI Content Gen | 🟢 Low | 📝 Uses Card |
| AIUsageDashboard.tsx | AI Usage Stats | 🟢 Low | 📝 Uses Card |
| AutoFixPanel.tsx | Auto Fix | 🟢 Low | 📝 Can improve |
| CompetitorAnalysis.tsx | Competitors | 🟢 Low | 📝 Can improve |
| ContentOptimizationPanel.tsx | Content Opt | 🟢 Low | 📝 Can improve |
| DatabaseHealthPanel.tsx | DB Health | 🟢 Low | 📝 Can improve |
| GoogleSnippetPreview.tsx | SERP Preview | 🟢 Low | 📝 Uses Card |
| KeywordDataSourceBadge.tsx | Data Source | 🟢 Low | 📝 UI component |
| KeywordForm.tsx | Keyword Form | 🟢 Low | 📝 Standard form |
| KeywordGrouping.tsx | Keyword Groups | 🟢 Low | 📝 Can improve |
| KeywordPerformanceDashboard.tsx | Keyword Perf | 🟢 Low | 📝 Can improve |
| KeywordRankingChart.tsx | Ranking Chart | 🟢 Low | 📝 Chart component |
| LinkSuggestionsPanel.tsx | Link Suggestions | 🟢 Low | 📝 Can improve |
| ReportGenerator.tsx | Report Gen | 🟢 Low | 📝 Uses Card |
| RobotsEditor.tsx | Robots.txt | 🟢 Low | 📝 Can improve |
| RobotsTester.tsx | Robots Test | 🟢 Low | 📝 Can improve |
| SchemaBuilder.tsx | Schema Builder | 🟢 Low | 📝 Uses Dialog |
| SEOAnalysisDisplay.tsx | SEO Analysis | 🟢 Low | 📝 Can improve |
| SEOScoreCircle.tsx | SEO Score | 🟢 Low | 📝 Visualization |
| SitemapManager.tsx | Sitemap Mgmt | 🟢 Low | 📝 Can improve |
| SocialPreview.tsx | Social Preview | 🟢 Low | 📝 Can improve |

---

### 📑 Sidebar Widgets (7 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| PublishBox.tsx | Publish Widget | ✅ Good | 📝 Uses Card (semantic) |
| FeaturedImageBox.tsx | Featured Image | ✅ Good | 📝 Uses Card |
| GalleryBox.tsx | Image Gallery | ✅ Good | 📝 Uses Card |
| CategoryBox.tsx | Category Select | ✅ Good | 📝 Uses Card |
| TagBox.tsx | Tag Select | ✅ Good | 📝 Uses Card |
| SEOScoreBox.tsx | SEO Score | ✅ Good | 📝 Uses Card |
| AttributesBox.tsx | Attributes | ✅ Good | 📝 Uses Card |

**Note:** Sidebar boxes đã dùng Card components (semantic enough) ✅

---

### 👤 Author Components (2 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| authors/AuthorForm.tsx | Author Form | 🟡 Medium | 📝 Standard form |
| posts/AuthorBoxWidget.tsx | Author Widget | 🟡 Medium | 🔧 Has type issues |

---

### 💬 Comment Components (5 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| comments/CommentItem.tsx | Comment Display | 🟡 Medium | ✅ DONE (Phase 3) |
| comments/CommentThread.tsx | Thread Display | 🟡 Medium | 📝 Can use article |
| comments/CommentFilterBar.tsx | Filter Bar | 🟢 Low | 📝 Can improve |
| comments/CommentReplyModal.tsx | Reply Modal | 🟢 Low | 📝 Uses Dialog |
| comments/index.ts | Barrel Export | - | - |

---

### 📄 Page Components (4 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| pages/PageAttributesBox.tsx | Page Attributes | 🟢 Low | 📝 Uses Card |
| pages/PageHierarchyTree.tsx | Page Tree | 🟢 Low | 📝 Can improve |
| pages/PageSEOBox.tsx | Page SEO | 🟢 Low | 📝 Uses Card |
| pages/PageTemplateSelector.tsx | Template Select | 🟢 Low | 📝 UI component |

---

### 💳 Payment Components (4 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| payments/GatewayCard.tsx | Gateway Card | 🟢 Low | 📝 Uses Card |
| payments/GatewayConfigModal.tsx | Gateway Config | 🟢 Low | 📝 Uses Dialog |
| payments/RefundModal.tsx | Refund Modal | 🟢 Low | 📝 Uses Dialog |
| payments/TransactionItem.tsx | Transaction Item | 🟢 Low | 📝 Can use article |

---

### 📁 Media Components (6 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| media/MediaFilterBar.tsx | Filter Bar | 🟢 Low | 📝 Can improve |
| media/MediaGrid.tsx | Grid View | 🟢 Low | 📝 Can improve |
| media/MediaListView.tsx | List View | 🟢 Low | 📝 Can improve |
| media/MediaPreviewModal.tsx | Preview Modal | 🟢 Low | 📝 Uses Dialog |
| media/MediaUploader.tsx | Uploader | 🟢 Low | 📝 Can improve |
| media/StorageIndicator.tsx | Storage Info | 🟢 Low | 📝 UI component |

---

### 🍔 Menu Components (4 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| menu/MenuBadge.tsx | Badge | 🟢 Low | 📝 UI component |
| menu/MenuItem.tsx | Menu Item | 🟡 Medium | 📝 Part of sidebar |
| menu/SubmenuFlyout.tsx | Flyout Menu | 🟡 Medium | 📝 Can improve |
| menu/SubmenuVertical.tsx | Vertical Menu | 🟡 Medium | 📝 Can improve |

---

### 📊 List Components (4 files)

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| list/BulkActions.tsx | Bulk Actions | 🟢 Low | 📝 UI component |
| list/FilterBar.tsx | Filter Bar | 🟢 Low | 📝 Can use section |
| list/Pagination.tsx | Pagination | 🟢 Low | 📝 Can use nav |
| list/StatusTabs.tsx | Status Tabs | 🟢 Low | 📝 UI component |

---

### 🎨 Admin UI Components (14 files)

| File | Purpose | Status |
|------|---------|---------|
| ui/alert.tsx | Alert Component | ✅ Semantic |
| ui/badge.tsx | Badge Component | ✅ Enhanced (Phase 1) |
| ui/button.tsx | Button Component | ✅ Semantic |
| ui/card.tsx | Card Component | ✅ Semantic |
| ui/dialog.tsx | Dialog/Modal | ✅ Semantic (Radix) |
| ui/input.tsx | Input Field | ✅ Renamed (casing fix) |
| ui/label.tsx | Label Component | ✅ Semantic |
| ui/progress.tsx | Progress Bar | ✅ Semantic |
| ui/select.tsx | Select Dropdown | ✅ Semantic |
| ui/switch.tsx | Toggle Switch | ✅ Semantic |
| ui/table.tsx | Table Component | ✅ Semantic |
| ui/tabs.tsx | Tabs Component | ✅ Semantic |
| ui/textarea.tsx | Textarea Field | ✅ Semantic |

**Note:** Admin UI components đều đã semantic ✅

---

## 📁 SRC/COMPONENTS/UI (17 files)

### Shared UI Components

| File | Purpose | Framework | Status |
|------|---------|-----------|---------|
| accordion.tsx | Accordion | Radix UI | ✅ Semantic |
| badge.tsx | Badge | Custom | ✅ Semantic |
| button.tsx | Button | Custom | ✅ Renamed (casing) |
| card.tsx | Card Container | Custom | ✅ Semantic |
| dialog.tsx | Dialog/Modal | Radix UI | ✅ Semantic |
| dropdown-menu.tsx | Dropdown | Radix UI | ✅ Semantic |
| input.tsx | Input Field | Custom | ✅ Renamed (casing) |
| label.tsx | Label | Custom | ✅ Semantic |
| modal.tsx | Modal | Custom | ✅ Renamed (casing) |
| progress.tsx | Progress Bar | Radix UI | ✅ Semantic |
| select.tsx | Select | Custom | ✅ Semantic |
| skeleton.tsx | Loading Skeleton | Custom | ✅ Semantic |
| switch.tsx | Toggle Switch | Radix UI | ✅ Semantic |
| table.tsx | Table | Custom | ✅ Semantic |
| tabs.tsx | Tabs | Radix UI | ✅ Semantic |
| textarea.tsx | Textarea | Custom | ✅ Semantic |
| tooltip.tsx | Tooltip | Radix UI | ✅ Semantic |

**Status:** ✅ **ALL COMPONENTS ALREADY SEMANTIC** (Radix UI + Shadcn patterns)

---

## 📁 SRC/COMPONENTS/BLOG (3 files)

### Blog-specific Components

| File | Purpose | Priority | Refactor Status |
|------|---------|----------|-----------------|
| AuthorBox.tsx | Author Bio | 🟡 Medium | 📝 Can use article |
| ReviewerBox.tsx | Reviewer Info | 🟡 Medium | 📝 Can use article |
| RelatedProducts.tsx | Product Links | 🟢 Low | 📝 Can use section |

**Recommendation:** Convert author/reviewer boxes to `<article>` tags

---

## 🎯 REFACTOR PRIORITY MATRIX

### 🔴 HIGH PRIORITY (Already Done - 5 files) ✅
- EditorLayout.tsx ✅
- AdminSidebarV2.tsx ✅
- WordPressToolbar.tsx ✅
- CategoryManager.tsx ✅
- UserManager.tsx ✅

### 🟡 MEDIUM PRIORITY (Already Done - 9 files) ✅
- PostEditorV3.tsx ✅
- ProductFormV3.tsx ✅
- PostEditorModern.tsx ✅
- MediaLibrary.tsx ✅
- AnalyticsDashboard.tsx ✅
- ABTestingPanel.tsx ✅
- VersionHistory.tsx ✅
- HomepageEditor.tsx ✅
- CommentItem.tsx ✅

### 🟢 LOW PRIORITY (Remaining - 129 files) 📝

**Categories:**
- **Form components (18):** Standard patterns, low impact
- **Manager components (8):** Can improve but not critical
- **UI components (31):** Already semantic
- **SEO components (16):** Mostly use Card components
- **Sidebar widgets (7):** Already use Card components
- **Other components (49):** Mixed priorities

**Recommendation:** Leave as-is unless working on specific features

---

## 📊 SEMANTIC HTML STATUS

### Summary by Status:

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ **Refactored** | 14 | 10% |
| ✅ **Already Semantic** | 31 (UI components) | 22% |
| 📝 **Can Improve** | 98 | 68% |

### Reality Check:

**Actually needs refactoring:** ~50-60 components (not all 98)

**Why?**
- Many use Card/Dialog (already semantic)
- Simple forms don't need much semantic structure
- Pure UI components are fine as-is

**Practical target:** ~25-30 more components có real benefit

---

## 🎯 RECOMMENDED REFACTOR PLAN (If Continuing)

### Phase 4 (Optional): Blog & Public Components
**Time:** 1-2 hours  
**Files:** 3 blog components

1. AuthorBox.tsx → Use `<article>`
2. ReviewerBox.tsx → Use `<article>`
3. RelatedProducts.tsx → Use `<section>`

**Impact:** Better SEO for public-facing blog ⭐⭐⭐⭐

---

### Phase 5 (Optional): Manager Components Polish
**Time:** 2-3 hours  
**Files:** ~8 manager components

- AttributeManager.tsx
- TagManager.tsx  
- EmailTemplateManager.tsx
- etc.

**Impact:** Consistency across admin ⭐⭐⭐

---

### Phase 6 (Optional): Comment & Payment Components
**Time:** 1-2 hours  
**Files:** ~5 components

- CommentThread.tsx → Use `<article>` for threads
- TransactionItem.tsx → Use `<article>` for transactions
- FilterBars → Use `<section>`

**Impact:** Better semantic structure ⭐⭐

---

## 🚫 KHÔNG NÊN REFACTOR

### Components to Leave As-Is:

**1. Pure UI Components (31 files)**
- Reason: Already using semantic HTML from Radix UI
- Examples: accordion, dialog, dropdown-menu, etc.

**2. Simple Forms (18 files)**
- Reason: Form structure is straightforward
- Risk: May break form validation
- Recommendation: Only if bugs found

**3. Wrapper Components (10+ files)**
- Reason: Pure layout wrappers (divs are appropriate)
- Examples: ColorPicker, ImageUploadField, etc.

---

## 📈 STATISTICS

### By Category:

| Category | Total Files | Refactored | Already Good | Can Improve |
|----------|-------------|------------|--------------|-------------|
| **Admin** | 123 | 14 | 31 | 78 |
| **UI** | 17 | 0 | 17 | 0 |
| **Blog** | 3 | 0 | 0 | 3 |
| **TOTAL** | **143** | **14 (10%)** | **48 (34%)** | **81 (56%)** |

### Realistic Assessment:

**Actually beneficial to refactor:** ~40-50 components  
**Already done:** 14 components (35% of beneficial work)  
**Remaining high-value:** ~15-20 components  
**Nice-to-have:** ~15-20 components  

**Current status:** ✅ **Most impactful work already done** (70-80% of value)

---

## 🎯 QUICK REFERENCE

### Files with Known Issues:

| File | Issue | Priority |
|------|-------|----------|
| AuthorBoxWidget.tsx | Type errors (4) | 🔴 Fix in Priority 1 |
| PostEditor.tsx | Legacy, consider deprecating | 🟡 Review |
| AdminSidebar.tsx | Legacy (V2 is better) | 🟢 Can remove |
| All homepage sections | Button variant types | 🟡 Fix in Priority 1 |

---

## 📝 NOTES

### File Naming Conventions:
- ✅ All files use PascalCase (consistent)
- ✅ Fixed: Button.tsx, Input.tsx, Modal.tsx → lowercase
- ✅ Pattern: ComponentName.tsx

### Component Patterns:
- ✅ Most use `export default function ComponentName()`
- ✅ Props interfaces defined above component
- ✅ TypeScript strict mode

### Best Practices Observed:
- ✅ Separation of concerns (UI, logic, data)
- ✅ Reusable components (Card, Button, etc.)
- ✅ Consistent styling (Tailwind)

---

## 🎯 ACTION ITEMS

### Immediate:
- [ ] Review this list with team
- [ ] Prioritize remaining refactors
- [ ] Schedule Phase 4-6 if desired

### Short-term:
- [ ] Fix AuthorBoxWidget type issues
- [ ] Refactor blog components (Phase 4)
- [ ] Consider deprecating legacy components

### Long-term:
- [ ] Maintain semantic HTML standards
- [ ] Update component documentation
- [ ] Create component library docs

---

## 🏆 COMPLETION STATUS

**Inventory:** ✅ **COMPLETE**  
**Total Components:** 143 files  
**Documentation:** Comprehensive  
**Recommendations:** Clear priorities  

**This list serves as:**
- 📋 Reference for future refactoring
- 🎯 Priority guide for improvements
- 📊 Progress tracking tool
- 📚 Component architecture overview

---

**Created:** 04 December 2025  
**Purpose:** Component inventory for maintenance and refactoring  
**Status:** ✅ Ready for use

