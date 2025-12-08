#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Generating TypeScript types from Supabase schema...${NC}"
echo ""

# Create types directory if it doesn't exist
mkdir -p types

# Generate types
supabase gen types typescript --local > types/supabase.ts

echo -e "${GREEN}✅ Types generated: types/supabase.ts${NC}"
echo ""
echo "You can now import types from 'types/supabase.ts'"
echo ""
echo "Example:"
echo "  import { Database } from './types/supabase';"
echo "  type Task = Database['public']['Tables']['tasks']['Row'];"
