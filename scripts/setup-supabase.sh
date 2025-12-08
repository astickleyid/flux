#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Flux Supabase Setup - Automated${NC}"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker Desktop first.${NC}"
    echo "   After starting Docker, run this script again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${BLUE}📦 Installing Supabase CLI via Homebrew...${NC}"
    if ! command -v brew &> /dev/null; then
        echo -e "${YELLOW}⚠️  Homebrew not found. Installing Homebrew first...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install supabase/tap/supabase
    echo -e "${GREEN}✅ Supabase CLI installed${NC}"
else
    echo -e "${GREEN}✅ Supabase CLI already installed ($(supabase --version))${NC}"
fi
echo ""

# Initialize Supabase (if not already done)
if [ ! -d "supabase" ]; then
    echo -e "${BLUE}🔧 Initializing Supabase project...${NC}"
    supabase init
    echo -e "${GREEN}✅ Supabase project initialized${NC}"
else
    echo -e "${GREEN}✅ Supabase project already initialized${NC}"
fi
echo ""

# Start Supabase (this pulls Docker images and starts services)
echo -e "${BLUE}�� Starting Supabase local environment...${NC}"
echo "   (This may take a few minutes on first run)"
supabase start

echo ""
echo -e "${GREEN}✅ Supabase is running locally!${NC}"
echo ""
echo "================================================"
echo -e "${BLUE}📊 Connection Details:${NC}"
echo "================================================"
supabase status

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: npm run supabase:migrate (create schema)"
echo "2. Run: npm run supabase:types (generate TypeScript types)"
echo "3. Update .env.local with the credentials above"
echo ""
echo "Useful commands:"
echo "  supabase start      - Start local instance"
echo "  supabase stop       - Stop local instance"
echo "  supabase status     - Show connection info"
echo "  supabase db reset   - Reset database to migrations"
echo ""
