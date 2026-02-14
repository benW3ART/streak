---
description: Resume Genius Team project from where it was left off
---

# /continue

Resume project from where it was left off.

## Execution

### Step 1: Load Context

```bash
# Read state
cat .genius/state.json 2>/dev/null

# Read progress
cat PROGRESS.md 2>/dev/null | head -50

# Read memory
cat .mind/MEMORY.md 2>/dev/null | head -30
```

If Mind MCP available:
```python
mind_recall()  # Load full context
```

### Step 2: Determine Resume Point

Based on `.genius/state.json`:

| Phase | Current Skill | Action |
|-------|--------------|--------|
| NOT_STARTED | null | Start genius-interviewer |
| IDEATION | genius-interviewer | Resume interview |
| IDEATION | genius-specs | Check if awaiting approval |
| IDEATION | genius-designer | Check if awaiting choice |
| IDEATION | genius-architect | Check if awaiting approval |
| EXECUTION | genius-orchestrator | Resume from PROGRESS.md |
| COMPLETE | null | Show completion summary |

### Step 3: Resume Execution

**If in IDEATION phase:**
```
📍 Resuming from: {skill name}

Last activity: {from state.json or PROGRESS.md}

{Load the appropriate skill and continue}
```

**If in EXECUTION phase:**
```
📍 Resuming execution...

Progress: {completed}/{total} tasks

Last completed: {task name}
Next task: {task name}

Continuing autonomously...
```

Then invoke genius-orchestrator with resume context.

**If COMPLETE:**
```
✅ Project already complete!

Summary:
- Tasks completed: {count}
- Last deployment: {date}

What would you like to do?
- "deploy to production" - Deploy latest
- "run QA" - Full quality audit
- "security audit" - Security check
- "new feature [description]" - Add to project
```

### Step 4: Log Resume

```python
mind_log(
  content="SESSION RESUMED: Phase={phase} | Skill={skill} | Progress={progress}",
  level=2,
  tags=["session", "resume"]
)
```
