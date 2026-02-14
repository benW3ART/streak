---
name: genius-security
description: Security audit skill that performs OWASP Top 10 checks, dependency scanning, configuration review, and vulnerability assessment. Integrates with Vibeship Scanner (3500+ rules) and SupaRalph (277 Supabase attack vectors). Produces prioritized fix recommendations. Use for "security audit", "penetration test", "find vulnerabilities", "threat model".
---

# Genius Security v8.0 - The Guardian

**Security is not a feature, it's a requirement.**

## Memory Integration

### On Audit Start
```python
mind_recall()  # Load previous security findings
mind_search("security vulnerabilities {project}")  # Check history
mind_search("known security issues")  # Known issues
```

### On Finding
```python
mind_log(
  content="VULNERABILITY: {type} | SEVERITY: {level} | FILE: {path} | STATUS: open",
  level=1,
  tags=["security", "vulnerability", severity]
)
```

### On Fix Verified
```python
mind_log(
  content="FIXED: {vulnerability_id} | METHOD: {how} | VERIFIED: {date}",
  level=1,
  tags=["security", "fixed"]
)
```

---

## Tools Integration

### 1. Vibeship Scanner (Primary)

**3,500+ security patterns** across 16 parallel scanners:
- Opengrep (SAST)
- Trivy (dependencies)
- Gitleaks (secrets)
- npm audit
- AI-friendly fix prompts

```bash
# Online scan (public repos)
https://scanner.vibeship.co/
# Paste GitHub URL -> Get findings in minutes

# Self-hosted
git clone https://github.com/vibeforge1111/vibeship-scanner.git
cd vibeship-scanner && npm install && npm run dev
```

### 2. SupaRalph (Supabase Projects)

**277 attack vectors** specific to Supabase:
- Real penetration testing (not static analysis)
- OWASP Top 10 compliance
- SOC2, GDPR compliance mapping

```bash
# Online
https://suparalph.vibeship.co/

# Self-hosted
git clone https://github.com/vibeforge1111/vibeship-supascanner.git
cd vibeship-supascanner && npm install && npm run dev
```

### 3. Local Tools
```bash
# npm audit
npm audit --json 2>&1

# Gitleaks
npx gitleaks detect --source . 2>/dev/null

# Snyk
npx snyk test 2>/dev/null
```

---

## Audit Protocol

### Phase 1: Discovery

```bash
# 1. Project type detection
ls -la package.json Cargo.toml requirements.txt go.mod 2>/dev/null

# 2. Framework detection
grep -r "next\|react\|vue\|svelte" package.json 2>/dev/null
grep -r "supabase\|firebase\|prisma" . --include="*.ts" 2>/dev/null

# 3. Check for existing security config
ls -la .env* .github/workflows/*security* 2>/dev/null
```

### Phase 2: Automated Scanning

#### For ALL Projects
```bash
# Run Vibeship Scanner
# Option A: Online (public repos)
echo "Scan at: https://scanner.vibeship.co/"
echo "Paste: $(git remote get-url origin 2>/dev/null)"

# Option B: Local tools
npm audit --json 2>/dev/null | head -100
npx gitleaks detect --source . 2>/dev/null
```

#### For Supabase Projects
```bash
# Detect Supabase
if grep -q "supabase" package.json 2>/dev/null; then
  echo "Supabase detected - Run SupaRalph!"
  echo "https://suparalph.vibeship.co/"
fi
```

### Phase 3: OWASP Top 10 Manual Review

| # | Vulnerability | Check | Files to Review |
|---|---------------|-------|-----------------|
| A01 | Broken Access Control | RLS policies, auth checks | `**/policies.sql`, `**/middleware.*` |
| A02 | Cryptographic Failures | Secrets exposure, weak crypto | `.env*`, `**/crypto.*`, `**/auth.*` |
| A03 | Injection | SQL, NoSQL, Command, XSS | `**/api/**`, `**/db/**`, forms |
| A04 | Insecure Design | Threat model gaps | Architecture docs |
| A05 | Security Misconfiguration | Default configs, verbose errors | `next.config.*`, `vercel.json` |
| A06 | Vulnerable Components | Outdated deps | `package.json`, `package-lock.json` |
| A07 | Auth Failures | Weak passwords, session issues | `**/auth/**`, `**/session.*` |
| A08 | Data Integrity | Unsigned updates, CI/CD trust | `.github/workflows/*` |
| A09 | Logging Failures | Missing audit logs | `**/logger.*`, `**/audit.*` |
| A10 | SSRF | Unvalidated URLs | `**/fetch.*`, `**/request.*` |

---

## Sharp Edges

### Edge 1: Hardcoded Secrets
```yaml
id: hardcoded-secrets
summary: API keys, passwords in code
severity: critical
detection: "(api[_-]?key|password|secret|token)\\s*[=:]\\s*['\"][^'\"]{8,}"
files: "**/*.{ts,js,tsx,jsx,py,env}"
symptoms:
  - Keys visible in git history
  - Secrets in client bundles
solution: |
  1. Move to environment variables
  2. Use .env.local (gitignored)
  3. Rotate compromised keys
  4. Run: gitleaks detect --source .
ai_fix_prompt: |
  Found hardcoded secret in {file} at line {line}.
  Move this to an environment variable and update the code to use process.env.{VAR_NAME}.
```

### Edge 2: SQL Injection
```yaml
id: sql-injection
summary: String concatenation in SQL queries
severity: critical
detection: "(SELECT|INSERT|UPDATE|DELETE).*\\+.*\\$|`\\$\\{.*\\}`"
files: "**/*.{ts,js,sql}"
symptoms:
  - Dynamic query building
  - User input in queries
solution: |
  Use parameterized queries:
  - Supabase: .eq(), .in(), etc.
  - Prisma: Prisma Client (auto-safe)
  - Raw: Prepared statements
ai_fix_prompt: |
  SQL injection vulnerability in {file} at line {line}.
  The code uses string concatenation: {code_snippet}
  Refactor to use parameterized queries.
```

### Edge 3: Missing RLS (Supabase)
```yaml
id: missing-rls
summary: Tables without Row Level Security
severity: critical
detection: "create table(?!.*enable row level security)"
files: "**/migrations/*.sql"
symptoms:
  - Anyone can read/write all data
  - No per-user isolation
solution: |
  ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users own rows" ON {table}
    FOR ALL USING (auth.uid() = user_id);
ai_fix_prompt: |
  Table {table} has no RLS policies.
  Add: ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
  Then create appropriate policies for SELECT, INSERT, UPDATE, DELETE.
```

### Edge 4: Service Role on Client
```yaml
id: service-role-client
summary: Supabase service_role key exposed to browser
severity: critical
detection: "NEXT_PUBLIC.*SERVICE.*ROLE|createClient.*service_role"
files: "**/*.{ts,js,tsx}"
symptoms:
  - Full database access from browser
  - RLS bypass possible
solution: |
  NEVER use service_role on client.
  Use anon key + RLS policies.
  Service role ONLY in server functions.
ai_fix_prompt: |
  Service role key exposed to client in {file}.
  1. Remove NEXT_PUBLIC_ prefix
  2. Move this code to a server action or API route
  3. Use anon key for client-side Supabase
```

### Edge 5: XSS in React
```yaml
id: xss-react
summary: dangerouslySetInnerHTML or unescaped user input
severity: high
detection: "dangerouslySetInnerHTML|innerHTML\\s*="
files: "**/*.{tsx,jsx}"
symptoms:
  - Script injection possible
  - Cookie theft
solution: |
  1. Avoid dangerouslySetInnerHTML
  2. If needed, sanitize with DOMPurify
  3. Use React's default escaping
ai_fix_prompt: |
  Potential XSS in {file} at line {line}.
  {code_snippet}
  Either remove dangerouslySetInnerHTML or sanitize input with DOMPurify.
```

### Edge 6: Missing Rate Limiting
```yaml
id: missing-rate-limit
summary: Auth endpoints without rate limiting
severity: high
detection: "POST /auth/login|POST /auth/register without rate limit"
symptoms:
  - Brute force possible
  - Account enumeration
solution: |
  1. Add rate limiting middleware
  2. Use upstash/ratelimit for serverless
  3. Limit: 5 attempts/minute for login
  4. Limit: 3 attempts/hour for register
```

---

## Validations

### V1: No Secrets in Code
```yaml
id: no-secrets
pattern: "(password|secret|api_key)\\s*=\\s*['\"][^'\"]{8,}"
exclude: "*.test.*,*.spec.*,*.example*"
severity: critical
message: "Potential secret in code!"
```

### V2: Environment Variables Protected
```yaml
id: env-gitignored
check: ".gitignore contains .env"
severity: critical
message: ".env files must be gitignored!"
```

### V3: Dependencies Audited
```yaml
id: deps-audit
command: "npm audit --audit-level=high"
severity: high
message: "High severity vulnerabilities in dependencies"
```

### V4: RLS Enabled (Supabase)
```yaml
id: rls-enabled
check: "All tables have ENABLE ROW LEVEL SECURITY"
severity: critical
message: "Tables without RLS are publicly accessible!"
```

---

## Report Format

### SECURITY-AUDIT.md Template

```markdown
# Security Audit Report

**Project:** {name}
**Date:** {date}
**Auditor:** genius-security v8.0

## Executive Summary

- **Critical:** {count}
- **High:** {count}
- **Medium:** {count}
- **Low:** {count}

## Tools Used

- Vibeship Scanner: {findings_count} rules checked
- SupaRalph: {if_supabase}
- npm audit: {deps_checked}
- gitleaks: {secrets_checked}

## Findings

### [CRITICAL] {title}

**Location:** `{file}:{line}`
**Category:** {owasp_category}

**Description:**
{description}

**Evidence:**
```{lang}
{code_snippet}
```

**AI Fix Prompt:**
```
{ai_fix_prompt}
```

**Remediation:**
{steps}

---

## Compliance Status

| Framework | Status | Notes |
|-----------|--------|-------|
| OWASP Top 10 | {status} | {notes} |
| SOC2 | {status} | {notes} |
| GDPR | {status} | {notes} |

## Recommendations

### Immediate (Fix Now)
1. {critical_1}
2. {critical_2}

### Short-term (This Sprint)
1. {high_1}
2. {high_2}

### Long-term (Roadmap)
1. {medium_1}
2. {medium_2}
```

---

## Handoffs

### From genius-architect
```yaml
receives:
  - Architecture decisions
  - Data flow diagrams
  - Third-party integrations list
action: |
  Review for security implications:
  - Data exposure risks
  - Trust boundaries
  - Attack surface
```

### From genius-qa
```yaml
receives:
  - Security-related findings from QA
  - Files with potential vulnerabilities
action: |
  Deep security audit on flagged areas.
```

### To genius-dev
```yaml
provides:
  - SECURITY-AUDIT.md with findings
  - AI fix prompts for each issue
  - Priority order for fixes
handoff_format: |
  "Security audit complete. {critical_count} critical, {high_count} high priority issues.
   Start with the AI fix prompts in SECURITY-AUDIT.md."
```

### To genius-deployer
```yaml
provides:
  - Security checklist for deployment
  - Environment variables to verify
  - Pre-deploy security gates
handoff_format: |
  "Security audit complete.
   Status: {PASS/FAIL}

   Before deploy, verify:
   - [ ] All critical issues fixed
   - [ ] Env vars configured correctly
   - [ ] No secrets in code"
```

---

## Quick Commands

```bash
# Full security audit
genius security audit

# Quick scan
genius security scan --quick

# Supabase-specific
genius security supabase

# Generate fix prompts
genius security fixes
```

---

## When to Use This Skill

- Before ANY deployment
- After implementing auth/security features
- When adding third-party integrations
- When handling user data
- Periodic security reviews (monthly)
- After security-related changes

---

*"Security is everyone's responsibility. Audit early, audit often."*
