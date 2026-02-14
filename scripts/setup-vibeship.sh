#!/bin/bash
# Genius Team v8.0 - Vibeship Setup
# Installs Mind MCP + Spawner + configures Claude Code
set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🧠 Genius Team v8.0 - Vibeship Setup                      ║"
echo "║  Mind MCP + Spawner + Scanner Integration                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════
# 1. Check Prerequisites
# ═══════════════════════════════════════════════════════════════
echo "📋 Checking prerequisites..."

# Python 3
if ! command -v python3 &>/dev/null; then
  echo -e "${RED}❌ Python 3 required${NC}"
  echo "   Install: https://www.python.org/downloads/"
  exit 1
fi
echo -e "${GREEN}✓${NC} Python 3 $(python3 --version | cut -d' ' -f2)"

# Node.js
if ! command -v node &>/dev/null; then
  echo -e "${RED}❌ Node.js required${NC}"
  echo "   Install: https://nodejs.org/"
  exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node --version)"

# Git
if ! command -v git &>/dev/null; then
  echo -e "${RED}❌ Git required${NC}"
  exit 1
fi
echo -e "${GREEN}✓${NC} Git $(git --version | cut -d' ' -f3)"

# uv (for Mind MCP)
if ! command -v uv &>/dev/null; then
  echo -e "${YELLOW}⚠️ uv not found. Installing...${NC}"
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.cargo/bin:$PATH"
  export PATH="$HOME/.local/bin:$PATH"
fi
echo -e "${GREEN}✓${NC} uv installed"

echo ""

# ═══════════════════════════════════════════════════════════════
# 2. Install Mind MCP
# ═══════════════════════════════════════════════════════════════
echo "📦 ${BLUE}Installing Mind MCP (memory)...${NC}"
MIND_DIR="$HOME/.vibeship/mind"

if [ -d "$MIND_DIR" ]; then
  echo -e "${GREEN}✓${NC} Mind already installed at $MIND_DIR"
  echo "   Updating..."
  cd "$MIND_DIR" && git pull 2>/dev/null || true
else
  mkdir -p "$HOME/.vibeship"
  git clone https://github.com/vibeforge1111/vibeship-mind.git "$MIND_DIR" 2>/dev/null || {
    echo -e "${YELLOW}⚠️ Clone failed, trying alternative method...${NC}"
    mkdir -p "$MIND_DIR"
    curl -L https://github.com/vibeforge1111/vibeship-mind/archive/main.tar.gz | tar -xz -C "$MIND_DIR" --strip-components=1
  }
fi

cd "$MIND_DIR"
uv sync 2>/dev/null || echo -e "${YELLOW}⚠️ uv sync failed, will try on first run${NC}"
echo -e "${GREEN}✓${NC} Mind installed → $MIND_DIR"

# ═══════════════════════════════════════════════════════════════
# 3. Install Spawner Skills (optional - via MCP)
# ═══════════════════════════════════════════════════════════════
echo "📦 ${BLUE}Installing Spawner (462 skills)...${NC}"
SPAWNER_DIR="$HOME/.spawner/skills"

if [ -d "$SPAWNER_DIR" ] && [ "$(ls -A $SPAWNER_DIR 2>/dev/null)" ]; then
  echo -e "${GREEN}✓${NC} Spawner skills already installed"
else
  echo "   Spawner uses remote MCP by default: https://mcp.vibeship.co"
  echo "   For offline mode, run:"
  echo "   npx -y github:vibeforge1111/vibeship-spawner-skills install"
fi
echo -e "${GREEN}✓${NC} Spawner configured (remote MCP)"

# ═══════════════════════════════════════════════════════════════
# 4. Configure MCP in Claude
# ═══════════════════════════════════════════════════════════════
echo "⚙️ ${BLUE}Configuring MCP servers...${NC}"
CLAUDE_CONFIG="$HOME/.claude.json"

# Backup existing config
if [ -f "$CLAUDE_CONFIG" ]; then
  cp "$CLAUDE_CONFIG" "$CLAUDE_CONFIG.backup.$(date +%Y%m%d%H%M%S)"
  echo -e "${YELLOW}📄 Backed up existing config${NC}"

  # Try to merge with existing config
  if command -v jq &>/dev/null; then
    echo "   Merging with existing config..."
    EXISTING=$(cat "$CLAUDE_CONFIG")

    # Add MCP servers to existing config
    echo "$EXISTING" | jq --arg mind_dir "$MIND_DIR" '
      .mcpServers = (.mcpServers // {}) + {
        "mind": {
          "command": "uv",
          "args": ["--directory", $mind_dir, "run", "mind", "mcp"]
        },
        "spawner": {
          "command": "npx",
          "args": ["-y", "mcp-remote", "https://mcp.vibeship.co"]
        }
      }
    ' > "$CLAUDE_CONFIG"
    echo -e "${GREEN}✓${NC} MCPs added to existing config"
  else
    # jq not available, create new config
    cat > "$CLAUDE_CONFIG" << EOF
{
  "mcpServers": {
    "mind": {
      "command": "uv",
      "args": ["--directory", "$MIND_DIR", "run", "mind", "mcp"]
    },
    "spawner": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.vibeship.co"]
    }
  }
}
EOF
    echo -e "${GREEN}✓${NC} MCP config created"
  fi
else
  # Create new config
  cat > "$CLAUDE_CONFIG" << EOF
{
  "mcpServers": {
    "mind": {
      "command": "uv",
      "args": ["--directory", "$MIND_DIR", "run", "mind", "mcp"]
    },
    "spawner": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.vibeship.co"]
    }
  }
}
EOF
  echo -e "${GREEN}✓${NC} MCP config created → ~/.claude.json"
fi

# ═══════════════════════════════════════════════════════════════
# 5. Initialize Mind
# ═══════════════════════════════════════════════════════════════
echo "🧠 ${BLUE}Initializing Mind...${NC}"
cd "$MIND_DIR"
uv run mind init 2>/dev/null && {
  echo -e "${GREEN}✓${NC} Mind initialized"
} || {
  echo -e "${YELLOW}⚠️ Mind init will run on first use${NC}"
}

# ═══════════════════════════════════════════════════════════════
# 6. Summary
# ═══════════════════════════════════════════════════════════════
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Components installed:"
echo -e "  ${GREEN}✓${NC} Mind MCP      → $MIND_DIR"
echo -e "  ${GREEN}✓${NC} Spawner       → Remote MCP (https://mcp.vibeship.co)"
echo -e "  ${GREEN}✓${NC} MCP Config    → ~/.claude.json"
echo ""
echo "Next steps:"
echo ""
echo -e "  1. ${YELLOW}Restart Claude Code${NC}"
echo ""
echo -e "  2. In your project, run: ${YELLOW}/genius-start${NC}"
echo ""
echo -e "  3. Verify MCPs: ${YELLOW}/mcp${NC}"
echo "     Should show: mind ✓, spawner ✓"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Additional tools (optional):"
echo ""
echo -e "  ${BLUE}Security Scanner:${NC} https://scanner.vibeship.co/"
echo -e "  ${BLUE}Supabase Scanner:${NC} https://suparalph.vibeship.co/"
echo -e "  ${BLUE}Idea Generator:${NC}   https://idearalph.vibeship.co/"
echo ""
