# 🔐 ORGANIC FUEL - ADMIN CREDENTIALS

**CONFIDENTIAL - DO NOT SHARE**

---

## USER ACCOUNTS

### 🛡️ SUPER ADMIN (You)
**Username:** `super_admin`  
**Password:** `OrganicFuel2026!Super`  
**Access Level:** FULL ACCESS

**Can See:**
- ✅ Dashboard Stats
- ✅ All Leads & Messages
- ✅ Backend Configuration
- ✅ API Endpoints
- ✅ Environment Variables
- ✅ Database Schema
- ✅ Setup/Deployment Guides

---

### 👤 ADMIN (Kikala Diallo)
**Username:** `kikala`  
**Password:** `OrganicFuel2026!Admin`  
**Access Level:** LIMITED ACCESS

**Can See:**
- ✅ Dashboard Stats
- ✅ All Leads & Messages
- ❌ Backend Configuration (Hidden)
- ❌ API Endpoints (Hidden)
- ❌ Environment Variables (Hidden)
- ❌ Database Schema (Hidden)
- ❌ Setup/Deployment Guides (Hidden)

---

## ACCESS URLS

**Login Page:** http://localhost:8888/login.html  
**Dashboard:** http://localhost:8888/dashboard.html  

*(Auto-redirects to login if not authenticated)*

---

## SECURITY FEATURES

✅ **Session-based authentication** (8-hour timeout)  
✅ **Role-based access control (RBAC)**  
✅ **Auto-logout on session expiration**  
✅ **Protected routes** (redirects to login)  
✅ **Password-protected access**  

---

## PRODUCTION NOTES

**Current Implementation:**
- Client-side authentication (demo/development)
- Passwords stored in auth.js

**For Production Deployment:**
1. Move authentication to Supabase Auth
2. Hash passwords (bcrypt)
3. Use JWT tokens
4. Add Netlify Function for login endpoint
5. Enable 2FA (optional)

---

## CHANGING PASSWORDS

Edit `public/auth.js` and update the USERS object:

```javascript
const USERS = {
    'super_admin': {
        password: 'YOUR_NEW_PASSWORD',
        role: 'super_admin',
        ...
    },
    'kikala': {
        password: 'KIKALA_NEW_PASSWORD',
        role: 'admin',
        ...
    }
};
```

---

## ADDING NEW USERS

Add to USERS object in `auth.js`:

```javascript
'username': {
    password: 'password',
    role: 'admin', // or 'super_admin'
    name: 'Display Name',
    canSee: ['stats', 'leads', 'messages'] // permissions
}
```

**Available Permissions:**
- `stats` - Dashboard statistics
- `leads` - Lead list
- `messages` - Message history
- `config` - Backend configuration
- `api` - API endpoints
- `env` - Environment variables
- `schema` - Database schema
- `setup` - Setup guides

---

## HOW IT WORKS

1. User enters credentials at `/login.html`
2. System validates against USERS object
3. Creates session with role and permissions
4. Stores in sessionStorage (8-hour expiry)
5. Dashboard shows/hides sections based on `canSee` array
6. Logout clears session and redirects to login

---

**Created:** January 17, 2026  
**System:** Organic Fuel CRM  
**Version:** 1.0
