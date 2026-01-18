# Deployment Instructions - Organic Fuel CRM

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Netlify Account** (free tier works)
3. **Supabase Account** (free tier works)
4. **Telnyx Account** with messaging enabled

---

## Step 1: Local Setup

```bash
# Navigate to project directory
cd organic-fuel

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# (Use your favorite editor)
```

---

## Step 2: Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy contents of `supabase/schema.sql`
5. Paste and run in SQL Editor
6. Go to Settings → API
7. Copy:
   - Project URL → `SUPABASE_URL`
   - `service_role` key (secret) → `SUPABASE_SERVICE_ROLE_KEY`
8. Add these to your `.env` file

---

## Step 3: Telnyx Setup

1. Go to [telnyx.com](https://telnyx.com)
2. Sign up / Log in
3. Buy a phone number (or use existing)
4. Go to API Keys → Create New Key
5. Copy:
   - API Key → `TELNYX_API_KEY`
   - Your phone number → `TELNYX_FROM_NUMBER` (format: +18663371932)
6. Add these to your `.env` file

---

## Step 4: Configure Notifications

In your `.env` file, set:

```env
NOTIFY_SMS_1=+12252485772
NOTIFY_SMS_2=+12254188858
NOTIFY_EMAIL_PRIMARY=kplenty@gmail.com
NOTIFY_EMAIL_CC=solutions@pitchmarketing.agency
```

---

## Step 5: Test Locally

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Start local development server
netlify dev

# Open browser to http://localhost:8888
```

Test the chat widget:
1. Click the floating chat button
2. Fill out the form
3. Submit
4. Check console logs for SMS/email notifications
5. Verify lead appears in Supabase database

---

## Step 6: Deploy to Netlify

### Option A: CLI Deployment

```bash
# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Option B: Git Deployment (Recommended)

1. Push code to GitHub/GitLab/Bitbucket:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Organic Fuel CRM"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git provider
5. Select your repository
6. Build settings:
   - Build command: (leave empty)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
7. Click "Deploy site"

---

## Step 7: Add Environment Variables to Netlify

1. Go to your site in Netlify dashboard
2. Site settings → Environment variables
3. Add all variables from your `.env` file:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TELNYX_API_KEY`
   - `TELNYX_FROM_NUMBER`
   - `NOTIFY_SMS_1`
   - `NOTIFY_SMS_2`
   - `NOTIFY_EMAIL_PRIMARY`
   - `NOTIFY_EMAIL_CC`

4. **Important**: Don't commit your `.env` file to Git!

---

## Step 8: Configure Custom Domain (Optional)

1. In Netlify: Site settings → Domain management
2. Add custom domain (e.g., organicfuel.com)
3. Follow DNS instructions
4. SSL certificate auto-generates

---

## Step 9: Email Integration (Required for Production)

The email function currently logs to console. To send real emails:

### Option A: SendGrid

```bash
npm install @sendgrid/mail
```

In `netlify/functions/send-email.js`, uncomment SendGrid code and add:
```env
SENDGRID_API_KEY=your_key_here
```

### Option B: Resend (Recommended)

```bash
npm install resend
```

In `netlify/functions/send-email.js`, uncomment Resend code and add:
```env
RESEND_API_KEY=your_key_here
```

### Option C: AWS SES, Postmark, Mailgun

Similar integration - replace placeholder code in `send-email.js`

---

## Step 10: Verify Production

1. Visit your deployed site
2. Test chat widget
3. Verify:
   - Lead appears in Supabase
   - SMS arrives at notification numbers
   - Email arrives at notification addresses
4. Check Netlify Functions logs for errors

---

## Monitoring & Maintenance

### Check Logs
- Netlify: Functions → View logs
- Supabase: Logs → API logs

### Rate Limits
- SMS limit: 1 per non-member (enforced in code)
- Telnyx has account-level limits (check dashboard)

### Database Queries

View all leads:
```sql
SELECT * FROM leads ORDER BY created_at DESC;
```

View messages for a lead:
```sql
SELECT * FROM messages 
WHERE lead_id = 'your-lead-id' 
ORDER BY created_at;
```

Check notification history:
```sql
SELECT * FROM notifications ORDER BY created_at DESC;
```

---

## Troubleshooting

### Chat form submits but nothing happens
- Check browser console for errors
- Verify Netlify Functions are deployed
- Check environment variables are set

### SMS not sending
- Verify Telnyx API key is correct
- Check Telnyx account has credits
- Check phone number is in E.164 format (+1XXXXXXXXXX)
- View Netlify Functions logs

### Database errors
- Verify Supabase connection
- Check service_role key (not anon key)
- Ensure schema.sql was executed

### CORS errors
- Should not occur with Netlify Functions
- If testing locally, ensure using `netlify dev`

---

## Security Checklist

✅ Never commit `.env` file  
✅ Use `service_role` key only in serverless functions  
✅ Enable Supabase RLS policies for future auth  
✅ Monitor for abuse (rate limiting in place)  
✅ Rotate API keys periodically  

---

## Next Steps (Phase 2)

- Add email SMTP integration
- Build admin dashboard for CRM
- Add member authentication
- Implement AI auto-replies
- Add billing system
- Create mobile app

---

## Support

For issues or questions:
- Email: solutions@pitchmarketing.agency
- Phone: (866) 337-1932

---

**This is infrastructure equity.**
