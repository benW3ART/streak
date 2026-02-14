---
name: genius-qa
description: Comprehensive QA skill with dual testing strategy using Playwright for automated tests and optional Claude in Chrome for visual testing. Runs micro-checks during execution and full audits before deployment. Use for "run tests", "test this", "quality check", "QA audit".
---

# Genius QA v8.0 - The Quality Guardian

**Quality is not an act, it is a habit. We don't find bugs, we prevent them.**

## Memory Integration

### On Audit Start
```python
mind_recall()  # Load previous QA findings
mind_search("test failures {project}")  # Check history
mind_search("known bugs {project}")  # Known issues
```

### On Issue Found
```python
mind_log(
  content="QA ISSUE: {type} | SEVERITY: {level} | FILE: {path}",
  level=1,
  tags=["qa", "issue", severity]
)
```

### On Audit Complete
```python
mind_log(
  content="QA AUDIT: {domain} | SCORE: {score}/100 | ISSUES: {count}",
  level=1,
  tags=["qa", "audit", "complete"]
)
```

---

## The Five Audit Domains

### 1. Functional Audit
**Does it work as intended?**

Checklist:
- [ ] All features from requirements implemented
- [ ] User flows work end-to-end
- [ ] Edge cases handled
- [ ] Error states displayed correctly
- [ ] Loading states present
- [ ] Empty states handled
- [ ] Pagination works correctly
- [ ] Search/filter functionality accurate
- [ ] Forms validate properly
- [ ] Data persists correctly

### 2. Technical Audit
**Is the code quality acceptable?**

Checklist:
- [ ] TypeScript strict mode enabled
- [ ] No TypeScript errors
- [ ] ESLint passes with no warnings
- [ ] No console.logs in production code
- [ ] Proper error handling everywhere
- [ ] No memory leaks
- [ ] Efficient database queries
- [ ] Proper caching implemented
- [ ] Bundle size optimized
- [ ] API response times acceptable

Automated Checks:
```bash
# TypeScript
npm run typecheck 2>&1

# Linting
npm run lint 2>&1

# Build
npm run build 2>&1

# Dependencies
npm audit 2>&1
npm outdated 2>&1
```

### 3. Security Audit
**Are there vulnerabilities?**

CRITICAL Checks:
- [ ] No secrets in code
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] CSRF protection enabled
- [ ] Authentication properly implemented
- [ ] Authorization checks on all endpoints
- [ ] Input validation on all user inputs
- [ ] Secure headers configured
- [ ] HTTPS enforced
- [ ] Rate limiting implemented

### 4. Architectural Audit
**Does it follow best practices?**

Checklist:
- [ ] Folder structure matches conventions
- [ ] Separation of concerns maintained
- [ ] No circular dependencies
- [ ] API contracts documented
- [ ] Database schema matches design
- [ ] Caching strategy implemented
- [ ] Error boundaries in place
- [ ] Logging implemented
- [ ] Monitoring configured

### 5. UI/UX Audit
**Is it usable and accessible?**

Checklist:
- [ ] Responsive on all breakpoints
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Consistent styling
- [ ] Loading states present
- [ ] Error states clear
- [ ] Forms have proper labels
- [ ] Focus states visible
- [ ] Color contrast sufficient
- [ ] Animations performant
- [ ] Touch targets adequate

---

## Testing Strategy

### Dual Testing Approach

#### 1. Playwright (Automated E2E)
```bash
# Run all tests
npx playwright test

# Run specific test
npx playwright test auth.spec.ts

# With UI
npx playwright test --ui
```

#### 2. Claude in Chrome (Visual Testing)
For complex visual interactions:
```yaml
use_when:
  - Visual regression testing
  - Complex user flows
  - Dynamic content verification
  - Accessibility testing
```

---

## Test Execution Matrix

### Unit Tests
```bash
npm run test:unit -- --coverage
# OR
npx vitest run --coverage
# OR
npx jest --coverage
```

### Integration Tests
```bash
npm run test:integration
npm run test:api
```

### E2E Tests
```bash
npx playwright test
# OR
npx cypress run
```

### Security Tests
```bash
npm audit
npx snyk test 2>/dev/null || echo "Snyk not configured"
```

### Performance Tests
```bash
npx lighthouse http://localhost:3000 --output json 2>/dev/null
```

---

## Output: Audit Report

Generate `AUDIT-REPORT.md`:

```markdown
# Quality Audit Report

**Project:** [Name]
**Date:** [ISO Date]
**Auditor:** genius-qa v8.0

## Executive Summary

| Domain | Score | Critical Issues |
|--------|-------|-----------------|
| Functional | 85% | 0 |
| Technical | 72% | 1 |
| Security | 65% | 2 |
| Architecture | 90% | 0 |
| UI/UX | 78% | 1 |

**Overall Health:** [Status]

### Critical Findings
1. [Finding 1]
2. [Finding 2]

### High Priority
1. [Issue 1]
2. [Issue 2]

---

## Detailed Findings

[Full audit details by domain]

---

## Test Results

| Type | Coverage | Target | Status |
|------|----------|--------|--------|
| Statements | 82% | 80% | Pass |
| Branches | 71% | 75% | Warn |
| Functions | 88% | 80% | Pass |

---

## Recommendations

### Immediate Actions
1. [Action 1]
2. [Action 2]

### Short-term
1. [Action 1]
2. [Action 2]
```

---

## Output: Corrections XML

Generate `CORRECTIONS.xml` for genius-dev:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<corrections source="genius-qa" date="2025-01-29">
  <summary>
    <total-issues>8</total-issues>
    <critical>2</critical>
    <high>3</high>
    <medium>2</medium>
    <low>1</low>
  </summary>

  <correction id="CORR-001" severity="critical" category="security">
    <title>SQL Injection Vulnerability</title>
    <finding>
      User search uses string interpolation for SQL query.
    </finding>
    <location>
      <file>/src/api/users/search.ts</file>
      <line>42</line>
    </location>
    <recommendation>
      Use parameterized queries or ORM methods.
    </recommendation>
    <fix-prompt>
      Refactor search to use Prisma's findMany with contains filter.
    </fix-prompt>
    <verification>
      <command>npm run test:security</command>
    </verification>
  </correction>

  <!-- Additional corrections -->
</corrections>
```

---

## Quality Gates

### Gate 1: Development Complete
- [ ] All unit tests pass
- [ ] Coverage > 80%
- [ ] No linting errors

### Gate 2: Integration Ready
- [ ] All integration tests pass
- [ ] API contracts verified
- [ ] Database migrations clean

### Gate 3: Release Candidate
- [ ] All E2E tests pass
- [ ] Security scan clean
- [ ] Performance within budgets
- [ ] Accessibility audit passed

### Gate 4: Production Ready
- [ ] All corrections applied
- [ ] Re-audit shows no critical issues
- [ ] Documentation complete
- [ ] Deployment verified in staging

---

## Sharp Edges

### Edge 1: Flaky Tests
```yaml
id: flaky-tests
summary: Tests pass sometimes, fail others
severity: high
detection: "Test failed" then "Test passed" on retry
symptoms:
  - Inconsistent CI results
  - False failures
solution: |
  1. Add proper waits for async operations
  2. Use stable selectors
  3. Isolate test data
  4. Add retry logic for network calls
```

### Edge 2: Missing Test Coverage
```yaml
id: coverage-gaps
summary: Code paths not tested
severity: medium
detection: "Coverage < 80%"
symptoms:
  - Bugs in untested code
  - Regression issues
solution: |
  1. Run coverage report
  2. Identify uncovered branches
  3. Write tests for critical paths
```

### Edge 3: Slow Tests
```yaml
id: slow-tests
summary: Tests take too long
severity: medium
detection: "Test suite > 5 minutes"
symptoms:
  - CI bottleneck
  - Developer frustration
solution: |
  1. Parallelize tests
  2. Mock external services
  3. Use test database in memory
```

### Edge 4: False Positives
```yaml
id: false-positives
summary: Tests fail for wrong reasons
severity: medium
detection: "Test fails but feature works"
symptoms:
  - Wasted debugging time
  - Ignored test results
solution: |
  1. Review test assertions
  2. Fix brittle selectors
  3. Add better error messages
```

---

## Validations

### V1: Tests Pass
```yaml
trigger: "before QA approval"
check: "npm run test exit code 0"
severity: critical
message: "All tests must pass before QA approval"
```

### V2: Coverage Threshold
```yaml
trigger: "coverage report"
check: "coverage >= 80%"
severity: high
message: "Coverage must be at least 80%"
```

### V3: No Critical Issues
```yaml
trigger: "audit complete"
check: "critical_issues == 0"
severity: critical
message: "Cannot proceed with critical issues"
```

### V4: Build Successful
```yaml
trigger: "before QA"
check: "npm run build succeeds"
severity: critical
message: "Build must succeed before QA"
```

---

## Handoffs

### From genius-orchestrator
```yaml
receives:
  - PROGRESS.md with completed tasks
  - List of implemented files
  - Any known issues
action: |
  1. Run full audit across all 5 domains
  2. Generate AUDIT-REPORT.md
  3. Generate CORRECTIONS.xml if issues found
```

### From genius-dev
```yaml
receives:
  - Implemented feature
  - Test files
  - Verification commands
action: |
  1. Run tests for the feature
  2. Check code quality
  3. Report issues or approve
```

### To genius-dev
```yaml
provides:
  - CORRECTIONS.xml with issues
  - Priority order for fixes
  - Fix prompts for each issue
handoff_format: |
  "QA found {count} issues. {critical} critical, {high} high priority.
   See CORRECTIONS.xml for fix prompts.
   Start with critical issues."
```

### To genius-security
```yaml
provides:
  - Security-related findings
  - Files with potential vulnerabilities
handoff_format: |
  "Security concerns found during QA.
   Recommend deep security audit.
   See AUDIT-REPORT.md security section."
```

### To genius-deployer
```yaml
provides:
  - QA approval status
  - Test results summary
  - Any deployment warnings
handoff_format: |
  "QA APPROVED for deployment.
   All tests pass. No critical issues.
   Proceed with staging deployment."
```

---

## When This Skill Activates

Use genius-qa when:
- Implementation phase complete
- Before any deployment
- User asks for "audit", "test", or "verify"
- After major refactoring
- Before code review submission
- Periodic quality checks

---

*"Quality means doing it right when no one is looking."*
