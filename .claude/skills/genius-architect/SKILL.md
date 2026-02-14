---
name: genius-architect
description: Technical architecture and task planning skill. Creates project structure, technology decisions, and task list in .claude/plan.md (SINGLE SOURCE OF TRUTH). Use for "architecture", "plan the build", "create tasks", "technical design", "system design", "break it down".
---

# Genius Architect - The Master Blueprint

**Breaking down the vision into executable tasks.**

> We don't just build applications. We architect ecosystems designed for flawless execution.

---

## Memory Integration (MANDATORY)

### On Session Start
```python
mind_recall()  # Load project context and previous decisions
mind_search("architecture decisions {project}")  # Check for existing patterns
mind_search("rejected architectures")  # Avoid past mistakes
```

### On Architecture Decision
```python
mind_log(
  content="ARCH DECISION: {choice} | REASON: {why} | ALTERNATIVES: {rejected}",
  level=1,
  tags=["decision", "architecture"]
)
```

### On Stack Choice
```python
mind_log(
  content="STACK: {framework} + {db} + {hosting} | REASON: {why}",
  level=1,
  tags=["decision", "stack"]
)
```

### On Architecture Complete
```python
mind_log(
  content="ARCHITECTURE COMPLETE: {project} | STACK: {stack} | TASKS: {count}",
  level=1,
  tags=["architecture", "complete"]
)
```

---

## Prerequisites

**REQUIRED before starting:**
- `SPECIFICATIONS.xml` from genius-specs (approved)
- `design-config.json` from genius-designer
- `INTEGRATIONS.md` from genius-integration-guide (optional)

---

## Architecture Process

### Step 1: Technology Decisions

Default stack (adjust based on user preferences):
```yaml
default_stack:
  framework: "Next.js 14 (App Router)"
  language: "TypeScript (strict mode)"
  styling: "Tailwind CSS"
  database: "Supabase (PostgreSQL)"
  auth: "Supabase Auth"
  state: "React hooks + Context"
  testing: "Vitest + Playwright"
```

Document all decisions in ARCHITECTURE.md.

### Step 2: Project Structure

Generate complete folder structure:

```
project-name/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Auth group (login, register)
│   │   ├── (dashboard)/     # Protected routes
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components
│   │   └── features/        # Feature-specific components
│   ├── lib/                 # Utilities
│   │   ├── supabase/        # Supabase client
│   │   ├── utils.ts         # Helper functions
│   │   └── constants.ts     # App constants
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript types
├── tests/                   # Test files
│   ├── unit/
│   └── e2e/
├── public/                  # Static assets
├── .claude/                 # Claude Code config
│   ├── plan.md              # SINGLE SOURCE OF TRUTH FOR TASKS
│   └── settings.json
├── CLAUDE.md                # Project instructions
└── package.json
```

### Step 3: Create Task List

**CRITICAL: `.claude/plan.md` is the SINGLE SOURCE OF TRUTH for all tasks.**

---

## Output: .claude/plan.md

This is the most important output. All tasks live here.

```markdown
# Implementation Plan

**Project:** [Name]
**Created:** [Date]
**Status:** Ready for execution

---

## Phase 1: Project Setup

### Task 1: Initialize Next.js Project
**Status:** [ ] Pending
**Agent:** orchestrator

**Steps:**
1. Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
2. Configure TypeScript strict mode
3. Set up path aliases in tsconfig.json

**Verification:**
- `npm run build` succeeds
- `npm run lint` passes

**Files Created:**
- package.json
- tsconfig.json
- next.config.js
- tailwind.config.ts

---

### Task 2: Configure Development Tools
**Status:** [ ] Pending
**Agent:** orchestrator
**Depends On:** Task 1

**Steps:**
1. Install Prettier: `npm i -D prettier eslint-config-prettier`
2. Create .prettierrc with project settings
3. Add lint-staged and husky for pre-commit hooks

**Verification:**
- `npm run lint` passes
- Pre-commit hook runs on staged files

**Files Created:**
- .prettierrc
- .husky/pre-commit

---

### Task 3: Create Folder Structure
**Status:** [ ] Pending
**Agent:** orchestrator
**Depends On:** Task 1

**Steps:**
1. Create all directories per architecture
2. Add placeholder index files
3. Create base types

**Verification:**
- All directories exist
- No import errors

---

## Phase 2: Design System

### Task 4: Configure Design Tokens
**Status:** [ ] Pending
**Agent:** frontend
**Depends On:** Task 3

**Steps:**
1. Import colors from design-config.json
2. Update tailwind.config.ts with custom theme
3. Create CSS variables for runtime theming

**Verification:**
- Colors render correctly in browser
- Tailwind classes work

**Files Created:**
- src/lib/design-tokens.ts
- tailwind.config.ts (updated)

---

### Task 5: Build Button Component
**Status:** [ ] Pending
**Agent:** frontend
**Depends On:** Task 4

**Steps:**
1. Create Button with variants: primary, secondary, outline, ghost
2. Add sizes: sm, md, lg
3. Add loading and disabled states
4. Write unit tests

**Verification:**
- All variants render correctly
- Tests pass

**Files Created:**
- src/components/ui/Button.tsx
- src/components/ui/Button.test.tsx

---

### Task 6: Build Input Component
**Status:** [ ] Pending
**Agent:** frontend
**Depends On:** Task 4

**Steps:**
1. Create Input with types: text, email, password
2. Add error state and helper text
3. Add label and required indicator
4. Write unit tests

**Verification:**
- Form inputs work correctly
- Tests pass

**Files Created:**
- src/components/ui/Input.tsx
- src/components/ui/Input.test.tsx

---

### Task 7: Build Card Component
**Status:** [ ] Pending
**Agent:** frontend
**Depends On:** Task 4

**Steps:**
1. Create Card with header, body, footer sections
2. Add hover and active states
3. Write unit tests

**Verification:**
- Layout correct
- Tests pass

**Files Created:**
- src/components/ui/Card.tsx
- src/components/ui/Card.test.tsx

---

## Phase 3: Authentication

### Task 8: Configure Supabase Client
**Status:** [ ] Pending
**Agent:** backend
**Depends On:** Task 3

**Steps:**
1. Install @supabase/supabase-js and @supabase/ssr
2. Create browser and server clients
3. Set up auth middleware

**Verification:**
- Connection to Supabase works
- Auth state persists

**Files Created:**
- src/lib/supabase/client.ts
- src/lib/supabase/server.ts
- src/middleware.ts

---

### Task 9: Build Auth Pages
**Status:** [ ] Pending
**Agent:** frontend
**Depends On:** Task 5, Task 6, Task 8

**Steps:**
1. Create /login page with form
2. Create /register page with form
3. Add social login buttons (if configured)
4. Handle error states

**Verification:**
- Can create account
- Can log in
- Errors display correctly

**Files Created:**
- src/app/(auth)/login/page.tsx
- src/app/(auth)/register/page.tsx
- src/components/features/auth/LoginForm.tsx
- src/components/features/auth/RegisterForm.tsx

---

### Task 10: Implement Auth Flow
**Status:** [ ] Pending
**Agent:** backend
**Depends On:** Task 9

**Steps:**
1. Create auth API routes
2. Handle email verification
3. Set up protected route middleware
4. Add logout functionality

**Verification:**
- Full auth flow works end-to-end
- Protected routes redirect correctly

**Files Created:**
- src/app/api/auth/callback/route.ts
- src/app/api/auth/logout/route.ts

---

## Phase 4: Core Features

### Task 11: Create Dashboard Layout
**Status:** [ ] Pending
**Agent:** frontend
**Depends On:** Task 10

**Steps:**
1. Create dashboard layout with sidebar
2. Add navigation component
3. Add user menu with logout
4. Mobile responsive design

**Verification:**
- Dashboard renders for logged-in user
- Navigation works
- Mobile layout correct

**Files Created:**
- src/app/(dashboard)/layout.tsx
- src/components/features/dashboard/Sidebar.tsx
- src/components/features/dashboard/UserMenu.tsx

---

### Task 12: [Feature from Specs]
**Status:** [ ] Pending
**Agent:** [appropriate agent]
**Depends On:** Task 11

**Steps:**
1. [Step 1 from specifications]
2. [Step 2 from specifications]
3. Write tests

**Verification:**
- [Acceptance criteria from specs]

**Files Created:**
- [Expected files]

---

## Phase 5: Testing & Polish

### Task 13: Write Integration Tests
**Status:** [ ] Pending
**Agent:** qa
**Depends On:** All Phase 4 tasks

**Steps:**
1. Set up Playwright
2. Write E2E tests for critical flows
3. Add to CI pipeline

**Verification:**
- All E2E tests pass
- CI runs tests on PR

**Files Created:**
- tests/e2e/auth.spec.ts
- tests/e2e/dashboard.spec.ts
- playwright.config.ts

---

### Task 14: Final Polish
**Status:** [ ] Pending
**Agent:** orchestrator
**Depends On:** Task 13

**Steps:**
1. Add loading states to all async operations
2. Improve error handling and messages
3. Add meta tags and SEO
4. Performance optimization

**Verification:**
- No console errors
- Lighthouse score > 90
- All loading states work

---

## Progress Tracking

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| 1. Setup | 3 | 0 | Pending |
| 2. Design System | 4 | 0 | Pending |
| 3. Auth | 3 | 0 | Pending |
| 4. Features | 2 | 0 | Pending |
| 5. Testing | 2 | 0 | Pending |
| **Total** | **14** | **0** | **0%** |

---

## Notes

- Each task is atomic and independently verifiable
- Dependencies must be respected
- Update status as tasks complete: [ ] -> [x]
- Add issues to ISSUES.md if blocked
```

---

## Output: ARCHITECTURE.md

```markdown
# Technical Architecture

**Project:** [Name]
**Version:** 1.0
**Date:** [Date]

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14 | App Router, SSR, API routes |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Database | Supabase | PostgreSQL, realtime, auth |
| Auth | Supabase Auth | Integrated with DB |
| Hosting | Vercel | Native Next.js support |
| Testing | Vitest + Playwright | Fast unit + E2E |

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth routes (login, register)
│   ├── (dashboard)/      # Protected routes
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   └── features/         # Feature-specific components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
├── hooks/                # Custom React hooks
└── types/                # TypeScript types
```

## Data Model

[Entity diagram from specifications]

```
User
├── id: uuid (PK)
├── email: string (unique)
├── name: string
├── created_at: timestamp
└── updated_at: timestamp

[Other entities...]
```

## API Design

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/callback | GET | OAuth callback |
| /api/auth/logout | POST | Log out user |
| [Other endpoints...] | | |

## Security Considerations

1. **Authentication**
   - Supabase Auth with RLS
   - HTTP-only cookies for session

2. **Authorization**
   - Row Level Security on all tables
   - Middleware for route protection

3. **Data Protection**
   - All data encrypted in transit (TLS 1.3)
   - Passwords hashed with bcrypt

## Performance Targets

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Lighthouse > 90

## Deployment Strategy

1. **Development:** Local with `npm run dev`
2. **Preview:** Vercel preview deployments on PR
3. **Production:** Vercel production on main merge
```

---

## CHECKPOINT: User Approval

After creating all files, display:

```
===============================================================
            ARCHITECTURE COMPLETE - READY FOR EXECUTION
===============================================================

Tasks: [X] tasks in .claude/plan.md
Architecture: ARCHITECTURE.md
Structure: Ready to scaffold

The plan is organized into [X] phases:
1. Project Setup ([X] tasks)
2. Design System ([X] tasks)
3. Authentication ([X] tasks)
4. Core Features ([X] tasks)
5. Testing & Polish ([X] tasks)

Execution will follow .claude/plan.md as SINGLE SOURCE OF TRUTH.
Progress tracked directly in the plan file.

Ready to start building?

--> Say "yes", "start building", "go", or "build it" to begin
--> Say "wait" or "review" to examine the plan first

===============================================================
```

---

## Sharp Edges

### Edge 1: Over-Engineering
```yaml
id: over-engineering
summary: Building for scale before validating idea
severity: high
detection_pattern: "microservices|kubernetes|event sourcing"
context: "MVP or early stage project"
solution: |
  For MVP: Monolith first (Next.js + Supabase)
  Scale later when you have the problem.
```

### Edge 2: Ignoring Existing Decisions
```yaml
id: ignore-decisions
summary: Proposing architecture without checking history
severity: high
detection_pattern: "let's use|I recommend"
solution: |
  ALWAYS call mind_search() before proposing.
  Check for existing architecture decisions.
```

### Edge 3: Missing Security Layer
```yaml
id: missing-security
summary: No authentication/authorization in design
severity: critical
solution: |
  Every architecture must include:
  1. Auth layer (Supabase Auth, Clerk, etc.)
  2. Authorization (RLS, middleware)
  3. Input validation
  4. Rate limiting
```

### Edge 4: Monolithic Tasks
```yaml
id: monolithic-tasks
summary: One giant task instead of decomposed tasks
severity: medium
detection_pattern: "implement everything|build the whole"
solution: |
  Decompose into atomic tasks:
  - Each task < 30 min work
  - Clear dependencies
  - Testable independently
```

---

## Validations

### V1: Plan Exists
```yaml
trigger: "architecture complete"
check: ".claude/plan.md exists and non-empty"
severity: critical
message: "Architecture must be saved to .claude/plan.md!"
```

### V2: Tasks Have Dependencies
```yaml
trigger: "architecture complete"
check: "Tasks specify dependencies correctly"
severity: high
message: "Tasks must declare dependencies"
```

### V3: Security Addressed
```yaml
trigger: "architecture complete"
check: "Auth and authorization mentioned in plan"
severity: high
message: "Architecture missing security considerations"
```

---

## Handoffs

### From: genius-integration-guide
```yaml
receives:
  - INTEGRATIONS.md
  - Configured services list
  - .env.example
```

### From: genius-specs
```yaml
receives:
  - SPECIFICATIONS.xml (approved)
  - Data model
  - API requirements
  - NFRs
```

### To: genius-orchestrator (after approval)
```yaml
provides:
  - .claude/plan.md (SINGLE SOURCE OF TRUTH)
  - ARCHITECTURE.md
  - Project structure plan
format: |
  "Architecture approved.
   Plan: .claude/plan.md
   Tasks: {count}
   Phases: {phases}

   Starting execution..."
```

### To: genius-dev
```yaml
provides:
  - Individual task specifications
  - Technical context
  - File locations
  - Verification commands
```

---

## Key Principles

1. **.claude/plan.md is the SINGLE SOURCE OF TRUTH**
   - All tasks live there
   - Status updates happen there
   - No other task files

2. **Tasks are atomic**
   - Each task < 30 minutes
   - Clear inputs and outputs
   - Independently verifiable

3. **Dependencies are explicit**
   - No hidden assumptions
   - Build order is clear
   - Parallel work is possible

4. **Verification is mandatory**
   - Every task has success criteria
   - Commands to run
   - Expected outcomes

---

*"Architecture is the art of how to waste space." - Philip Johnson*

*But great architecture wastes nothing - not space, not time, not potential.*

*Let's architect brilliance. What are we building?*
