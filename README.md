# 🧸 Teddy Shop - E-commerce Platform

> Professional e-commerce platform with complete admin panel

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

### 🛍️ E-commerce
- Product management with variants
- Shopping cart & checkout
- Order management
- Payment gateways (VNPay, MoMo, PayPal, Stripe, COD)
- Inventory tracking

### 📝 Content Management
- Blog posts with rich editor
- Landing pages (hierarchical)
- Media library
- Comments system

### 📊 Analytics & Marketing
- Sales analytics with charts
- Customer insights
- Coupon management
- Email campaigns

### 🔍 SEO Tools
- Keyword tracking
- SEO analysis
- Sitemap generator
- Redirects manager
- Image alt audit

### 🎨 Customization
- Theme settings
- Navigation builder
- Logo & favicon
- Custom CSS/JS

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Vercel account (for deployment)

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd teddy-shop

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Setup database
npm run test:db
npm run reset:admin

# 5. Run development server
npm run dev
```

Visit: `http://localhost:3000`  
Admin: `http://localhost:3000/admin/login`

**🔒 Admin Access:**

Create an admin user:
```bash
npm run reset:admin
```

This will create an admin account with credentials shown in the terminal output.

**⚠️ CRITICAL SECURITY WARNING:**
- **NEVER commit credentials to git!**
- **ALWAYS use strong, unique passwords in production!**
- **Change default passwords immediately after first login!**
- Admin credentials should only be in `.env.local` (git-ignored)
- For production: Use password manager and enable 2FA
- See `ENV_SETUP.md` for secure configuration

---

## 📁 Project Structure

```
teddy-shop/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel (60+ pages)
│   │   ├── api/                # API routes (110+ endpoints)
│   │   └── (shop)/             # Public shop pages
│   ├── components/
│   │   ├── admin/              # Admin components (110+ files)
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI components
│   ├── lib/
│   │   ├── types/              # TypeScript types
│   │   ├── schemas/            # Validation schemas
│   │   └── db.ts               # Database connection
│   └── store/                  # State management
├── public/                     # Static assets
├── scripts/                    # Utility scripts
└── docs/                       # Documentation
```

---

## 🗄️ Database

### MongoDB Collections (25+)
- **Core:** products, orders, carts, users
- **Content:** posts, pages, media, comments
- **Settings:** categories, tags, attributes
- **SEO:** seoAnalysis, keywordTracking, redirects
- **Payments:** transactions, paymentGateways
- **Marketing:** coupons, emailCampaigns

### Backup
```bash
mongodump --uri="<MONGODB_URI>" --out=./backup
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test:db          # Test MongoDB connection
npm run reset:admin      # Reset admin password
npm run seed:settings    # Seed initial settings
```

### Environment Variables

See `ENV_SETUP.md` for complete list.

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - Site URL
- `NEXTAUTH_SECRET` - Auth secret key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# Visit: https://vercel.com/new

# 3. Configure
# Add environment variables
# Deploy
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📚 Documentation

### Essential Docs
- **[MASTER_DOCUMENTATION.md](./MASTER_DOCUMENTATION.md)** - Complete guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Testing guide
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database structure
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment configuration

### Implementation Docs
- **[COMPLETE_IMPLEMENTATION_SUMMARY.md](./COMPLETE_IMPLEMENTATION_SUMMARY.md)** - All phases
- **[ADMIN_FEATURES_ROADMAP.md](./ADMIN_FEATURES_ROADMAP.md)** - Feature roadmap

---

## 🎯 Features Status

### ✅ Completed (100%)
- Phase 1-5: Core features
- Phase 6: Media Management
- Phase 7: Pages Management
- Phase 8: Comments System
- Phase 9: Payments & Transactions
- Phase 10: Analytics Dashboard
- Phase 11: Marketing Tools
- Phase 12: SEO Tools
- Phase 13: Appearance

### 🔮 Future Enhancements
- Advanced widgets system
- Page builder (drag & drop)
- Multi-language support
- Advanced permissions
- Activity logs

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Next.js team for amazing framework
- MongoDB for database
- Vercel for hosting
- Tailwind CSS for styling
- Tiptap for rich text editor
- Recharts for data visualization

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues
- **Email:** support@teddyshop.com

---

## 🎉 Status

**Version:** 1.0.0  
**Status:** 🟢 Production Ready  
**Last Updated:** December 2025

**Built with ❤️ for modern e-commerce**
