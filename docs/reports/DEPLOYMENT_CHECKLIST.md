# Deployment Checklist - Teddy Shop

**Ngày tạo:** 2025-12-04  
**Mục tiêu:** Rà soát cuối cùng trước khi deploy lên Production (Vercel)  
**Người thực hiện:** DevOps Engineer / Deployment Lead

---

## ⚠️ CRITICAL: Pre-Deployment Checks

**Chạy script kiểm tra tự động trước khi deploy:**

```bash
npx tsx scripts/pre-deploy-check.ts
```

Script này sẽ kiểm tra:
- ✅ TypeScript type errors
- ✅ ESLint errors
- ✅ Unit tests
- ✅ Production build

**Nếu script FAIL → KHÔNG được deploy!**

---

## 1️⃣ Environment Variables

### Vercel Project Settings

Đảm bảo các biến môi trường sau đã được thêm vào Vercel Project Settings:

#### Required Variables

- [ ] **`MONGODB_URI`**
  - ✅ MongoDB connection string (Atlas hoặc self-hosted)
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
  - ⚠️ Production database, KHÔNG dùng development database

- [ ] **`AUTH_SECRET`**
  - ✅ Secret key cho NextAuth (generate với `openssl rand -base64 32`)
  - ⚠️ Phải là unique secret, KHÔNG dùng example value
  - ⚠️ Phải giống nhau giữa các environments (nếu cần share sessions)

- [ ] **`NEXTAUTH_URL`**
  - ✅ Production URL: `https://yourdomain.com`
  - ⚠️ Phải match với domain thực tế

- [ ] **`NEXT_PUBLIC_SITE_URL`**
  - ✅ Production URL: `https://yourdomain.com`
  - ⚠️ Dùng cho metadata, social sharing, sitemap

#### Optional but Recommended

- [ ] **`BLOB_READ_WRITE_TOKEN`**
  - ✅ Vercel Blob Storage token (cho file uploads)
  - Lấy từ: https://vercel.com/dashboard/stores
  - ⚠️ Cần cho upload logo, favicon, media files

- [ ] **`ADMIN_EMAIL`**
  - ✅ Email của admin user (nếu dùng email auth)

- [ ] **`ADMIN_PASSWORD`**
  - ✅ Password của admin user (sẽ được hash)
  - ⚠️ Phải là strong password

#### Environment-Specific

- [ ] **Development Environment** (nếu có)
  - `MONGODB_URI` (dev database)
  - `NEXTAUTH_URL` (localhost hoặc preview URL)
  - `NEXT_PUBLIC_SITE_URL` (localhost hoặc preview URL)

- [ ] **Preview Environment** (nếu có)
  - `MONGODB_URI` (staging database)
  - `NEXTAUTH_URL` (preview URL)
  - `NEXT_PUBLIC_SITE_URL` (preview URL)

### Verification

- [ ] Đã test tất cả env vars trong Vercel dashboard
- [ ] Không có placeholder values (VD: `EXAMPLE_ONLY_...`)
- [ ] Secrets được mark là "Encrypted" trong Vercel

---

## 2️⃣ Database Setup

### Production Database

- [ ] **MongoDB Connection**
  - ✅ Production database đã được tạo
  - ✅ Connection string đã được test
  - ✅ Network access đã được cấu hình (IP whitelist hoặc 0.0.0.0/0)

- [ ] **Database Indexes**
  - ✅ Đã chạy script tạo indexes trên Production DB:
    ```bash
    npx tsx scripts/create-product-indexes.ts
    ```
  - ✅ Đã chạy script tạo author indexes (nếu có):
    ```bash
    npx tsx scripts/create-author-indexes.ts
    ```
  - ✅ Kiểm tra indexes đã được tạo:
    - `products.collection_1`
    - `products.specialOccasions_1`
    - `products.relatedProducts_1`
    - `authors.slug_1` (unique)

- [ ] **Data Migration**
  - ✅ Đã chạy migration script cho existing products:
    ```bash
    npx tsx scripts/migrate-product-schema.ts
    ```
  - ✅ Kiểm tra products đã có default values cho new fields
  - ✅ Backup database trước khi migration (nếu có data quan trọng)

### Database Backup

- [ ] **Backup Strategy**
  - ✅ Đã setup automatic backup (MongoDB Atlas hoặc manual)
  - ✅ Backup schedule: Daily / Weekly
  - ✅ Backup retention: 30 days (recommended)

---

## 3️⃣ Code Quality & Cleanup

### Build Exclusions

- [ ] **Test Files**
  - ✅ Test files (`.test.ts`, `.test.tsx`) không được include trong build
  - ✅ `vitest.config.ts` đã exclude test files khỏi build

- [ ] **Scripts Folder**
  - ✅ Scripts folder không được include trong build
  - ✅ `.next` folder được git-ignored

- [ ] **Documentation**
  - ✅ `docs/` folder không được include trong build
  - ✅ Markdown files không được include trong build

### File Cleanup

- [ ] **Temporary Files**
  - ✅ Không có file `.tmp`, `.log` trong repo
  - ✅ Không có file test data trong production code

- [ ] **Sensitive Data**
  - ✅ Không có credentials trong code
  - ✅ Không có API keys hardcoded
  - ✅ `.env.local` được git-ignored

### Git Status

- [ ] **Uncommitted Changes**
  - ✅ Tất cả changes đã được commit
  - ✅ Không có uncommitted sensitive data

- [ ] **Git Ignore**
  - ✅ `.env.local` trong `.gitignore`
  - ✅ `.next/` trong `.gitignore`
  - ✅ `node_modules/` trong `.gitignore`

---

## 4️⃣ Security & Permissions

### Authentication

- [ ] **Admin Access**
  - ✅ Admin user đã được tạo với strong password
  - ✅ Admin credentials không được commit vào git
  - ✅ Admin password đã được change từ default

- [ ] **Role-Based Access**
  - ✅ CMS routes được protect với authentication
  - ✅ API routes có proper authorization checks
  - ✅ Admin-only endpoints có role check

### API Security

- [ ] **Input Validation**
  - ✅ Tất cả API routes có Zod validation
  - ✅ Không có `any` types trong API code
  - ✅ SQL injection protection (nếu có SQL queries)

- [ ] **Rate Limiting**
  - ✅ API routes có rate limiting (nếu implement)
  - ✅ Authentication endpoints có rate limiting

### Environment Security

- [ ] **Secrets Management**
  - ✅ Secrets được store trong Vercel (không hardcode)
  - ✅ Secrets được encrypt trong Vercel
  - ✅ Không có secrets trong client-side code

---

## 5️⃣ Performance Optimization

### Build Optimization

- [ ] **Bundle Size**
  - ✅ Bundle size < 1MB (lý tưởng)
  - ✅ Dynamic imports cho heavy libraries (Recharts, Tiptap)
  - ✅ Code splitting đã được optimize

- [ ] **Image Optimization**
  - ✅ Sử dụng `next/image` cho tất cả images
  - ✅ Images có proper `alt` text
  - ✅ Image sizes được optimize

### Runtime Performance

- [ ] **Database Queries**
  - ✅ Indexes đã được tạo cho frequent queries
  - ✅ Queries không có N+1 problems
  - ✅ Aggregation pipelines được optimize

- [ ] **Caching**
  - ✅ Static pages được cached (nếu có)
  - ✅ API responses có proper cache headers

---

## 6️⃣ Monitoring & Logging

### Error Tracking

- [ ] **Error Monitoring**
  - ✅ Error tracking service đã được setup (Sentry, LogRocket, etc.)
  - ✅ Production errors được log và alert

- [ ] **Console Logs**
  - ✅ Không có `console.log` trong production code
  - ✅ Chỉ có `console.error` cho critical errors

### Analytics

- [ ] **Analytics Setup**
  - ✅ Google Analytics hoặc analytics service đã được setup
  - ✅ Tracking code đã được verify

---

## 7️⃣ Vercel Configuration

### Project Settings

- [ ] **Framework Preset**
  - ✅ Framework: Next.js
  - ✅ Build Command: `npm run build` (default)
  - ✅ Output Directory: `.next` (default)

- [ ] **Node Version**
  - ✅ Node.js version: 18+ (check `package.json` engines)
  - ✅ Vercel đã được set đúng Node version

### Build Settings

- [ ] **Build Timeout**
  - ✅ Build timeout đủ lớn (default 45s, có thể tăng nếu cần)
  - ✅ Build không bị timeout

- [ ] **Install Command**
  - ✅ Install command: `npm install` (hoặc `npm ci`)

### Domain & DNS

- [ ] **Custom Domain**
  - ✅ Custom domain đã được add vào Vercel project
  - ✅ DNS records đã được configure đúng
  - ✅ SSL certificate đã được issue (automatic)

---

## 8️⃣ Post-Deployment Verification

### Smoke Tests

- [ ] **Homepage**
  - ✅ Homepage load được: `https://yourdomain.com`
  - ✅ Không có console errors
  - ✅ Images load được

- [ ] **Admin Login**
  - ✅ Admin login page load được: `https://yourdomain.com/admin/login`
  - ✅ Có thể login với admin credentials
  - ✅ Admin dashboard load được

- [ ] **Product Pages**
  - ✅ Product listing page load được
  - ✅ Product detail page load được
  - ✅ Product images hiển thị đúng

- [ ] **API Endpoints**
  - ✅ API endpoints trả về đúng response
  - ✅ Không có 500 errors
  - ✅ Authentication hoạt động đúng

### Feature Verification

- [ ] **New Features (Dec 2025)**
  - ✅ Gift wrapping options hiển thị (nếu product có `giftWrapping: true`)
  - ✅ 360° view hoạt động (nếu product có `images360`)
  - ✅ Combo products hiển thị (nếu product có `comboProducts`)
  - ✅ Product tabs hoạt động (Description, Specs, Reviews, Care)
  - ✅ Social share buttons hoạt động

- [ ] **Database**
  - ✅ Products được fetch từ database
  - ✅ New fields (material, dimensions, etc.) hiển thị đúng
  - ✅ Indexes đã được tạo và hoạt động

---

## 9️⃣ Rollback Plan

### Rollback Strategy

- [ ] **Git Tags**
  - ✅ Đã tag stable version trước khi deploy
  - ✅ Tag format: `v1.0.0` hoặc `deploy-YYYY-MM-DD`

- [ ] **Database Backup**
  - ✅ Database backup đã được tạo trước khi deploy
  - ✅ Backup location đã được document

- [ ] **Vercel Rollback**
  - ✅ Biết cách rollback trong Vercel dashboard
  - ✅ Previous deployment đã được mark là "stable"

### Emergency Contacts

- [ ] **Team Contacts**
  - ✅ DevOps engineer contact info
  - ✅ Backend developer contact info
  - ✅ Frontend developer contact info

---

## 🔟 Documentation

### Deployment Documentation

- [ ] **Deployment Guide**
  - ✅ `DEPLOYMENT_GUIDE.md` đã được cập nhật
  - ✅ Deployment steps đã được document

- [ ] **Changelog**
  - ✅ `CHANGELOG.md` đã được cập nhật với new features
  - ✅ Version number đã được bump

- [ ] **README**
  - ✅ `README.md` đã được cập nhật với new features
  - ✅ Tech stack đã được cập nhật

---

## ✅ Final Sign-off

### Pre-Deployment

- [ ] **Code Review**
  - ✅ Code đã được review bởi team
  - ✅ Không có blocking issues

- [ ] **Testing**
  - ✅ Unit tests đã pass
  - ✅ Integration tests đã pass (nếu có)
  - ✅ Manual QA đã được thực hiện

- [ ] **Documentation**
  - ✅ Documentation đã được cập nhật
  - ✅ Changelog đã được cập nhật

### Deployment Approval

- [ ] **Product Owner Approval**
  - ✅ Product Owner đã approve deployment

- [ ] **Tech Lead Approval**
  - ✅ Tech Lead đã approve deployment

- [ ] **DevOps Approval**
  - ✅ DevOps đã verify infrastructure

---

## 📊 Deployment Summary

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Version:** _______________  
**Environment:** Production / Staging  
**Git Commit:** _______________  
**Vercel Deployment URL:** _______________

### Issues Encountered

| Issue | Severity | Resolution | Notes |
|-------|----------|------------|-------|
|       |          |            |       |

### Post-Deployment Notes

- 
- 
- 

---

## ✅ Sign-off

- [ ] **Deployment Completed:** _______________
- [ ] **Smoke Tests Passed:** _______________
- [ ] **Monitoring Active:** _______________

**Status:** ✅ **READY FOR PRODUCTION** / ❌ **ISSUES FOUND**

---

**Generated:** 2025-12-04  
**Last Updated:** 2025-12-04

