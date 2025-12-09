# Google OAuth Sign-In Fix for Vercel Deployment

## The Problem
Users are redirected to Google, authenticate successfully, but then get redirected back to the home page without being logged in.

## Root Causes
1. **Missing Redirect URL in Supabase** - Your Vercel URL needs to be added to Supabase's allowed OAuth redirect URLs
2. **OAuth Callback Not Configured** - Supabase needs to know where to send users after Google authentication

## Fix Steps

### Step 1: Add Vercel URL to Supabase Dashboard

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add these URLs to **Redirect URLs**:
   ```
   https://flux-caoauryck-lemxnaidhead-6918s-projects.vercel.app
   https://flux-caoauryck-lemxnaidhead-6918s-projects.vercel.app/
   http://localhost:5173
   http://localhost:5173/
   ```

5. Set **Site URL** to:
   ```
   https://flux-caoauryck-lemxnaidhead-6918s-projects.vercel.app
   ```

### Step 2: Configure Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one in your `client_secret_*.json` file)
3. Click **Edit** on the OAuth client
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
   
5. Under **Authorized JavaScript origins**, add:
   ```
   https://flux-caoauryck-lemxnaidhead-6918s-projects.vercel.app
   https://YOUR_PROJECT_REF.supabase.co
   ```

6. Click **Save**

### Step 3: Get Your Supabase Project Reference

```bash
# If you have Supabase CLI linked
supabase projects list

# Or find it in your Supabase Dashboard URL:
# https://supabase.com/dashboard/project/YOUR_PROJECT_REF
```

### Step 4: Verify Environment Variables in Vercel

Make sure these are set in Vercel (they already are, but verify the values):

```bash
vercel env ls
```

Should show:
- `VITE_SUPABASE_URL` - Your Supabase project URL (NOT localhost)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `GEMINI_API_KEY` - Your Gemini API key

**IMPORTANT**: Make sure `VITE_SUPABASE_URL` is your **production Supabase URL**, not `http://127.0.0.1:54321`

Example:
```
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
```

### Step 5: Redeploy

After making the above changes:

```bash
git add -A
git commit -m "Fix OAuth redirect configuration"
git push origin main
```

Or manually trigger a redeploy in Vercel dashboard.

## Verification

1. Go to your Vercel deployment URL
2. Click "Continue with Google"
3. Select your Google account
4. You should be redirected back AND logged in

## Debugging

If it still doesn't work, check:

### 1. Browser Console
Open DevTools (F12) and look for errors related to:
- `supabase.auth.signInWithOAuth`
- CORS errors
- Redirect errors

### 2. Supabase Auth Logs
In Supabase Dashboard:
- Go to **Authentication** → **Logs**
- Look for failed sign-in attempts
- Check for redirect URL mismatches

### 3. Check Network Tab
1. Open DevTools → Network tab
2. Click "Continue with Google"
3. Look for the redirect chain:
   - Your app → Google → Supabase callback → Your app
4. Look for any failed requests or 400/500 errors

## Common Issues

### Issue: "Invalid redirect URL"
**Fix**: Make sure the exact URL (including trailing slash or not) is added to Supabase's allowed redirect URLs

### Issue: "Cross-site request blocked"
**Fix**: Add your Vercel domain to Google Cloud Console's Authorized JavaScript origins

### Issue: Session not persisting
**Fix**: Check that `detectSessionInUrl: true` is set in supabase client config (already done in `services/api/supabase.ts`)

### Issue: Still using localhost
**Fix**: Update Vercel environment variables:
```bash
vercel env rm VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_URL
# Enter your production Supabase URL: https://xxx.supabase.co
```

## Quick Command Reference

```bash
# Check Vercel deployments
vercel ls

# Check environment variables
vercel env ls

# Pull latest env vars locally
vercel env pull

# Redeploy
vercel --prod

# Check Supabase status (local)
npm run supabase:status
```

## What I Already Fixed

✅ Updated OAuth redirect in `hooks/useAuth.ts` to include trailing slash and proper query params
✅ Added `access_type: 'offline'` and `prompt: 'consent'` for better OAuth flow

## Next Steps for You

1. ⬜ Add Vercel URL to Supabase Dashboard redirect URLs
2. ⬜ Add Supabase callback URL to Google Cloud Console
3. ⬜ Verify `VITE_SUPABASE_URL` in Vercel is production URL (not localhost)
4. ⬜ Redeploy and test

---

**Need more help?** 
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Google OAuth Setup: https://supabase.com/docs/guides/auth/social-login/auth-google
