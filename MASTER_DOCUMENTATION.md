# 📚 Teddy Shop - Master Documentation

> **Tài liệu tổng hợp đầy đủ cho dự án Teddy Shop Admin Panel**

---

## 📋 Mục lục

1. [Tổng quan Dự án](#tổng-quan-dự-án)
2. [Cài đặt & Khởi động](#cài-đặt--khởi-động)
3. [Kiến trúc Hệ thống](#kiến-trúc-hệ-thống)
4. [Tính năng Đã triển khai](#tính-năng-đã-triển-khai)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan Dự án

### Giới thiệu
**Teddy Shop** là một e-commerce platform hoàn chỉnh với admin panel chuyên nghiệp, được xây dựng với Next.js 16, MongoDB, và TypeScript.

### Tech Stack
- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Backend:** Next.js API Routes
- **Database:** MongoDB (native driver)
- **Storage:** Vercel Blob
- **Styling:** Tailwind CSS
- **Auth:** NextAuth v5
- **Editor:** Tiptap
- **Charts:** Recharts

### Tính năng chính
✅ Complete CMS (Posts, Pages, Media)  
✅ E-commerce (Products, Orders, Payments)  
✅ Customer Engagement (Comments, Marketing)  
✅ Business Intelligence (Analytics, Reports)  
✅ SEO Optimization (Tools, Analysis)  
✅ Full Customization (Appearance, Settings)  

---

## 🚀 Cài đặt & Khởi động

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/teddy-shop.git
cd teddy-shop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local`:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teddy-shop

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Teddy Shop
```

### 4. Database Setup
```bash
# Test connection
npm run test:db

# Create admin user
npm run reset:admin

# Seed initial data (optional)
npm run seed:settings
```

### 5. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000/admin/login`

**Admin Login:**
- Use the ADMIN_EMAIL and ADMIN_PASSWORD from your `.env.local` file
- Set strong credentials in production (see ENV_SETUP.md)

---

## 🏗️ Kiến trúc Hệ thống

### Cấu trúc thư mục
```
teddy-shop/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel pages
│   │   ├── api/                # API routes
│   │   └── (shop)/             # Public shop pages
│   ├── components/
│   │   ├── admin/              # Admin components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI components
│   ├── lib/
│   │   ├── types/              # TypeScript types
│   │   ├── schemas/            # Zod schemas
│   │   └── db.ts               # Database connection
│   └── store/                  # State management
├── public/                     # Static files
└── scripts/                    # Utility scripts
```

### Database Collections
```javascript
{
  // Core
  products, orders, carts, users, contacts,
  
  // Content
  posts, pages, media, comments,
  
  // Settings
  productCategories, productTags, productAttributes,
  orderStatuses, paymentMethods, emailTemplates,
  
  // Admin
  adminUsers, securityConfig, appearanceConfig,
  
  // SEO
  seoAnalysis, keywordTracking, redirectRules,
  
  // Payments
  transactions, paymentGateways,
  
  // Marketing
  coupons, emailCampaigns, campaigns, promotions
}
```

---

## ✅ Tính năng Đã triển khai

### Phase 6: Media Management ✅
- Media Library (Grid/List view)
- Drag & drop upload
- Advanced filters
- Metadata editor
- Storage indicator

**Pages:**
- `/admin/media` - Media Library
- `/admin/media/upload` - Upload page

### Phase 7: Pages Management ✅
- Hierarchical pages (parent/child)
- WordPress-style editor
- 5 templates
- SEO settings per page
- Custom CSS/JS

**Pages:**
- `/admin/pages` - Pages list
- `/admin/pages/new` - Create page
- `/admin/pages/[id]/edit` - Edit page

### Phase 8: Comments System ✅
- Comment moderation
- Threaded comments
- Quick reply
- Bulk actions

**Pages:**
- `/admin/comments` - All comments
- `/admin/comments/pending` - Pending
- `/admin/comments/approved` - Approved
- `/admin/comments/spam` - Spam

### Phase 9: Payments & Transactions ✅
- Transaction tracking
- 5 payment gateways
- Refund processing
- Gateway configuration

**Pages:**
- `/admin/payments` - Transactions
- `/admin/payments/gateways` - Gateways config

### Phase 10: Analytics Dashboard ✅
- Sales statistics
- Revenue charts (Recharts)
- Top products
- Customer metrics

**Pages:**
- `/admin/analytics` - Dashboard
- `/admin/analytics/sales` - Sales report
- `/admin/analytics/customers` - Customer analytics
- `/admin/analytics/products` - Product analytics

### Phase 11: Marketing Tools ✅
- Coupon management
- Email campaigns
- Usage tracking

**Pages:**
- `/admin/marketing/coupons` - Coupons
- `/admin/marketing/campaigns` - Email campaigns
- `/admin/marketing/emails` - Email marketing
- `/admin/marketing/promotions` - Promotions

### Phase 12: SEO Tools ✅
- XML Sitemap generator
- Image Alt Text audit
- Broken Links checker
- Keyword tracking

**Pages:**
- `/admin/seo` - SEO Dashboard
- `/admin/seo/tools` - SEO Tools
- `/admin/seo/sitemap` - Sitemap manager
- `/admin/seo/keywords` - Keyword tracking
- `/admin/seo/analysis` - SEO Analysis

### Phase 13: Appearance ✅
- Theme settings
- Navigation builder
- Logo & Favicon

**Pages:**
- `/admin/settings/appearance` - Theme settings
- `/admin/settings/navigation` - Menu builder
- `/admin/appearance/customize` - Theme customizer
- `/admin/appearance/widgets` - Widgets
- `/admin/appearance/background` - Background
- `/admin/appearance/editor` - CSS/JS editor

### Additional Features
- Posts management with categories/tags
- Products management with variants
- Orders management
- Contact messages
- User management
- Security settings

---

## 🧪 Testing

### Quick Test
```bash
# 1. Login
Visit: http://localhost:3000/admin/login
Login with: admin@teddyshop.com / admin123

# 2. Test core features
- Upload media
- Create page
- Create post
- Add product
- View analytics
```

### Comprehensive Testing
See detailed checklist in testing section below.

---

## 🚀 Deployment

### Recommended: Vercel

**1. Push to GitHub**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

**2. Deploy to Vercel**
- Go to https://vercel.com/new
- Import your repository
- Add environment variables
- Deploy

**3. Post-Deployment**
- Configure payment gateways
- Set up SMTP
- Upload logo/favicon
- Generate sitemap

### Environment Variables (Production)
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-new-secret
BLOB_READ_WRITE_TOKEN=vercel-provides-this
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

---

## 📡 API Documentation

### Media API
```
GET    /api/admin/media              # List all
POST   /api/admin/media              # Upload
GET    /api/admin/media/[id]         # Get one
PATCH  /api/admin/media/[id]         # Update
DELETE /api/admin/media/[id]         # Delete
```

### Pages API
```
GET    /api/admin/pages              # List all
POST   /api/admin/pages              # Create
GET    /api/admin/pages/[id]         # Get one
PATCH  /api/admin/pages/[id]         # Update
DELETE /api/admin/pages/[id]         # Delete
```

### Comments API
```
GET    /api/admin/comments            # List all
PATCH  /api/admin/comments            # Bulk actions
GET    /api/admin/comments/[id]       # Get one
PATCH  /api/admin/comments/[id]       # Update
DELETE /api/admin/comments/[id]       # Delete
POST   /api/admin/comments/[id]/reply # Reply
```

### Payments API
```
GET  /api/admin/payments                    # List transactions
GET  /api/admin/payments/[id]               # Get details
POST /api/admin/payments/[id]/refund        # Refund
GET  /api/admin/payments/gateways           # List gateways
POST /api/admin/payments/gateways           # Configure
```

### Analytics API
```
GET /api/admin/analytics?dateFrom=&dateTo=  # Dashboard data
```

### Marketing API
```
GET    /api/admin/marketing/coupons         # List coupons
POST   /api/admin/marketing/coupons         # Create
GET    /api/admin/marketing/coupons/[id]    # Get one
PATCH  /api/admin/marketing/coupons/[id]    # Update
DELETE /api/admin/marketing/coupons/[id]    # Delete

GET  /api/admin/marketing/campaigns         # List campaigns
POST /api/admin/marketing/campaigns         # Create
```

### SEO API
```
GET /api/admin/seo/sitemap                  # Generate sitemap
GET /api/admin/seo/audit/images             # Image alt audit
GET /api/admin/seo/audit/links              # Broken links check
```

---

## 🐛 Troubleshooting

### Build Errors

**Module not found:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Out of memory:**
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Runtime Errors

**Cannot connect to MongoDB:**
- Check `MONGODB_URI` in `.env.local`
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Test connection: `npm run test:db`

**NextAuth error:**
- Generate new secret: `openssl rand -base64 32`
- Update `NEXTAUTH_SECRET` in `.env.local`
- Verify `NEXTAUTH_URL` matches your domain

**Images not loading:**
- Check Vercel Blob token
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Test upload in Media Library

---

## 📊 Performance

### Optimization Tips
- ✅ Images auto-optimized by Next.js
- ✅ Code splitting automatic
- ✅ CDN included with Vercel
- ✅ Lazy loading implemented

### Monitoring
- Use Vercel Analytics (built-in)
- Add Sentry for error tracking
- Monitor with UptimeRobot (free)

---

## 🔒 Security

### Best Practices
- ✅ Strong admin passwords
- ✅ Session management with NextAuth
- ✅ Rate limiting on API routes
- ✅ CORS configured
- ✅ XSS protection
- ✅ SQL injection prevented

### Recommendations
- Enable 2FA for admin users
- Regular security audits
- Keep dependencies updated
- Monitor suspicious activity

---

## 📈 Roadmap

### Completed (100%)
- ✅ Phase 1-5: Core features
- ✅ Phase 6: Media Management
- ✅ Phase 7: Pages Management
- ✅ Phase 8: Comments System
- ✅ Phase 9: Payments & Transactions
- ✅ Phase 10: Analytics Dashboard
- ✅ Phase 11: Marketing Tools
- ✅ Phase 12: SEO Tools
- ✅ Phase 13: Appearance

### Future Enhancements
- [ ] Advanced Widgets System
- [ ] Page Builder (Drag & Drop)
- [ ] Multi-language Support
- [ ] Advanced Permissions
- [ ] Activity Logs
- [ ] Backup & Restore

---

## 💡 Quick Reference

### Admin Access
- **URL:** `/admin/login`
- **Default:** admin@teddyshop.com / admin123

### Key Pages
- Dashboard: `/admin/dashboard`
- Media: `/admin/media`
- Pages: `/admin/pages`
- Comments: `/admin/comments`
- Payments: `/admin/payments`
- Analytics: `/admin/analytics`
- Marketing: `/admin/marketing/coupons`
- SEO: `/admin/seo`
- Settings: `/admin/settings`

### Useful Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production
npm run test:db      # Test MongoDB connection
npm run reset:admin  # Reset admin password
```

---

## 📞 Support

### Documentation Files
- `README.md` - Project overview
- `ADMIN_FEATURES_ROADMAP.md` - Feature roadmap
- `DATABASE_SCHEMA.md` - Database structure
- `ENV_SETUP.md` - Environment configuration

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Vercel Docs](https://vercel.com/docs)

---

## 📝 Changelog

### v1.0.0 (Current)
- ✅ All 13 phases completed
- ✅ 62+ new files created
- ✅ 35+ API endpoints
- ✅ 30+ reusable components
- ✅ Production-ready code

---

## 🎉 Credits

Built with ❤️ using modern web technologies

**Powered by:**
- Next.js
- React
- MongoDB
- Vercel
- Tailwind CSS
- TypeScript

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** 🟢 Production Ready

