# .flux Development System

**This directory contains our session-aware development tracking system.**

---

## 📁 Files Overview

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `SESSION_CONTEXT.md` | Current project state, structure, and focus | Every session start/end |
| `SPRINT_TRACKER.md` | Active sprint tasks and progress | Daily |
| `IMPLEMENTATION_LOG.md` | What we built each session | After each session |
| `DECISIONS.md` | Architecture decision records | When making big decisions |
| `README.md` | This file - system documentation | Rarely |

---

## 🚀 Quick Start (For AI Assistant)

### Starting a New Session
```bash
# 1. Read context files
cat .flux/SESSION_CONTEXT.md
cat .flux/SPRINT_TRACKER.md
cat .flux/IMPLEMENTATION_LOG.md

# 2. Check git status
git log --oneline -5
git status

# 3. Verify app works
npm run dev
```

### Ending a Session
```bash
# 1. Update IMPLEMENTATION_LOG.md
# - Log what you built
# - Note any issues
# - List next steps

# 2. Update SPRINT_TRACKER.md
# - Mark completed tasks
# - Update statuses

# 3. Commit changes
git add .
git commit -m "Descriptive message"

# 4. Update SESSION_CONTEXT.md if needed
# - Change sprint if completed
# - Update blockers
# - Adjust next actions
```

---

## 📋 Sprint System

### Sprint Structure
Each sprint is **1-2 weeks** of focused work on a single goal.

### Current Sprint Workflow
1. **Sprint 1:** Backend Foundation (← WE ARE HERE)
2. **Sprint 2:** Invisible Hand
3. **Sprint 3:** Calendar Integration
4. **Sprint 4:** Email Automation
5. **Sprint 5:** Testing Infrastructure
6. **Sprint 6:** Resistance Profile Quiz

### Sprint Checklist
- [ ] All tasks defined in SPRINT_TRACKER.md
- [ ] Success criteria clear
- [ ] Files to create listed
- [ ] Dependencies identified
- [ ] Blockers noted

---

## 🎯 Session Templates

### For AI: Session Resume Template
```
Looking at the tracking files:

Current State:
- Sprint: [X]
- Task: [Y]
- Status: [Z]

What I'll work on today:
1. [Task A]
2. [Task B]

Questions for user:
1. [Question]
```

### For User: Progress Check Template
```
Session Summary:
✅ Completed:
- [Task 1]
- [Task 2]

🚧 In Progress:
- [Task 3]

🔴 Blocked:
- [Task 4] - Reason

Next Session:
- [What to do next]
```

---

## 🔧 System Maintenance

### When to Update Each File

**SESSION_CONTEXT.md**
- ✏️ Sprint changes
- ✏️ Major architectural shifts
- ✏️ New blockers identified
- ✏️ Folder structure changes

**SPRINT_TRACKER.md**
- ✏️ Task status changes
- ✏️ New blockers
- ✏️ Task estimates adjust
- ✏️ Daily progress updates

**IMPLEMENTATION_LOG.md**
- ✏️ After every session
- ✏️ Document what was built
- ✏️ Note key decisions
- ✏️ List next steps

**DECISIONS.md**
- ✏️ When choosing between options
- ✏️ When making architecture decisions
- ✏️ When pivoting strategy
- ✏️ When tech stack changes

---

## 💡 Best Practices

### ✅ DO
- Read context files at session start
- Update IMPLEMENTATION_LOG.md after each session
- Mark tasks complete in SPRINT_TRACKER.md
- Document major decisions in DECISIONS.md
- Commit tracking files with code changes

### ❌ DON'T
- Let tracking files get out of sync
- Skip session logs (context loss)
- Make big decisions without documenting
- Ignore blockers in tracker
- Forget to update when pivoting

---

## 🔍 Common Commands

### Quick Context Check
```bash
# Full context dump
cat .flux/*.md | less

# Just current sprint
cat .flux/SPRINT_TRACKER.md

# Recent work
cat .flux/IMPLEMENTATION_LOG.md | tail -n 50
```

### Search Tracking History
```bash
# Find when we made a decision
grep -r "Decision:" .flux/

# Find blockers
grep -r "Blocked" .flux/

# Find TODOs
grep -r "\[ \]" .flux/
```

### Stats
```bash
# Count completed tasks
grep -c "✅" .flux/SPRINT_TRACKER.md

# Sessions count
grep -c "^## Session" .flux/IMPLEMENTATION_LOG.md
```

---

## 🎓 Philosophy

### Why This System?

1. **Context Persistence** - AI assistants lose context between sessions
2. **Human Readable** - Markdown is easy to read and edit
3. **Version Controlled** - Changes tracked alongside code
4. **Offline First** - No external tools required
5. **Searchable** - grep works great on plain text

### Inspired By
- [Architectural Decision Records](https://adr.github.io/)
- [Bullet Journal](https://bulletjournal.com/) methodology
- Agile sprint planning
- Engineering logbooks

---

## 📊 Metrics to Track (Future)

- Sessions per sprint (velocity)
- Tasks completed per session
- Blocker resolution time
- Decision-to-implementation time
- Code churn in tracking files

---

## 🔮 Future Enhancements

- [ ] CLI tool for updating tracking files
- [ ] Git hooks to auto-update
- [ ] Dashboard view (HTML generator)
- [ ] AI integration for auto-logging
- [ ] Sprint retrospective templates

---

**Created:** 2024-12-08  
**Last Updated:** 2024-12-08  
**System Version:** 1.0
