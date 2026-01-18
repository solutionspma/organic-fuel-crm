# Organic Fuel – Native CRM + Outreach Engine

**Owned communications infrastructure. Not rented.**

## What This Is

A native JavaScript website with integrated backend CRM + messaging engine:
- Native chat widget (no third-party dependencies)
- Supabase CRM database
- Telnyx SMS notifications
- Email notifications
- Abuse-limited outbound messaging (1 SMS per non-member)
- Netlify serverless backend

## Stack

- **Frontend**: Native HTML/CSS/JavaScript
- **Backend**: Netlify Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **SMS**: Telnyx
- **Email**: SMTP/SendGrid/Resend (placeholder ready)
- **Hosting**: Netlify

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
   - Add your Telnyx API key and phone number
   - Set notification phone numbers and emails

3. **Initialize Supabase database:**
   - Run the SQL in `supabase/schema.sql` in your Supabase SQL editor

4. **Deploy to Netlify:**
   ```bash
   netlify deploy --prod
   ```
   Or connect your Git repository to Netlify and push.

## Environment Variables (Netlify)

Add these in Netlify dashboard → Site settings → Environment variables:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
TELNYX_API_KEY
TELNYX_FROM_NUMBER
NOTIFY_SMS_1
NOTIFY_SMS_2
NOTIFY_EMAIL_PRIMARY
NOTIFY_EMAIL_CC
```

## Features

✅ Native chat widget (bottom-right floating button)  
✅ Instant lead capture to Supabase CRM  
✅ Simultaneous SMS + email notifications  
✅ 1-SMS limit for non-members (abuse protection)  
✅ Complete message history logging  
✅ No third-party chat dependencies  
✅ Expandable for AI, memberships, billing (Phase 2)  

## Architecture

```
Chat Submit → Supabase CRM → Parallel Notifications
                            ├── SMS (Telnyx, rate-limited)
                            └── Email (SMTP)
```

## What's NOT Included (Yet)

- AI auto-replies
- Multi-agent routing
- Authentication UI
- Billing system
- Member portal

This is **Phase 1** — infrastructure equity.

## API Endpoints

- `/.netlify/functions/chat-submit` - Handle chat submissions
- `/.netlify/functions/send-sms` - Send SMS notifications via Telnyx
- `/.netlify/functions/send-email` - Send email notifications

## Database Schema

- **leads** - Contact records with status tracking
- **messages** - Complete message history (inbound/outbound)
- **notifications** - Notification delivery log

## License

Proprietary - Organic Fuel / Pitch Marketing Agency
