#!/bin/bash
# Local test script for Organic Fuel CRM

echo "🌱 Organic Fuel - Local Test Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo ""
    echo "Please create .env file:"
    echo "  cp .env.example .env"
    echo ""
    echo "Then fill in your credentials:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - TELNYX_API_KEY"
    echo "  - TELNYX_FROM_NUMBER"
    echo "  - Notification phone numbers and emails"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Dependencies not installed. Installing now..."
    echo ""
    npm install --prefix . --no-workspaces @supabase/supabase-js@^2.39.0 axios@^1.6.2
    echo ""
fi

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo ""
fi

echo "✅ Prerequisites check complete!"
echo ""
echo "🚀 Starting local development server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Server will start at: http://localhost:8888"
echo ""
echo "To test:"
echo "  1. Click the chat button (bottom-right)"
echo "  2. Fill out the form"
echo "  3. Submit"
echo "  4. Check console for notifications"
echo "  5. Verify lead in Supabase database"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Netlify dev server
npx netlify dev
