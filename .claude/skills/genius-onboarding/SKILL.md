---
name: genius-onboarding
description: First-time user experience and setup wizard for Genius Team. Use when a new user starts their first project, says "hello", "get started", or when no user profile exists in .claude/user-profile.json.
---

# Genius Onboarding v8.0 - Welcome Experience

**Making every first interaction memorable and productive.**

## Memory Integration

### On Onboarding Start
```python
mind_recall()  # Check for existing context
mind_search("user preferences")  # Look for saved preferences
```

### On Profile Created
```python
mind_log(
  content="USER ONBOARDED: {name} | LEVEL: {skill_level} | STACK: {stack}",
  level=1,
  tags=["onboarding", "user"]
)
```

### On Preferences Set
```python
mind_log(
  content="PREFERENCE: {key} = {value}",
  level=1,
  tags=["onboarding", "preference"]
)
```

---

## Mission

Welcome new users to Genius Team. Gather essential preferences quickly and set up their environment for success.

---

## Trigger Conditions

Activate when:
- No `.claude/user-profile.json` exists
- User says "hello", "hi", "get started", "new here"
- User explicitly asks for setup/onboarding
- First interaction in a new project

---

## Onboarding Flow

### Phase 1: Welcome (30 seconds)

```
+====================================================================+
|  Welcome to Genius Team v8.0                                        |
|                                                                     |
|  I'm your AI development partner. I can help you:                   |
|  - Build complete applications from idea to deployment              |
|  - Write high-quality, tested code                                  |
|  - Design beautiful interfaces                                      |
|  - Deploy to production                                             |
|                                                                     |
|  Let me learn a bit about you to personalize the experience.        |
+====================================================================+
```

### Phase 2: Quick Questions (2-3 minutes)

Ask ONE question at a time. Max 5 questions total.

**Q1: Name & Role**
> What should I call you, and what's your role? (e.g., "Ben, indie developer")

**Q2: Experience Level**
> How would you describe your coding experience?
> - Vibe Coder - I describe what I want, you build it
> - Builder - I understand code, help me move faster
> - Developer - I code daily, be my pair programmer
> - Expert - Skip the basics, let's ship

**Q3: Preferred Stack** (if Builder+)
> What's your go-to tech stack? (or "surprise me")
> Common: Next.js + Supabase + Tailwind

**Q4: Communication Style**
> How should I communicate?
> - Direct (just the facts)
> - Detailed (explain the why)
> - Casual (conversational)

**Q5: Language Preference**
> What language for comments and docs? (en/fr/both)

### Phase 3: Profile Creation

Create `.claude/user-profile.json`:

```json
{
  "name": "Ben",
  "role": "indie developer",
  "skill_level": "builder",
  "preferences": {
    "communication": "direct",
    "language": "fr",
    "stack": {
      "frontend": "Next.js 14+",
      "backend": "Supabase",
      "styling": "Tailwind CSS",
      "deployment": "Vercel"
    }
  },
  "onboarded_at": "2025-01-29T12:00:00Z",
  "genius_team_version": "8.0.0"
}
```

### Phase 4: Environment Check

Verify setup:
```bash
# Check for essential tools
which node npm git 2>/dev/null

# Check for .claude directory
ls -la .claude/ 2>/dev/null

# Check for Mind MCP
python3 -c "import mind" 2>/dev/null && echo "Mind: OK"
```

Report status and offer to fix issues.

### Phase 5: First Project Prompt

Based on skill level:

**Vibe Coder:**
> Perfect! Now tell me: what do you want to build?
> Just describe your idea in plain language.

**Builder/Developer:**
> You're all set! Here's what you can do:
> - `architect a solution for [idea]` - Start a new project
> - `implement [feature]` - Code something specific
> - `/help` - See all commands

**Expert:**
> Ready to ship. Skills loaded. What are we building?

---

## Sharp Edges

### Edge 1: Too Many Questions
```yaml
id: too-many-questions
summary: Asking more than 5 questions
severity: medium
detection: "Question count > 5"
symptoms:
  - User impatience
  - Abandonment
solution: |
  MAX 5 questions total.
  Use smart defaults for the rest.
```

### Edge 2: Multiple Questions at Once
```yaml
id: multiple-questions
summary: Asking several questions in one message
severity: medium
detection: "Multiple question marks in one message"
symptoms:
  - User confusion
  - Incomplete answers
solution: |
  ONE question at a time.
  Wait for answer before next.
```

### Edge 3: Skipping Profile Save
```yaml
id: skip-profile
summary: Not saving user preferences
severity: high
detection: "No user-profile.json created"
symptoms:
  - Lost preferences
  - Repeated onboarding
solution: |
  ALWAYS save profile to .claude/user-profile.json
  ALWAYS log to memory with mind_log()
```

### Edge 4: Assuming Preferences
```yaml
id: assuming-prefs
summary: Making assumptions without asking
severity: medium
detection: "Using preferences not explicitly stated"
symptoms:
  - Wrong communication style
  - Unexpected behavior
solution: |
  ASK, don't assume.
  Use sensible defaults only when user says "skip"
```

---

## Validations

### V1: Profile Created
```yaml
trigger: "onboarding complete"
check: ".claude/user-profile.json exists"
severity: high
message: "Must create user profile"
```

### V2: Max 5 Questions
```yaml
trigger: "asking question"
check: "question_count <= 5"
severity: medium
message: "Stop at 5 questions, use defaults"
```

### V3: Memory Logged
```yaml
trigger: "onboarding complete"
check: "mind_log() called with user preferences"
severity: medium
message: "Log preferences to memory"
```

---

## Handoffs

### To genius-interviewer
```yaml
provides:
  - User profile with preferences
  - Initial idea (if mentioned)
handoff_format: |
  "User onboarded: {name}, {skill_level}
   Stack preference: {stack}
   Communication: {style}

   User wants to build: {initial_idea}

   Start discovery interview."
```

### To genius-memory
```yaml
provides:
  - User preferences to remember
handoff_format: |
  "New user preferences:
   Name: {name}
   Level: {level}
   Stack: {stack}

   Store in long-term memory."
```

### To genius-architect
```yaml
provides:
  - User profile
  - Project idea (if provided)
handoff_format: |
  "Ready for architecture.
   User: {name}, {skill_level}
   Stack: {stack}

   Project idea: {idea}"
```

---

## Skip Onboarding

If user says "skip" or "I know what I'm doing":

```
> Got it! Quick setup:
> - Name? [wait for answer]
> - Stack preference? [wait or use defaults]
> Done! What are we building?
```

Create minimal profile and proceed.

---

## Profile Updates

After onboarding, profile can be updated with:
- "update my preferences"
- "change my stack to..."
- "I prefer [communication style]"

Route to genius-memory for updates.

---

## Anti-Patterns

**DON'T:**
- Ask more than 5 questions
- Ask multiple questions at once
- Require lengthy answers
- Skip profile creation
- Assume preferences

**DO:**
- Keep it fast (<3 min total)
- Remember answers immediately
- Adapt tone to responses
- Celebrate completion
- Save everything to profile

---

## Default Stack (when "surprise me")

```json
{
  "frontend": "Next.js 14+ (App Router)",
  "backend": "Supabase",
  "styling": "Tailwind CSS",
  "deployment": "Vercel",
  "auth": "Supabase Auth",
  "database": "PostgreSQL (Supabase)"
}
```

---

*"First impressions matter. Make it count."*
