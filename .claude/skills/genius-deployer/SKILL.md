---
name: genius-deployer
description: Deployment and operations skill that handles staging and production deployments, monitors systems, reads logs, diagnoses issues, and manages rollbacks. Works with Vercel, Railway, and other platforms. Use for "deploy", "go live", "push to production", "ship it".
---

# Genius Deployer v8.0 - Ship It Safely

**Ships code to production with zero downtime. Never deploy on Friday at 5pm.**

## Memory Integration

### On Deploy Start
```python
mind_recall()  # Load deployment history
mind_search("deployment issues {project}")  # Check past issues
mind_search("environment config {project}")  # Env vars
```

### On Deploy Success
```python
mind_log(
  content="DEPLOYED: {version} to {env} at {time} | STATUS: success",
  level=1,
  tags=["deployment", "success"]
)
```

### On Deploy Failure
```python
mind_log(
  content="DEPLOY FAILED: {version} to {env} | ERROR: {error}",
  level=1,
  tags=["deployment", "failed"]
)
```

### On Rollback
```python
mind_log(
  content="ROLLBACK: {version} -> {previous} | REASON: {why}",
  level=1,
  tags=["deployment", "rollback"]
)
```

---

## Deployment Protocol

### 1. Pre-Deploy Checklist

```markdown
## Pre-Deploy Verification

- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compiles (`tsc --noEmit`)
- [ ] Lint clean (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set in platform
- [ ] Database migrations ready (if any)
- [ ] Rollback plan documented
- [ ] NOT Friday after 3pm
```

### 2. Staged Deployment

```bash
# Stage 1: Build
npm run build
# Verify no errors

# Stage 2: Deploy to Staging
vercel --env staging
# OR
railway up --environment staging

# Stage 3: Smoke Test
# Hit critical paths manually
# Check error rates in logs

# Stage 4: Deploy to Production
vercel --prod
# OR
railway up --environment production

# Stage 5: Monitor (15 min)
# Watch error rates
# Check performance metrics
# Verify key functionality
```

### 3. Environment Variables

```bash
# NEVER hardcode. Set in platform:

# Vercel
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_API_URL production

# Railway
railway variables set DATABASE_URL=xxx
railway variables set NEXT_PUBLIC_API_URL=xxx

# Required for most projects:
# - DATABASE_URL
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY (server only!)
```

---

## Platform Commands

### Vercel
```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# Rollback
vercel rollback

# List deployments
vercel ls

# Environment variables
vercel env ls production
vercel env add VARIABLE_NAME production
```

### Railway
```bash
# Deploy
railway up

# View logs
railway logs

# Rollback
railway rollback

# Environment variables
railway variables
railway variables set KEY=value
```

### Manual (Docker/VPS)
```bash
# Build
docker build -t app:latest .

# Deploy
docker-compose up -d

# Check logs
docker-compose logs -f

# Rollback
docker-compose up -d --force-recreate app:previous
```

---

## Post-Deploy Monitoring

### What to Watch (First 15 Minutes)
```
1. Error rates - Any spike?
2. Response times - Slower than before?
3. CPU/Memory - Normal levels?
4. User flows - Can users complete key actions?
5. Logs - Any new errors?
```

### Quick Health Check
```bash
#!/bin/bash
# health-check.sh

echo "Checking production health..."

# Check if site is up
curl -s -o /dev/null -w "%{http_code}" https://your-app.com | grep 200 && echo "Site responding"

# Check API
curl -s https://your-app.com/api/health | grep "ok" && echo "API healthy"

# Check database (via API)
curl -s https://your-app.com/api/db-check | grep "connected" && echo "Database connected"

echo "Health check complete"
```

---

## Rollback Procedure

### When to Rollback
- Error rate > 5% (or significantly higher than baseline)
- Critical user flow broken
- Database corruption detected
- Security vulnerability discovered

### How to Rollback
```bash
# Vercel
vercel rollback

# Railway
railway rollback

# Manual
git revert HEAD
npm run build
# redeploy
```

---

## Sharp Edges

### Edge 1: Missing Env Vars
```yaml
id: missing-env
summary: Environment variables not set in platform
severity: critical
detection: "Runtime error about undefined env var"
symptoms:
  - App crashes on start
  - Features broken
solution: |
  1. List required vars: grep NEXT_PUBLIC .env.example
  2. Verify in platform: vercel env ls production
  3. Add missing vars
  4. Redeploy
```

### Edge 2: Forgotten Migration
```yaml
id: forgotten-migration
summary: Database schema out of sync
severity: critical
detection: "relation does not exist"
symptoms:
  - Database errors
  - Missing columns/tables
solution: |
  1. Run migrations before deploy
  2. Verify schema matches code
  3. Never deploy code before migrations
```

### Edge 3: No Monitoring
```yaml
id: no-monitoring
summary: Issues discovered by users, not alerts
severity: high
detection: "Users report issues first"
symptoms:
  - Slow incident response
  - Reputation damage
solution: |
  1. Set up error tracking (Sentry)
  2. Add health check endpoints
  3. Configure alerting
```

### Edge 4: Friday 5PM Deploy
```yaml
id: friday-deploy
summary: Deploying before weekend
severity: high
detection: "Deploy on Friday afternoon"
symptoms:
  - Weekend incidents
  - Unavailable team
solution: |
  NEVER deploy Friday after 3pm.
  Monday-Wednesday morning deploys only.
  Full team available for issues.
```

### Edge 5: Cache Issues
```yaml
id: cache-issues
summary: Old code serving after deploy
severity: medium
detection: "Changes not visible"
symptoms:
  - Users see old version
  - Inconsistent behavior
solution: |
  1. Force rebuild
  2. Clear CDN cache
  3. Verify cache headers
```

---

## Validations

### V1: Pre-Deploy Checks Pass
```yaml
trigger: "before deploy"
check: "tests pass AND build succeeds"
severity: critical
message: "Cannot deploy with failing tests or build"
```

### V2: Env Vars Set
```yaml
trigger: "before deploy"
check: "All required env vars configured"
severity: critical
message: "Missing environment variables"
```

### V3: Migrations Run
```yaml
trigger: "if database changes"
check: "Migrations applied before deploy"
severity: critical
message: "Run migrations before deploying code"
```

### V4: Not Friday Afternoon
```yaml
trigger: "deploy command"
check: "Not Friday after 3pm"
severity: high
message: "Consider delaying deploy until Monday"
```

---

## Handoffs

### From genius-qa
```yaml
receives:
  - QA approval status
  - Test results summary
  - Any deployment warnings
action: |
  1. Verify QA approval
  2. Check for deployment warnings
  3. Proceed with staged deployment
```

### From genius-security
```yaml
receives:
  - Security audit status
  - Any blocking issues
action: |
  1. Verify no critical security issues
  2. Check security checklist
  3. Proceed only if security cleared
```

### To genius-debugger (on issue)
```yaml
provides:
  - Deployment logs
  - Error messages
  - Environment context
handoff_format: |
  "Deployment issue detected:
   Error: {error}
   Logs: {logs}
   Environment: {env}

   Please diagnose and fix."
```

### To genius-dev (on issue)
```yaml
provides:
  - Bug description from production
  - Logs and stack traces
handoff_format: |
  "Production bug discovered:
   Issue: {description}
   Logs: {logs}

   Please fix and prepare for redeploy."
```

---

## Deployment Checklist Template

```markdown
## Deploy: {version} to {environment}

### Pre-Deploy
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Env vars set
- [ ] Migrations ready

### Deploy
- [ ] Staging deployed
- [ ] Staging tested
- [ ] Production deployed

### Post-Deploy
- [ ] Monitor 15 min
- [ ] Check error rates
- [ ] Verify key flows
- [ ] Update status

### Rollback Plan
If issues: `vercel rollback {deployment_id}`
```

---

## Anti-Patterns

**DON'T:**
- Deploy and pray
- Skip staging
- Deploy without rollback plan
- Deploy Friday afternoon
- Ignore monitoring

**DO:**
- Staged deployments always
- Monitor after every deploy
- Have rollback ready
- Deploy early in the week
- Communicate with team

---

*"Ship it, but ship it safely."*
