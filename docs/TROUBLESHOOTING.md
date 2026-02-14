# Troubleshooting

## Quick Diagnostics

Run these commands to check your setup:

```bash
# Verify Genius Team installation
bash scripts/verify.sh

# Check Claude Code version
claude --version

# Check MCP config
cat ~/.claude.json

# Check Mind installation
ls ~/.vibeship/mind
```

---

## Common Issues

### 1. Skills Not Loading

**Symptoms**: Claude doesn't recognize skill commands, skills don't trigger

**Solution**:
```bash
# Check skills exist
ls .claude/skills/ | wc -l
# Should be 21

# Check SKILL.md files
find .claude/skills -name "SKILL.md" | wc -l
# Should be 21

# Verify skill format (should have frontmatter)
head -5 .claude/skills/genius-team/SKILL.md
```

---

### 2. Mind MCP Not Working

**Symptoms**: `mind_recall()` fails, memory not persisting

**Check MCP status**:
```
/mcp
```

**If Mind not connected**:

1. Verify Mind is installed:
```bash
ls ~/.vibeship/mind
```

2. Verify ~/.claude.json config:
```json
{
  "mcpServers": {
    "mind": {
      "command": "uv",
      "args": ["--directory", "/Users/YOU/.vibeship/mind", "run", "mind", "mcp"]
    }
  }
}
```

3. Re-run setup:
```bash
bash scripts/setup-vibeship.sh
```

4. Restart Claude Code

---

### 3. Spawner Not Responding

**Symptoms**: Can't access 462+ skills, spawner commands fail

**Solution**:
```bash
# Check network access
curl -I https://mcp.vibeship.co

# Or install local skills
npx -y github:vibeforge1111/vibeship-spawner-skills install
```

---

### 4. State Not Persisting

**Symptoms**: Project forgets where it was, checkpoints reset

**Solution**:
```bash
# Check state file exists
cat .genius/state.json

# If corrupted, recreate:
rm .genius/state.json
# Then run /genius-start
```

---

### 5. Execution Stops Unexpectedly

**Symptoms**: genius-orchestrator stops before completing all tasks

**Check**:
```bash
# Check progress
cat PROGRESS.md

# Check plan
cat .claude/plan.md | grep -c "\[ \]"
# Shows remaining tasks
```

**Solution**:
- Run `/continue` to resume
- If stuck, check error logs in PROGRESS.md
- Use `/reset` as last resort

---

### 6. Memory Triggers Not Working

**Symptoms**: "Remember that..." doesn't save

**Solution**:
- Ensure Mind MCP is connected
- Check exact phrasing (case-sensitive)
- Verify `.mind/` directory exists

Manual fallback:
```bash
echo "## Manual Entry" >> KNOWLEDGE-BASE.md
echo "- Your note here" >> KNOWLEDGE-BASE.md
```

---

### 7. Hooks Not Executing

**Symptoms**: SessionStart doesn't load context, PreCompact doesn't preserve state

**Check**:
```bash
# Verify settings.json has hooks
cat .claude/settings.json | grep -A5 "hooks"
```

**Solution**:
```bash
# Validate JSON syntax
python3 -c "import json; json.load(open('.claude/settings.json'))"
```

---

### 8. Permission Errors

**Symptoms**: Can't run bash commands, file operations blocked

**Solution**:
Check `.claude/settings.json` permissions:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)"
    ]
  }
}
```

---

### 9. Wrong Model Being Used

**Symptoms**: Responses seem different, capabilities missing

**Check current model**:
Look at Claude Code status bar or run `/model`

**Solution**:
Genius Team works best with Claude Sonnet or Opus.

---

### 10. TypeScript Errors in Generated Code

**Symptoms**: `any` types, type mismatches

**Solution**:
1. Check project has tsconfig.json with strict mode
2. Ensure genius-dev skill is using TypeScript standards
3. Run: `npx tsc --noEmit` to see all errors

---

## Debug Mode

Enable verbose logging:

```bash
# In your session
export GENIUS_DEBUG=1
```

This will show:
- Skill transitions
- Memory operations
- State changes

---

## Nuclear Reset

If nothing works, full reset:

```bash
# Backup current state
cp -r .genius .genius.backup
cp -r .mind .mind.backup

# Remove state files
rm -rf .genius .mind
rm -f PROGRESS.md KNOWLEDGE-BASE.md DECISIONS.md

# Recreate
mkdir -p .genius .mind
/genius-start
```

---

## Getting Help

1. **Check the docs**: README.md, SKILLS.md, GETTING-STARTED.md
2. **Run diagnostics**: `bash scripts/verify.sh`
3. **Check MCP status**: `/mcp`
4. **Review logs**: PROGRESS.md, .mind/MEMORY.md

---

## Reporting Issues

When reporting issues, include:

```
Claude Code version:
Genius Team version: 8.0.0
OS:
Error message:
Steps to reproduce:
Output of: bash scripts/verify.sh
```
