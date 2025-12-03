# 🚀 Deployment Guide - Teddy Shop

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All features tested and working
- [ ] No linter errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] All dependencies installed
- [ ] Environment variables documented
- [ ] Sensitive data removed from code
- [ ] Console.logs removed from production code

### 2. Database Preparation
- [ ] MongoDB Atlas account created (or production DB ready)
- [ ] Database backup taken
- [ ] Collections indexed for performance
- [ ] Admin user created
- [ ] Test data cleaned (if any)

### 3. Environment Configuration
- [ ] Production `.env` file ready
- [ ] All API keys configured
- [ ] SMTP settings configured (for emails)
- [ ] Payment gateway credentials ready
- [ ] Vercel Blob setup (for media storage)

---

## Deployment Options

### Option 1: Vercel (Recommended) ⚡

#### Why Vercel?
- ✅ Built for Next.js
- ✅ Automatic deployments
- ✅ CDN included
- ✅ Edge functions
- ✅ Free SSL
- ✅ Easy environment variables
- ✅ Vercel Blob already integrated

#### Steps:

**1. Prepare Repository**
```bash
# Make sure everything is committed
git add .
git commit -m "Production ready"
git push origin main
```

**2. Sign Up / Login to Vercel**
- Go to https://vercel.com
- Sign up with GitHub
- Grant Vercel access to your repository

**3. Import Project**
- Click "New Project"
- Select your repository
- Configure project:
  - Framework Preset: Next.js
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `.next`

**4. Environment Variables**
Add all environment variables in Vercel dashboard:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teddy-shop

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here-generate-new-one

# Vercel Blob (automatically provided by Vercel)
BLOB_READ_WRITE_TOKEN=vercel_blob_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Teddy Shop

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment Gateways (configure in admin after deployment)
# These can be set via admin panel

# Google Services (optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_SEARCH_CONSOLE_ID=your-gsc-id
```

**5. Deploy**
- Click "Deploy"
- Wait for build to complete (2-5 minutes)
- Check deployment logs for errors
- Visit your deployment URL

**6. Post-Deployment**
- [ ] Test login at `your-domain.vercel.app/admin/login`
- [ ] Verify all pages load
- [ ] Test CRUD operations
- [ ] Check database connections
- [ ] Configure custom domain (if any)

**7. Custom Domain (Optional)**
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions
- Wait for DNS propagation (can take 24-48 hours)

---

### Option 2: Railway 🚂

#### Why Railway?
- ✅ Simple deployment
- ✅ Automatic HTTPS
- ✅ Environment variables
- ✅ MongoDB hosting option
- ✅ Good free tier

#### Steps:

**1. Sign Up**
- Go to https://railway.app
- Sign up with GitHub

**2. New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

**3. Configure**
- Railway auto-detects Next.js
- Add environment variables in Variables tab
- Same variables as Vercel section above

**4. Deploy**
- Railway automatically builds and deploys
- Get your deployment URL
- Test the application

---

### Option 3: DigitalOcean App Platform 🌊

#### Why DigitalOcean?
- ✅ Good performance
- ✅ Predictable pricing
- ✅ MongoDB hosting available
- ✅ Professional infrastructure

#### Steps:

**1. Create Account**
- Go to https://www.digitalocean.com
- Sign up and add payment method

**2. Create App**
- Click "Create" → "Apps"
- Choose GitHub
- Select repository
- Configure:
  - Resource Type: Web Service
  - Branch: main
  - Build Command: `npm run build`
  - Run Command: `npm start`

**3. Environment Variables**
- Add all variables from `.env` file
- Use same structure as Vercel section

**4. Deploy**
- Click "Create Resources"
- Wait for build
- Test deployment

---

### Option 4: Self-Hosted (VPS) 🖥️

#### Requirements:
- Ubuntu 20.04+ server
- Minimum 2GB RAM
- Node.js 18+
- PM2 process manager
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)

#### Steps:

**1. Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

**2. Clone Repository**
```bash
cd /var/www
sudo git clone https://github.com/your-username/teddy-shop.git
cd teddy-shop
sudo chown -R $USER:$USER /var/www/teddy-shop
```

**3. Install Dependencies**
```bash
npm install
```

**4. Environment Variables**
```bash
# Create .env file
nano .env

# Paste all environment variables
# Save and exit (Ctrl+X, Y, Enter)
```

**5. Build Application**
```bash
npm run build
```

**6. Start with PM2**
```bash
pm2 start npm --name "teddy-shop" -- start
pm2 save
pm2 startup
```

**7. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/teddy-shop
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/teddy-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**8. SSL Certificate**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Post-Deployment Configuration

### 1. Admin Setup
- [ ] Login to admin panel
- [ ] Create additional admin users (if needed)
- [ ] Configure site settings
- [ ] Upload logo and favicon
- [ ] Set up navigation menus

### 2. Payment Gateways
- [ ] Configure VNPay credentials
- [ ] Configure MoMo credentials
- [ ] Test payments in test mode
- [ ] Switch to production mode when ready

### 3. Email Configuration
- [ ] Test SMTP connection in Settings → Notifications
- [ ] Send test email
- [ ] Configure email templates

### 4. SEO Setup
- [ ] Generate sitemap: `/api/admin/seo/sitemap`
- [ ] Submit sitemap to Google Search Console
- [ ] Configure Google Analytics (if using)
- [ ] Set up robots.txt
- [ ] Configure social media previews

### 5. Content Migration
- [ ] Import products (if any)
- [ ] Import blog posts (if any)
- [ ] Upload media files
- [ ] Create initial pages

### 6. Performance Optimization
- [ ] Enable caching (if applicable)
- [ ] Compress images
- [ ] Enable CDN (Vercel includes this)
- [ ] Test page speed with Google PageSpeed Insights

---

## Monitoring & Maintenance

### 1. Uptime Monitoring
Set up monitoring with:
- UptimeRobot (free)
- Pingdom
- New Relic
- Vercel Analytics (built-in)

### 2. Error Tracking
Consider adding:
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics (user analytics)

### 3. Database Backups
- [ ] Set up automated MongoDB backups
- [ ] Test backup restoration
- [ ] Store backups off-site
- [ ] Schedule weekly backups

### 4. Security
- [ ] Enable rate limiting (if not already)
- [ ] Set up WAF (Web Application Firewall)
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Regular security audits

### 5. Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test thoroughly after updates
npm run build
npm test
```

---

## Troubleshooting

### Build Errors

**Error: Out of memory**
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Runtime Errors

**Error: Cannot connect to MongoDB**
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Check database user permissions

**Error: NextAuth configuration error**
- Verify `NEXTAUTH_URL` matches your domain
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`

**Error: Images not loading**
- Check Vercel Blob is configured
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check CORS settings

---

## Performance Checklist

- [ ] Enable Next.js Image Optimization
- [ ] Use ISR (Incremental Static Regeneration) where applicable
- [ ] Implement caching strategy
- [ ] Lazy load components
- [ ] Compress assets
- [ ] Use CDN for static files
- [ ] Monitor Core Web Vitals

---

## Rollback Plan

If deployment fails:

**Vercel:**
- Go to Deployments
- Find previous working deployment
- Click "..." → "Promote to Production"

**Railway:**
- Go to Deployments
- Select previous deployment
- Click "Redeploy"

**Self-Hosted:**
```bash
cd /var/www/teddy-shop
git log  # Find previous commit
git checkout <commit-hash>
npm install
npm run build
pm2 restart teddy-shop
```

---

## Success Criteria

Deployment is successful when:
- [ ] Site loads at production URL
- [ ] Admin login works
- [ ] All pages accessible
- [ ] Database operations work
- [ ] Images upload successfully
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Page load < 3 seconds
- [ ] SSL certificate active
- [ ] Analytics tracking works

---

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

### Community
- Next.js Discord
- Stack Overflow
- GitHub Issues

### Professional Support
Consider hiring DevOps engineer for:
- Complex infrastructure
- High-traffic optimization
- Security hardening
- 24/7 monitoring

---

## Deployment Timeline

**Estimated Time:**
- Code preparation: 1-2 hours
- Deployment setup: 30 minutes
- Testing: 1-2 hours
- Configuration: 1 hour
- DNS propagation (custom domain): 24-48 hours

**Total: 3-5 hours** (excluding DNS wait time)

---

## Cost Estimates

### Vercel (Recommended for MVP)
- **Free Tier:** Good for development
- **Pro Plan:** $20/month (production)
- Includes: Hosting, CDN, SSL, Serverless Functions

### Alternative Hosting
- **Railway:** ~$5-20/month
- **DigitalOcean:** $12-25/month (App Platform)
- **VPS:** $5-10/month + management time

### Additional Services
- **MongoDB Atlas:** Free tier (512MB) or $9+/month
- **Vercel Blob:** Pay as you go (~$0.15/GB)
- **Domain:** $10-15/year
- **Email Service:** Free (Gmail) or $5+/month (SendGrid)

**Total Monthly Cost (Estimated):** $20-50/month for production

---

**Ready to deploy?** Follow the Vercel instructions above for the fastest path to production! 🚀

