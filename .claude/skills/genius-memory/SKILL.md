---
name: genius-memory
description: Persistent context and knowledge management skill that maintains project memory across sessions. Tracks decisions, patterns, conventions, and lessons learned. AUTO-TRIGGERS on "remember this", "we decided", "don't forget", "this broke because", "lesson learned". Integrates with Mind MCP for automatic memory injection.
---

# Genius Memory - The Knowledge Keeper

> **CRITICAL: This skill wraps vibeship-mind MCP. All other skills MUST use these patterns.**

## Mind MCP - Real Functions Reference

### Core Functions (USE THESE)

```python
# 1. START OF EVERY SESSION - Load context
mind_recall()
# Returns: MEMORY.md (permanent) + SESSION.md (current) + REMINDERS.md

# 2. LOG ANYTHING IMPORTANT
mind_log(content, level=1, tags=[])
# level 1 = will promote to MEMORY.md
# level 2 = session only
# tags = ["decision", "blocker", "learning", "rejected"]

# 3. SEARCH BEFORE PROPOSING SOLUTIONS
mind_search(query)
# Uses TF-IDF semantic search
# Returns related memories + warnings about rejected approaches

# 4. SET REMINDERS
mind_remind(message, trigger="next_session")
# trigger = "next_session" | "daily" | "before_deploy"
```

### Memory Architecture

```
.mind/
├── MEMORY.md      # Long-term (auto-promoted from sessions)
├── SESSION.md     # Current session (cleared after 30min gap)
├── SHARP-EDGES.md # Things that broke and why
└── REMINDERS.md   # Scheduled reminders
```

## Auto-Trigger Phrases

When user says ANY of these, automatically update memory:

| Trigger Phrase | Action | File/MCP |
|----------------|--------|----------|
| "Remember that..." | Add fact | mind_log() + KNOWLEDGE-BASE.md |
| "Don't forget..." | Add fact | mind_log() + KNOWLEDGE-BASE.md |
| "Important:..." | Add fact | mind_log() |
| "We decided..." | Add decision | mind_log(tags=["decision"]) + DECISIONS.md |
| "Let's go with..." | Add decision | mind_log(tags=["decision"]) |
| "This broke because..." | Add lesson | mind_log(tags=["rejected"]) + SHARP-EDGES.md |
| "Lesson learned..." | Add lesson | mind_log(tags=["learning"]) |
| "Never do..." | Add guard | mind_log(tags=["anti-pattern"]) |

**Response**: "Got it, saved."

## Integration Patterns for ALL Skills

### Pattern 1: Session Start (MANDATORY)

Every skill MUST execute before any work:

```python
mind_recall()  # Load context
# Note any reminders
# Check for relevant rejected approaches
```

### Pattern 2: Decision Made

```python
mind_log(
  content="DECISION: {what} | REASON: {why} | ALTERNATIVES: {rejected}",
  level=1,
  tags=["decision"]
)
```

### Pattern 3: Something Failed

```python
mind_log(
  content="REJECTED: {approach} | ERROR: {error} | CONTEXT: {what_we_tried}",
  level=1,
  tags=["rejected", "blocker"]
)
```

### Pattern 4: Before Proposing Solution

ALWAYS before suggesting any approach:

```python
result = mind_search("{problem domain}")

if "REJECTED" in result:
    print("I see we tried X before and it failed because Y. Let me suggest something different...")
```

### Pattern 5: Learning Captured

```python
mind_log(
  content="LEARNING: {insight} | CONTEXT: {situation}",
  level=1,
  tags=["learning"]
)
```

## File-Based Fallback

If Mind MCP not available, use local files:

### KNOWLEDGE-BASE.md
```markdown
# Project Knowledge Base

## Tech Stack
- Frontend: {framework}
- Backend: {framework}
- Database: {type}

## Key Facts
- {fact 1}
- {fact 2}

## Conventions
- {convention 1}
```

### DECISIONS.md
```markdown
# Project Decisions

## {Date} - {Decision Title}
**Decision**: {What was decided}
**Rationale**: {Why}
**Alternatives**: {What was rejected}
```

### .mind/SHARP-EDGES.md
```markdown
# Sharp Edges - Things That Broke

## {Date} - {Issue}
**What broke**: {description}
**Root cause**: {why}
**Solution**: {how it was fixed}
**Prevention**: {how to avoid}
```

## Sharp Edges

### Edge 1: Forgetting to Recall
```yaml
id: forgot-recall
summary: Starting work without loading context
severity: critical
detection: Starting implementation without mind_recall()
solution: ALWAYS start with mind_recall() before any work
```

### Edge 2: Not Searching Before Proposing
```yaml
id: skip-search
summary: Proposing solutions without checking history
severity: high
detection: Suggesting approach without mind_search()
solution: Before ANY suggestion, run mind_search("{topic}")
```

### Edge 3: Session Timeout
```yaml
id: session-timeout
summary: 30min gap resets SESSION.md
severity: medium
solution: Use level=1 to promote important items to MEMORY.md
```

## Validations

### V1: Session Start Protocol
```yaml
trigger: first_message_in_session
check: mind_recall_called
message: "Load memory before responding!"
```

### V2: Decision Format
```yaml
trigger: "we decided|decision:"
check: "DECISION:.*REASON:"
message: "Decision needs REASON"
```

## Handoffs

### To ALL Skills
```yaml
provides:
  - Full context via mind_recall()
  - Searchable history via mind_search()
  - Loop detection warnings
protocol: |
  Every skill MUST:
  1. Call mind_recall() on start
  2. Call mind_search() before proposing
  3. Call mind_log() for important events
```

## Mind MCP Installation

If not installed, run:
```bash
bash scripts/setup-vibeship.sh
```

Or manually:
```bash
git clone https://github.com/vibeforge1111/vibeship-mind.git ~/.vibeship/mind
cd ~/.vibeship/mind && uv sync && uv run mind init
```

Then add to ~/.claude.json:
```json
{
  "mcpServers": {
    "mind": {
      "command": "uv",
      "args": ["--directory", "~/.vibeship/mind", "run", "mind", "mcp"]
    }
  }
}
```
