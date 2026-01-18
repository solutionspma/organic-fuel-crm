#!/bin/bash
# Setup script for Organic Fuel CRM
# Bypasses workspace npm issues

echo "🌱 Organic Fuel - Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install without workspace context
npm install --prefix . --no-workspaces @supabase/supabase-js@^2.39.0 axios@^1.6.2

# Install dev dependencies
npm install --prefix . --no-workspaces --save-dev netlify-cli@^17.10.1

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Copy .env.example to .env"
echo "   cp .env.example .env"
echo ""
echo "2. Fill in your credentials in .env"
echo ""
echo "3. Run the Supabase schema in supabase/schema.sql"
echo ""
echo "4. Test locally:"
echo "   npx netlify dev"
echo ""
echo "5. Deploy to Netlify:"
echo "   npx netlify deploy --prod"
echo ""
echo "See DEPLOYMENT.md for complete instructions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
