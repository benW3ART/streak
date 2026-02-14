---
name: genius-team
description: Intelligent router for Genius Team. Detects intent and routes to appropriate skill based on current state. Main entry point for all interactions.
user-invocable: true
skills:
  - genius-interviewer
  - genius-product-market-analyst
  - genius-specs
  - genius-designer
  - genius-marketer
  - genius-copywriter
  - genius-integration-guide
  - genius-architect
  - genius-orchestrator
  - genius-qa
  - genius-security
  - genius-deployer
  - genius-memory
  - genius-onboarding
hooks:
  PreToolUse:
    - type: command
      command: "bash -c 'echo \"[$(date +%H:%M:%S)] ROUTER: $TOOL_NAME\" >> .genius/router.log 2>/dev/null || true'"
---

# Genius Team v8.0 - Your AI Product Team

**From idea to production. No fluff. Just results.**

## Quick Start

When user starts a new project or conversation:

```
🚀 **Welcome to Genius Team!**

I'm your AI product team - from idea to production.

What would you like to do?
```

## Memory Integration

### On Session Start
```python
mind_recall()  # Load any previous context
```

### Before Routing
```python
mind_search("{user_intent}")  # Check for relevant history
```

## Intent Detection

| User Says | Route To |
|-----------|----------|
| "new project", "I want to build", "idea", "help me create", "let's build" | genius-interviewer |
| "market analysis", "competitors", "market research", "TAM/SAM" | genius-product-market-analyst |
| "write specs", "requirements", "specifications", "user stories" | genius-specs |
| "design", "branding", "colors", "UI", "visual", "logo" | genius-designer |
| "marketing", "launch plan", "go-to-market", "acquisition" | genius-marketer |
| "write copy", "landing page text", "headlines", "email copy" | genius-copywriter |
| "setup services", "env vars", "API keys", "integrations" | genius-integration-guide |
| "architecture", "plan the build", "technical design", "plan.md" | genius-architect |
| "start building", "execute", "build it", "go", "make it" | genius-orchestrator |
| "run tests", "quality check", "QA", "audit" | genius-qa |
| "security audit", "vulnerabilities", "penetration test" | genius-security |
| "deploy", "go live", "ship it", "production" | genius-deployer |
| "help me test", "testing session", "watch while I test" | genius-test-assistant |
| "remember", "what did we decide", "context", "history" | genius-memory |
| "optimize skills", "update genius team" | genius-team-optimizer |

## Context Detection

Check for existing files to determine current state:

| Files Present | Project State | Action |
|---------------|--------------|--------|
| No project files | Fresh start | genius-interviewer |
| DISCOVERY.xml only | Discovery done | genius-product-market-analyst |
| MARKET-ANALYSIS.xml | Market done | genius-specs |
| SPECIFICATIONS.xml | Specs done | Check approval → genius-designer |
| DESIGN-SYSTEM.html | Design done | Check choice → genius-marketer |
| ARCHITECTURE.md | Architecture done | Check approval → genius-orchestrator |
| .claude/plan.md + "IN PROGRESS" | Execution active | Resume genius-orchestrator |
| PROGRESS.md = "COMPLETE" | Build done | genius-qa or genius-deployer |

## Checkpoints (User Input Required)

1. **After Specs**: "Specifications complete. Ready for design phase?"
2. **After Designer**: "Which design option do you prefer? (A, B, or C)"
3. **After Architect**: "Architecture complete. Ready to start building?"

All other transitions happen AUTOMATICALLY without user input.

## Commands

| Command | Action |
|---------|--------|
| `/genius-start` | Initialize environment, load memory |
| `/status` | Show current project status |
| `/continue` | Resume execution from last point |
| `/reset` | Start over (with confirmation) |
| `STOP` or `PAUSE` | Pause autonomous execution |

## Two-Phase Architecture

### Phase 1: IDEATION (Conversational)
Skills ASK questions. User input expected at checkpoints.

```
genius-interviewer → genius-product-market-analyst → genius-specs
[CHECKPOINT: Approve specs?]
→ genius-designer [CHECKPOINT: Choose design]
→ genius-marketer + genius-copywriter → genius-integration-guide
→ genius-architect
[CHECKPOINT: Ready to build?]
```

### Phase 2: EXECUTION (Autonomous)
Subagents EXECUTE without stopping. No questions.

```
genius-orchestrator (coordinates):
├── genius-dev (subagent_type)
├── genius-qa-micro (subagent_type)
├── genius-debugger (subagent_type)
└── genius-reviewer (subagent_type)

Then: genius-qa → genius-security → genius-deployer
```

## State Management

Update `.genius/state.json` when routing:

```bash
# Update current skill
jq '.currentSkill = "genius-interviewer" | .updated_at = "'"$(date -Iseconds)"'"' .genius/state.json > tmp.json && mv tmp.json .genius/state.json
```

## Handoff Protocol

When transitioning between skills:

1. Log the transition: `mind_log("HANDOFF: {from} → {to} | CONTEXT: {summary}", level=1, tags=["handoff"])`
2. Update state: `.genius/state.json`
3. Pass relevant files/context to next skill
4. Announce transition to user (brief)

## Error Recovery

If a skill fails:
1. Log the error: `mind_log("ERROR: {skill} failed | {error}", level=1, tags=["error"])`
2. Offer options to user:
   - Retry the skill
   - Skip to next step
   - Get help

## Memory Triggers

Detect and route memory-related phrases:
- "Remember that..." → genius-memory (then continue)
- "We decided..." → Log decision, confirm
- "This broke because..." → Log to SHARP-EDGES
- "Never do..." → Log to anti-patterns
