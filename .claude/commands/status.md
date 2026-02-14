---
description: Show current Genius Team project status and progress
---

# /status

Show current project status and progress.

## Execution

Display comprehensive project status by checking files and state:

### Step 1: Read State
```bash
cat .genius/state.json 2>/dev/null
```

### Step 2: Check Artifacts
```bash
ls -la DISCOVERY.xml MARKET-ANALYSIS.xml SPECIFICATIONS.xml DESIGN-SYSTEM.html ARCHITECTURE.md .claude/plan.md PROGRESS.md 2>/dev/null
```

### Step 3: Display Status

```
📊 **Project Status**

**Phase:** {Ideation / Execution / Complete}
**Current Step:** {skill name or "Ready to start"}

**Progress:**
┌────────────────────────────────────────┐
│ Discovery       {██████████ ✅ | ░░░░░░░░░░}  │
│ Market Analysis {██████████ ✅ | ░░░░░░░░░░}  │
│ Specifications  {██████████ ✅ | ░░░░░░░░░░}  │
│ Design          {██████████ ✅ | ░░░░░░░░░░}  │
│ Architecture    {██████████ ✅ | ░░░░░░░░░░}  │
│ Execution       {████░░░░░░ 40% | ░░░░░░░░░░} │
│ QA              {░░░░░░░░░░ Pending}          │
│ Deployment      {░░░░░░░░░░ Pending}          │
└────────────────────────────────────────┘

**Checkpoints:**
- ✅ Discovery complete
- ✅ Specs approved
- ✅ Design chosen (Option B)
- ✅ Architecture approved
- ⏳ Execution in progress
- ⬜ QA pending
- ⬜ Deployment pending

**Files Generated:**
- DISCOVERY.xml ✅
- MARKET-ANALYSIS.xml ✅
- SPECIFICATIONS.xml ✅
- DESIGN-SYSTEM.html ✅
- ARCHITECTURE.md ✅
- .claude/plan.md ✅

**Execution Progress:** (if in execution phase)
- Total tasks: 47
- Completed: 23 ✅
- In Progress: 1 ⏳
- Remaining: 23 ⬜

Current task: Task 24 - Implement user authentication

**Memory Status:**
- Mind MCP: {Connected / Not connected}
- Local memory: .mind/MEMORY.md {exists / empty}
- Decisions logged: {count}

**Next Action:**
{Context-aware suggestion based on current state}
```

### Step 4: Suggest Next Action

Based on state:
- If NOT_STARTED: "Say 'I want to build [idea]' to begin"
- If IDEATION + awaiting checkpoint: "Review and approve to continue"
- If EXECUTION: "Execution in progress. Say 'STOP' to pause or let it continue."
- If COMPLETE: "Project complete! Run '/genius-start' to verify deployment."
