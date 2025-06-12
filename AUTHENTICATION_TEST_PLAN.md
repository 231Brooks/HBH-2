# Authentication Test Plan

## Prerequisites
1. Clear disk space (currently 99% full)
2. Update OAuth credentials in `.env.local`
3. Run `npm install`
4. Start dev server with `npm run dev`

## Test Scenarios

### 1. Basic Connection Test
- Visit: `http://localhost:3000/test-auth`
- Should show: ✅ Supabase connection working!

### 2. Email/Password Authentication
- Visit: `http://localhost:3000/auth/login`
- Try signing up with email/password
- Check email for confirmation link
- Try logging in

### 3. Google OAuth
- Visit: `http://localhost:3000/auth/login`
- Click "Google" button
- Should redirect to Google OAuth
- After authorization, should redirect back and log you in

### 4. GitHub OAuth
- Visit: `http://localhost:3000/auth/login`
- Click "GitHub" button
- Should redirect to GitHub OAuth
- After authorization, should redirect back and log you in

## Expected Callback URLs
- Google: `https://mqmfzpkvuucvvbqlnzci.supabase.co/auth/v1/callback`
- GitHub: `https://mqmfzpkvuucvvbqlnzci.supabase.co/auth/v1/callback`

## Troubleshooting
- If OAuth fails, check `/auth/error` page for details
- Check browser console for JavaScript errors
- Verify OAuth app redirect URLs match Supabase callback URL

## Current Status
✅ Supabase configured
✅ Environment variables set
✅ Code conflicts resolved
✅ Real OAuth credentials configured
✅ GitHub OAuth: Ov23liWo3wVVX5guG4ci
✅ Google OAuth: 712378422174-gunuq354uiagr5icjefl4jsp1j1l7g3d.apps.googleusercontent.com
⚠️ Need disk space to test (99% full)

## Quick Test (without npm install)
Run: `node test-auth-connection.js`
This will verify the Supabase connection without starting the full app.
