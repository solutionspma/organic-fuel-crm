# ORGANIC FUEL - SYSTEM ARCHITECTURE

## HIGH-LEVEL OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ORGANIC FUEL CRM                             │
│                   Native Communications Infrastructure                │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   VISITOR WEB   │────────▶│  NETLIFY CDN    │────────▶│  NETLIFY EDGE   │
│                 │         │  (Static Host)  │         │   (Functions)   │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                                                 │
                                                                 │
                                                                 ▼
                    ┌────────────────────────────────────────────────────┐
                    │         SERVERLESS BACKEND (Node.js)                │
                    ├────────────────────────────────────────────────────┤
                    │                                                    │
                    │  ┌─────────────────┐                              │
                    │  │  chat-submit.js │  ◀── Handles form submission │
                    │  └────────┬────────┘                              │
                    │           │                                        │
                    │           ├──▶ Supabase Insert (Lead)             │
                    │           ├──▶ Supabase Insert (Message)          │
                    │           │                                        │
                    │           ├──▶ Trigger: send-sms.js               │
                    │           └──▶ Trigger: send-email.js             │
                    │                                                    │
                    │  ┌─────────────────┐                              │
                    │  │   send-sms.js   │  ◀── Telnyx API + Rate Limit │
                    │  └────────┬────────┘                              │
                    │           │                                        │
                    │           ├──▶ Check SMS count (abuse protection) │
                    │           ├──▶ Send to NOTIFY_SMS_1               │
                    │           ├──▶ Send to NOTIFY_SMS_2               │
                    │           └──▶ Update SMS counter                 │
                    │                                                    │
                    │  ┌─────────────────┐                              │
                    │  │  send-email.js  │  ◀── Email notifications     │
                    │  └────────┬────────┘                              │
                    │           │                                        │
                    │           ├──▶ Send to NOTIFY_EMAIL_PRIMARY       │
                    │           ├──▶ CC: NOTIFY_EMAIL_CC                │
                    │           └──▶ Log notification record             │
                    │                                                    │
                    └────────────────────────────────────────────────────┘
                                         │
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  SUPABASE CRM   │         │  TELNYX SMS     │         │  EMAIL SMTP     │
│   (PostgreSQL)  │         │    (API)        │         │  (Future)       │
│                 │         │                 │         │                 │
│  • leads        │         │  SMS Gateway    │         │  SendGrid       │
│  • messages     │         │  +18663371932   │         │  Resend         │
│  • notifications│         │                 │         │  Postmark       │
│                 │         │  Dual-recipient │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## DATA FLOW - NEW LEAD SUBMISSION

```
Step 1: User Interaction
┌─────────────────────────────────────────────────────────────────┐
│ Visitor clicks chat button (floating, bottom-right)             │
│ Modal opens with form:                                          │
│   • Name (required)                                             │
│   • Phone (optional)                                            │
│   • Email (optional)                                            │
│   • Message (required)                                          │
│ User fills form and clicks "Send Message"                       │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
Step 2: Frontend Validation (chat.js)
┌─────────────────────────────────────────────────────────────────┐
│ • Validate name + message present                               │
│ • Require at least phone OR email                               │
│ • Disable submit button                                         │
│ • Show "Sending..." state                                       │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
Step 3: POST to Netlify Function
┌─────────────────────────────────────────────────────────────────┐
│ POST /.netlify/functions/chat-submit                            │
│ {                                                                │
│   "name": "John Doe",                                           │
│   "phone": "+12252485772",                                      │
│   "email": "john@example.com",                                  │
│   "message": "I need help with marketing"                       │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
Step 4: chat-submit.js Processing
┌─────────────────────────────────────────────────────────────────┐
│ A. Initialize Supabase client (service_role key)                │
│ B. Insert lead record:                                          │
│    → leads table (name, phone, email, source='chat')            │
│ C. Insert message record:                                       │
│    → messages table (lead_id, direction='inbound',              │
│      channel='chat', body=message)                              │
│ D. Get lead.id from insert response                             │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ├──────────────────────┐
                          │                      │
                          ▼                      ▼
Step 5A: SMS Notification      Step 5B: Email Notification
┌───────────────────────┐       ┌───────────────────────┐
│ POST send-sms         │       │ POST send-email       │
│ {                     │       │ {                     │
│   "lead": {...},      │       │   "lead": {...},      │
│   "message": "..."    │       │   "message": "..."    │
│ }                     │       │ }                     │
└───────────────────────┘       └───────────────────────┘
          │                                │
          ▼                                ▼
┌───────────────────────┐       ┌───────────────────────┐
│ Check SMS count       │       │ Format email body     │
│ If >= 1: STOP         │       │ Log notification      │
│ Else: Continue        │       │ Send via SMTP         │
│                       │       │ (placeholder ready)   │
│ Send to:              │       │                       │
│ • +12252485772        │       │ To: kplenty@...       │
│ • +12254188858        │       │ CC: solutions@...     │
│                       │       │                       │
│ Via Telnyx API        │       │ Insert notification   │
│ Increment counter     │       │ record to DB          │
└───────────────────────┘       └───────────────────────┘
          │                                │
          └────────────┬───────────────────┘
                       │
                       ▼
Step 6: Return Success to Frontend
┌─────────────────────────────────────────────────────────────────┐
│ 200 OK                                                           │
│ { "success": true, "leadId": "..." }                            │
└─────────────────────────────────────────────────────────────────┘
                       │
                       ▼
Step 7: User Feedback
┌─────────────────────────────────────────────────────────────────┐
│ • Hide form                                                      │
│ • Show success message                                           │
│ • Auto-close modal after 3 seconds                              │
│ • Reset form state                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## RATE LIMITING LOGIC - SMS ABUSE PROTECTION

```
┌─────────────────────────────────────────────────────────────────┐
│                  SMS RATE LIMITING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

New Lead Submitted
        │
        ▼
┌──────────────────┐
│ Check lead.      │      ┌─────────────────────────────────┐
│ outbound_sms_    │─────▶│ outbound_sms_count = 0          │
│ count            │      │ ✅ ALLOW SMS                    │
└──────────────────┘      │ Send notifications              │
        │                 │ Increment counter to 1          │
        │                 └─────────────────────────────────┘
        │
        ▼
┌──────────────────┐
│ outbound_sms_    │      ┌─────────────────────────────────┐
│ count >= 1?      │─────▶│ outbound_sms_count >= 1         │
└──────────────────┘      │ ❌ BLOCK SMS                    │
        │                 │ Return: "SMS limit reached"     │
        │                 │ Do not send, do not increment   │
        │                 └─────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ RESULT: Non-members get EXACTLY ONE outbound SMS notification    │
│ Members (Phase 2): Unlimited SMS via membership status check     │
└──────────────────────────────────────────────────────────────────┘
```

---

## DATABASE SCHEMA RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────┐
│        LEADS              │
├───────────────────────────┤
│ id (PK)        UUID       │────┐
│ name           TEXT       │    │
│ phone          TEXT       │    │
│ email          TEXT       │    │
│ source         TEXT       │    │ (chat | form)
│ status         TEXT       │    │ (default: 'new')
│ outbound_sms_  INT        │    │ (default: 0)
│   count                   │    │
│ created_at     TIMESTAMP  │    │
└───────────────────────────┘    │
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│    MESSAGES      │   │  NOTIFICATIONS   │   │   (Future)       │
├──────────────────┤   ├──────────────────┤   │   MEMBERS        │
│ id (PK)     UUID │   │ id (PK)     UUID │   │   THREADS        │
│ lead_id (FK) UUID│   │ lead_id (FK) UUID│   │   AUTOMATIONS    │
│ direction   TEXT │   │ type        TEXT │   │                  │
│ channel     TEXT │   │ recipients  TEXT │   └──────────────────┘
│ body        TEXT │   │ status      TEXT │
│ created_at  TS   │   │ created_at  TS   │
└──────────────────┘   └──────────────────┘

direction: inbound | outbound
channel: chat | sms | email
type: sms | email
```

---

## TECHNOLOGY STACK

```
┌─────────────────────────────────────────────────────────────────┐
│                         TECH STACK                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRONTEND                                                        │
│  ├── Native HTML5                                               │
│  ├── Native CSS3 (no frameworks)                                │
│  ├── Native JavaScript ES6+ (no React, Vue, etc.)               │
│  └── Responsive Design (mobile-first)                           │
│                                                                  │
│  BACKEND                                                         │
│  ├── Netlify Functions (AWS Lambda)                             │
│  ├── Node.js (ESM modules)                                      │
│  ├── Serverless architecture                                    │
│  └── Auto-scaling (infinite)                                    │
│                                                                  │
│  DATABASE                                                        │
│  ├── Supabase (PostgreSQL)                                      │
│  ├── Row Level Security (RLS)                                   │
│  ├── Real-time subscriptions (ready)                            │
│  └── REST API + Client SDK                                      │
│                                                                  │
│  COMMUNICATIONS                                                  │
│  ├── Telnyx SMS API                                             │
│  ├── SMTP (SendGrid/Resend ready)                               │
│  └── Rate limiting (custom logic)                               │
│                                                                  │
│  HOSTING & CDN                                                   │
│  ├── Netlify (CDN + Functions)                                  │
│  ├── Global edge network                                        │
│  ├── Auto SSL                                                    │
│  └── Git-based deployment                                       │
│                                                                  │
│  DEPENDENCIES                                                    │
│  ├── @supabase/supabase-js (2.39.0)                             │
│  ├── axios (1.6.2)                                              │
│  └── netlify-cli (17.10.1, dev only)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## SECURITY ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

1. ENVIRONMENT ISOLATION
   • Secrets in environment variables (Netlify)
   • Never committed to Git (.gitignore)
   • Service role key only in serverless functions
   • Client never sees API keys

2. DATABASE SECURITY
   • Row Level Security (RLS) enabled
   • Service role bypasses RLS (functions only)
   • Indexed queries (performance + safety)
   • Foreign key constraints (data integrity)

3. RATE LIMITING
   • SMS: 1 per non-member (enforced in code)
   • Counter tracked in database
   • Future: IP-based rate limiting
   • Future: Member tier unlocks

4. INPUT VALIDATION
   • Frontend: Required fields
   • Backend: Schema validation
   • Sanitization: Supabase handles SQL injection
   • Type checking: PostgreSQL enforces types

5. API SECURITY
   • Telnyx: Bearer token auth
   • Supabase: Service role key (RLS bypass)
   • HTTPS only (Netlify enforces)
   • CORS: Handled by Netlify Functions

6. MONITORING
   • Netlify Functions logs
   • Supabase API logs
   • Database query logs
   • Future: Error tracking (Sentry)
```

---

## DEPLOYMENT PIPELINE

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT WORKFLOW                           │
└─────────────────────────────────────────────────────────────────┘

LOCAL DEVELOPMENT
┌──────────────────┐
│ git commit       │
│ netlify dev      │
│ Test locally     │
│ http://localhost │
└────────┬─────────┘
         │
         ▼
GIT PUSH
┌──────────────────┐
│ git push origin  │
│ main             │
└────────┬─────────┘
         │
         ▼
NETLIFY AUTO-DEPLOY
┌──────────────────┐
│ Detect push      │
│ Pull code        │
│ Install deps     │
│ Build (none)     │
│ Deploy functions │
│ Deploy static    │
│ Update CDN       │
└────────┬─────────┘
         │
         ▼
PRODUCTION LIVE
┌──────────────────┐
│ HTTPS enabled    │
│ Global CDN       │
│ Functions active │
│ Monitor logs     │
└──────────────────┘

ALTERNATIVE: CLI DEPLOY
┌──────────────────┐
│ netlify deploy   │
│ --prod           │
└──────────────────┘
```

---

## FUTURE EXPANSIONS (Phase 2+)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROADMAP (Not Yet Built)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ADMIN DASHBOARD                                                 │
│  • View all leads                                               │
│  • Message history                                               │
│  • Status management                                             │
│  • Reply to conversations                                        │
│  • Analytics dashboard                                           │
│                                                                  │
│  MEMBER SYSTEM                                                   │
│  • Authentication (Supabase Auth)                                │
│  • Member tiers                                                  │
│  • Unlimited SMS for members                                     │
│  • Role-based access control                                     │
│                                                                  │
│  AI INTEGRATION                                                  │
│  • Auto-reply to common questions                                │
│  • Sentiment analysis                                            │
│  • Lead scoring                                                  │
│  • Smart routing                                                 │
│                                                                  │
│  BILLING                                                         │
│  • Stripe integration                                            │
│  • Subscription management                                       │
│  • Usage-based billing                                           │
│  • Invoice generation                                            │
│                                                                  │
│  ADVANCED FEATURES                                               │
│  • Multi-channel inbox                                           │
│  • Team collaboration                                            │
│  • Workflow automation                                           │
│  • A/B testing                                                   │
│  • Mobile app (React Native)                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## FILE STRUCTURE EXPLAINED

```
organic-fuel/
│
├── public/                     # Frontend (served by Netlify CDN)
│   ├── index.html             # Main HTML (chat widget embedded)
│   ├── styles.css             # Complete styling (responsive)
│   ├── chat.js                # Chat widget logic (native)
│   └── main.js                # Site functionality (smooth scroll, etc.)
│
├── netlify/functions/         # Backend (serverless Node.js)
│   ├── chat-submit.js         # Main handler (CRM entry point)
│   ├── send-sms.js            # Telnyx SMS (rate-limited)
│   └── send-email.js          # Email notifications (SMTP ready)
│
├── supabase/
│   └── schema.sql             # Database schema (run once in Supabase)
│
├── node_modules/              # Dependencies (not committed)
│
├── .env                       # Local secrets (not committed)
├── .env.example               # Template (committed)
├── .gitignore                 # Security (committed)
│
├── netlify.toml               # Netlify config (build settings)
├── package.json               # Dependencies manifest
├── package-lock.json          # Dependency lock file
│
├── README.md                  # Project overview
├── QUICKSTART.md              # 5-minute setup guide
├── DEPLOYMENT.md              # Complete deployment instructions
├── BUILD_COMPLETE.md          # Build verification checklist
├── ARCHITECTURE.md            # This file
│
├── setup.sh                   # Automated setup script
└── test-local.sh              # Local testing helper
```

---

## MONITORING & DEBUGGING

```
┌─────────────────────────────────────────────────────────────────┐
│                   WHERE TO LOOK WHEN...                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Chat form doesn't submit                                        │
│  ➜ Browser console (F12 → Console tab)                          │
│  ➜ Check for JavaScript errors                                  │
│                                                                  │
│  Lead not appearing in database                                  │
│  ➜ Netlify Functions logs                                        │
│  ➜ Supabase → Logs → API logs                                   │
│  ➜ Check environment variables                                   │
│                                                                  │
│  SMS not sending                                                 │
│  ➜ Netlify Functions logs (send-sms)                            │
│  ➜ Telnyx dashboard → Message logs                              │
│  ➜ Check API key and phone number format                        │
│  ➜ Verify rate limit not reached                                │
│                                                                  │
│  Email not sending                                               │
│  ➜ Netlify Functions logs (send-email)                          │
│  ➜ Email currently logs to console (SMTP not configured)        │
│  ➜ Check placeholder code in send-email.js                      │
│                                                                  │
│  Database errors                                                 │
│  ➜ Supabase → Logs → API logs                                   │
│  ➜ Verify service_role key (not anon key)                       │
│  ➜ Check schema.sql was executed                                │
│                                                                  │
│  CORS errors                                                     │
│  ➜ Should not happen with Netlify Functions                     │
│  ➜ If using custom domain, verify DNS                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## COST BREAKDOWN (Monthly)

```
┌─────────────────────────────────────────────────────────────────┐
│                       PRICING TIERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Netlify (Hosting + Functions)                                  │
│  ├── Free tier: 100GB bandwidth, 125k function invocations      │
│  ├── Pro: $19/month (400GB, 1M invocations)                     │
│  └── This build: FREE TIER SUFFICIENT for Phase 1               │
│                                                                  │
│  Supabase (Database)                                             │
│  ├── Free tier: 500MB database, unlimited API requests          │
│  ├── Pro: $25/month (8GB database, daily backups)               │
│  └── This build: FREE TIER SUFFICIENT for Phase 1               │
│                                                                  │
│  Telnyx (SMS)                                                    │
│  ├── Pay-as-you-go: $0.007 per SMS                              │
│  ├── No monthly fee                                              │
│  ├── Phone number: $2/month                                     │
│  └── Estimate: $2-20/month (depends on lead volume)             │
│                                                                  │
│  Email (When configured)                                         │
│  ├── SendGrid: Free tier (100/day)                              │
│  ├── Resend: Free tier (3,000/month)                            │
│  └── Estimate: FREE (until high volume)                         │
│                                                                  │
│  TOTAL PHASE 1 COST: ~$2-20/month                               │
│  (Telnyx phone number + SMS usage only)                         │
│                                                                  │
│  Compare to: Intercom ($39/month), HubSpot ($45/month),         │
│  Zendesk ($49/month) - You're saving $500-1000/year             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**END OF ARCHITECTURE DOCUMENTATION**

This is owned infrastructure.  
Not rented.  
Not licensed.  
Owned.

**Infrastructure equity.**
