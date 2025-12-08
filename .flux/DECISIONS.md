# Architecture Decision Records (ADR)

**Purpose:** Document why we made specific technical choices

---

## Decision 1: Modular Sprint System

**Date:** 2024-12-08  
**Status:** ✅ Accepted  

**Context:**  
Development will happen across multiple sessions with potential context loss. Need a system to track progress and resume work efficiently.

**Options Considered:**

1. **No formal system** - Just git commits and memory
   - ❌ Easy to lose context
   - ❌ Hard to resume after breaks
   - ✅ No overhead

2. **Issue tracker (GitHub Issues)** - Use GitHub's native tracking
   - ✅ Integrated with repo
   - ❌ Requires internet
   - ❌ Harder to read full context quickly

3. **In-repo markdown system** - `.flux/` directory with tracking files
   - ✅ Works offline
   - ✅ Fast to read/update
   - ✅ Version controlled
   - ✅ Easy to grep/search
   - ❌ Manual updates needed

**Decision:**  
Chose **Option 3** - In-repo markdown system

**Rationale:**
- Fastest context resumption (just `cat .flux/*.md`)
- Works offline during development
- Version controlled alongside code
- Easy to scan and update
- No external dependencies

**Consequences:**
- Must remember to update tracking files after each session
- Files can get out of sync if forgotten
- Need discipline to maintain

---

## Decision 2: Backend Platform (PENDING)

**Date:** 2024-12-08  
**Status:** 🟡 Pending User Choice  

**Context:**  
Need persistent storage for user data, tasks, and knowledge base. Currently using localStorage which doesn't sync across devices.

**Options:**

### Option A: Firebase
**Pros:**
- Fast setup (< 1 hour)
- Excellent documentation
- Auth built-in (Google, Email, etc.)
- Real-time updates
- Generous free tier
- Good React integration

**Cons:**
- Vendor lock-in (Google)
- NoSQL only (Firestore)
- Can get expensive at scale
- Less control over infrastructure
- Proprietary

**Cost Estimate:** 
- Free: Up to 50K reads/day, 20K writes/day
- Paid: ~$25-50/month for early growth

### Option B: Supabase
**Pros:**
- PostgreSQL (relational data)
- Open source (can self-host)
- Good TypeScript support
- Real-time subscriptions
- Row-level security
- More control

**Cons:**
- Newer platform (less battle-tested)
- Smaller ecosystem
- Might need more setup time
- Auth is good but less polished

**Cost Estimate:**
- Free: 500MB database, 2GB bandwidth
- Paid: $25/month for Pro tier

### Option C: Custom Backend (Express + PostgreSQL)
**Pros:**
- Full control
- No vendor lock-in
- Cheapest long-term
- Can optimize exactly for needs

**Cons:**
- Most time-consuming (2-3 weeks)
- Need to handle auth, security, scaling
- DevOps overhead
- Not worth it for MVP

**Recommendation:**
**Firebase** if prioritizing speed-to-market  
**Supabase** if prioritizing flexibility and open source

**Decision:** TBD - Awaiting user preference

---

## Decision 3: Deployment Strategy

**Date:** 2024-12-08  
**Status:** ✅ Accepted  

**Context:**  
Need automated deployment for rapid iteration and testing.

**Options:**

1. **GitHub Pages Only**
   - ✅ Free
   - ❌ Static only (no backend)
   - ❌ Manual CNAME for custom domain

2. **Vercel Only**
   - ✅ Great DX
   - ✅ Edge functions for backend
   - ❌ Lock-in to platform

3. **Both (Hybrid)**
   - ✅ Options for users
   - ✅ Can test both
   - ❌ More complex CI

**Decision:** **Both** - Support GitHub Pages AND Vercel

**Rationale:**
- GitHub Pages: Free option for open source users
- Vercel: Better for custom domains and edge functions
- CI/CD already handles both
- Users can choose based on needs

**Implementation:**
- `.github/workflows/deploy.yml` for GitHub Pages
- `vercel.json` for Vercel deployments
- Base path conditional in `vite.config.ts`

---

## Decision 4: AI Provider Strategy

**Date:** 2024-12-08  
**Status:** ✅ Accepted  

**Context:**  
Currently using Google Gemini 2.5 Flash. Should we add fallbacks or alternatives?

**Options:**

1. **Gemini Only**
   - ✅ Simplest
   - ✅ Function calling works well
   - ❌ Single point of failure
   - ❌ Locked to Google pricing

2. **Multi-Provider (Gemini + Claude + GPT-4)**
   - ✅ Redundancy
   - ✅ Can choose best for task
   - ❌ Complex config
   - ❌ Different APIs to maintain

3. **OpenRouter (Unified API)**
   - ✅ Access to all models
   - ✅ Automatic failover
   - ❌ Another service dependency
   - ❌ Slightly higher cost

**Decision:** **Gemini Only** for now, with abstraction layer

**Rationale:**
- Keep it simple for MVP
- Abstract AI calls behind service layer
- Easy to add fallbacks later
- Gemini pricing is competitive
- Function calling is critical (Gemini does this well)

**Future:** Add OpenRouter as fallback in Phase 3

---

## Decision 5: State Management

**Date:** 2024-12-08  
**Status:** ✅ Accepted  

**Context:**  
App has complex state (tasks, projects, energy, active task, etc.). How to manage?

**Options:**

1. **React Context Only** (current)
   - ✅ Simple
   - ✅ No dependencies
   - ❌ Can cause re-renders
   - ❌ Harder to debug

2. **Redux Toolkit**
   - ✅ Mature
   - ✅ DevTools
   - ❌ Boilerplate
   - ❌ Overkill for current size

3. **Zustand**
   - ✅ Simple + powerful
   - ✅ Small bundle
   - ✅ Good TypeScript
   - ✅ Easy debugging

4. **Jotai**
   - ✅ Atomic state
   - ✅ Small
   - ❌ Different paradigm

**Decision:** **Keep React Context for now**, migrate to Zustand if state complexity grows

**Rationale:**
- Current state management works
- Not enough pain to justify change yet
- Easy to migrate to Zustand incrementally
- Avoid premature optimization

**Trigger for Change:** When we add real-time sync, consider Zustand + React Query

---

## Decision 6: TypeScript Configuration

**Date:** 2024-12-08  
**Status:** ✅ Accepted  

**Context:**  
TypeScript is enabled but not in strict mode. Some `any` types exist.

**Options:**

1. **Strict Mode Now**
   - ✅ Catch bugs early
   - ❌ Blocks development
   - ❌ Large refactor needed

2. **Gradual Strictness**
   - ✅ Incremental improvement
   - ✅ Doesn't block progress
   - ✅ Fix files as we touch them

3. **Permissive (Current)**
   - ✅ Fast development
   - ❌ Runtime errors slip through
   - ❌ Technical debt

**Decision:** **Gradual Strictness** - Enable strict mode, but with `skipLibCheck`

**Rationale:**
- Strike balance between safety and speed
- Fix type issues as we refactor
- New code must be type-safe
- Add `// @ts-expect-error` for legacy code

**Action Items:**
- [ ] Update `tsconfig.json` to add `strict: true`
- [ ] Fix type errors in new code only
- [ ] Add proper types to `geminiService.ts`

---

## Decision Template (Copy for New Decisions)

### Decision X: [Title]

**Date:** YYYY-MM-DD  
**Status:** 🟡 Pending / ✅ Accepted / ❌ Rejected  

**Context:**  
What problem are we solving? Why does this matter?

**Options:**

1. **Option A**
   - ✅ Pro 1
   - ✅ Pro 2
   - ❌ Con 1

2. **Option B**
   - ✅ Pro 1
   - ❌ Con 1

**Decision:** We chose [X]

**Rationale:**  
Why this is the best choice given constraints

**Consequences:**  
What this means for future development

---

**Total Decisions:** 6 (5 accepted, 1 pending)  
**Last Updated:** 2024-12-08
