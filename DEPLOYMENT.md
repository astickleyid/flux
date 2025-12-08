# Deployment Guide

## GitHub Pages Setup

### Step 1: Create GitHub Repository
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/flux.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**

### Step 3: Add Secrets
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `GEMINI_API_KEY`
4. Value: Your Google Gemini API key
5. Click **Add secret**

### Step 4: Deploy
```bash
git push origin main
```

Your site will be live at: `https://YOUR_USERNAME.github.io/flux/`

---

## Vercel Setup

### Option 1: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Import your GitHub repository
4. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your API key
5. Click **Deploy**

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

---

## Environment Variables

Both platforms need:
- `GEMINI_API_KEY` - Your Google Gemini API key

Get your API key at: https://aistudio.google.com/app/apikey

---

## Troubleshooting

### Build fails
- Make sure all dependencies are installed: `npm install --include=dev`
- Check that your API key is set correctly
- Verify Node.js version is 20 or higher

### App not loading
- Check browser console for errors
- Verify the base path in `vite.config.ts` matches your deployment
- For GitHub Pages: base should be `/flux/` (or your repo name)
- For Vercel: base should be `/`

### API errors
- Verify `GEMINI_API_KEY` is set in deployment platform
- Check API key is valid and has necessary permissions
- Review API usage limits

---

## Local Testing

Test production build locally:
```bash
npm run build
npm run preview
```
