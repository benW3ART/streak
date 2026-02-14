# Genius Team v8.0

> Your AI product team. From idea to production. With persistent memory.

## Quick Start

**First time?** Run `/genius-start` to initialize your environment.

**Returning?** Just say what you want to do - I'll remember where we left off.

## Vibeship Integration

This project uses the Vibeship ecosystem for enhanced capabilities:

### Mind MCP (Memory)
```python
mind_recall()                              # Load context at session start
mind_log(content, level=1, tags=[])        # Save decisions/learnings
mind_search(query)                         # Search history before proposing
mind_remind(message, trigger)              # Set reminders
```

### Spawner (462 Expert Skills)
Access specialized expertise via MCP when connected.

### Security Tools
- **Scanner**: https://scanner.vibeship.co/ (3500+ security rules)
- **SupaRalph**: https://suparalph.vibeship.co/ (Supabase penetration testing)

## Session Protocol

1. **Start**: `/genius-start` loads MCPs and memory
2. **Before proposing**: `mind_search("{topic}")` to check history
3. **On decisions**: `mind_log("DECISION: X | REASON: Y", level=1, tags=["decision"])`
4. **On failures**: `mind_log("REJECTED: X | ERROR: Y", level=1, tags=["rejected"])`

## Project Context (Auto-loaded)

@PROGRESS.md
@KNOWLEDGE-BASE.md
@DECISIONS.md
@.claude/plan.md

## Quick Reference

| Say This | What Happens |
|----------|--------------|
| "I want to build [idea]" | Starts discovery interview |
| "New project" | Starts discovery interview |
| "Start building" / "Go" | Begins autonomous execution |
| "STOP" / "PAUSE" | Halts execution |
| `/status` | Shows current progress |
| `/continue` | Resumes from last point |
| `/genius-start` | Initialize/verify environment |

## Two Phases

### Phase 1: IDEATION (Conversational)
Skills ASK questions. User input expected at checkpoints.

```
genius-interviewer → genius-product-market-analyst → genius-specs
                                                      ↓
                                            [CHECKPOINT: Approve specs]
                                                      ↓
                                            genius-designer
                                                      ↓
                                            [CHECKPOINT: Choose design]
                                                      ↓
                           genius-marketer → genius-copywriter → genius-integration-guide
                                                      ↓
                                            genius-architect
                                                      ↓
                                            [CHECKPOINT: Approve architecture]
```

### Phase 2: EXECUTION (Autonomous)
Subagents EXECUTE without stopping. No questions.

```
genius-orchestrator (coordinates):
├── Task(subagent_type: "genius-dev")
├── Task(subagent_type: "genius-qa-micro")
├── Task(subagent_type: "genius-debugger")
└── Task(subagent_type: "genius-reviewer")

Then: genius-qa (full audit) → genius-security → genius-deployer
```

## Key Files

| File | Purpose |
|------|---------|
| `.claude/plan.md` | **Single source of truth** for task list |
| `.genius/state.json` | Project state tracking |
| `.mind/MEMORY.md` | Persistent project memory |
| `PROGRESS.md` | Real-time execution status |
| `KNOWLEDGE-BASE.md` | Project knowledge |
| `DECISIONS.md` | Key decisions with rationale |
| `DISCOVERY.xml` | Interview findings |
| `SPECIFICATIONS.xml` | Feature requirements |
| `DESIGN-SYSTEM.html` | Visual design options |
| `ARCHITECTURE.md` | Technical architecture |

## Memory Triggers

| Say This | Effect |
|----------|--------|
| "Remember that..." | Adds to KNOWLEDGE-BASE.md + mind_log() |
| "We decided..." | Adds to DECISIONS.md + mind_log() |
| "This broke because..." | Adds to .mind/SHARP-EDGES.md + mind_log() |
| "Never do..." | Adds to global anti-patterns |

## Checkpoints (User Input Required)

1. **After Specs**: "Specifications complete. Ready for design phase?"
2. **After Designer**: "Which design option do you prefer?"
3. **After Architect**: "Architecture complete. Ready to start building?"

All other transitions happen automatically.

## Subagents

| Subagent | subagent_type | Purpose |
|----------|---------------|---------|
| genius-dev | `genius-dev` | Code implementation |
| genius-qa-micro | `genius-qa-micro` | Quick 30s quality check |
| genius-debugger | `genius-debugger` | Fix errors |
| genius-reviewer | `genius-reviewer` | Quality score (read-only) |

**Task Tool Syntax:**
```
Task(
  description: "short description",
  prompt: "detailed instructions",
  subagent_type: "genius-dev"  // ALWAYS specify explicitly
)
```

## Important Rules

1. **IDEATION Phase**: Ask questions, validate understanding, get approval at checkpoints
2. **EXECUTION Phase**: Never stop, handle errors, keep going until ALL tasks complete
3. **Always update** PROGRESS.md after each task
4. **Memory first**: Call `mind_recall()` at session start, `mind_search()` before proposing
5. **Log everything**: Decisions, rejections, learnings via `mind_log()`
