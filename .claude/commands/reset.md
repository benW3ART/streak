---
description: Reset Genius Team project (with backup and confirmation)
---

# /reset

Start the project over with confirmation.

## Execution

### Step 1: Confirm Reset

```
⚠️ **Reset Project**

This will:
- Create a backup of current state in .genius/backups/
- Reset .genius/state.json to NOT_STARTED
- Clear PROGRESS.md

This will NOT:
- Delete generated files (DISCOVERY.xml, etc.)
- Clear memory (.mind/)
- Remove code files

Are you sure? Type "yes" to confirm or "no" to cancel.
```

### Step 2: If Confirmed

```bash
# Create backup
mkdir -p .genius/backups
BACKUP_DIR=".genius/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp .genius/state.json "$BACKUP_DIR/" 2>/dev/null
cp PROGRESS.md "$BACKUP_DIR/" 2>/dev/null
cp .claude/plan.md "$BACKUP_DIR/" 2>/dev/null

# Reset state
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

# Clear progress
rm -f PROGRESS.md
rm -f .claude/plan.md

echo "✅ Reset complete. Backup saved to $BACKUP_DIR"
```

### Step 3: Log Reset

```python
mind_log(
  content="PROJECT RESET: Backup saved | Ready for fresh start",
  level=1,
  tags=["reset", "session"]
)
```

### Step 4: Show Ready State

```
🔄 **Project Reset Complete**

Backup saved to: .genius/backups/{timestamp}/

The project is ready to start fresh.

Existing files preserved:
{list any DISCOVERY.xml, SPECIFICATIONS.xml, etc. if present}

Memory preserved:
{summary from .mind/MEMORY.md}

Say "I want to build [idea]" to begin a new project,
or describe what you want to do differently this time.
```

### Step 5: If Not Confirmed

```
Reset cancelled. Project state unchanged.

Use /status to see current progress.
```
