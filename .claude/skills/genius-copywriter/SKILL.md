---
name: genius-copywriter
description: Persuasive writing skill that creates landing page copy, email sequences, in-app UI copy, and social media content. Matches brand voice from design system. Use for "write copy", "landing page text", "email copy", "headlines", "microcopy", "CTA", "UI text".
---

# Genius Copywriter - Words That Convert

**Turning features into feelings, and visitors into customers.**

---

## Memory Integration (MANDATORY)

### On Session Start
```python
mind_recall()  # Load project context
mind_search("brand voice tone")  # Check for voice guidelines
mind_search("messaging framework")  # Check for existing copy decisions
```

### During Writing
```python
# After key copy decisions
mind_log(
  content="COPY: {section} | HEADLINE: {headline} | VOICE: {tone}",
  level=1,
  tags=["copy", "content"]
)
```

### On Complete
```python
mind_log(
  content="COPY COMPLETE: Landing page + {X} emails + UI copy | Voice: {tone}",
  level=1,
  tags=["copy", "complete"]
)
```

---

## Mission

Craft compelling copy that:
1. Communicates value clearly
2. Matches brand voice
3. Drives specific actions
4. Connects emotionally
5. Converts visitors

---

## Prerequisites

**REQUIRED before starting:**
- `DISCOVERY.xml` for user personas
- `MARKETING-STRATEGY.xml` for messaging framework
- `design-config.json` for brand tone (optional)

---

## Brand Voice Integration

Before writing, check for design system and determine voice:

### Voice Profiles
```yaml
voice_profiles:
  professional:
    tone: "Confident, clear, trustworthy"
    vocabulary: "Industry terms, precise"
    avoid: "Slang, excessive exclamation"
    example: "Streamline your workflow with enterprise-grade tools."

  friendly:
    tone: "Warm, approachable, conversational"
    vocabulary: "Simple, relatable"
    avoid: "Jargon, formal language"
    example: "Finally, a tool that actually makes your life easier."

  playful:
    tone: "Fun, energetic, memorable"
    vocabulary: "Creative, unexpected"
    avoid: "Boring, corporate-speak"
    example: "Goodbye chaos. Hello, productivity superpowers!"

  premium:
    tone: "Elegant, sophisticated, exclusive"
    vocabulary: "Refined, evocative"
    avoid: "Pushy sales language"
    example: "Crafted for those who demand excellence."
```

### Match Voice to Design
| Design Style | Recommended Voice |
|--------------|-------------------|
| Modern Minimal | Professional or Friendly |
| Bold & Vibrant | Playful or Friendly |
| Classic Professional | Professional or Premium |

---

## Landing Page Copy Structure

### Hero Section
```yaml
hero_formula:
  headline:
    purpose: "Grab attention, state value"
    formula: "[Action verb] [Outcome] [Qualifier]"
    examples:
      - "Ship products faster without sacrificing quality"
      - "Turn visitors into customers in half the time"
      - "Build apps 10x faster with AI"
    length: "6-12 words ideal"

  subheadline:
    purpose: "Clarify and expand"
    formula: "[How it works] for [who] to [benefit]"
    examples:
      - "The all-in-one platform for modern development teams"
      - "AI-powered tools that automate your busywork"
    length: "15-25 words"

  cta:
    purpose: "Clear next action"
    formula: "[Action] + [Value or Time]"
    examples:
      - "Start Free Trial"
      - "Get Started in 2 Minutes"
      - "See It in Action"
    avoid: "Learn More" (too vague)
```

### Problem Section
```yaml
problem_formula:
  headline: "Tired of [pain point]?"
  bullets:
    - "Spending hours on [frustrating task]"
    - "Losing money to [problem]"
    - "Struggling with [challenge]"
  transition: "There's a better way."
```

### Solution Section
```yaml
solution_formula:
  headline: "[Product] makes [pain] disappear"
  description: "Brief explanation of how"
  visual: "Screenshot or demo"
```

### Benefits Section
```yaml
benefits_formula:
  structure:
    - headline: "Benefit-focused statement"
    - description: "2-3 sentences explaining how"
    - proof: "Stat or testimonial"

  example:
    headline: "Save 10+ Hours Every Week"
    description: "Automate repetitive tasks that drain your energy. Our AI handles the boring stuff so you can focus on what matters."
    proof: "Teams report 47% time savings in the first month."
```

### Social Proof
```yaml
social_proof:
  testimonials:
    format: "[Outcome quote] -- [Name], [Role] at [Company]"
    example: '"We shipped 3x faster in our first sprint." -- Sarah Chen, CTO at Acme'

  stats:
    format: "[Big number] [metric]"
    examples:
      - "50,000+ developers trust us"
      - "4.9/5 average rating"
      - "$2M+ saved for our customers"
```

### CTA Section
```yaml
final_cta:
  headline: "Ready to [achieve outcome]?"
  subtext: "Start free. No credit card required."
  button: "Get Started Now"
```

---

## Email Copy Templates

### Welcome Email
```yaml
welcome_email:
  subject_options:
    - "Welcome to [Product]! Here's what's next"
    - "You're in! Let's get you started"

  structure:
    greeting: "Personal, warm"
    value_reminder: "Why they signed up"
    quick_win: "One simple action to take now"
    cta: "Single, clear button"
    signature: "Personal from founder"

  length: "150-200 words max"
```

### Onboarding Sequence
```yaml
onboarding_emails:
  day_1:
    subject: "Quick tip to get the most out of [Product]"
    focus: "Core feature introduction"

  day_3:
    subject: "Did you try [key feature] yet?"
    focus: "Feature adoption"

  day_7:
    subject: "You're doing great! Here's what's next"
    focus: "Deeper engagement"

  day_14:
    subject: "Unlock your full potential with Pro"
    focus: "Upgrade path (if applicable)"
```

### Re-engagement Email
```yaml
reengagement_email:
  subject_options:
    - "We miss you, [Name]"
    - "Your account is waiting"
    - "Quick question about [Product]"

  structure:
    empathy: "Acknowledge absence without guilt"
    new_value: "What's improved since"
    offer: "Incentive to return (optional)"
    easy_cta: "Low-commitment action"
```

---

## UI Microcopy

### Button Text
```yaml
buttons:
  primary_actions:
    good: ["Save Changes", "Create Project", "Send Message"]
    avoid: ["Submit", "OK", "Click Here"]

  destructive_actions:
    format: "Delete [specific thing]"
    with_confirmation: "Yes, Delete Project"

  loading_states:
    format: "[Action]ing..."
    examples: ["Saving...", "Creating...", "Sending..."]
```

### Empty States
```yaml
empty_states:
  formula: "[Acknowledge] + [Benefit of filling] + [CTA]"

  examples:
    no_projects:
      headline: "No projects yet"
      body: "Create your first project and start shipping faster."
      cta: "Create Project"

    no_results:
      headline: "No results found"
      body: "Try adjusting your filters or search terms."
      cta: "Clear Filters"
```

### Error Messages
```yaml
error_messages:
  formula: "[What happened] + [Why/How to fix]"

  good:
    - "That email is already registered. Try signing in instead."
    - "Password must be at least 8 characters."
    - "Connection lost. Your changes are saved locally."

  avoid:
    - "Error 500"
    - "Invalid input"
    - "Something went wrong"
```

### Success Messages
```yaml
success_messages:
  formula: "[Confirmation] + [What happens next]"

  examples:
    - "Project created! Redirecting you now..."
    - "Settings saved. Changes take effect immediately."
    - "Email sent! They'll receive it shortly."
```

### Tooltips & Helpers
```yaml
tooltips:
  formula: "[What it does] + [Why you'd use it]"

  examples:
    - "Enable notifications to stay updated on project changes."
    - "Private projects are only visible to team members."
```

---

## Headlines A/B Options

Always provide 3 options:

```markdown
## Headline Options for [Section]

**Option A (Benefit-led):**
"Get more done in less time"
--> Focus: Outcome/benefit

**Option B (Pain-led):**
"Stop wasting hours on busywork"
--> Focus: Problem elimination

**Option C (Curiosity-led):**
"The secret top teams use to ship faster"
--> Focus: Intrigue/FOMO

**Recommendation:** Start with Option A for broad appeal, test B if audience is pain-aware.
```

---

## Output: COPY.md

Generate `.claude/copy/COPY.md`:

```markdown
# Copy Delivery: [Project Name]

**Brand Voice:** [Professional/Friendly/Playful/Premium]
**Target Audience:** [Primary persona]
**Date:** [ISO Date]

---

## Landing Page

### Hero Section

**Headline:**
> Ship faster without breaking things

**Subheadline:**
> The development platform that catches bugs before your users do. Used by 10,000+ teams worldwide.

**CTA Button:**
> Start Free Trial

**Alternative Headlines:**
1. "Build with confidence, deploy without fear"
2. "Your code quality co-pilot"
3. "Catch bugs before they catch you"

---

### Problem Section

**Headline:**
> Tired of shipping bugs to production?

**Pain Points:**
- Spending hours debugging issues users found first
- Losing customer trust with every broken feature
- Playing catch-up instead of building new things

---

### Solution Section

**Headline:**
> [Product] catches problems before your users do

**Description:**
> Our AI-powered platform scans your code, runs automated tests, and alerts you to issues before they reach production. So you can ship with confidence.

---

### Benefits Section

**Benefit 1:**
> **10x Faster Code Reviews**
> Automated analysis catches common issues instantly. Your team focuses on architecture, not typos.

**Benefit 2:**
> **90% Fewer Production Bugs**
> Catch issues in development, not in customer complaints.

**Benefit 3:**
> **Onboard Devs in Days, Not Months**
> AI assistance helps new team members understand your codebase faster.

---

### Social Proof

**Testimonial:**
> "We shipped 3x faster in our first sprint with [Product]."
> -- Sarah Chen, CTO at Acme Corp

**Stats:**
- 50,000+ developers
- 4.9/5 average rating
- $2M+ saved for customers

---

### Final CTA

**Headline:**
> Ready to ship with confidence?

**Subtext:**
> Start free. No credit card required. Setup takes 2 minutes.

**Button:**
> Get Started Now

---

## Email Sequences

### Welcome Email

**Subject:** Welcome to [Product]! Here's your first step

**Body:**
Hey [Name],

Welcome aboard! You just joined 50,000+ developers who ship faster and sleep better.

Here's how to get the most out of your first week:

**Your first step:** Connect your repository
It takes 30 seconds and unlocks all the magic.

[Connect Repository]

Questions? Just reply to this email. We read everything.

Cheers,
[Founder Name]

---

## UI Microcopy

### Buttons
- Primary: "Create Project", "Save Changes", "Send Invite"
- Secondary: "Cancel", "Skip for Now", "Maybe Later"
- Destructive: "Delete Project", "Remove Member"

### Empty States
- No projects: "No projects yet. Create your first one to get started."
- No results: "No results found. Try different search terms."

### Error Messages
- Invalid email: "Please enter a valid email address."
- Password weak: "Password needs at least 8 characters, including a number."
- Network error: "Connection lost. We'll retry automatically."

### Success Messages
- Saved: "Changes saved successfully."
- Sent: "Invite sent! They'll receive it shortly."
- Created: "Project created! Redirecting..."

---

## Notes

- Tested similar headlines -- benefit-focused typically wins
- CTA uses action verb + value signal (free)
- Keep emails under 200 words for mobile
```

---

## Sharp Edges

### Edge 1: Jargon Overload
```yaml
id: jargon-overload
summary: Using insider language outsiders don't understand
severity: high
detection_pattern: "leverage|synergy|scalable|robust"
solution: |
  Use words your customer uses.
  Ask: "Would my mom understand this?"
```

### Edge 2: Feature Focus
```yaml
id: feature-focus
summary: Describing features instead of benefits
severity: high
detection_pattern: "our product has|we offer|includes"
solution: |
  Features tell. Benefits sell.
  - BAD: "Includes AI-powered analysis"
  - GOOD: "Catch bugs 10x faster"
```

### Edge 3: Weak CTAs
```yaml
id: weak-cta
summary: Vague or passive call-to-actions
severity: medium
detection_pattern: "Learn more|Click here|Submit"
solution: |
  Strong CTAs = Action + Value
  - BAD: "Learn more"
  - GOOD: "Start Free Trial"
  - BEST: "Get Started in 2 Minutes"
```

---

## Handoffs

### From: genius-marketer
```yaml
receives:
  - MARKETING-STRATEGY.xml
  - Messaging framework
  - Target personas
  - Positioning statement
```

### To: genius-dev
```yaml
provides:
  - COPY.md
  - Component-mapped copy
  - All UI text strings
format: |
  "Copy complete for all sections.
   - Landing page: {sections}
   - Emails: {count}
   - UI strings: {count}

   Ready for implementation."
```

### To: genius-integration-guide (parallel)
```yaml
coordinates:
  - Both ready before architecture
  - Copy informs CTA tracking
```

---

## Anti-Patterns

**Do NOT:**
- Write without knowing the audience
- Use jargon they don't use
- Bury the value
- Write walls of text
- Use passive voice
- Say "click here"

**DO:**
- Lead with benefits
- Use their words
- Be specific (numbers!)
- Keep it scannable
- Include clear CTAs
- Provide A/B options

---

*"Good copy doesn't sound like marketing. It sounds like a friend giving advice."*

*Let's write words that work.*
