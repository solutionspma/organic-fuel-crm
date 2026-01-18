// Authentication System for Organic Fuel Admin
// Role-based access control: super_admin and admin

// User credentials (In production, this should be in Supabase with hashed passwords)
const USERS = {
    // Super Admin - Full access to everything
    'super_admin': {
        password: 'OrganicFuel2026!Super',
        role: 'super_admin',
        name: 'Super Administrator',
        canSee: ['stats', 'leads', 'messages', 'config', 'api', 'env', 'schema', 'setup']
    },
    // Admin - Kikala Diallo - Limited access
    'kikala': {
        password: 'OrganicFuel2026!Admin',
        role: 'admin',
        name: 'Kikala Diallo',
        canSee: ['stats', 'leads', 'messages']
    }
};

// Check if user is logged in
function checkAuth() {
    const session = sessionStorage.getItem('of_session');
    if (!session) {
        if (window.location.pathname !== '/login.html') {
            window.location.href = '/login.html';
        }
        return null;
    }
    
    try {
        const user = JSON.parse(session);
        // Verify session is valid (expires after 8 hours)
        if (user.expires && user.expires < Date.now()) {
            logout();
            return null;
        }
        return user;
    } catch (e) {
        logout();
        return null;
    }
}

// Login handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');
        
        errorDiv.classList.remove('show');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';
        
        // Simulate network delay
        setTimeout(() => {
            if (USERS[username] && USERS[username].password === password) {
                // Create session
                const session = {
                    username: username,
                    role: USERS[username].role,
                    name: USERS[username].name,
                    canSee: USERS[username].canSee,
                    expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
                };
                
                sessionStorage.setItem('of_session', JSON.stringify(session));
                
                // Redirect to dashboard
                window.location.href = '/dashboard.html';
            } else {
                errorDiv.textContent = 'Invalid username or password';
                errorDiv.classList.add('show');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Sign In';
            }
        }, 500);
    });
}

// Logout handler
function logout() {
    sessionStorage.removeItem('of_session');
    window.location.href = '/login.html';
}

// Check permissions
function canSee(section) {
    const user = checkAuth();
    if (!user) return false;
    return user.canSee.includes(section);
}

// Get current user
function getCurrentUser() {
    return checkAuth();
}

// Initialize auth check on protected pages
if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('admin.html')) {
    const user = checkAuth();
    if (!user) {
        window.location.href = '/login.html';
    }
}
