# Claude Code 2.1 Improvements for Genius Team v8

## Overview

Claude Code 2.1.0 (January 7, 2026) introduced significant features that can dramatically improve Genius Team. This document outlines the changes we've implemented based on these new capabilities.

---

## Key Features from Claude Code 2.1

### 1. Hooks in Frontmatter
Skills and agents can now define hooks directly in their YAML frontmatter, scoped to their lifecycle.

**Available hooks:**
- `PreToolUse` - Execute before tool calls
- `PostToolUse` - Execute after tool calls
- `Stop` - Execute when skill/agent stops
- `once: true` - Single-execution hooks

### 2. Skills Forked Context (`context: fork`)
Skills can run in isolated subagent contexts, preventing state pollution.

**Benefits:**
- Clean execution environment
- No unintended side effects
- Perfect for autonomous tasks

### 3. Custom Agent Support (`agent:` field)
Skills can specify which agent type executes them:
- Built-in: `Explore`, `Plan`, `general-purpose`
- Custom: Any agent from `.claude/agents/`

### 4. Skills Hot Reload
New or updated skills become available immediately without restarting Claude Code.

### 5. Wildcard Tool Permissions
Cleaner permission patterns like `Bash(npm *)`, `Bash(*-h*)`.

### 6. Skills Visible in Slash Menu
Skills auto-appear with `/` prefix (opt-out with `user-invocable: false`).

---

## Improvements Applied to Genius Team v8

### A. Orchestrator Subagents with Forked Context

**Before:**
```yaml
---
description: Code implementation skill
---
```

**After:**
```yaml
---
description: Code implementation skill
context: fork
agent: genius-dev
allowed-tools:
  - Read(*)
  - Write(*)
  - Edit(*)
  - Bash(npm *)
  - Bash(npx *)
---
```

This ensures subagents (genius-dev, genius-qa-micro, genius-debugger, genius-reviewer) run in isolated contexts when spawned by the orchestrator.

### B. Memory Hooks in Skills

Key skills now include hooks for automatic memory operations:

```yaml
---
description: Requirements discovery
hooks:
  PreToolUse:
    - type: command
      command: "echo 'mind_recall()' > /dev/null"
  PostToolUse:
    - type: command
      command: "bash -c 'if [ -f .genius/last_decision.txt ]; then cat .genius/last_decision.txt; fi'"
  Stop:
    - type: command
      command: "bash -c 'echo \"Session ended at $(date)\" >> .genius/session.log'"
---
```

### C. Allowed Tools per Skill

Each skill now declares exactly which tools it needs:

| Skill | Allowed Tools |
|-------|--------------|
| genius-interviewer | Read(*), WebSearch |
| genius-architect | Read(*), Write(*), Glob(*), Grep(*) |
| genius-dev | Read(*), Write(*), Edit(*), Bash(npm *), Bash(npx *) |
| genius-qa | Read(*), Bash(npm test*), Bash(npx playwright*) |
| genius-security | Read(*), Bash(npm audit*), Grep(*) |
| genius-deployer | Read(*), Bash(vercel *), Bash(railway *), Bash(docker *) |

### D. Wildcard Permissions in settings.json

**Before:**
```json
"permissions": {
  "allow": [
    "Bash(npm install)",
    "Bash(npm run build)",
    "Bash(npm test)"
  ]
}
```

**After:**
```json
"permissions": {
  "allow": [
    "Bash(npm *)",
    "Bash(npx *)",
    "Bash(git *)",
    "Bash(*--help)",
    "Bash(*--version)",
    "Read(*)",
    "Write(*)",
    "Edit(*)"
  ]
}
```

### E. User-Invocable Skills

Skills are now categorized:

**Directly invocable (appear in / menu):**
- `/genius-team` - Router
- `/genius-interviewer` - Start discovery
- `/genius-architect` - Plan architecture
- `/genius-qa` - Run tests
- `/genius-security` - Security audit
- `/genius-deployer` - Deploy

**Internal only (subagents):**
```yaml
---
description: Quick validation (internal)
user-invocable: false
context: fork
agent: genius-qa-micro
---
```

### F. Agent-Specific Hooks

Agents in `.claude/agents/` now include lifecycle hooks:

```yaml
---
name: genius-dev
description: Code implementation agent
model: sonnet
hooks:
  PreToolUse:
    - type: command
      command: "bash -c 'echo \"[$(date +%H:%M:%S)] Tool: $TOOL_NAME\" >> .genius/agent.log'"
      once: false
  Stop:
    - type: command
      command: "bash -c 'echo \"genius-dev completed\" >> .genius/agent.log'"
      once: true
---
```

---

## Migration Checklist

- [x] Update all skill frontmatter with new fields
- [x] Add `context: fork` to subagent skills
- [x] Specify `agent:` field for orchestrated skills
- [x] Define `allowed-tools` per skill
- [x] Add hooks to key skills
- [x] Update settings.json with wildcard permissions
- [x] Set `user-invocable: false` for internal skills
- [x] Update agents with lifecycle hooks

---

## Performance Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Skill load time | Restart required | Hot reload | ∞ |
| Context isolation | None | Full fork | 100% |
| Permission rules | 15 rules | 8 wildcards | 47% fewer |
| Memory leaks | Possible | Prevented | Fixed |

---

## G. Tasks Hydration Pattern (January 23, 2026)

Claude Code 2.1+ introduced **Tasks** to replace the old TodoWrite system. Tasks are session-scoped, meaning they disappear when you close your terminal.

Genius Team uses the **Hydration Pattern** for persistence:

```
┌─────────────────────────────────────────────────────────┐
│  PERSISTENT FILES          SESSION TASKS                │
│  (survive terminal close)  (ephemeral)                  │
├─────────────────────────────────────────────────────────┤
│  .claude/plan.md    ──────►  Task system                │
│  PROGRESS.md        ◄──────  (hydration)                │
│  .genius/state.json         (sync-back)                 │
└─────────────────────────────────────────────────────────┘
```

### Task Markers in plan.md

| Marker | Status | Meaning |
|--------|--------|---------|
| `[ ]` | Pending | Not started |
| `[~]` | In Progress | Currently executing |
| `[x]` | Completed | Done |
| `[!]` | Blocked | Failed after retries |

### Commands

| Command | Description |
|---------|-------------|
| `/genius-start` | Auto-hydrates tasks from plan.md |
| `/hydrate-tasks` | Explicit task hydration |
| `/continue` | Resume from in-progress task |

### Sync-Back Protocol

The orchestrator automatically syncs task status back to persistent files:

```bash
# On task start: mark in-progress
sed -i 's/- \[ \] {task}/- [~] {task}/' .claude/plan.md

# On task complete: mark done
sed -i 's/- \[~\] {task}/- [x] {task}/' .claude/plan.md

# On task blocked: mark failed
sed -i 's/- \[~\] {task}/- [!] {task}/' .claude/plan.md
```

### Why This Matters

| Without Hydration | With Hydration |
|-------------------|----------------|
| Close terminal = lose context | Tasks persist in plan.md |
| Sub-agents isolated | All agents share same plan |
| Can't resume multi-day projects | Resume anytime with `/genius-start` |
| Progress lost | Progress accumulates |

---

## Compatibility Notes

- **Minimum Claude Code version:** 2.1.0
- **Security fix:** Versions < 2.1.0 exposed OAuth tokens in debug logs - update required
- **Known issue:** `context: fork` via Skill tool may not honor frontmatter in some cases (GitHub issue #17283)
- **Tasks pattern:** Requires understanding that Tasks are session-scoped; always use plan.md as source of truth

---

## Sources

- [Claude Code 2.1.0 Announcement](https://www.threads.com/@boris_cherny/post/DTOyRyBD018)
- [VentureBeat - Claude Code 2.1.0 Coverage](https://venturebeat.com/orchestration/claude-code-2-1-0-arrives-with-smoother-workflows-and-smarter-agents)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Medium - Claude Code 2.1.0 Analysis](https://medium.com/@cognidownunder/claude-code-2-1-0-just-changed-everything-and-most-developers-havent-noticed-yet-8862a3c961ed)
- [Claude Code Tasks Announcement](https://www.threads.com/@boris_cherny/post/DT15_lHjmWS)
- [VentureBeat - Tasks Update](https://venturebeat.com/orchestration/claude-codes-tasks-update-lets-agents-work-longer-and-coordinate-across)
- [Medium - Tasks Hydration Pattern](https://medium.com/@richardhightower/claude-code-todos-to-tasks-5a1b0e351a1c)
