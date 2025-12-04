# 🔧 Troubleshooting Guide

> Quick solutions for common issues in Teddy Shop

---

## 🚨 Common Issues

### 1. AUTH_SECRET Error

**Error:**
```
Error: AUTH_SECRET is required. Generate with: openssl rand -base64 32
```

**Solution:**

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Add to `.env.local`:
```env
AUTH_SECRET=your-generated-secret-here
```

---

### 2. MongoDB Connection Error

**Error:**
```
Error: MongoDB URI is not configured
```

**Solution:**

1. Check `.env.local` exists and contains:
```env
MONGODB_URI=mongodb://localhost:27017/teddy-shop
# or MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teddy-shop
```

2. Test connection:
```bash
npm run test:db
```

3. For MongoDB Atlas:
   - Whitelist IP: `0.0.0.0/0` (or your specific IP)
   - Check username/password
   - Verify network access

---

### 3. Admin Login Not Working

**Error:**
```
Invalid credentials
```

**Solution:**

1. Reset admin password:
```bash
npm run reset:admin
```

2. Check `.env.local`:
```env
ADMIN_EMAIL=admin@emotionalhouse.vn
ADMIN_PASSWORD=your-password-here
```

3. Clear browser cookies/localStorage
4. Try login again

---

### 4. Build Errors

**Error:**
```
Module not found
```

**Solution:**

```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

**Error:**
```
Out of memory
```

**Solution:**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

### 5. TypeScript Errors

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solution:**

1. Check type definitions:
```bash
npm run type-check
```

2. Common fixes:
   - Add proper type annotations
   - Use type assertions: `as Type`
   - Check imports

3. Strict mode issues:
   - See `tsconfig.json`
   - Temporarily disable strict checks if needed

---

### 6. Image Upload Not Working

**Error:**
```
Failed to upload image
```

**Solution:**

1. Check Vercel Blob token:
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

2. Get token from:
   - https://vercel.com/dashboard/stores
   - Create new Blob store if needed

3. Test upload in Media Library

---

### 7. NextAuth Session Error

**Error:**
```
[auth][error] JWTSessionError: no matching decryption secret
```

**Solution:**

This is **NORMAL** after changing `AUTH_SECRET`:

1. Clear browser cookies
2. Logout and login again
3. All old sessions are invalidated (security feature)

---

### 8. Port Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solution:**

**Windows:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find and kill
lsof -ti:3000 | xargs kill -9
```

Or use different port:
```bash
PORT=3001 npm run dev
```

---

### 9. Vercel Deployment Fails

**Error:**
```
Build failed
```

**Solution:**

1. Check environment variables in Vercel:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN`

2. Check build locally first:
```bash
npm run build
```

3. Check Vercel logs for specific errors

4. Common issues:
   - Missing env vars
   - TypeScript errors
   - Import errors

---

### 10. 404 Errors in Production

**Error:**
```
Page not found
```

**Solution:**

1. Check route exists in `src/app/`
2. Verify file naming (Next.js conventions)
3. Check dynamic routes: `[id]` folders
4. Clear Vercel cache and redeploy

---

## 🛠️ Development Issues

### Hot Reload Not Working

**Solution:**
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### Slow Build Times

**Solution:**
1. Clear `.next` folder
2. Update dependencies
3. Check for circular imports
4. Use `npm run build` with `--profile` flag

---

## 🗄️ Database Issues

### Collections Not Found

**Solution:**
```bash
# Verify MongoDB connection
npm run test:db

# Check collections exist
# Use MongoDB Compass to inspect
```

### Data Migration Issues

**Solution:**
```bash
# Run migration scripts
npm run migrate
npm run seed:settings
```

---

## 🔒 Security Issues

### CORS Errors

**Solution:**

Check `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
```

### Rate Limiting

If you're rate limited:
1. Wait a few minutes
2. Check `src/lib/rate-limit.ts`
3. Adjust limits if needed (development only)

---

## 📞 Getting Help

### Still Stuck?

1. **Check logs:**
   - Browser console (F12)
   - Terminal output
   - Vercel deployment logs

2. **Search error message:**
   - Google the exact error
   - Check Next.js docs
   - Check MongoDB docs

3. **Review documentation:**
   - `README.md` - Quick start
   - `MASTER_DOCUMENTATION.md` - Complete guide
   - `DEPLOYMENT_GUIDE.md` - Deploy help

4. **Common resources:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [MongoDB Docs](https://docs.mongodb.com)
   - [Vercel Docs](https://vercel.com/docs)
   - [NextAuth Docs](https://authjs.dev)

---

## 🎯 Quick Diagnostics

### Health Check Commands

```bash
# Test MongoDB
npm run test:db

# Check TypeScript
npm run type-check

# Test build
npm run build

# Verify indexes
npm run verify:indexes

# Test connections
npm run test:connections
```

### Environment Check

```bash
# Verify .env.local exists
ls -la .env.local

# Check required variables
cat .env.local | grep -E "(MONGODB_URI|AUTH_SECRET|ADMIN_EMAIL)"
```

---

## 📊 Performance Issues

### Slow Page Load

1. Check database queries
2. Optimize images (use Next.js Image)
3. Enable caching
4. Use CDN (Vercel provides this)

### High Memory Usage

1. Check for memory leaks
2. Optimize large data fetches
3. Use pagination
4. Clear unused dependencies

---

## 🎉 Prevention Tips

### Best Practices

1. **Always use `.env.local`** for local development
2. **Never commit secrets** to git
3. **Test locally** before deploying
4. **Keep dependencies updated**
5. **Use TypeScript** for type safety
6. **Monitor logs** regularly
7. **Backup database** before major changes

### Development Workflow

```bash
# 1. Pull latest
git pull

# 2. Install deps
npm install

# 3. Check types
npm run type-check

# 4. Test locally
npm run dev

# 5. Build test
npm run build

# 6. Deploy
git push
```

---

**Last Updated:** December 2025  
**Status:** ✅ Comprehensive troubleshooting guide

**Need more help?** Check `MASTER_DOCUMENTATION.md` for detailed information.

