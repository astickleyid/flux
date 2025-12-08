# Flux: Product Roadmap & Architecture Vision

## 🎯 Mission Statement

**Flux is not a to-do app. It's a psychological intervention system designed to eliminate the "Execution Gap" through behavioral architecture, AI automation, and calm technology.**

---

## 📐 Current Architecture (v0.1 - MVP)

### ✅ **Implemented Features**

#### Core Philosophy
- **Manifesto Screen** - Introduces the behavioral psychology framework
- **Onboarding** - Captures user context (name, email, bio) for personalized AI
- **User Knowledge System** - LocalStorage-based learning that persists across sessions

#### Main Features
1. **Dashboard** (The Command Center)
   - Energy-aware task display (HIGH/MEDIUM/LOW/DEPLETED)
   - Quick task input with AI parsing
   - Priority-based task queue
   - Project management with subtasks
   - Reality check (overbooked detection)
   - Completed task archive with AI result viewer

2. **Brain Dump Mode** (Strategic Release Valve)
   - Voice-to-text capture (WebKit Speech Recognition)
   - Multi-turn conversational AI planning
   - Socratic questioning for complex goals
   - Auto-generates tasks AND projects from chaos
   - Context-aware suggestions based on user's unique constraints

3. **Flow Mode** (Execution Chamber)
   - Distraction-free timer interface
   - AI Co-Pilot sidebar with tool access
   - Proactive execution (AI acts WITHOUT being asked)
   - Multi-turn chat with task context
   - Progress visualization

4. **AI Intelligence Layer**
   - Google Gemini 2.5 Flash integration
   - **Function Calling Tools:**
     - `sendEmail` - Simulated email automation
     - `scheduleEvent` - Calendar integration mock
     - `getCurrentWeather` - Environmental context
   - **Grounding Tools:**
     - Google Search
     - Google Maps (location-aware)
   - Knowledge persistence (learns from feedback)
   - Auto-execution for "AI-generatable" tasks

#### Technical Stack
- React 19 + TypeScript
- Vite (fast dev + build)
- Tailwind CSS (utility-first styling)
- Google Gemini AI
- LocalStorage (knowledge persistence)
- Geolocation API (context-aware AI)

---

## 🚀 Phase 2: The "Execution Gap" Closer (Next 3-6 Months)

### 🔴 **Critical Missing Features**

#### 1. **The Invisible Hand (Auto-Rescheduler)**
**Problem:** Users feel guilt when they miss tasks.  
**Solution:** AI automatically reschedules missed tasks based on:
- Current energy level
- Historical completion patterns
- Task priority decay curves
- Calendar conflicts (future integration)

**Implementation:**
```typescript
// New service: services/invisibleHand.ts
- detectMissedTasks()
- rescheduleIntelligently()
- adjustPriorityDynamically()
- preserveDopamineLoop() // No shame, only flow
```

#### 2. **Persistent User Profiles (Backend)**
**Problem:** LocalStorage is ephemeral. No cross-device sync.  
**Solution:** Lightweight backend for profile + task sync

**Tech Options:**
- **Firebase** (fastest MVP path)
- **Supabase** (open-source, PostgreSQL)
- **Vercel KV** (edge storage, low latency)

**Schema:**
```typescript
UserProfile {
  id: uuid
  name: string
  email: string
  bio: string
  energyPreferences: EnergyProfile
  taskHistory: Task[]
  knowledgeBase: string[]
  createdAt: timestamp
}
```

#### 3. **Real Calendar Integration**
**Problem:** Simulated calendar is not real automation.  
**Solution:** OAuth with Google Calendar / Outlook

**Features:**
- Sync tasks to calendar
- Block focus time automatically
- Detect conflicts in real-time
- Time-boxing enforcement

**APIs:**
- Google Calendar API
- Microsoft Graph API (Outlook)

#### 4. **Real Email Automation**
**Problem:** Simulated emails don't execute.  
**Solution:** SMTP integration or API-based sending

**Options:**
- **SendGrid** (transactional email)
- **Resend** (developer-friendly)
- **Gmail API** (OAuth for user's own account)

**Safety:**
- Preview before send
- User confirmation for first-time recipients
- Rate limiting

#### 5. **The Energy Tracker (Biometric Integration)**
**Problem:** Manual energy reporting is inaccurate.  
**Solution:** Passive biometric tracking

**Data Sources:**
- **Fitbit / Apple Watch** - Heart rate variability, sleep quality
- **RescueTime / ActivityWatch** - Computer usage patterns
- **Oura Ring** - Sleep cycles, readiness score

**Algorithm:**
```typescript
calculateEnergyLevel() {
  sleepQuality * 0.4 +
  circadianRhythm * 0.3 +
  recentProductivity * 0.2 +
  timeOfDay * 0.1
}
```

#### 6. **The Resistance Profile Quiz**
**Problem:** Generic productivity advice fails.  
**Solution:** Personality-based calibration

**Based on:**
- Big 5 Personality Traits (OCEAN)
- ADHD/Autism screening questions
- Chronotype (morning/evening person)
- Work style preferences

**Output:**
- Custom UI density (minimalist vs rich)
- Default task estimation bias corrections
- AI tone adjustments (calm vs motivational)

---

## 🌟 Phase 3: The "God-Tier" Experience (6-12 Months)

### **Advanced Features**

#### 7. **Dynamic Dashboard Morphing**
**Concept:** UI adapts to stress level in real-time

**States:**
- **Morning Mode** - Broad overview, strategic planning
- **Focus Mode** - Single task, minimal distractions
- **Burnout Mode** - Simplified, gentle prompts
- **Crisis Mode** - Emergency triage interface

**Triggers:**
- Time of day
- Task completion velocity
- Energy depletion rate
- User override

#### 8. **The "Second Brain" Export**
**Problem:** Knowledge locked in Flux.  
**Solution:** Export to Obsidian, Notion, Roam

**Formats:**
- Markdown files
- JSON (structured data)
- CSV (spreadsheet analysis)

**API Endpoints:**
```
GET /export/markdown
GET /export/json
POST /import/todoist
POST /import/notion
```

#### 9. **Team Mode (Collaboration Layer)**
**Use Case:** Shared projects, delegation

**Features:**
- Assign tasks to team members
- Visibility controls
- Async updates with conflict resolution
- AI suggests optimal task assignments

**Tech:**
- WebSockets for real-time sync
- Conflict-free replicated data types (CRDTs)

#### 10. **Voice-First Interface**
**Problem:** Typing breaks flow.  
**Solution:** Conversational control

**Commands:**
- "Flux, what's next?" → AI suggests task
- "Flux, reschedule this to tomorrow" → Auto-adjust
- "Flux, brain dump" → Opens War Room
- "Flux, I'm exhausted" → Triggers Burnout Mode

**Implementation:**
- WebKit Speech Recognition (already partially done)
- Wake word detection ("Hey Flux")
- Voice feedback (optional)

#### 11. **Gamification Without Toxicity**
**Problem:** Streaks create anxiety.  
**Solution:** Process-based rewards

**Metrics:**
- "Flow Hours" (time in focused state)
- "Execution Rate" (tasks completed vs deferred)
- "Energy Optimization" (matching task energy cost to user energy)
- **NO daily streaks** (they cause guilt)

**Rewards:**
- Aesthetic unlocks (UI themes)
- Advanced features (early access)
- "Hall of Execution" (personal milestones)

#### 12. **AI Coaching Sessions**
**Concept:** Weekly strategic reviews

**Flow:**
1. AI analyzes past week's data
2. Identifies execution patterns
3. Asks reflective questions
4. Adjusts task estimation calibration
5. Updates knowledge base

**Trigger:**
- Every Sunday evening (customizable)
- After 10+ completed tasks
- When energy patterns shift

---

## 🔧 Technical Debt & Infrastructure

### **Code Quality**
- [ ] Add comprehensive TypeScript types (no `any`)
- [ ] Extract magic numbers to constants
- [ ] Implement error boundaries
- [ ] Add loading states for all async operations
- [ ] Centralize API error handling

### **Testing**
- [ ] Unit tests (Vitest)
- [ ] Integration tests (React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] AI mock responses for deterministic testing

### **Performance**
- [ ] Code splitting (React.lazy)
- [ ] Service Worker (offline support)
- [ ] IndexedDB (large knowledge bases)
- [ ] Virtual scrolling (long task lists)

### **Security**
- [ ] Encrypt sensitive data in LocalStorage
- [ ] API key rotation system
- [ ] Rate limiting on AI calls
- [ ] CSP headers

### **DevOps**
- [ ] CI/CD pipeline (GitHub Actions ✅ already done)
- [ ] Staging environment
- [ ] Analytics (privacy-respecting)
- [ ] Error tracking (Sentry)

---

## 🎨 Design System Evolution

### **Current State:**
- Warm paper background (#FDFBF7)
- Swiss typography (Inter + Playfair Display)
- Neumorphic glass panels

### **Future Enhancements:**

#### **Themes**
- **Flux Light** (current)
- **Flux Dark** (midnight mode)
- **Flux Focus** (monochrome, high contrast)
- **Flux Calm** (pastel, low saturation)

#### **Accessibility**
- [ ] WCAG AAA contrast ratios
- [ ] Screen reader optimization
- [ ] Keyboard-only navigation
- [ ] Reduced motion mode
- [ ] Dyslexia-friendly font option

#### **Animations**
- [ ] Page transitions (Framer Motion)
- [ ] Micro-interactions on task completion
- [ ] Energy level shift animations
- [ ] Loading state choreography

---

## 📊 Success Metrics (KPIs)

### **User Behavior**
- **Execution Rate:** % of tasks marked complete (target: 70%+)
- **Defer Rate:** % of tasks deferred (target: <20%)
- **Energy Accuracy:** Manual vs biometric match (target: 80%+)
- **Flow Duration:** Avg minutes in Flow Mode (target: 45+)

### **AI Performance**
- **Task Estimation Accuracy:** ±10 minutes (target: 80%+)
- **Auto-Execution Success:** % of AI tasks accepted (target: 90%+)
- **Knowledge Base Growth:** Facts learned per week (target: 5+)
- **Socratic Success:** % of Brain Dumps resolved without re-clarification (target: 60%+)

### **Technical Health**
- **API Latency:** Gemini response time (target: <2s)
- **Build Time:** Vite production build (target: <30s)
- **Bundle Size:** Main JS chunk (target: <500KB)
- **Uptime:** Server availability (target: 99.9%)

---

## 🤝 Community & Open Source

### **Contribution Opportunities**
- [ ] Plugin system for custom tools
- [ ] Theme marketplace
- [ ] Knowledge base templates (ADHD, Students, Founders)
- [ ] Translation/i18n

### **API for Developers**
```typescript
// Example: Custom tool registration
FluxAPI.registerTool({
  name: 'summarizeArticle',
  description: 'Extract key points from a URL',
  execute: async (url) => { /* ... */ }
});
```

---

## 💡 Innovation Experiments (Research Track)

### **Crazy Ideas to Explore**

1. **Neuralink Integration** (far future)
   - Direct brainwave measurement for true cognitive load

2. **Ambient Computing**
   - Room sensors detect when you sit down → Auto-start Flow Mode
   - Smart lights dim when Flow Mode activates

3. **Predictive Burnout Detection**
   - ML model trained on task velocity, energy trends
   - Intervention: "Take tomorrow off" recommendation

4. **Flux for Teams**
   - Shared "War Room" for collaborative planning
   - AI mediates task delegation based on individual energy

5. **Blockchain Task Verification** (controversial)
   - Immutable execution history
   - NFT badges for milestone completion

---

## 📅 Release Timeline

### **v0.2 - The Persistence Update** (Q1 2025)
- ✅ Firebase backend
- ✅ Cross-device sync
- ✅ Invisible Hand auto-rescheduler

### **v0.3 - The Integration Update** (Q2 2025)
- ✅ Google Calendar OAuth
- ✅ Real email sending
- ✅ Biometric energy tracking (Fitbit/Apple Watch)

### **v0.4 - The Intelligence Update** (Q3 2025)
- ✅ Resistance Profile quiz
- ✅ Dynamic Dashboard morphing
- ✅ AI coaching sessions

### **v1.0 - The Complete Experience** (Q4 2025)
- ✅ Voice-first interface
- ✅ Team collaboration
- ✅ Export/import ecosystem
- ✅ Mobile apps (React Native)

---

## 🛠️ Immediate Next Steps (This Week)

1. **Set up Firebase** (or Supabase) for backend
2. **Implement Invisible Hand** rescheduling logic
3. **Add Google Calendar OAuth** flow
4. **Create Resistance Profile** quiz component
5. **Write comprehensive tests** for critical paths
6. **Document API** for community contributions

---

## 💬 Open Questions

1. **Monetization Strategy?**
   - Freemium (basic features free, advanced paid)
   - One-time purchase (indie app model)
   - Open source + donations

2. **Mobile Native vs PWA?**
   - PWA pros: Same codebase, instant updates
   - Native pros: Better biometric integration, App Store presence

3. **Data Privacy Philosophy?**
   - Self-hosted option for enterprises?
   - End-to-end encryption for task data?
   - GDPR compliance checklist

4. **AI Model Strategy?**
   - Stick with Gemini or add Claude/GPT-4 fallbacks?
   - Train custom small model for task estimation?
   - Edge AI for offline mode?

---

**Last Updated:** December 8, 2024  
**Version:** 0.1-MVP  
**Status:** 🟢 Active Development

---

*"Chaos precedes order. Flux is the architect."*
