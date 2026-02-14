---
description: Hydrate tasks from plan.md for longer work loops
---

# /hydrate-tasks

Hydrate Claude Code Tasks from persistent plan files. This enables longer work loops by syncing external task files into the session-scoped Task system.

## The Hydration Pattern

Claude Code Tasks are **session-scoped** - they disappear when you close your terminal. The hydration pattern solves this by:

1. **Persistent files** (`.claude/plan.md`, `PROGRESS.md`) = Source of truth
2. **Session Tasks** = Ephemeral execution tracking
3. **Hydration** = Load persistent → session at start
4. **Sync-back** = Write session → persistent on changes

## Execution

### Step 1: Read Persistent Task Files

```bash
# Check for plan file
if [ -f .claude/plan.md ]; then
  echo "📋 Found plan.md"
  cat .claude/plan.md
else
  echo "⚠️ No plan.md found - run genius-architect first"
  exit 1
fi

# Check for progress file
if [ -f PROGRESS.md ]; then
  echo "📊 Found PROGRESS.md"
  cat PROGRESS.md
fi
```

### Step 2: Parse Tasks from plan.md

Extract tasks in format:
```markdown
- [ ] Task description (not started)
- [~] Task description (in progress)
- [x] Task description (completed)
- [!] Task description (blocked/skipped)
```

### Step 3: Create Session Tasks

For each incomplete task from plan.md, mentally track:
- Task ID (line number or explicit ID)
- Description
- Status (pending/in_progress/completed/blocked)
- Dependencies (if specified)

### Step 4: Display Hydrated State

```
╔════════════════════════════════════════════════════════════╗
║  📋 Tasks Hydrated from .claude/plan.md                    ║
╚════════════════════════════════════════════════════════════╝

Total Tasks: {count}
├── ✅ Completed: {completed}
├── 🔄 In Progress: {in_progress}
├── ⏳ Pending: {pending}
└── ⚠️ Blocked: {blocked}

Next Task: {next_task_description}

Ready to continue execution. Say "go" or "continue" to proceed.
```

## Sync-Back Protocol

After completing each task:

1. Update `.claude/plan.md`:
   - Change `[ ]` to `[x]` for completed
   - Change `[ ]` to `[~]` for in-progress
   - Change `[ ]` to `[!]` for blocked

2. Update `PROGRESS.md`:
   - Add completion timestamp
   - Note any issues encountered
   - Update task counts

3. Update `.genius/state.json`:
   - Record last completed task
   - Update phase if milestone reached

## Usage

### Manual Hydration
```
/hydrate-tasks
```

### Auto-Hydration (via SessionStart hook)
The `SessionStart` hook in settings.json already loads context, but you can explicitly hydrate tasks for longer sessions.

### Resume After Break
```
/hydrate-tasks
continue
```

## Integration with genius-orchestrator

The orchestrator should:

1. **On start**: Read tasks from `.claude/plan.md`
2. **Per task**:
   - Mark as `[~]` in-progress
   - Execute via Task tool
   - Mark as `[x]` on success or `[!]` on failure
3. **On pause/stop**: Ensure all state is synced to files
4. **On resume**: Hydrate from files and continue

## Why This Matters

Without hydration:
- Close terminal = lose all task context
- Sub-agents don't know main agent's tasks
- Can't resume multi-day projects

With hydration:
- Tasks persist in `.claude/plan.md`
- Any session can pick up where you left off
- Sub-agents can read the same plan
- Progress accumulates across sessions

---

*"The blueprint persists. Progress accumulates."*
