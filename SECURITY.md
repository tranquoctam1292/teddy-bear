# 🔒 Security Policy

## 🚨 CRITICAL: Before Production Deployment

### 1. Environment Variables Security

**NEVER commit these files to git:**
- `.env.local`
- `.env.production`
- `.env.development.local`
- Any file containing real credentials

**Checklist:**
- [ ] Changed default admin password
- [ ] Generated strong AUTH_SECRET (32+ characters)
- [ ] Set production MONGODB_URI
- [ ] Configured BLOB_READ_WRITE_TOKEN
- [ ] Updated NEXT_PUBLIC_SITE_URL to production domain

### 2. Generate Secure Secrets

#### AUTH_SECRET (Required)
```bash
# Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Linux/Mac:
openssl rand -base64 32
```

#### Admin Password (Required)
- Minimum 12 characters
- Include uppercase, lowercase, numbers, symbols
- Never use: `admin123`, `password`, `12345678`

### 3. MongoDB Security

**Development:**
```
mongodb://localhost:27017/teddy-shop
```

**Production (MongoDB Atlas):**
```
mongodb+srv://username:password@cluster.mongodb.net/teddy-shop?retryWrites=true&w=majority
```

**Best Practices:**
- Use IP whitelist
- Enable authentication
- Use strong passwords
- Regular backups

### 4. Vercel Deployment Security

**Environment Variables to Set:**
1. Go to: `https://vercel.com/your-project/settings/environment-variables`
2. Add all variables from `.env.example`
3. Use different values for production!

**Production Checklist:**
- [ ] All env vars set in Vercel dashboard
- [ ] No `.env.local` in repository
- [ ] AUTH_SECRET is production-grade
- [ ] Admin password changed from default
- [ ] MongoDB connection uses Atlas (not localhost)
- [ ] BLOB_READ_WRITE_TOKEN is production token

### 5. Files NEVER to Commit

```
.env.local
.env.production.local
*.key
*.pem
credentials.json
secrets.json
*.sql
*.dump
```

These are already in `.gitignore` but **double-check before pushing!**

### 6. Verify Before Push

```bash
# Check what files will be committed
git status

# Check for sensitive data
git diff

# Verify .env.local is NOT tracked
git ls-files | grep ".env.local"
# Should return nothing!
```

### 7. If You Accidentally Committed Secrets

**IMMEDIATE ACTIONS:**
1. Rotate ALL compromised credentials
2. Change passwords immediately
3. Generate new AUTH_SECRET
4. Update MongoDB password
5. Regenerate Vercel Blob token

**Remove from git history:**
```bash
# Remove file from git history (use with caution!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history!)
git push origin --force --all
```

### 8. Security Headers

Already configured in `next.config.ts`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### 9. Regular Security Audits

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### 10. Reporting Security Issues

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email: security@yourdomain.com
- Include: description, steps to reproduce, impact

---

## ✅ Security Checklist Summary

Before deploying to production:

- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded credentials in code
- [ ] Strong AUTH_SECRET generated
- [ ] Admin password changed from default
- [ ] Production MongoDB configured
- [ ] All env vars set in Vercel
- [ ] Security headers enabled
- [ ] Dependencies updated
- [ ] No sensitive files in git
- [ ] `.gitattributes` configured

---

## 🛡️ Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Vercel Security](https://vercel.com/docs/security)

---

**🔒 Security is not optional - it's mandatory!**

