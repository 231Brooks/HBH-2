# OAuth Setup Guide

## 🔧 Google OAuth Configuration

### Step 1: Access Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Navigate to "APIs & Services" → "Credentials"

### Step 2: Find Your OAuth Client
- Look for Client ID: `712378422174-gunuq354uiagr5icjefl4jsp1j1l7g3d.apps.googleusercontent.com`
- Click on it to edit

### Step 3: Add Authorized Redirect URIs
Add these URIs to the "Authorized redirect URIs" section:
```
https://mqmfzpkvuucvvbqlnzci.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

### Step 4: Save Changes
- Click "Save"
- Changes may take a few minutes to propagate

## 🔧 GitHub OAuth Configuration

### Step 1: Access GitHub Developer Settings
1. Go to: https://github.com/settings/developers
2. Click "OAuth Apps"

### Step 2: Find Your OAuth App
- Look for Client ID: `Ov23liWo3wVVX5guG4ci`
- Click on it to edit

### Step 3: Set Authorization Callback URL
Set the callback URL to:
```
https://mqmfzpkvuucvvbqlnzci.supabase.co/auth/v1/callback
```

### Step 4: Save Changes
- Click "Update application"

## 🧪 Testing Authentication

### Email/Password (Works Immediately)
1. Go to: http://localhost:3000/auth/login
2. Try signing up with email/password
3. Check your email for confirmation

### OAuth Testing (After Configuration)
1. Go to: http://localhost:3000/auth/login
2. Click "Google" or "GitHub" buttons
3. Should redirect to OAuth provider
4. After authorization, should return to your app

## 🔍 Troubleshooting

### If OAuth Still Fails:
1. Check browser console for errors
2. Visit: http://localhost:3000/auth/error for detailed error messages
3. Verify redirect URIs are exactly correct (no trailing slashes)
4. Wait a few minutes for changes to propagate

### Current Configuration:
- **Supabase Project**: mqmfzpkvuucvvbqlnzci
- **Callback URL**: https://mqmfzpkvuucvvbqlnzci.supabase.co/auth/v1/callback
- **GitHub Client ID**: Ov23liWo3wVVX5guG4ci
- **Google Client ID**: 712378422174-gunuq354uiagr5icjefl4jsp1j1l7g3d.apps.googleusercontent.com

## ✅ What's Working Now:
- ✅ Supabase connection
- ✅ Environment variables
- ✅ Email/password authentication
- ⚠️ OAuth (needs redirect URI configuration)
