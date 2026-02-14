#!/bin/bash

# STREAK Deploy Script
# This script deploys the Solana program and initializes the game state

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SOLANA_CLI="${HOME}/.local/share/solana/install/active_release/bin/solana"
PROGRAM_PATH="target/deploy/streak.so"
KEYPAIR_PATH="target/deploy/streak-keypair.json"

echo -e "${GREEN}=== STREAK Deployment Script ===${NC}"
echo ""

# Check if Solana CLI is installed
if [ ! -f "$SOLANA_CLI" ]; then
    echo -e "${RED}Error: Solana CLI not found at $SOLANA_CLI${NC}"
    exit 1
fi

# Check balance
BALANCE=$($SOLANA_CLI balance)
echo -e "Current balance: ${YELLOW}$BALANCE${NC}"

# Check if program binary exists
if [ ! -f "$PROGRAM_PATH" ]; then
    echo -e "${RED}Error: Program binary not found at $PROGRAM_PATH${NC}"
    echo "Run 'anchor build --no-idl' first."
    exit 1
fi

# Get program size
PROGRAM_SIZE=$(ls -l "$PROGRAM_PATH" | awk '{print $5}')
echo "Program size: $PROGRAM_SIZE bytes"

# Estimate required SOL (rough estimate: ~7 lamports per byte + buffer)
REQUIRED_LAMPORTS=$((PROGRAM_SIZE * 7 + 1000000000))
REQUIRED_SOL=$(echo "scale=4; $REQUIRED_LAMPORTS / 1000000000" | bc)
echo "Estimated required: ~${REQUIRED_SOL} SOL"

# Confirm deployment
echo ""
echo -e "${YELLOW}Ready to deploy STREAK program to devnet.${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Deploy
echo ""
echo -e "${GREEN}Deploying program...${NC}"
$SOLANA_CLI program deploy "$PROGRAM_PATH"

# Get program ID
PROGRAM_ID=$($SOLANA_CLI address -k "$KEYPAIR_PATH")
echo ""
echo -e "${GREEN}Program deployed successfully!${NC}"
echo -e "Program ID: ${YELLOW}$PROGRAM_ID${NC}"

# Save program ID
echo "$PROGRAM_ID" > .program-id
echo "Program ID saved to .program-id"

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. Update app/src/lib/constants.ts with the program ID"
echo "2. Initialize the game state using the initialize instruction"
echo "3. Run 'npm run dev' to test the frontend"
