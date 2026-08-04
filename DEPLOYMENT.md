# Aegis Command Center - Deployment Guide

## Quick Start to Vercel Deployment

### Prerequisites
- GitHub account with repository access
- Vercel account (free tier available)
- Node.js 18+ installed locally

### Step 1: Prepare Your Local Environment

```bash
# Install dependencies
npm install

# Verify build works locally
npm run build

# Preview the production build
npm run preview
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Select project settings
# - Confirm deployment
```

#### Option B: GitHub Integration (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables (if needed)
6. Click "Deploy"

### Step 3: Configure Environment Variables (If Needed)

In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add any `VITE_*` variables needed:
   ```
   VITE_API_URL=https://your-api.example.com
   VITE_APP_ENV=production
   ```

### Step 4: Automatic Deployments

After initial deployment, Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Handles SSL certificates
- Provides edge caching

---

## Project Configuration Files

### vercel.json
- **Purpose**: Configure Vercel build and deployment settings
- **Key Settings**:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Cache headers for static assets
  - SPA routing configuration
  - PWA support headers

### tailwind.config.js
- **Purpose**: Configure Tailwind CSS with custom Aegis theme
- **Includes**:
  - `aegis-black` color palette
  - `aegis-gold` color gradients
  - Custom box shadows for glowing effects
  - Extended borderRadius

### postcss.config.js
- **Purpose**: Process Tailwind CSS and autoprefixer
- **Plugins**:
  - tailwindcss: CSS utility generation
  - autoprefixer: Cross-browser CSS compatibility

### .gitignore
- Excludes build artifacts, node_modules, and environment files
- Keeps repository clean and lightweight

### .vercelignore
- Prevents Vercel from processing unnecessary files
- Speeds up build time

### .env.example
- Template for environment variables
- Document all available `VITE_*` options
- Copy to `.env.local` for local development

---

## Troubleshooting Deployment

### Build Fails with Module Errors

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Missing Environment Variables

Ensure all required `VITE_*` variables are set in:
1. Vercel project dashboard
2. Local `.env.local` for testing

### Route Issues on Vercel

The `vercel.json` rewrites all routes to `index.html` for SPA routing. Verify routes work:
- Direct URL access: `https://your-domain.vercel.app/history`
- Back button: Should navigate correctly
- Refresh page: Should load correct view

### PWA Issues

Service Workers cached on old version? Clear:
1. Browser cache
2. Application storage in DevTools
3. Service Worker registrations

---

## Performance Optimization

### Vercel Edge Caching

Files are cached based on headers in `vercel.json`:
- **Immutable assets** (JS, CSS): 1 year cache
- **Manifest**: No cache (must always be fresh)
- **Service Worker**: No cache (critical for updates)

### Build Optimization

1. **Code Splitting**: Vite automatically splits chunks
2. **CSS Optimization**: Tailwind purges unused styles
3. **Asset Minification**: Automatic during build

Monitor performance:
```bash
npm run build  # Check bundle size
npm run preview  # Test locally before pushing
```

---

## Post-Deployment Checklist

- [ ] Verify deployment URL works
- [ ] Test all navigation routes
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Verify environment variables are loaded
- [ ] Test offline functionality (PWA)
- [ ] Check browser console for errors
- [ ] Monitor Vercel Analytics dashboard
- [ ] Set up custom domain (if needed)

---

## Next Steps

### Before Production

1. Complete open issues:
   - #2: Rebuild Dashboard UI
   - #3: Mission log CRUD
   - #4: Backup & Restore
   - #5: Statistic engine

2. Security review:
   - Validate all user inputs
   - Sanitize data before storage
   - Use HTTPS for API calls

3. Testing:
   - Run `npm run lint` before push
   - Test in multiple browsers
   - Verify mobile experience

### Post-Deployment Monitoring

1. **Vercel Analytics**: Monitor performance metrics
2. **Error Tracking**: Set up error logging service
3. **User Feedback**: Collect feedback from users
4. **Metrics**: Track key usage patterns

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Guide**: https://vitejs.dev/
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## Deployment Summary

✅ **Configuration Files Created**:
- `vercel.json` - Vercel deployment config
- `tailwind.config.js` - Tailwind CSS theme
- `postcss.config.js` - PostCSS processors
- `.gitignore` - Git exclusions
- `.vercelignore` - Vercel exclusions
- `.env.example` - Environment template
- `.eslintignore` - ESLint exclusions
- `README.md` - Project documentation

✅ **Ready to Deploy**: Push to GitHub and connect to Vercel for automatic deployments!
