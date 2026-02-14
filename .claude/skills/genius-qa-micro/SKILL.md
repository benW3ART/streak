---
name: genius-qa-micro
description: Quick quality check skill. Fast 30-second validation of code changes. Use for "quick check", "validate", "does this work", "test this".
context: fork
agent: genius-qa-micro
user-invocable: false
allowed-tools:
  - Read(*)
  - Glob(*)
  - Grep(*)
  - Bash(npm run lint*)
  - Bash(npm run typecheck*)
  - Bash(npx tsc*)
  - Bash(npx eslint*)
hooks:
  Stop:
    - type: command
      command: "bash -c 'echo \"QA-MICRO COMPLETE: $(date)\" >> .genius/qa.log 2>/dev/null || true'"
      once: true
---

# Genius QA Micro v8.0 - Rapid Validation

**Lightning-fast quality checks in 30 seconds or less.**

## Memory Integration

### On Check Start
```python
mind_recall()  # Load context
mind_search("recent errors {file}")  # Known issues with this file
```

### On Issue Found
```python
mind_log(
  content="MICRO-QA: {issue} | FILE: {file} | SEVERITY: {level}",
  level=2,  # Session only unless critical
  tags=["qa-micro", "issue"]
)
```

### On Pass
```python
mind_log(
  content="MICRO-QA PASS: {files} | CHECKS: {count}",
  level=2,
  tags=["qa-micro", "pass"]
)
```

---

## Speed Commitment

```
================================================
          30 SECONDS MAX
================================================

If it takes longer, escalate to genius-qa.

Target breakdown:
- Syntax check: 5 seconds
- Type check: 10 seconds
- Pattern scan: 10 seconds
- Smoke test: 5 seconds

================================================
```

---

## Micro-Check Pipeline

```
+---------------------------------------------+
|  MICRO-QA PIPELINE (Target: 30 seconds)     |
+---------------------------------------------+
|  1. SYNTAX CHECK (5s)                       |
|     - TypeScript/ESLint errors              |
|                                             |
|  2. TYPE CHECK (10s)                        |
|     - tsc --noEmit                          |
|                                             |
|  3. CRITICAL PATTERNS (10s)                 |
|     - Security anti-patterns                |
|     - Common bugs                           |
|                                             |
|  4. SMOKE TEST (5s)                         |
|     - Does it build?                        |
|     - No runtime errors?                    |
+---------------------------------------------+
```

---

## Quick Commands

### Syntax Check
```bash
# TypeScript
npx tsc --noEmit --pretty 2>&1 | head -20

# ESLint (fast mode)
npx eslint . --quiet --max-warnings 0 2>&1 | head -10
```

### Critical Pattern Scan
```bash
# Security patterns
grep -rn "eval\|innerHTML\|dangerouslySetInnerHTML" src/ --include="*.ts" --include="*.tsx" | head -5

# Hardcoded secrets
grep -rn "sk_live\|password\s*=\s*['\"]" src/ --include="*.ts" | head -5

# Console.log count
grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx" | wc -l
```

### Smoke Test
```bash
# Build check
npm run build 2>&1 | tail -5

# Or just type check
npx tsc --noEmit
```

---

## Response Formats

### Pass (All Clear)
```
MICRO-QA PASSED (18s)

Checks:
- TypeScript: No errors
- ESLint: Clean
- Patterns: No issues
- Build: Success

Ready for commit!
```

### Warning (Issues Found)
```
MICRO-QA: 2 ISSUES (24s)

Found:
- TypeScript: 1 error in src/utils.ts:42
  -> Property 'foo' does not exist on type 'Bar'

- Pattern: console.log found (12 occurrences)
  -> Consider removing before production

Quick fix needed. Run full QA? (y/n)
```

### Fail (Critical Problems)
```
MICRO-QA FAILED (12s)

Critical:
- Build fails - Cannot proceed
  Error: Module not found: '@/lib/missing'

Fix required before any testing.
```

---

## Escalation Rules

Escalate to genius-qa when:
- Build completely broken
- More than 5 issues found
- Security vulnerability detected
- User requests "full qa" or "thorough test"

```yaml
escalation:
  to: genius-qa
  reason: "Micro-QA found issues requiring deeper analysis"
  issues_found: [list of issues]
```

---

## What Micro-QA Does NOT Do

- Unit tests (too slow)
- Integration tests
- Visual regression
- Performance testing
- Accessibility audit
- Full security scan

For these, escalate to:
- genius-qa (comprehensive)
- genius-security (security-focused)

---

## Sharp Edges

### Edge 1: False Sense of Security
```yaml
id: false-security
summary: Micro-QA passing doesn't mean code is correct
severity: medium
detection: "Micro-QA pass but feature broken"
symptoms:
  - Bugs in production
  - Logic errors missed
solution: |
  Micro-QA only catches obvious issues.
  Run full QA for important changes.
```

### Edge 2: Timeout on Large Codebases
```yaml
id: timeout-large
summary: 30 seconds exceeded on big projects
severity: medium
detection: "Micro-QA taking > 30s"
symptoms:
  - Slow feedback
  - Pipeline delays
solution: |
  Scope to changed files only:
  npx tsc --noEmit --incremental
  npx eslint [changed-files-only]
```

### Edge 3: Missing Critical Patterns
```yaml
id: missing-patterns
summary: Security issue not in pattern list
severity: high
detection: "Security bug passed micro-QA"
symptoms:
  - Vulnerability in production
solution: |
  Micro-QA is not security audit.
  Run genius-security for security concerns.
```

---

## Validations

### V1: Under 30 Seconds
```yaml
trigger: "micro-qa complete"
check: "execution_time <= 30s"
severity: medium
message: "Micro-QA took too long - optimize or escalate"
```

### V2: TypeScript Clean
```yaml
trigger: "type check"
check: "tsc --noEmit returns 0"
severity: high
message: "TypeScript errors must be fixed"
```

### V3: No Secrets Detected
```yaml
trigger: "pattern scan"
check: "no hardcoded secrets found"
severity: critical
message: "Potential secret in code - escalate to security"
```

---

## Handoffs

### From genius-orchestrator
```yaml
receives:
  - Just-completed task
  - Files modified
  - Quick check request
protocol: |
  Task(
    description: "QA: [component]",
    prompt: "Quick check: [files]",
    subagent_type: "genius-qa-micro"
  )
action: |
  1. Run 30-second pipeline
  2. Return pass/fail status
  3. Report any issues found
```

### From genius-dev
```yaml
receives:
  - Files just written
  - Implicit "does this work?" request
action: |
  1. Run quick validation
  2. Return immediate feedback
  3. Suggest fixes if issues found
```

### To genius-debugger
```yaml
provides:
  - Specific error found
  - File and line number
  - Quick context
handoff_format: |
  "Micro-QA found error:
   File: {file}:{line}
   Error: {message}
   Fix this specific issue."
```

### To genius-qa (escalation)
```yaml
provides:
  - Issues found
  - Files checked
  - Reason for escalation
handoff_format: |
  "Micro-QA found {count} issues, escalating.
   Files: {files}
   Issues: {list}
   Need comprehensive audit."
```

---

## Anti-Patterns

**DON'T:**
- Run full test suites
- Do comprehensive analysis
- Take more than 30 seconds
- Block on minor issues
- Generate long reports

**DO:**
- Be fast above all
- Catch obvious errors
- Give clear pass/fail
- Suggest quick fixes
- Escalate appropriately

---

## Integration with Dev Flow

### Pre-Commit Style
```bash
# Add to package.json scripts
"micro-qa": "tsc --noEmit && eslint . --quiet"
```

### During Development
```
Dev: "quick check this"
-> Run micro-pipeline
-> Report in <30s
-> Dev continues or fixes
```

---

*Fast feedback is the best feedback.*
