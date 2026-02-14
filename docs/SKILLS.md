# Genius Team Skills Reference

## Overview

Genius Team consists of 21 specialized skills organized into phases:

```
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 1: IDEATION                           │
├─────────────────────────────────────────────────────────────────┤
│  genius-interviewer → genius-product-market-analyst             │
│            ↓                                                    │
│  genius-specs  ─────────────────→ [CHECKPOINT: Approve specs]   │
│            ↓                                                    │
│  genius-designer ───────────────→ [CHECKPOINT: Choose design]   │
│            ↓                                                    │
│  genius-marketer + genius-copywriter                            │
│            ↓                                                    │
│  genius-integration-guide                                       │
│            ↓                                                    │
│  genius-architect ──────────────→ [CHECKPOINT: Approve arch]    │
├─────────────────────────────────────────────────────────────────┤
│                     PHASE 2: EXECUTION                          │
├─────────────────────────────────────────────────────────────────┤
│  genius-orchestrator                                            │
│      ├── genius-dev (subagent)                                  │
│      ├── genius-qa-micro (subagent)                             │
│      ├── genius-debugger (subagent)                             │
│      └── genius-reviewer (subagent)                             │
├─────────────────────────────────────────────────────────────────┤
│                     PHASE 3: VALIDATION                         │
├─────────────────────────────────────────────────────────────────┤
│  genius-qa → genius-security → genius-deployer                  │
├─────────────────────────────────────────────────────────────────┤
│                     SUPPORT SKILLS                              │
├─────────────────────────────────────────────────────────────────┤
│  genius-team (router) | genius-memory | genius-onboarding       │
│  genius-test-assistant | genius-team-optimizer                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Workflow Skills

### genius-team
**Role**: Intelligent Router

Detects user intent and routes to the appropriate skill. Entry point for all interactions.

**Triggers**: Any project-related request
**Output**: Routes to correct skill

---

### genius-interviewer
**Role**: Requirements Discovery

Conducts structured interview to understand project vision, users, features, and constraints.

**Triggers**: "new project", "I want to build", "let's start"
**Output**: `DISCOVERY.xml`
**Next**: genius-product-market-analyst

---

### genius-product-market-analyst
**Role**: Market Validation

Analyzes market opportunity, competition, and business model.

**Triggers**: "market analysis", "competitors", "TAM/SAM"
**Output**: `MARKET-ANALYSIS.xml`
**Next**: genius-specs

---

### genius-specs
**Role**: Formal Specifications

Creates detailed specifications with user stories, use cases, and business rules.

**Triggers**: "write specs", "requirements"
**Output**: `SPECIFICATIONS.xml`
**CHECKPOINT**: Requires user approval
**Next**: genius-designer (after approval)

---

### genius-designer
**Role**: Visual Identity

Creates 2-3 design options with color schemes, typography, and component styles.

**Triggers**: "design", "branding", "UI"
**Output**: `DESIGN-SYSTEM.html`, `design-config.json`
**CHECKPOINT**: User must choose an option
**Next**: genius-marketer (after choice)

---

### genius-marketer
**Role**: Go-to-Market Strategy

Defines target audience, positioning, channels, and launch plan.

**Triggers**: "marketing", "launch plan", "go-to-market"
**Output**: `MARKETING-STRATEGY.xml`, `TRACKING-PLAN.xml`
**Next**: genius-integration-guide

---

### genius-copywriter
**Role**: Marketing Copy

Creates landing page copy, email templates, and UI text.

**Triggers**: "write copy", "landing page text"
**Output**: `COPY.md`
**Runs**: In parallel with genius-marketer

---

### genius-integration-guide
**Role**: Service Setup

Guides setup of external services (Supabase, Stripe, etc.) with environment variables.

**Triggers**: "setup services", "env vars", "API keys"
**Output**: `INTEGRATIONS.md`, `.env.example`, `.env.local`
**Next**: genius-architect

---

### genius-architect
**Role**: Technical Planning

Designs architecture and creates task list for execution.

**Triggers**: "architecture", "plan the build"
**Output**: `ARCHITECTURE.md`, `.claude/plan.md`
**CHECKPOINT**: Requires user approval
**Next**: genius-orchestrator (after approval)

---

## Execution Skills

### genius-orchestrator
**Role**: Autonomous Execution

Coordinates subagents to execute all tasks without stopping.

**Critical Rule**: NEVER STOP until all tasks complete or user says STOP

**Triggers**: "start building", "go", "execute"
**Input**: `.claude/plan.md`
**Output**: `PROGRESS.md`, completed code
**Subagents**:
- genius-dev (implementation)
- genius-qa-micro (quick checks)
- genius-debugger (fix errors)
- genius-reviewer (quality scores)

---

### genius-dev
**Role**: Code Implementation

Implements individual coding tasks with quality standards.

**Used by**: genius-orchestrator (as subagent)
**Output**: Code files, PASS/FAIL report

---

### genius-qa-micro
**Role**: Quick Validation

30-second quality check after each implementation.

**Used by**: genius-orchestrator (as subagent)
**Output**: QA PASS/FAIL report

---

### genius-debugger
**Role**: Error Fixing

Analyzes and fixes errors in code.

**Used by**: genius-orchestrator (as subagent)
**Output**: FIXED/CANNOT_FIX report

---

### genius-reviewer
**Role**: Code Review (Read-Only)

Scores code quality across 5 dimensions.

**Used by**: genius-orchestrator (as subagent)
**Output**: Quality scorecard, always APPROVED

---

## Validation Skills

### genius-qa
**Role**: Full Quality Audit

Comprehensive audit across 5 domains: functional, technical, security, architectural, UI/UX.

**Triggers**: "run tests", "QA", "quality audit"
**Output**: `AUDIT-REPORT.md`, `CORRECTIONS.xml`

---

### genius-security
**Role**: Security Audit

OWASP Top 10 checks, dependency scanning, secrets detection.

**Integrations**:
- Vibeship Scanner (3500+ rules)
- SupaRalph (Supabase testing)

**Triggers**: "security audit", "vulnerabilities"
**Output**: `SECURITY-AUDIT.md`

---

### genius-deployer
**Role**: Deployment

Handles staging and production deployments.

**Platforms**: Vercel, Railway, Docker, AWS

**Triggers**: "deploy", "go live", "ship it"
**Output**: Deployment logs, URLs

---

## Support Skills

### genius-memory
**Role**: Knowledge Management

Maintains persistent memory across sessions.

**Triggers**: "remember that", "we decided", "this broke because"
**Integration**: Mind MCP
**Files**: `KNOWLEDGE-BASE.md`, `DECISIONS.md`, `.mind/MEMORY.md`

---

### genius-onboarding
**Role**: First-Time Setup

Guides new users through initial configuration.

**Triggers**: First use, "hello", "get started"
**Output**: `.claude/user-profile.json`

---

### genius-test-assistant
**Role**: Manual Testing Companion

Monitors server logs and browser during manual testing.

**Triggers**: "help me test", "testing session"
**Output**: Error correlations, fix prompts

---

### genius-team-optimizer
**Role**: Self-Improvement

Analyzes Claude Code releases and updates skills.

**Triggers**: "optimize skills", "update genius team"
**Output**: Updated skill files

---

## Skill Communication

Skills communicate through:

1. **Files**: XML, MD, JSON artifacts
2. **State**: `.genius/state.json`
3. **Memory**: Mind MCP + local `.mind/` files
4. **Handoffs**: Explicit transitions with context

---

## Memory Integration

All skills use these patterns:

```python
# Session start
mind_recall()

# Before proposing solutions
mind_search("{topic}")

# After decisions
mind_log("DECISION: X | REASON: Y", level=1, tags=["decision"])

# After failures
mind_log("REJECTED: X | ERROR: Y", level=1, tags=["rejected"])
```
