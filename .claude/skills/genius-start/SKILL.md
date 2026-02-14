# /genius-start

Initialize Genius Team environment, load context, and **hydrate tasks** for longer work loops.

## The Hydration Pattern

Claude Code Tasks are session-scoped (disappear when you close terminal). Genius Team uses the **hydration pattern**:
- `.claude/plan.md` = Persistent task source of truth
- `PROGRESS.md` = Persistent progress tracking
- Session Tasks = Ephemeral execution (auto-synced back to files)

## Execution

### Step 1: Verify MCPs

Check MCP availability by running `/mcp` command or checking for Mind/Spawner tools.

**If Mind MCP connected:**
```
mind_recall()
```
Load returned context (MEMORY.md + SESSION.md + REMINDERS.md).

**If MCPs not connected, show setup instructions:**
```
⚠️ Vibeship MCPs not detected.

To install (one-time setup):

1. Run the setup script:
   bash scripts/setup-vibeship.sh

2. Or manually configure ~/.claude.json:
   {
     "mcpServers": {
       "mind": {
         "command": "uv",
         "args": ["--directory", "~/.vibeship/mind", "run", "mind", "mcp"]
       },
       "spawner": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://mcp.vibeship.co"]
       }
     }
   }

3. Restart Claude Code

Continuing without MCPs - memory will be file-based only.
```

### Step 2: Check Project State

```bash
# Check for existing state
cat .genius/state.json 2>/dev/null || echo "No state yet"

# Check for memory files
ls -la .mind/ 2>/dev/null || echo "No memory yet"

# Check for project artifacts
ls DISCOVERY.xml SPECIFICATIONS.xml ARCHITECTURE.md .claude/plan.md 2>/dev/null
```

### Step 3: Initialize State if Needed

If `.genius/state.json` doesn't exist:
```bash
mkdir -p .genius .mind

cat > .genius/state.json << 'EOF'
{
  "version": "8.0.0",
  "phase": "NOT_STARTED",
  "currentSkill": null,
  "checkpoints": {
    "discovery": false,
    "specs_approved": false,
    "design_chosen": false,
    "architecture_approved": false,
    "execution_started": false,
    "qa_passed": false,
    "deployed": false
  },
  "artifacts": {},
  "created_at": "{{ISO_DATE}}",
  "updated_at": "{{ISO_DATE}}"
}
EOF
```

### Step 4: Display Status

```
╔════════════════════════════════════════════════════════════╗
║  🧠 Genius Team v8.0 - Environment Ready                   ║
╚════════════════════════════════════════════════════════════╝

MCPs:
  • Mind:    {✅ Connected | ⚠️ Not connected (file-based fallback)}
  • Spawner: {✅ Connected | ⚠️ Not connected}

Memory:
  {Summary from mind_recall() or "Empty - new session"}

Project State:
  Phase: {phase}
  Current: {currentSkill or "Ready to start"}

Artifacts:
  {List of existing files: DISCOVERY.xml, SPECIFICATIONS.xml, etc.}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready! What would you like to do?

  💡 "I want to build [idea]"     → Start new project
  📋 "/status"                    → See detailed progress
  ▶️  "continue"                  → Resume where we left off
  🔧 "/reset"                     → Start over

```

### Step 5: Hydrate Tasks (If Execution Phase)

If `.claude/plan.md` exists and phase is EXECUTION:

```bash
# Count tasks from plan.md
if [ -f .claude/plan.md ]; then
  total=$(grep -c "^- \[" .claude/plan.md 2>/dev/null || echo "0")
  completed=$(grep -c "^- \[x\]" .claude/plan.md 2>/dev/null || echo "0")
  in_progress=$(grep -c "^- \[~\]" .claude/plan.md 2>/dev/null || echo "0")
  pending=$(grep -c "^- \[ \]" .claude/plan.md 2>/dev/null || echo "0")
  blocked=$(grep -c "^- \[!\]" .claude/plan.md 2>/dev/null || echo "0")

  echo "📋 Tasks Hydrated: $completed/$total complete"

  # Find next pending task
  next_task=$(grep -m1 "^- \[ \]" .claude/plan.md 2>/dev/null | sed 's/^- \[ \] //')
  if [ -n "$next_task" ]; then
    echo "⏭️ Next: $next_task"
  fi
fi
```

Display hydrated task status:
```
Tasks (from .claude/plan.md):
  ├── ✅ Completed: {completed}
  ├── 🔄 In Progress: {in_progress}
  ├── ⏳ Pending: {pending}
  └── ⚠️ Blocked: {blocked}

{If in_progress > 0: "⚡ Resuming: {in_progress_task}"}
{If pending > 0: "⏭️ Next: {next_pending_task}"}
```

### Step 6: Wait for User Input

After displaying status, wait for user to indicate what they want to do.
Route to appropriate skill based on their response using genius-team router.

## Task Sync-Back Protocol

During execution, Genius Team automatically syncs task status:

1. **On task start**: Update plan.md `[ ]` → `[~]`
2. **On task complete**: Update plan.md `[~]` → `[x]`
3. **On task blocked**: Update plan.md `[~]` → `[!]`
4. **Update PROGRESS.md**: Add timestamps and notes

This ensures you can close the terminal anytime and resume later with `/genius-start`.
