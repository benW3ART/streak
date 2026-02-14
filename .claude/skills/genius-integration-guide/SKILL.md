---
name: genius-integration-guide
description: Guides user step-by-step through external service setup based on project phase (MVP/Beta/Production). Collects environment variables, validates configurations, creates .env files. Use for "setup integrations", "configure services", "env setup", "environment variables", "connect to", "add API".
---

# Genius Integration Guide - Service Setup Wizard

**Making external service integration painless.**

---

## Memory Integration (MANDATORY)

### On Session Start
```python
mind_recall()  # Load project context
mind_search("integrations configured")  # Check what's already set up
mind_search("API keys environment")  # Check for existing credentials
```

### During Setup
```python
# After each service configured
mind_log(
  content="INTEGRATION: {service} configured | Phase: {phase} | Status: {status}",
  level=1,
  tags=["integration", "config"]
)
```

### On Complete
```python
mind_log(
  content="INTEGRATIONS COMPLETE: {count} services | Phase: {phase} | .env created",
  level=1,
  tags=["integration", "complete"]
)
```

---

## Mission

Guide users through setting up external services by:
1. Identifying required integrations for their project
2. Walking through setup step-by-step
3. Collecting and validating credentials
4. Creating proper .env configuration
5. Testing connections

---

## Integration Categories

```
+-------------------------------------------------------------+
|  INTEGRATION CATEGORIES                                     |
+-------------------------------------------------------------+
|  AUTH:     Supabase, Auth0, Clerk, NextAuth                 |
|  PAYMENTS: Stripe, Lemon Squeezy, PayPal                    |
|  EMAIL:    Resend, SendGrid, Postmark, Mailgun              |
|  STORAGE:  Supabase Storage, S3, Cloudflare R2              |
|  ANALYTICS: PostHog, Mixpanel, Plausible, Vercel            |
|  AI:       OpenAI, Anthropic, Replicate                     |
|  DEPLOY:   Vercel, Railway, Netlify                         |
|  MONITOR:  Sentry, LogRocket, Datadog                       |
+-------------------------------------------------------------+
```

---

## Phase-Based Setup

### MVP Phase (Essential Only)
```yaml
mvp_integrations:
  required:
    - name: "Supabase"
      provides: ["database", "auth", "storage"]
      priority: 1
      setup_time: "5 min"
    - name: "Vercel"
      provides: ["deployment", "analytics"]
      priority: 2
      setup_time: "3 min"
  optional:
    - name: "Resend"
      provides: ["email"]
      when: "transactional emails needed"
      setup_time: "2 min"
```

### Beta Phase (Add Monitoring)
```yaml
beta_integrations:
  add:
    - name: "Sentry"
      provides: ["error tracking"]
      setup_time: "3 min"
    - name: "PostHog"
      provides: ["analytics", "feature flags"]
      setup_time: "5 min"
```

### Production Phase (Full Stack)
```yaml
production_integrations:
  add:
    - name: "Stripe"
      provides: ["payments", "billing"]
      setup_time: "10 min"
    - name: "Upstash"
      provides: ["Redis cache", "rate limiting"]
      setup_time: "3 min"
```

---

## Setup Flow

### Step 1: Identify Needs

```
What integrations does your project need?

Based on your SPECIFICATIONS.xml, I recommend:
[CHECK] Supabase (database + auth) - Required
[CHECK] Vercel (deployment) - Required
[ ] Stripe (payments) - If monetizing
[ ] Resend (email) - If sending emails

Which phase are you targeting? (MVP/Beta/Production)
```

### Step 2: Guide Through Each Service

#### Example: Supabase Setup
```
Setting up SUPABASE

Step 1/5: Create Project
--> Go to: https://supabase.com/dashboard
--> Click "New Project"
--> Name: [your-project-name]
--> Password: [generate strong password]
--> Region: [closest to your users]

Done? (yes/need help)

Step 2/5: Get Credentials
--> Go to: Settings > API
--> Copy these values:

NEXT_PUBLIC_SUPABASE_URL=
(paste your Project URL)

NEXT_PUBLIC_SUPABASE_ANON_KEY=
(paste your anon/public key)

SUPABASE_SERVICE_ROLE_KEY=
(paste your service_role key - KEEP SECRET!)

Paste each value when ready
```

### Step 3: Validate & Save
```bash
# Validate connection
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" | head -1
```

---

## Service-Specific Guides

### Supabase
```yaml
supabase:
  dashboard: "https://supabase.com/dashboard"
  docs: "https://supabase.com/docs"
  credentials_location: "Settings > API"
  env_vars:
    - name: NEXT_PUBLIC_SUPABASE_URL
      type: public
      pattern: "^https://[a-z0-9]+\\.supabase\\.co$"
    - name: NEXT_PUBLIC_SUPABASE_ANON_KEY
      type: public
      pattern: "^eyJ"
    - name: SUPABASE_SERVICE_ROLE_KEY
      type: secret
      pattern: "^eyJ"
  test_command: "curl $URL/rest/v1/ -H 'apikey: $KEY'"
  common_issues:
    - "RLS policies not set"
    - "Service role used on client"
```

### Stripe
```yaml
stripe:
  dashboard: "https://dashboard.stripe.com"
  docs: "https://stripe.com/docs"
  credentials_location: "Developers > API keys"
  env_vars:
    - name: STRIPE_SECRET_KEY
      type: secret
      pattern: "^sk_(test|live)_"
    - name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      type: public
      pattern: "^pk_(test|live)_"
    - name: STRIPE_WEBHOOK_SECRET
      type: secret
      pattern: "^whsec_"
  test_command: "stripe balance retrieve"
  common_issues:
    - "Webhook not configured"
    - "Test vs live mode confusion"
```

### Resend
```yaml
resend:
  dashboard: "https://resend.com/api-keys"
  docs: "https://resend.com/docs"
  credentials_location: "API Keys page"
  env_vars:
    - name: RESEND_API_KEY
      type: secret
      pattern: "^re_"
  test_command: "curl -X POST https://api.resend.com/emails -H 'Authorization: Bearer $KEY'"
```

### Vercel
```yaml
vercel:
  dashboard: "https://vercel.com/dashboard"
  docs: "https://vercel.com/docs"
  credentials_location: "Settings > Environment Variables"
  env_vars:
    - name: VERCEL_TOKEN
      type: secret
      optional: true
      note: "Only needed for CLI deployment"
  deploy_command: "vercel --prod"
  common_issues:
    - "Env vars not set in Vercel dashboard"
    - "Build command wrong"
```

### PostHog
```yaml
posthog:
  dashboard: "https://app.posthog.com"
  docs: "https://posthog.com/docs"
  credentials_location: "Project Settings > Project API Key"
  env_vars:
    - name: NEXT_PUBLIC_POSTHOG_KEY
      type: public
      pattern: "^phc_"
    - name: NEXT_PUBLIC_POSTHOG_HOST
      type: public
      default: "https://app.posthog.com"
```

### Sentry
```yaml
sentry:
  dashboard: "https://sentry.io"
  docs: "https://docs.sentry.io"
  credentials_location: "Settings > Projects > [Project] > Client Keys"
  env_vars:
    - name: NEXT_PUBLIC_SENTRY_DSN
      type: public
      pattern: "^https://.*@.*\\.ingest\\.sentry\\.io"
  setup_command: "npx @sentry/wizard@latest -i nextjs"
```

---

## .env File Management

### File Structure
```
project/
├── .env.local          # Local development (gitignored)
├── .env.example        # Template for team (committed)
└── .env.production     # Production values (gitignored)
```

### Validation Rules
```yaml
env_validation:
  NEXT_PUBLIC_SUPABASE_URL:
    pattern: "^https://[a-z0-9]+\\.supabase\\.co$"
    required: true

  SUPABASE_SERVICE_ROLE_KEY:
    pattern: "^eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$"
    required: true
    secret: true  # Never log this

  STRIPE_SECRET_KEY:
    pattern: "^sk_(test|live)_[A-Za-z0-9]+$"
    required_for: payments
```

---

## Output: INTEGRATIONS.md

Generate `INTEGRATIONS.md`:

```markdown
# Integration Setup Complete

**Project:** [Name]
**Date:** [ISO Date]
**Phase:** MVP

## Configured Services

| Service | Status | Phase | Purpose |
|---------|--------|-------|---------|
| Supabase | Connected | MVP | Database, Auth |
| Vercel | Deployed | MVP | Hosting |
| Resend | Configured | MVP | Email |
| Stripe | Test Mode | Beta | Payments |

## Environment Files

Created:
- `.env.local` (development)
- `.env.example` (template)

Production env vars need to be added to Vercel dashboard.

## Credentials Summary

### Supabase
- URL: https://xxxxx.supabase.co
- Status: Connected
- RLS: Needs configuration

### Vercel
- Project: [project-name]
- URL: https://[project].vercel.app
- Status: Deployed

### Resend
- Domain: Verified
- Status: Ready

## Next Steps

1. Add production env vars to Vercel dashboard
2. Configure Stripe webhooks
3. Set up Supabase RLS policies
4. Test email delivery

## Security Reminders

- NEVER commit .env.local or .env.production
- Rotate any keys that were accidentally exposed
- Use NEXT_PUBLIC_ prefix ONLY for public keys
```

---

## Output: .env Files

### .env.example (Safe to commit)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (if needed)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (if needed)
RESEND_API_KEY=re_xxx

# Analytics (if needed)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### .env.local (Gitignored - actual values)
```bash
# Generated by genius-integration-guide
# DO NOT COMMIT THIS FILE

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Add more as configured...
```

---

## Security Reminders

**CRITICAL RULES:**

1. **Never commit secrets**
```bash
# Verify .gitignore includes:
.env.local
.env.production
.env*.local
```

2. **Use correct prefix**
- `NEXT_PUBLIC_` = exposed to browser (public keys only!)
- No prefix = server-only (secrets)

3. **Rotate compromised keys immediately**
- If a secret key was committed, rotate it NOW
- Check git history for leaked secrets

---

## Connection Testing

```bash
# Test all integrations
echo "Testing Supabase..."
curl -s "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" > /dev/null \
  && echo "Supabase OK" || echo "Supabase FAILED"

echo "Testing Stripe..."
curl -s https://api.stripe.com/v1/balance \
  -u "${STRIPE_SECRET_KEY}:" > /dev/null \
  && echo "Stripe OK" || echo "Stripe FAILED"

echo "Testing Resend..."
# Test email sending capability
```

---

## Sharp Edges

### Edge 1: Committed Secrets
```yaml
id: committed-secrets
summary: Secret keys pushed to git
severity: critical
detection_pattern: "git diff shows .env"
solution: |
  1. Rotate the key IMMEDIATELY
  2. Add to .gitignore
  3. Remove from git history with BFG or filter-branch
  4. Never commit again
```

### Edge 2: Wrong Prefix
```yaml
id: wrong-prefix
summary: Secret exposed with NEXT_PUBLIC_
severity: critical
detection_pattern: "NEXT_PUBLIC_.*SECRET"
solution: |
  Secret keys should NEVER have NEXT_PUBLIC_ prefix.
  - NEXT_PUBLIC_ = browser-visible
  - No prefix = server-only
```

### Edge 3: Test vs Production
```yaml
id: test-prod-confusion
summary: Using test keys in production
severity: high
detection_pattern: "sk_test in production"
solution: |
  Verify environment:
  - Development: sk_test_*, pk_test_*
  - Production: sk_live_*, pk_live_*
```

---

## Handoffs

### From: genius-marketer + genius-copywriter
```yaml
receives:
  - TRACKING-PLAN.xml (analytics needs)
  - Project requirements
```

### To: genius-architect
```yaml
provides:
  - INTEGRATIONS.md
  - .env.example
  - Configured services list
  - Connection test results
format: |
  "Integrations configured for {phase} phase.
   Services: {list}
   .env files created.

   Ready for architecture planning."
```

---

## Anti-Patterns

**Do NOT:**
- Store secrets in code
- Use service_role on client
- Skip validation steps
- Forget .gitignore entries
- Mix test/production keys

**DO:**
- Guide step by step
- Validate each credential
- Test connections
- Document everything
- Remind about security

---

*"The best integration is the one that just works."*

*Let's get your services connected.*
