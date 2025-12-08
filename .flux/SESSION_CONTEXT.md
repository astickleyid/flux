# Flux Development - Session Context System

**Last Updated:** 2024-12-08  
**Current Phase:** Phase 2 - Backend & Core Features  
**Active Sprint:** Sprint 1 - Foundation Setup

---

## 🎯 Project Status Overview

### Current Version: v0.1-MVP
- ✅ Core UI complete
- ✅ AI integration working
- ✅ Local state management
- ⚠️ No backend persistence
- ⚠️ No real integrations (email/calendar)

### What Works Right Now
1. Manifesto → Onboarding → Dashboard flow
2. Brain Dump with voice input + AI planning
3. Flow Mode with AI co-pilot
4. Task creation and management (in-memory)
5. Energy level tracking (manual)
6. Knowledge base (localStorage only)

### What's Broken/Missing
1. ❌ No data persistence across sessions
2. ❌ No backend/database
3. ❌ Email/Calendar are simulated only
4. ❌ No authentication system
5. ❌ No tests
6. ❌ No error boundaries

---

## 📂 Project Structure Map

```
flux/
├── .flux/                          # 🆕 Development tracking (THIS FOLDER)
│   ├── SESSION_CONTEXT.md          # Current state & context
│   ├── SPRINT_TRACKER.md           # Active sprint tasks
│   ├── IMPLEMENTATION_LOG.md       # What we built each session
│   └── DECISIONS.md                # Architecture decisions log
│
├── components/                     # React components
│   ├── Manifesto.tsx              # ✅ Complete
│   ├── Onboarding.tsx             # ✅ Complete
│   ├── Dashboard.tsx              # ✅ Complete (needs backend)
│   ├── FlowMode.tsx               # ✅ Complete (needs backend)
│   └── BrainDump.tsx              # ✅ Complete (needs backend)
│
├── services/                       # Business logic
│   ├── geminiService.ts           # ✅ AI integration
│   ├── knowledge.ts               # ✅ LocalStorage only
│   ├── api/                       # 🆕 TO BUILD
│   │   ├── auth.ts               # 🔴 Not started
│   │   ├── tasks.ts              # 🔴 Not started
│   │   ├── profile.ts            # 🔴 Not started
│   │   └── sync.ts               # 🔴 Not started
│   └── integrations/              # 🆕 TO BUILD
│       ├── calendar.ts            # 🔴 Not started
│       ├── email.ts               # 🔴 Not started
│       └── biometrics.ts          # 🔴 Not started
│
├── lib/                           # 🆕 TO BUILD - Utilities
│   ├── invisibleHand.ts          # 🔴 Auto-rescheduler
│   ├── energyCalculator.ts       # 🔴 Smart energy detection
│   └── storage.ts                # 🔴 Abstraction layer
│
├── hooks/                         # 🆕 TO BUILD - React hooks
│   ├── useAuth.ts                # 🔴 Authentication
│   ├── useTasks.ts               # 🔴 Task CRUD
│   └── useSync.ts                # 🔴 Real-time sync
│
├── types.ts                       # ✅ Type definitions
├── App.tsx                        # ✅ Main app
└── index.tsx                      # ✅ Entry point
```

---

## 🗺️ Implementation Roadmap (Modular)

### **SPRINT 1: Backend Foundation** ⬅️ START HERE
**Goal:** Get data persisting beyond browser refresh

**Tasks:**
1. [ ] Choose backend (Firebase vs Supabase) - **DECISION NEEDED**
2. [ ] Set up project on chosen platform
3. [ ] Create database schema
4. [ ] Implement authentication (Google OAuth)
5. [ ] Build API service layer (`services/api/`)
6. [ ] Migrate localStorage to backend
7. [ ] Test: User can login and see same data on refresh

**Files to Create:**
- `services/api/client.ts` - API client setup
- `services/api/auth.ts` - Auth methods
- `services/api/tasks.ts` - Task CRUD
- `services/api/profile.ts` - User profile
- `hooks/useAuth.ts` - Auth state hook
- `.env.local` - Add backend credentials

**Success Criteria:**
- ✅ User can create account
- ✅ Tasks persist after browser refresh
- ✅ User profile saved to database

---

### **SPRINT 2: The Invisible Hand**
**Goal:** Tasks auto-reschedule without user guilt

**Tasks:**
1. [ ] Create `lib/invisibleHand.ts`
2. [ ] Implement missed task detection
3. [ ] Build rescheduling algorithm
4. [ ] Add background job system
5. [ ] Create UI notifications for auto-reschedules
6. [ ] Test: Miss a task, see it auto-moved to tomorrow

**Files to Create:**
- `lib/invisibleHand.ts`
- `lib/scheduling.ts`
- `components/InvisibleHandNotification.tsx`
- `services/background.ts`

**Success Criteria:**
- ✅ Missed tasks detected at midnight
- ✅ Tasks rescheduled intelligently
- ✅ User sees gentle notification

---

### **SPRINT 3: Google Calendar Integration**
**Goal:** Real calendar sync (not simulated)

**Tasks:**
1. [ ] Set up Google Cloud Project
2. [ ] Enable Calendar API
3. [ ] Implement OAuth flow
4. [ ] Create `services/integrations/calendar.ts`
5. [ ] Build calendar sync UI
6. [ ] Add conflict detection
7. [ ] Test: Task syncs to Google Calendar

**Files to Create:**
- `services/integrations/calendar.ts`
- `components/CalendarConnect.tsx`
- `lib/oauth.ts`

**Success Criteria:**
- ✅ User can connect Google Calendar
- ✅ Tasks appear in Google Calendar
- ✅ Calendar events block Flux task time

---

### **SPRINT 4: Email Automation**
**Goal:** Real email sending

**Tasks:**
1. [ ] Choose email provider (Gmail API vs SendGrid)
2. [ ] Set up OAuth or API keys
3. [ ] Create `services/integrations/email.ts`
4. [ ] Build email preview modal
5. [ ] Add confirmation for first sends
6. [ ] Test: AI can send real emails

**Files to Create:**
- `services/integrations/email.ts`
- `components/EmailPreview.tsx`
- `components/EmailSettings.tsx`

**Success Criteria:**
- ✅ AI drafts show preview before sending
- ✅ User can approve/edit emails
- ✅ Real emails sent successfully

---

### **SPRINT 5: Testing Infrastructure**
**Goal:** Prevent regressions

**Tasks:**
1. [ ] Set up Vitest
2. [ ] Write unit tests for services
3. [ ] Add React Testing Library
4. [ ] Write component tests
5. [ ] Set up Playwright for E2E
6. [ ] Add CI test runner

**Files to Create:**
- `vitest.config.ts`
- `__tests__/services/`
- `__tests__/components/`
- `e2e/` folder

**Success Criteria:**
- ✅ >70% code coverage
- ✅ CI fails on broken tests
- ✅ E2E tests for critical flows

---

### **SPRINT 6: Resistance Profile Quiz**
**Goal:** Personality-based customization

**Tasks:**
1. [ ] Design quiz questions
2. [ ] Create `components/ResistanceQuiz.tsx`
3. [ ] Build scoring algorithm
4. [ ] Save profile to backend
5. [ ] Adjust UI based on profile
6. [ ] Test: Different profiles = different UX

**Files to Create:**
- `components/ResistanceQuiz.tsx`
- `lib/resistanceProfile.ts`
- `data/quizQuestions.ts`

**Success Criteria:**
- ✅ User takes quiz after onboarding
- ✅ Profile affects task suggestions
- ✅ UI density adapts

---

## 🔄 Session Resumption Protocol

### **When Starting a New Session:**

1. **Read Context Files** (in order):
   ```bash
   cat .flux/SESSION_CONTEXT.md      # Where we are
   cat .flux/SPRINT_TRACKER.md       # What's in progress
   cat .flux/IMPLEMENTATION_LOG.md   # What we just built
   cat .flux/DECISIONS.md            # Why we chose things
   ```

2. **Check Git Status**:
   ```bash
   git log --oneline -5              # Recent commits
   git status                        # Uncommitted changes
   ```

3. **Verify App State**:
   ```bash
   npm run dev                       # Does it still run?
   npm run build                     # Does it build?
   ```

4. **Ask User**:
   - "We're on Sprint X, Task Y. Continue or pivot?"
   - "Any blockers from last session?"

---

## 📝 Decision Log Template

### Decision: [Title]
**Date:** YYYY-MM-DD  
**Context:** What problem are we solving?  
**Options:**
1. Option A - Pros/Cons
2. Option B - Pros/Cons

**Decision:** We chose [X] because [Y]  
**Consequences:** What this means for future work

---

## 🚨 Known Issues & Blockers

### Active Blockers
1. **Backend Choice Pending** - Need to decide Firebase vs Supabase
   - Firebase: Easier, but vendor lock-in
   - Supabase: Open source, PostgreSQL, more control

### Technical Debt
1. No TypeScript strict mode
2. Using `any` types in geminiService
3. No error boundaries
4. No loading states on async operations

### Future Concerns
1. API rate limiting strategy needed
2. Cost management for AI calls
3. Data migration strategy as schema evolves

---

## 📊 Progress Metrics

### Completion Tracking
- **Phase 1 (MVP):** 100% ✅
- **Phase 2 (Backend):** 0% 🔴
- **Phase 3 (Advanced):** 0% 🔴

### Sprint Velocity
- Sprint 1: Not started
- Estimated: 1 sprint = 1-2 weeks

---

## 🎯 Next Session Checklist

**Before Coding:**
- [ ] Review this file
- [ ] Check SPRINT_TRACKER.md
- [ ] Read IMPLEMENTATION_LOG.md
- [ ] Confirm current sprint goal

**After Coding:**
- [ ] Update IMPLEMENTATION_LOG.md
- [ ] Mark tasks complete in SPRINT_TRACKER.md
- [ ] Commit with descriptive message
- [ ] Update this file if context changes

---

## 🔗 Quick Links

- [Roadmap](../ROADMAP.md) - Full product vision
- [Deployment Guide](../DEPLOYMENT.md) - How to deploy
- [README](../README.md) - Project overview

---

**🎯 CURRENT FOCUS:** Sprint 1 - Backend Foundation  
**📍 NEXT ACTION:** Choose Firebase vs Supabase and initialize project
