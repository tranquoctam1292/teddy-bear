# ⚡ Quick Start Guide

> Get Teddy Shop running in 5 minutes!

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **MongoDB** running (local or Atlas)
- **Git** installed
- **Code editor** (VS Code recommended)

---

## 🚀 Installation Steps

### Step 1: Clone & Install (2 minutes)

```bash
# Clone repository
git clone <your-repo-url>
cd teddy-shop

# Install dependencies
npm install
```

### Step 2: Environment Setup (2 minutes)

**Create `.env.local` file:**

```bash
# Copy example (if exists)
cp .env.example .env.local

# Or create manually
touch .env.local
```

**Add these variables to `.env.local`:**

```env
# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/teddy-shop

# Authentication (REQUIRED)
AUTH_SECRET=your-secret-here
ADMIN_EMAIL=admin@emotionalhouse.vn
ADMIN_PASSWORD=your-password-here

# Site URLs (REQUIRED)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# File Storage (Optional - for uploads)
# BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

**Generate AUTH_SECRET:**

**Windows:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

### Step 3: Database Setup (1 minute)

```bash
# Test MongoDB connection
npm run test:db

# Create admin user
npm run reset:admin
```

**Note:** Admin credentials will be shown in terminal output.

### Step 4: Run Development Server (30 seconds)

```bash
npm run dev
```

**Open in browser:**
- **Shop:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Dev server starts without errors
- [ ] MongoDB connection successful
- [ ] Can access homepage (http://localhost:3000)
- [ ] Can access admin login (http://localhost:3000/admin/login)
- [ ] Can login with admin credentials
- [ ] Admin dashboard loads

---

## 🎯 What's Next?

### Explore Admin Panel

**Content Management:**
- `/admin/posts` - Create blog posts
- `/admin/pages` - Create landing pages
- `/admin/media` - Upload images

**E-commerce:**
- `/admin/products` - Add products
- `/admin/orders` - Manage orders
- `/admin/customers` - View customers

**Settings:**
- `/admin/settings/appearance` - Customize theme
- `/admin/settings/navigation` - Build menus
- `/admin/seo` - SEO tools

### Test Features

1. **Upload an image** in Media Library
2. **Create a blog post** with rich text
3. **Add a product** with variants
4. **Customize appearance** (logo, colors)
5. **View analytics** dashboard

---

## 🔧 Common Issues

### MongoDB Connection Failed

**Error:** `MongoDB URI is not configured`

**Fix:**
```bash
# Check MongoDB is running
# Windows: Check Services
# Mac: brew services list
# Linux: systemctl status mongod

# Or use MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/teddy-shop
```

### AUTH_SECRET Error

**Error:** `AUTH_SECRET is required`

**Fix:** Generate and add to `.env.local` (see Step 2)

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Fix:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill existing process
# Windows: taskkill /F /IM node.exe
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

### Admin Login Not Working

**Fix:**
```bash
# Reset admin password
npm run reset:admin

# Check credentials in .env.local
# Clear browser cookies
```

**More issues?** See `TROUBLESHOOTING.md`

---

## 📚 Documentation

### Essential Docs

- **README.md** - Project overview
- **MASTER_DOCUMENTATION.md** - Complete reference
- **DEPLOYMENT_GUIDE.md** - Deploy to production
- **TROUBLESHOOTING.md** - Fix common issues
- **ENV_SETUP.md** - Environment variables guide

### Quick Links

- **Database:** `DATABASE_SCHEMA.md`
- **Testing:** `TESTING_CHECKLIST.md`
- **Security:** `SECURITY.md`
- **Features:** `ADMIN_FEATURES_ROADMAP.md`

---

## 🎓 Learning Path

### For Beginners

1. **Day 1:** Setup and explore admin panel
2. **Day 2:** Create content (posts, pages, media)
3. **Day 3:** Add products and test checkout
4. **Day 4:** Customize appearance
5. **Day 5:** Deploy to production

### For Developers

1. Read `MASTER_DOCUMENTATION.md`
2. Explore `src/` folder structure
3. Review API routes in `src/app/api/`
4. Check database schema
5. Start customizing

---

## 💡 Pro Tips

### Development

- Use **VS Code** with TypeScript extension
- Enable **ESLint** for code quality
- Use **Prettier** for formatting
- Check **TypeScript errors**: `npm run type-check`

### Performance

- Images auto-optimized by Next.js
- Use **MongoDB indexes** (run `npm run setup:indexes`)
- Enable **caching** in production
- Monitor with **Vercel Analytics**

### Security

- **Never commit** `.env.local` to git
- Use **strong passwords** in production
- Keep **dependencies updated**
- Enable **rate limiting** (already configured)

---

## 🚀 Deploy to Production

**Ready to go live?**

1. Read `DEPLOYMENT_GUIDE.md`
2. Push to GitHub
3. Deploy to Vercel (recommended)
4. Add environment variables
5. Configure domain

**Quick deploy:**
```bash
git push origin main
# Then visit: https://vercel.com/new
```

---

## 📞 Need Help?

### Resources

- **Documentation:** `/docs` folder
- **Troubleshooting:** `TROUBLESHOOTING.md`
- **Issues:** Check GitHub Issues
- **Community:** Next.js Discord

### Support Channels

1. Check documentation first
2. Search error messages
3. Review troubleshooting guide
4. Check Next.js/MongoDB docs
5. Ask in community forums

---

## 🎉 Success!

**You now have a fully functional e-commerce platform!**

### What You Can Do

✅ Manage content (CMS)  
✅ Sell products (E-commerce)  
✅ Track analytics (Business Intelligence)  
✅ Optimize SEO (SEO Tools)  
✅ Customize appearance (Theme)  
✅ Engage customers (Marketing)

### Next Steps

- [ ] Customize branding (logo, colors)
- [ ] Add your products
- [ ] Create content pages
- [ ] Configure payment gateways
- [ ] Deploy to production
- [ ] Start selling! 💰

---

**Built with ❤️ using Next.js 16 + React 19 + MongoDB**

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** 🟢 Production Ready

---

**🎊 Happy Building! 🧸**

