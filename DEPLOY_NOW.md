# 🚀 DEPLOYMENT SETUP GUIDE

## Step 1: Supabase Configuration ✅

**Using existing project:** `logademy` (hkfcfooyqaonbszhnrpx)

### Supabase Project Details:
- **Project Reference:** `hkfcfooyqaonbszhnrpx`
- **Project URL:** `https://hkfcfooyqaonbszhnrpx.supabase.co`
- **Status:** Ready to configure

### Setup Supabase Database:

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/hkfcfooyqaonbszhnrpx/sql/new

2. **Run the schema (copy from `supabase/schema.sql`):**
   - This will create: `leads`, `messages`, `notifications` tables
   - Sets up indexes and RLS policies

3. **Get your credentials:**
   - Go to: Settings → API
   - Copy **Project URL** → `SUPABASE_URL`
   - Copy **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2: GitHub Repository

### Create Repository:

```bash
# Repository will be created at: 
# https://github.com/YOUR_USERNAME/organic-fuel-crm

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/organic-fuel-crm.git

# Push code
git push -u origin main
```

**Or use GitHub CLI:**
```bash
gh repo create organic-fuel-crm --public --source=. --remote=origin
git push -u origin main
```

---

## Step 3: Netlify Deployment

### Option A: Connect GitHub Repo (Recommended)

1. **Go to Netlify:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Connect:** GitHub
4. **Select:** organic-fuel-crm repository
5. **Build Settings:**
   - Build command: (leave empty)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
6. **Click:** "Deploy site"

### Option B: CLI Deploy

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

---

## Step 4: Environment Variables in Netlify

**Go to:** Site settings → Environment variables

**Add these variables:**

```env
SUPABASE_URL=https://hkfcfooyqaonbszhnrpx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[get from Supabase Settings → API]

TELNYX_API_KEY=[your Telnyx API key]
TELNYX_FROM_NUMBER=+18663371932

NOTIFY_SMS_1=+12252485772
NOTIFY_SMS_2=+12254188858

NOTIFY_EMAIL_PRIMARY=kplenty@gmail.com
NOTIFY_EMAIL_CC=solutions@pitchmarketing.agency

PEXELS_API_KEY=RH8RBXiR6FvHEKqhKz6t6BQqGQHLJc4eXgNQq5oPd9FVVSJlTuzhAWvV
```

---

## Step 5: Test Production Site

1. **Visit your Netlify URL:** https://YOUR_SITE.netlify.app
2. **Test chat widget:**
   - Click chat button
   - Submit a test message
3. **Check Supabase:**
   - Go to Table Editor
   - Verify lead was created
4. **Check SMS:**
   - Verify SMS arrived at notification numbers
5. **Login to admin:**
   - Go to: https://YOUR_SITE.netlify.app/login.html
   - Test both accounts (super_admin and kikala)

---

## Step 6: Custom Domain (Optional)

1. **Go to:** Netlify → Domain settings
2. **Add custom domain:** organicfuel.com (or your domain)
3. **Configure DNS:**
   - Add CNAME record pointing to Netlify
4. **SSL:** Auto-generates

---

## Quick Reference

### Supabase
- **URL:** https://hkfcfooyqaonbszhnrpx.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/hkfcfooyqaonbszhnrpx

### GitHub
- **Repository:** (Create at https://github.com/new)
- **Name:** organic-fuel-crm

### Netlify
- **Dashboard:** https://app.netlify.com
- **Deploy:** Connect GitHub repo

---

## Credentials Reference

### Admin Login
- **Super Admin:** `super_admin` / `OrganicFuel2026!Super`
- **Admin (Kikala):** `kikala` / `OrganicFuel2026!Admin`

### API Keys Needed
- ✅ Supabase URL and Service Role Key
- ✅ Telnyx API Key (get from telnyx.com)
- ✅ Pexels API Key (already configured)

---

## Post-Deployment Checklist

- [ ] Supabase schema executed
- [ ] Supabase credentials copied
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] Netlify connected to GitHub
- [ ] Environment variables added to Netlify
- [ ] Site deployed successfully
- [ ] Chat widget tested
- [ ] Lead created in Supabase
- [ ] SMS notification received
- [ ] Admin login tested
- [ ] Custom domain configured (optional)

---

**Ready to deploy!** 🚀
