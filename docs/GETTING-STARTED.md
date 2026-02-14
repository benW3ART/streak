# Getting Started with Genius Team

## Prerequisites

Before you begin, make sure you have:

- **Claude Code** 2.1 or later
- **Node.js** 18 or later
- **Python** 3.10 or later
- **Git** installed

## Setup (5 minutes)

### Step 1: Clone or Copy the Repository

```bash
# Option A: Clone from GitHub
git clone https://github.com/your-username/genius-team.git my-project
cd my-project

# Option B: Copy an existing Genius Team folder
cp -r genius-team my-project
cd my-project
```

### Step 2: Install Vibeship MCPs (One-time)

```bash
bash scripts/setup-vibeship.sh
```

This installs:
- **Mind MCP** - Persistent memory across sessions
- **Spawner MCP** - Access to 462+ expert skills

### Step 3: Restart Claude Code

Close and reopen Claude Code to load the new MCPs.

### Step 4: Verify Installation

Run the verification script:
```bash
bash scripts/verify.sh
```

Or in Claude Code:
```
/genius-start
```

## Your First Project

### 1. Start the Conversation

Open Claude Code in your project folder and type:

```
/genius-start
```

You'll see:
```
╔════════════════════════════════════════════════════════════╗
║  🧠 Genius Team v8.0 - Environment Ready                   ║
╚════════════════════════════════════════════════════════════╝

MCPs:
  • Mind:    ✅ Connected
  • Spawner: ✅ Connected

Ready! What would you like to do?
```

### 2. Describe Your Project

Simply tell Genius Team what you want to build:

```
I want to build a booking system for a hair salon
```

### 3. Answer Questions

The AI will interview you to understand your needs:
- What problem does it solve?
- Who are your users?
- What features do you need?
- What's your timeline?

### 4. Review and Approve

At key milestones, you'll be asked to approve:

1. **Specifications** - "Do these specs look right?"
2. **Design** - "Which design option do you prefer?"
3. **Architecture** - "Ready to start building?"

### 5. Watch It Build

Once approved, Genius Team builds your project autonomously:
- Creates all the code
- Tests everything
- Fixes any errors
- Reports progress

### 6. Deploy

When ready:
```
Deploy to staging
```

## Key Commands

| Command | What It Does |
|---------|--------------|
| `/genius-start` | Initialize and show status |
| `/status` | Show progress |
| `/continue` | Resume from last point |
| `/reset` | Start over |
| `STOP` | Pause execution |

## Tips for Best Results

### Be Specific
Instead of: "Build me an app"
Say: "Build a task management app for freelancers with time tracking"

### Use Memory Triggers
- "Remember that we're using Supabase"
- "We decided to go with Stripe for payments"
- "This broke because of a CORS issue"

### Let It Complete
During execution, avoid interrupting unless necessary. The AI handles errors automatically.

### Review Checkpoints
Take time to review specifications and architecture before approving. It's easier to change plans than code.

## Common Issues

### MCPs Not Loading

```bash
# Verify installation
bash scripts/verify.sh

# Re-run setup
bash scripts/setup-vibeship.sh

# Restart Claude Code
```

### Memory Not Persisting

Make sure Mind MCP is configured in `~/.claude.json`:
```json
{
  "mcpServers": {
    "mind": {
      "command": "uv",
      "args": ["--directory", "~/.vibeship/mind", "run", "mind", "mcp"]
    }
  }
}
```

### Skills Not Found

Check that `.claude/skills/` contains all 21 skill folders:
```bash
ls .claude/skills/ | wc -l
# Should be 21
```

## Next Steps

- Read [SKILLS.md](SKILLS.md) to understand each skill
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- Customize your [USER-PROFILE.yaml](../templates/global/USER-PROFILE.yaml)

---

Happy building! 🚀
