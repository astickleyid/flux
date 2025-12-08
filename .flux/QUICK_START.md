# 🚀 Quick Start Guide - For AI Assistants

**Use this checklist every time you resume work on Flux**

---

## ⚡ 30-Second Context Load

```bash
# Run this first!
cd /Users/austinstickley/Documents/GitHub/flux
cat .flux/SESSION_CONTEXT.md | head -60
```

**Current Status at a Glance:**
- **Phase:** Phase 2 - Backend & Core Features
- **Sprint:** Sprint 1 - Backend Foundation
- **Goal:** Data persistence + authentication
- **Next Action:** Choose Firebase vs Supabase

---

## 📋 Session Start Checklist

### 1️⃣ Load Context (2 min)
```bash
cat .flux/SESSION_CONTEXT.md    # Where we are
cat .flux/SPRINT_TRACKER.md     # What's in progress
tail -50 .flux/IMPLEMENTATION_LOG.md  # What we just did
```

### 2️⃣ Verify Environment (1 min)
```bash
git status                      # Any uncommitted changes?
git log --oneline -5            # What was last commit?
npm run dev                     # Does it still work?
```

### 3️⃣ Ask User (30 sec)
- "We're on Sprint 1, Task: [Current Task]. Continue or pivot?"
- "Any blockers from last time?"
- "Ready to code or want to plan first?"

---

## 🎯 Active Sprint Summary

### Sprint 1: Backend Foundation (0% complete)

**Critical Path:**
1. ⚠️ **BLOCKED:** Choose backend platform (Firebase vs Supabase)
2. TODO: Set up backend project
3. TODO: Design database schema
4. TODO: Implement authentication
5. TODO: Build API service layer
6. TODO: Migrate localStorage to backend
7. TODO: Test persistence

**Files to Create:**
```
services/api/client.ts
services/api/auth.ts
services/api/tasks.ts
hooks/useAuth.ts
```

**Success Criteria:**
- ✅ User can login
- ✅ Tasks persist after refresh
- ✅ Data syncs across devices

---

## 🔥 Immediate Actions

### If User Chooses Firebase:
```bash
# 1. Install Firebase
npm install firebase

# 2. Go to console.firebase.google.com
# 3. Create project "flux-prod"
# 4. Enable Authentication (Google provider)
# 5. Enable Firestore
# 6. Get config credentials

# 7. Create service
touch services/api/firebase.ts
```

### If User Chooses Supabase:
```bash
# 1. Install Supabase
npm install @supabase/supabase-js

# 2. Go to supabase.com
# 3. Create project "flux-prod"
# 4. Get API keys from settings
# 5. Enable Google OAuth

# 6. Create service
touch services/api/supabase.ts
```

---

## 📝 Session End Checklist

### Before Stopping Work:

1. **Update Implementation Log**
```bash
# Add entry to .flux/IMPLEMENTATION_LOG.md
# - What you built
# - What works/doesn't work
# - Next steps
```

2. **Update Sprint Tracker**
```bash
# Mark completed tasks in .flux/SPRINT_TRACKER.md
# Move tasks: TODO → IN PROGRESS → COMPLETED
# Note any new blockers
```

3. **Commit Changes**
```bash
git add .
git commit -m "Descriptive message of what changed"
```

4. **Update Context (if needed)**
```bash
# Only update .flux/SESSION_CONTEXT.md if:
# - Sprint changed
# - Major pivot happened
# - New blockers identified
```

---

## 🆘 Common Issues

### "I don't remember what we were doing"
→ Run: `cat .flux/IMPLEMENTATION_LOG.md | tail -100`

### "What's the project structure?"
→ Run: `cat .flux/SESSION_CONTEXT.md | grep -A 30 "Project Structure"`

### "What decisions have we made?"
→ Run: `cat .flux/DECISIONS.md`

### "What's blocked?"
→ Run: `grep -A 5 "Blockers" .flux/*.md`

### "How do I run this?"
→ Run: `npm run dev` (dev server on http://localhost:3000)

---

## 🎓 Key Files Reference

### User-Facing Docs
- `README.md` - Project overview for users
- `ROADMAP.md` - Full product vision (465 lines)
- `DEPLOYMENT.md` - How to deploy

### Developer Tracking
- `.flux/SESSION_CONTEXT.md` - Current state (read this first!)
- `.flux/SPRINT_TRACKER.md` - Active tasks
- `.flux/IMPLEMENTATION_LOG.md` - Build history
- `.flux/DECISIONS.md` - Why we chose things

### Code Structure
```
components/     - React UI components (5 files, all working)
services/       - Business logic (AI, knowledge)
types.ts        - TypeScript definitions
App.tsx         - Main app router
```

---

## 💡 Pro Tips

1. **Always read SESSION_CONTEXT.md first** - It's the single source of truth
2. **Update IMPLEMENTATION_LOG.md after EVERY session** - Future you will thank you
3. **Mark tasks as complete immediately** - Keeps momentum visible
4. **Document decisions in DECISIONS.md** - Prevents re-litigating choices
5. **Commit tracking files WITH code changes** - Keep them in sync

---

## 🎯 Decision Needed NOW

**Backend Platform Choice:**
- Option A: Firebase (faster, easier, vendor lock-in)
- Option B: Supabase (open source, PostgreSQL, more control)

**Ask user:** "Do you prefer Firebase or Supabase for the backend?"

---

## 📞 Emergency Commands

```bash
# Nuclear option: See everything
cat .flux/*.md | less

# What's the current sprint goal?
head -20 .flux/SPRINT_TRACKER.md

# What was the last thing we built?
tail -100 .flux/IMPLEMENTATION_LOG.md

# What file do I need to create next?
grep "Files to Create" .flux/SPRINT_TRACKER.md

# Are there any blockers?
grep -i "block" .flux/*.md
```

---

**⏱️ Time to Full Context: ~3 minutes**  
**📍 You Are Here: Sprint 1, Task 1 (Backend Decision)**  
**🎯 Next Step: User chooses Firebase or Supabase**

---

**Last Updated:** 2024-12-08  
**Quick Start Version:** 1.0
