# Supabase Setup Guide - Fully Automated

**Time to complete:** 10-15 minutes (mostly Docker pulling images)

---

## Prerequisites

1. **Docker Desktop** must be installed and running
   - Download: https://www.docker.com/products/docker-desktop
   - Start Docker Desktop before continuing

2. **Node.js** (already installed ✅)

---

## 🚀 Automated Setup (3 commands)

### Step 1: Run Setup Script
```bash
npm run supabase:setup
```

**What this does:**
- ✅ Installs Supabase CLI globally
- ✅ Initializes Supabase project in `supabase/` folder
- ✅ Pulls Docker images (PostgreSQL, Auth, Realtime, etc.)
- ✅ Starts local Supabase instance
- ✅ Shows connection credentials

**Output:** Connection details including API URL and keys

---

### Step 2: Create Database Schema
```bash
npm run supabase:migrate
```

**What this does:**
- ✅ Creates SQL migration file with full schema
- ✅ Applies migration to local database
- ✅ Sets up all tables: users, tasks, projects, knowledge_base
- ✅ Configures Row Level Security (RLS) policies
- ✅ Creates indexes for performance

---

### Step 3: Generate TypeScript Types
```bash
npm run supabase:types
```

**What this does:**
- ✅ Reads database schema
- ✅ Generates TypeScript types in `types/supabase.ts`
- ✅ Provides full type safety for queries

---

## 📋 Update Environment Variables

After setup, copy the credentials shown by `npm run supabase:status`:

```bash
# .env.local
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## ✅ Verify Setup

```bash
# Check if Supabase is running
npm run supabase:status

# Should show:
# - API URL
# - DB URL
# - Studio URL (http://localhost:54323) ← Database UI
# - Anon key
# - Service role key
```

**Open Studio:** http://localhost:54323
- Visual database browser
- Run SQL queries
- View tables and data
- Test authentication

---

## 🛠️ Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run supabase:start` | Start local Supabase |
| `npm run supabase:stop` | Stop local Supabase |
| `npm run supabase:status` | Show connection info |
| `supabase db reset` | Reset DB to migrations |
| `supabase db seed` | Run seed data (if exists) |

---

## 📂 What Gets Created

```
flux/
├── supabase/
│   ├── config.toml              # Supabase configuration
│   ├── migrations/              # SQL migration files
│   │   └── YYYYMMDD_flux_initial_schema.sql
│   └── seed.sql                # Optional seed data
│
├── types/
│   └── supabase.ts             # Auto-generated types
│
├── scripts/
│   ├── setup-supabase.sh       # Automated setup
│   ├── create-schema.sh        # Schema migration
│   └── generate-types.sh       # Type generation
```

---

## 🗄️ Database Schema

### Tables Created:

1. **users**
   - Extends Supabase auth.users
   - Stores: name, email, bio

2. **tasks**
   - User tasks with priority, status, energy cost
   - Links to projects
   - Stores AI results

3. **projects**
   - Groups of related tasks
   - Progress tracking
   - Status management

4. **knowledge_base**
   - User-specific learned facts
   - Fed to AI for context

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Policies prevent data leaks

---

## 🌐 Cloud Deployment (Later)

When ready to deploy:

```bash
# 1. Login to Supabase
supabase login

# 2. Link to cloud project
supabase link --project-ref your-project-ref

# 3. Push migrations
supabase db push

# 4. Update .env.local with cloud credentials
```

---

## 🐛 Troubleshooting

### Docker not running
```
Error: Cannot connect to Docker
```
**Fix:** Start Docker Desktop, wait for it to fully load, then retry

### Port already in use
```
Error: Port 54321 already in use
```
**Fix:** 
```bash
supabase stop
# Kill any lingering processes
docker ps | grep supabase | awk '{print $1}' | xargs docker kill
supabase start
```

### Migration failed
```
Error: migration failed
```
**Fix:**
```bash
supabase db reset  # Resets to clean state
```

### Types not generating
```
Error: Failed to generate types
```
**Fix:**
```bash
# Make sure Supabase is running
npm run supabase:status

# Manually generate
supabase gen types typescript --local > types/supabase.ts
```

---

## 📊 What's Running Locally

When you run `supabase start`, these services start:

| Service | Port | Purpose |
|---------|------|---------|
| **PostgreSQL** | 54322 | Database |
| **API** | 54321 | REST & Realtime |
| **Studio** | 54323 | Web UI |
| **Auth** | Internal | Authentication |
| **Storage** | Internal | File uploads |

**Total RAM:** ~500MB  
**Startup Time:** 30-60 seconds (first time: 2-5 min)

---

## 🎯 Next Steps

After setup:
1. ✅ Supabase running locally
2. ✅ Schema created
3. ✅ Types generated
4. 🔜 Build API service layer (`services/api/supabase.ts`)
5. 🔜 Implement authentication
6. 🔜 Migrate from localStorage

---

## 💡 Why This Approach?

**Benefits of CLI automation:**
- 🚀 One command setup (vs hours of manual config)
- 📝 Schema as code (version controlled)
- 🔄 Easy to reset/recreate
- 🧪 Test migrations before cloud deploy
- 🔧 No internet needed for development
- 📊 Visual database browser included

---

**Questions?** Check:
- Supabase Docs: https://supabase.com/docs
- Supabase CLI: https://supabase.com/docs/guides/cli
- Studio: http://localhost:54323 (after setup)

---

**Last Updated:** 2024-12-08  
**Setup Version:** 1.0 - Fully Automated
