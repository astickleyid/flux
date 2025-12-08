# Sprint Tracker

**Current Sprint:** Sprint 1 - Backend Foundation  
**Sprint Start:** 2024-12-08  
**Sprint Goal:** Get data persisting beyond browser refresh with authentication

---

## Sprint 1 Tasks

### 🔴 TODO
- [ ] Install Supabase CLI
- [ ] Run automated setup script
- [ ] Generate database schema migration
- [ ] Implement authentication flow
- [ ] Create API service layer
- [ ] Migrate localStorage to backend
- [ ] Test persistence across sessions

### 🟡 IN PROGRESS
- [x] **Decision:** Choose backend platform → **Supabase chosen!**

### ✅ COMPLETED
- [x] Backend platform decision (Supabase)

---

## Task Details

### Task 1: Backend Platform Decision
**Status:** 🔴 Blocked - Needs user decision  
**Priority:** Critical  
**Estimated Time:** 1 hour research + decision  

**Options:**
1. **Firebase**
   - Pros: Fast setup, good docs, auth built-in
   - Cons: Vendor lock-in, NoSQL only, pricing
   
2. **Supabase**
   - Pros: PostgreSQL, open source, self-hostable
   - Cons: Newer, less ecosystem support

**Next Action:** User decides, then initialize project

---

### Task 2: Database Schema Design
**Status:** 🔴 Not Started  
**Priority:** Critical  
**Estimated Time:** 2-3 hours  
**Depends On:** Task 1

**Schema Needed:**
```sql
users
  - id (uuid)
  - email (text)
  - name (text)
  - bio (text)
  - created_at (timestamp)

tasks
  - id (uuid)
  - user_id (uuid, fk)
  - title (text)
  - description (text)
  - status (enum: pending, completed, deferred)
  - priority (enum: critical, high, medium, low)
  - energy_cost (enum: high, low)
  - category (enum: work, learning, life)
  - estimated_duration (int)
  - is_ai_generatable (bool)
  - auto_execute_with_ai (bool)
  - ai_result (text)
  - project_id (uuid, nullable)
  - created_at (timestamp)
  - completed_at (timestamp)

projects
  - id (uuid)
  - user_id (uuid, fk)
  - title (text)
  - description (text)
  - status (enum: active, completed, on_hold)
  - progress (int)
  - created_at (timestamp)

knowledge_base
  - id (uuid)
  - user_id (uuid, fk)
  - fact (text)
  - created_at (timestamp)
```

**Next Action:** Create schema in chosen backend

---

### Task 3: Authentication Implementation
**Status:** 🔴 Not Started  
**Priority:** Critical  
**Estimated Time:** 4-6 hours  
**Depends On:** Task 1, 2

**Subtasks:**
- [ ] Set up OAuth provider (Google)
- [ ] Create login/signup UI
- [ ] Implement auth state management
- [ ] Add protected routes
- [ ] Handle token refresh
- [ ] Add logout functionality

**Files to Create:**
- `services/api/auth.ts`
- `hooks/useAuth.ts`
- `components/Login.tsx`
- `components/ProtectedRoute.tsx`

**Next Action:** Implement Google OAuth flow

---

### Task 4: API Service Layer
**Status:** 🔴 Not Started  
**Priority:** High  
**Estimated Time:** 4-6 hours  
**Depends On:** Task 2, 3

**Subtasks:**
- [ ] Create API client (`services/api/client.ts`)
- [ ] Implement task CRUD operations
- [ ] Implement project CRUD operations
- [ ] Implement profile operations
- [ ] Add error handling
- [ ] Add loading states

**Files to Create:**
- `services/api/client.ts`
- `services/api/tasks.ts`
- `services/api/projects.ts`
- `services/api/profile.ts`

**Next Action:** Build REST/GraphQL client

---

### Task 5: Data Migration
**Status:** 🔴 Not Started  
**Priority:** Medium  
**Estimated Time:** 3-4 hours  
**Depends On:** Task 4

**Subtasks:**
- [ ] Create migration utility
- [ ] Move localStorage tasks to backend
- [ ] Move localStorage knowledge to backend
- [ ] Handle conflicts
- [ ] Add sync indicator in UI

**Files to Create:**
- `lib/migration.ts`
- `components/SyncStatus.tsx`

**Next Action:** Build localStorage → Backend migration tool

---

### Task 6: Integration Testing
**Status:** 🔴 Not Started  
**Priority:** High  
**Estimated Time:** 2-3 hours  
**Depends On:** Task 5

**Test Cases:**
- [ ] User signs up → Creates account
- [ ] User logs in → Sees existing data
- [ ] Create task → Persists in database
- [ ] Close browser → Reopen → Data still there
- [ ] Edit task → Changes saved
- [ ] Delete task → Removed from database

**Next Action:** Manual testing, then automated

---

## Blockers & Issues

### Current Blockers
1. **Backend platform decision** - Waiting on user choice

### Risks
1. OAuth setup might take longer than estimated
2. Schema design might need iteration
3. Migration from localStorage might have edge cases

---

## Sprint Notes

### 2024-12-08
- Created sprint tracking system
- Defined all Sprint 1 tasks
- Awaiting backend platform decision

---

## Next Sprint Preview

### Sprint 2: The Invisible Hand
**Goal:** Auto-reschedule missed tasks without guilt  
**Key Files:**
- `lib/invisibleHand.ts`
- `lib/scheduling.ts`
- `components/InvisibleHandNotification.tsx`

---

**Last Updated:** 2024-12-08  
**Progress:** 0/7 tasks complete
