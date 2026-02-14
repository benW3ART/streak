---
name: genius-team-optimizer
description: Self-improving skill that analyzes Claude Code releases and updates Genius Team skills to leverage new features. Monitors changelogs, proposes updates, and applies improvements with user approval. Use for "optimize skills", "update genius team", "check for improvements".
---

# Genius Team Optimizer v8.0 - Self-Evolution Engine

**The skill that makes all other skills better.**

## Memory Integration

### On Optimization Start
```python
mind_recall()  # Load optimization history
mind_search("skill performance {skill_name}")  # Check effectiveness
mind_search("previous optimizations")  # Past improvements
```

### On Improvement Found
```python
mind_log(
  content="OPTIMIZATION: {skill} | TYPE: {type} | IMPACT: {impact}",
  level=1,
  tags=["optimization", "improvement"]
)
```

### On Applied
```python
mind_log(
  content="APPLIED: {optimization} to {skill} | VERSION: {new_version}",
  level=1,
  tags=["optimization", "applied"]
)
```

---

## Mission

Keep Genius Team at peak performance by:
1. Monitoring Claude Code updates and new features
2. Analyzing skill effectiveness
3. Proposing optimizations
4. Applying improvements with approval
5. Learning from usage patterns

---

## Optimization Framework

```
+---------------------------------------------+
|  OPTIMIZATION CYCLE                         |
+---------------------------------------------+
|  1. DISCOVER                                |
|     - Check Claude Code releases            |
|     - Monitor Anthropic announcements       |
|     - Review community best practices       |
|                                             |
|  2. ANALYZE                                 |
|     - Compare current vs optimal patterns   |
|     - Identify skill gaps                   |
|     - Measure effectiveness                 |
|                                             |
|  3. PROPOSE                                 |
|     - Generate improvement plan             |
|     - Estimate impact                       |
|     - Present to user for approval          |
|                                             |
|  4. IMPLEMENT                               |
|     - Apply approved changes                |
|     - Update skill files                    |
|     - Document changes                      |
|                                             |
|  5. VALIDATE                                |
|     - Test updated skills                   |
|     - Gather feedback                       |
|     - Iterate if needed                     |
+---------------------------------------------+
```

---

## Discovery Sources

### Claude Code Releases
```bash
# Check for updates
# Monitor: https://docs.anthropic.com/claude-code/changelog
# Look for: new tools, syntax changes, capability updates
```

### Anthropic Blog/Docs
- New prompting techniques
- Model capability updates
- Best practice recommendations

### Community Patterns
- GitHub discussions
- Effective prompts shared
- Performance optimizations

---

## Skill Analysis Metrics

### Effectiveness Score
```yaml
skill_metrics:
  genius-dev:
    trigger_accuracy: 0.92     # Correct activation rate
    completion_rate: 0.87      # Tasks completed successfully
    user_satisfaction: 0.89    # Based on feedback signals
    handoff_efficiency: 0.95   # Clean transitions

  genius-qa:
    trigger_accuracy: 0.88
    completion_rate: 0.91
    user_satisfaction: 0.85
    handoff_efficiency: 0.90
```

### Areas to Optimize
1. **Trigger patterns** - Are we catching all relevant inputs?
2. **Handoff protocols** - Are transitions smooth?
3. **Output quality** - Is the format optimal?
4. **Tool usage** - Are we using best tools for each task?
5. **Error handling** - How do we handle edge cases?

---

## Improvement Proposal Format

```markdown
# Skill Optimization Proposal

**Date:** 2025-01-29
**Skill:** genius-dev
**Impact:** High

## Discovered Opportunity
Claude Code now supports `Task tool with subagent_type` for parallel execution.
Currently genius-orchestrator doesn't fully leverage this.

## Proposed Change
Update genius-orchestrator to use parallel task execution:
1. Identify independent tasks
2. Spawn parallel subagents
3. Collect results asynchronously

## Expected Improvement
- Reduce build time by ~40%
- Better resource utilization
- Faster feedback loop

## Changes Required
- Update Task tool syntax
- Add dependency detection
- Modify progress tracking

## Risk Assessment
- Low risk: additive change
- Fallback: works without parallelism

## Approval Required
[ ] Approve and apply
[ ] Modify proposal
[ ] Reject
```

---

## Auto-Optimization Rules

### Safe Auto-Optimizations (No approval needed)
- Updating deprecated syntax
- Fixing broken links/references
- Updating version numbers
- Adding missing documentation

### Requires Approval
- Changing trigger patterns
- Modifying handoff protocols
- Adding new dependencies
- Significant workflow changes
- Changing memory integration

---

## Version Tracking

```yaml
# .genius/version.yaml
genius_team_version: "8.0.0"
last_optimization: "2025-01-29"
skills_updated:
  - skill: genius-dev
    version: "8.1.0"
    changes: "Added parallel task support"
    date: "2025-01-29"
  - skill: genius-qa
    version: "8.0.1"
    changes: "Updated Playwright patterns"
    date: "2025-01-28"
optimization_history:
  - date: "2025-01-29"
    proposals: 3
    approved: 2
    rejected: 1
    auto_applied: 5
```

---

## Changelog Generation

After optimizations:
```markdown
# Genius Team Changelog

## [8.1.0] - 2025-01-29

### Added
- genius-dev: Parallel task execution
- genius-qa: Visual regression testing support

### Changed
- genius-architect: Updated XML prompt format
- genius-orchestrator: Improved checkpoint handling

### Fixed
- genius-security: False positive in secret detection
- genius-memory: Memory persistence issue

### Deprecated
- Old markdown-only skill format (migrate to YAML frontmatter)
```

---

## Self-Assessment Report

```markdown
# Genius Team Health Report

**Generated:** 2025-01-29
**Period:** Last 30 days

## Overall Health: 87/100

## Skill Performance

| Skill | Triggers | Success | Issues |
|-------|----------|---------|--------|
| genius-dev | 145 | 94% | 2 |
| genius-qa | 67 | 89% | 5 |
| genius-architect | 34 | 97% | 0 |
| genius-orchestrator | 23 | 91% | 1 |

## Top Issues
1. genius-qa sometimes misses TypeScript errors
2. genius-dev handoff to qa incomplete
3. genius-memory retrieval sometimes slow

## Recommendations
1. Add tsc check to genius-qa pipeline
2. Improve handoff context in genius-dev
3. Implement memory caching

## Upcoming Optimizations
- [ ] Claude Code 2.x compatibility
- [ ] New streaming support
- [ ] Enhanced tool calling
```

---

## Sharp Edges

### Edge 1: Breaking Changes
```yaml
id: breaking-changes
summary: Optimization breaks existing functionality
severity: critical
detection: "Skill fails after update"
symptoms:
  - Tasks failing
  - Unexpected behavior
solution: |
  1. Test changes in isolation first
  2. Keep backup of previous version
  3. Rollback if issues detected
  4. Require approval for major changes
```

### Edge 2: Over-Optimization
```yaml
id: over-optimization
summary: Optimizing things that don't need it
severity: medium
detection: "Many changes, little impact"
symptoms:
  - Wasted effort
  - Unnecessary complexity
solution: |
  1. Focus on measurable improvements
  2. Prioritize by impact
  3. Skip minor optimizations
```

### Edge 3: Skipping Validation
```yaml
id: skip-validation
summary: Not testing after changes
severity: high
detection: "Changes applied without testing"
symptoms:
  - Broken skills
  - Regressions
solution: |
  ALWAYS test skills after changes.
  Run validation suite.
  Get user confirmation.
```

### Edge 4: Lost History
```yaml
id: lost-history
summary: Not tracking what was changed
severity: medium
detection: "No changelog entry"
symptoms:
  - Can't rollback
  - Can't understand changes
solution: |
  ALWAYS update:
  - version.yaml
  - CHANGELOG.md
  - mind_log() the change
```

---

## Validations

### V1: Approval for Major Changes
```yaml
trigger: "major optimization"
check: "User approval received"
severity: critical
message: "Major changes require user approval"
```

### V2: Testing After Changes
```yaml
trigger: "optimization applied"
check: "Skill tested and working"
severity: high
message: "Test skill after any changes"
```

### V3: Version Updated
```yaml
trigger: "optimization applied"
check: "version.yaml updated"
severity: medium
message: "Update version tracking"
```

### V4: Changelog Entry
```yaml
trigger: "optimization applied"
check: "CHANGELOG.md updated"
severity: medium
message: "Document all changes"
```

---

## Handoffs

### To genius-dev (for skill updates)
```yaml
provides:
  - Skill to update
  - Changes approved
  - Implementation details
handoff_format: |
  "Apply approved skill update:
   Skill: {skill_name}
   Changes: {diff}
   Version: {old} -> {new}

   Implement and test."
```

### To All Skills (broadcast update)
```yaml
provides:
  - New capability information
  - Updated patterns
handoff_format: |
  "Skill update broadcast:
   New feature available: {feature}
   Update your usage to: {new_pattern}
   Old pattern deprecated: {old_pattern}"
```

---

## Anti-Patterns

**DON'T:**
- Apply breaking changes without approval
- Optimize prematurely
- Ignore backward compatibility
- Skip validation after changes
- Forget to document changes

**DO:**
- Monitor continuously
- Propose with clear rationale
- Test changes thoroughly
- Maintain version history
- Learn from feedback

---

## Quick Commands

```bash
# Check for improvements
genius optimize check

# Show optimization proposals
genius optimize proposals

# Apply specific optimization
genius optimize apply [proposal-id]

# View health report
genius optimize health

# View changelog
genius optimize changelog
```

---

*"The best systems improve themselves."*
