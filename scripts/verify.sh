#!/bin/bash
# Genius Team v8.0 - Verification Script
# Verify that the environment is properly set up

echo "🔍 Genius Team v8.0 - Environment Verification"
echo "═══════════════════════════════════════════════════════════════"
echo ""

ERRORS=0
WARNINGS=0

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════
# 1. Check Project Structure
# ═══════════════════════════════════════════════════════════════
echo "📁 Checking project structure..."

check_dir() {
  if [ -d "$1" ]; then
    echo -e "  ${GREEN}✓${NC} $1"
  else
    echo -e "  ${RED}✗${NC} $1 (missing)"
    ERRORS=$((ERRORS + 1))
  fi
}

check_file() {
  if [ -f "$1" ]; then
    echo -e "  ${GREEN}✓${NC} $1"
  else
    echo -e "  ${RED}✗${NC} $1 (missing)"
    ERRORS=$((ERRORS + 1))
  fi
}

check_file_optional() {
  if [ -f "$1" ]; then
    echo -e "  ${GREEN}✓${NC} $1"
  else
    echo -e "  ${YELLOW}○${NC} $1 (optional)"
    WARNINGS=$((WARNINGS + 1))
  fi
}

check_file "CLAUDE.md"
check_dir ".claude"
check_file ".claude/settings.json"
check_dir ".claude/commands"
check_dir ".claude/agents"
check_dir ".claude/skills"
check_dir "scripts"

echo ""

# ═══════════════════════════════════════════════════════════════
# 2. Check Skills
# ═══════════════════════════════════════════════════════════════
echo "🎯 Checking skills..."

SKILLS=(
  "genius-team"
  "genius-interviewer"
  "genius-product-market-analyst"
  "genius-specs"
  "genius-designer"
  "genius-marketer"
  "genius-copywriter"
  "genius-integration-guide"
  "genius-architect"
  "genius-orchestrator"
  "genius-dev"
  "genius-qa"
  "genius-qa-micro"
  "genius-debugger"
  "genius-reviewer"
  "genius-security"
  "genius-deployer"
  "genius-memory"
  "genius-onboarding"
  "genius-test-assistant"
  "genius-team-optimizer"
)

SKILL_COUNT=0
for skill in "${SKILLS[@]}"; do
  if [ -f ".claude/skills/$skill/SKILL.md" ]; then
    SKILL_COUNT=$((SKILL_COUNT + 1))
  else
    echo -e "  ${RED}✗${NC} $skill (missing)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo -e "  ${GREEN}✓${NC} $SKILL_COUNT/${#SKILLS[@]} skills found"

echo ""

# ═══════════════════════════════════════════════════════════════
# 3. Check Commands
# ═══════════════════════════════════════════════════════════════
echo "⚡ Checking commands..."

COMMANDS=(
  "genius-start"
  "status"
  "continue"
  "reset"
)

for cmd in "${COMMANDS[@]}"; do
  check_file ".claude/commands/$cmd.md"
done

echo ""

# ═══════════════════════════════════════════════════════════════
# 4. Check Agents
# ═══════════════════════════════════════════════════════════════
echo "🤖 Checking agents..."

AGENTS=(
  "genius-dev"
  "genius-qa-micro"
  "genius-debugger"
  "genius-reviewer"
)

for agent in "${AGENTS[@]}"; do
  check_file ".claude/agents/$agent.md"
done

echo ""

# ═══════════════════════════════════════════════════════════════
# 5. Check MCP Configuration
# ═══════════════════════════════════════════════════════════════
echo "🔌 Checking MCP configuration..."

if [ -f "$HOME/.claude.json" ]; then
  echo -e "  ${GREEN}✓${NC} ~/.claude.json exists"

  # Check for Mind MCP
  if grep -q '"mind"' "$HOME/.claude.json" 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Mind MCP configured"
  else
    echo -e "  ${YELLOW}○${NC} Mind MCP not configured"
    WARNINGS=$((WARNINGS + 1))
  fi

  # Check for Spawner MCP
  if grep -q '"spawner"' "$HOME/.claude.json" 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Spawner MCP configured"
  else
    echo -e "  ${YELLOW}○${NC} Spawner MCP not configured"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "  ${YELLOW}○${NC} ~/.claude.json not found"
  echo "     Run: bash scripts/setup-vibeship.sh"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 6. Check Mind Installation
# ═══════════════════════════════════════════════════════════════
echo "🧠 Checking Mind MCP installation..."

MIND_DIR="$HOME/.vibeship/mind"
if [ -d "$MIND_DIR" ]; then
  echo -e "  ${GREEN}✓${NC} Mind installed at $MIND_DIR"
else
  echo -e "  ${YELLOW}○${NC} Mind not installed"
  echo "     Run: bash scripts/setup-vibeship.sh"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# 7. Check Project State Files
# ═══════════════════════════════════════════════════════════════
echo "📊 Checking project state files..."

check_file_optional ".genius/state.json"
check_file_optional ".mind/MEMORY.md"
check_file_optional "PROGRESS.md"
check_file_optional "KNOWLEDGE-BASE.md"
check_file_optional "DECISIONS.md"

echo ""

# ═══════════════════════════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════════════════════════
echo "═══════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Genius Team is ready. Run /genius-start to begin."
  else
    echo -e "${YELLOW}⚠️ $WARNINGS warning(s), but ready to use${NC}"
    echo ""
    echo "Some optional components are missing."
    echo "For full functionality, run: bash scripts/setup-vibeship.sh"
  fi
else
  echo -e "${RED}❌ $ERRORS error(s) found${NC}"
  echo ""
  echo "Please fix the errors above before using Genius Team."
  exit 1
fi

echo ""
