# 🌱 Organic Fuel - Quick Start

**Native CRM + Outreach Engine**  
Infrastructure equity. Not rented.

---

## 🚀 Quick Setup (5 minutes)

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
# (Get these from Supabase and Telnyx)
```

### 2. Database Setup

1. Go to [supabase.com](https://supabase.com) and create a project
2. Open SQL Editor
3. Copy/paste contents of `supabase/schema.sql`
4. Run the SQL
5. Copy your credentials to `.env`:
   - Project URL → `SUPABASE_URL`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Telnyx Setup

1. Go to [telnyx.com](https://telnyx.com)
2. Get a phone number
3. Create API key
4. Add to `.env`:
   - `TELNYX_API_KEY`
   - `TELNYX_FROM_NUMBER=+18663371932`

### 4. Test Locally

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Start dev server
npx netlify dev

# Open http://localhost:8888
```

Test the chat widget → Check console for notifications

### 5. Deploy

```bash
# Option A: Quick deploy
npx netlify deploy --prod

# Option B: Connect to Git (recommended)
git init
git add .
git commit -m "Initial commit"
git push

# Then connect repo in Netlify dashboard
```

---

## 📁 Project Structure

```
organic-fuel/
├── public/              # Frontend (native HTML/CSS/JS)
│   ├── index.html       # Main website
│   ├── styles.css       # Styling
│   ├── chat.js          # Native chat widget
│   └── main.js          # Site functionality
│
├── netlify/functions/   # Backend (serverless)
│   ├── chat-submit.js   # Handle chat submissions
│   ├── send-sms.js      # Telnyx SMS (rate-limited)
│   └── send-email.js    # Email notifications
│
├── supabase/
│   └── schema.sql       # Database schema
│
├── .env.example         # Environment template
├── netlify.toml         # Netlify config
└── package.json         # Dependencies
```

---

## ✅ What This Does

**Frontend:**
- Native chat widget (no third-party dependencies)
- Responsive design
- Smooth UX

**Backend:**
- Supabase CRM database
- SMS via Telnyx (1 per non-member limit)
- Email notifications
- Complete message history
- Abuse protection built-in

**Database:**
- `leads` - Contact records
- `messages` - Communication history
- `notifications` - Delivery tracking

---

## 🔒 Security

- ✅ Service keys only in serverless functions
- ✅ Rate limiting on SMS (1 per non-member)
- ✅ RLS policies ready for auth
- ✅ Never commit `.env` file

---

## 🛠️ Troubleshooting

### Chat doesn't submit
- Check browser console
- Verify environment variables in Netlify
- Check Functions logs in Netlify dashboard

### SMS not sending
- Verify Telnyx API key
- Check account has credits
- Phone numbers must be E.164 format (+1XXXXXXXXXX)

### Database errors
- Use `service_role` key (not anon key)
- Verify schema.sql was executed
- Check Supabase API logs

---

## 📋 Next Steps

1. ✅ Test locally
2. ✅ Deploy to Netlify
3. ✅ Add environment variables
4. ✅ Test production chat widget
5. ✅ Integrate email provider (SendGrid/Resend)
6. ✅ Configure custom domain

**Phase 2:**
- Admin CRM dashboard
- Member authentication
- AI auto-replies
- Billing integration

---

## 📖 Full Documentation

See `DEPLOYMENT.md` for complete setup instructions.

---

## 📞 Support

- Email: solutions@pitchmarketing.agency
- Phone: (866) 337-1932

---

**This isn't a website. This is owned communications infrastructure.**

Most agencies rent this. You're building it.
