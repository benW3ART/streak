# Implementation Plan

**Project:** STREAK
**Created:** 2026-01-29
**Timeline:** 3 days
**Status:** Ready for execution

---

## Phase 1: Project Setup

### Task 1.1: Initialize Monorepo Structure
**Status:** [ ] Pending
**Priority:** Critical

Create workspace structure with `app/` for Next.js and `programs/` for Anchor.

**Steps:**
1. Create root package.json with workspaces
2. Create `app/` directory for Next.js PWA
3. Create `programs/streak/` directory for Anchor program
4. Initialize git (if not already)

**Verification:**
- Directory structure matches ARCHITECTURE.md
- `npm install` works from root

**Files Created:**
- package.json (root)
- app/ (directory)
- programs/streak/ (directory)

---

### Task 1.2: Initialize Next.js PWA
**Status:** [ ] Pending
**Depends On:** 1.1

**Steps:**
1. Run `npx create-next-app@latest app --typescript --tailwind --eslint --app --src-dir --use-npm`
2. Configure for PWA (next-pwa or manual manifest)
3. Add path aliases in tsconfig.json
4. Install dependencies: `@solana/web3.js`, `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets`, `@coral-xyz/anchor`

**Verification:**
- `cd app && npm run dev` starts server
- `npm run build` succeeds

**Files Created:**
- app/package.json
- app/tsconfig.json
- app/next.config.js
- app/tailwind.config.ts
- app/src/app/manifest.ts

---

### Task 1.3: Initialize Anchor Program
**Status:** [ ] Pending
**Depends On:** 1.1

**Steps:**
1. Run `anchor init streak --no-git` in programs/
2. Configure Anchor.toml for devnet/mainnet
3. Set up program ID placeholder
4. Create folder structure: state/, instructions/, errors.rs, constants.rs

**Verification:**
- `anchor build` succeeds (empty program)
- Program compiles without errors

**Files Created:**
- programs/streak/Cargo.toml
- programs/streak/Anchor.toml
- programs/streak/src/lib.rs
- programs/streak/src/state/mod.rs
- programs/streak/src/instructions/mod.rs

---

### Task 1.4: Configure Design Tokens
**Status:** [ ] Pending
**Depends On:** 1.2

**Steps:**
1. Update tailwind.config.ts with STREAK colors from brand identity
2. Add custom fonts (Bebas Neue, Space Mono, Inter)
3. Create src/lib/design-tokens.ts with CSS variables
4. Add font imports to layout.tsx

**Verification:**
- Tailwind classes like `bg-streak-orange` work
- Fonts render correctly

**Files Modified:**
- app/tailwind.config.ts
- app/src/app/layout.tsx
- app/src/lib/design-tokens.ts

---

## Phase 2: Solana Program (Core)

### Task 2.1: Define State Accounts
**Status:** [ ] Pending
**Depends On:** 1.3

**Steps:**
1. Create `state/game_state.rs` with GameState struct
2. Create `state/player.rs` with Player struct
3. Add account sizes, PDA seeds
4. Export from state/mod.rs

**Verification:**
- `anchor build` succeeds
- Account sizes are calculated correctly

**Files Created:**
- programs/streak/src/state/game_state.rs
- programs/streak/src/state/player.rs

---

### Task 2.2: Implement Initialize Instruction
**Status:** [ ] Pending
**Depends On:** 2.1

**Steps:**
1. Create `instructions/initialize.rs`
2. Define Initialize context with game_state PDA
3. Set authority, treasury, initial values
4. Add to lib.rs

**Verification:**
- Unit test passes
- GameState account created on devnet

**Files Created:**
- programs/streak/src/instructions/initialize.rs

---

### Task 2.3: Implement Stake Instruction
**Status:** [ ] Pending
**Depends On:** 2.2

**Steps:**
1. Create `instructions/stake.rs`
2. Validate minimum stake (0.05 SOL)
3. Create Player PDA account
4. Transfer SOL to game vault
5. Handle referral relationship if provided
6. Handle grace period (after 23:55 UTC)
7. Increment total_players

**Verification:**
- Can stake 0.05 SOL, Player account created
- Referral recorded correctly
- Fails below minimum

**Files Created:**
- programs/streak/src/instructions/stake.rs

---

### Task 2.4: Implement Checkin Instruction
**Status:** [ ] Pending
**Depends On:** 2.3

**Steps:**
1. Create `instructions/checkin.rs`
2. Verify player is active
3. Verify hasn't checked in today (UTC day comparison)
4. Increment streak_days
5. Apply 0.1% growth to stake
6. Update last_checkin timestamp

**Verification:**
- Check-in increments streak
- Stake grows by 0.1%
- Cannot check in twice same day

**Files Created:**
- programs/streak/src/instructions/checkin.rs

---

### Task 2.5: Implement Process Death Instruction
**Status:** [ ] Pending
**Depends On:** 2.4

**Steps:**
1. Create `instructions/process_death.rs`
2. Verify player missed previous day (permissionless crank)
3. Check for lifelines - if has lifeline, consume it and return
4. Calculate distributions: 3% treasury, 5% x3 levels referrers
5. Transfer stake to pool/treasury/referrers
6. Mark player as inactive
7. Update global stats

**Verification:**
- Dead player stake goes to pool
- Referrers receive 5% each level
- Lifeline saves player if available

**Files Created:**
- programs/streak/src/instructions/process_death.rs

---

### Task 2.6: Implement Withdraw Instruction
**Status:** [ ] Pending
**Depends On:** 2.4

**Steps:**
1. Create `instructions/withdraw.rs`
2. Verify player is active
3. Transfer full stake + pending rewards back to user
4. Close player account or mark inactive
5. Decrement total_players

**Verification:**
- User receives full stake
- Player account closed/reset

**Files Created:**
- programs/streak/src/instructions/withdraw.rs

---

### Task 2.7: Implement Bonus Window Instructions
**Status:** [ ] Pending
**Depends On:** 2.4

**Steps:**
1. Create `instructions/start_bonus_window.rs` (authority only)
2. Set current_bonus_window ID and bonus_window_end (now + 15 min)
3. Create `instructions/claim_bonus.rs`
4. Verify window is active
5. Verify player hasn't claimed this window
6. Apply 0.05% growth, update last_bonus_claimed

**Verification:**
- Authority can start window
- Players can claim bonus during window
- Cannot claim twice per window

**Files Created:**
- programs/streak/src/instructions/start_bonus_window.rs
- programs/streak/src/instructions/claim_bonus.rs

---

### Task 2.8: Implement Claim Rewards Instruction
**Status:** [ ] Pending
**Depends On:** 2.5

**Steps:**
1. Create `instructions/claim_rewards.rs`
2. Transfer pending_rewards to user
3. Reset pending_rewards to 0

**Verification:**
- User receives pending rewards
- pending_rewards zeroed

**Files Created:**
- programs/streak/src/instructions/claim_rewards.rs

---

### Task 2.9: Add Error Handling
**Status:** [ ] Pending
**Depends On:** 2.3

**Steps:**
1. Create `errors.rs` with all custom errors
2. AlreadyStaked, BelowMinimum, NotStaked, AlreadyCheckedIn, PlayerNotDead, WindowClosed, AlreadyClaimed, etc.
3. Use in all instructions

**Verification:**
- Errors return correct codes
- Error messages are clear

**Files Created:**
- programs/streak/src/errors.rs

---

### Task 2.10: Deploy to Devnet
**Status:** [ ] Pending
**Depends On:** 2.1-2.9

**Steps:**
1. `anchor build`
2. `anchor deploy --provider.cluster devnet`
3. Note program ID
4. Run initialize with authority wallet
5. Update constants in frontend

**Verification:**
- Program deployed to devnet
- GameState initialized
- Can stake/checkin via CLI or test

---

## Phase 3: Frontend Core

### Task 3.1: Set Up Wallet Provider
**Status:** [ ] Pending
**Depends On:** 1.2, 1.4

**Steps:**
1. Create `src/lib/solana/provider.tsx`
2. Configure WalletProvider with Mobile Wallet Adapter
3. Add Phantom, Solflare, Backpack adapters
4. Wrap app in layout.tsx

**Verification:**
- Wallet connect button works
- Seed Vault connects on Seeker

**Files Created:**
- app/src/lib/solana/provider.tsx
- app/src/app/layout.tsx (modified)

---

### Task 3.2: Create Program Client
**Status:** [ ] Pending
**Depends On:** 2.10, 3.1

**Steps:**
1. Create `src/lib/solana/program.ts`
2. Import IDL from anchor build
3. Create useProgram hook
4. Add helper functions for PDAs

**Verification:**
- Can fetch GameState
- Can derive Player PDA

**Files Created:**
- app/src/lib/solana/program.ts
- app/src/lib/solana/idl.json (copy from target/)

---

### Task 3.3: Create Player Hook
**Status:** [ ] Pending
**Depends On:** 3.2

**Steps:**
1. Create `src/hooks/usePlayer.ts`
2. Fetch player account by wallet
3. Return player state + loading + refetch
4. Handle "not found" (new user)

**Verification:**
- Returns player data for existing user
- Returns null for new user

**Files Created:**
- app/src/hooks/usePlayer.ts

---

### Task 3.4: Create Game State Hook
**Status:** [ ] Pending
**Depends On:** 3.2

**Steps:**
1. Create `src/hooks/useGameState.ts`
2. Fetch GameState account
3. Return total_players, total_pool, last_death, bonus window status

**Verification:**
- Returns current game state
- Updates on refetch

**Files Created:**
- app/src/hooks/useGameState.ts

---

### Task 3.5: Build UI Components
**Status:** [ ] Pending
**Depends On:** 1.4

**Steps:**
1. Create Button.tsx (primary, secondary, success, danger states)
2. Create Card.tsx
3. Create Badge.tsx (lifeline, referral)
4. Create Slider.tsx (stake amount)
5. Create BottomNav.tsx
6. Create Logo.tsx (STREAK with orange A)

**Verification:**
- Components match design system
- All variants work

**Files Created:**
- app/src/components/ui/Button.tsx
- app/src/components/ui/Card.tsx
- app/src/components/ui/Badge.tsx
- app/src/components/ui/Slider.tsx
- app/src/components/layout/BottomNav.tsx
- app/src/components/layout/Logo.tsx

---

### Task 3.6: Build Day Counter Component
**Status:** [ ] Pending
**Depends On:** 3.5

**Steps:**
1. Create DayCounter.tsx
2. Large Bebas Neue number
3. Color states: orange (alive), red (danger), green (success), white (dead)
4. Glow animation

**Verification:**
- Renders correctly in all states
- Animation works

**Files Created:**
- app/src/components/streak/DayCounter.tsx

---

### Task 3.7: Build Timer Component
**Status:** [ ] Pending
**Depends On:** 3.5

**Steps:**
1. Create Timer.tsx
2. Create useCountdown hook for live countdown
3. Show time until midnight UTC (if checked in) or deadline (if not)
4. Danger state when < 1 hour

**Verification:**
- Counts down in real-time
- Switches to danger state correctly

**Files Created:**
- app/src/components/streak/Timer.tsx
- app/src/hooks/useCountdown.ts

---

### Task 3.8: Build Check-in Button
**Status:** [ ] Pending
**Depends On:** 3.5, 3.3

**Steps:**
1. Create CheckinButton.tsx
2. States: CHECK IN, CHECKING IN... (loading), DAY X COMPLETE (success), disabled
3. Call checkin instruction on click
4. Pulse animation when available

**Verification:**
- Calls program on click
- Shows loading state
- Shows success after confirm

**Files Created:**
- app/src/components/streak/CheckinButton.tsx

---

### Task 3.9: Build Stake Slider Component
**Status:** [ ] Pending
**Depends On:** 3.5

**Steps:**
1. Create StakeSlider.tsx
2. Min 0.05 SOL, max = balance - 0.01
3. Show selected amount
4. STAKE AND BEGIN button

**Verification:**
- Slider works with correct range
- Amount updates on slide

**Files Created:**
- app/src/components/streak/StakeSlider.tsx

---

### Task 3.10: Build Bonus Banner Component
**Status:** [ ] Pending
**Depends On:** 3.4, 3.5

**Steps:**
1. Create BonusBanner.tsx
2. Show when bonus window active
3. Countdown timer
4. CLAIM BONUS button
5. Hide when not active or already claimed

**Verification:**
- Shows during active window
- Hides after claim

**Files Created:**
- app/src/components/streak/BonusBanner.tsx

---

## Phase 4: Frontend Screens

### Task 4.1: Build Home Screen (Main Page)
**Status:** [ ] Pending
**Depends On:** 3.3-3.10

**Steps:**
1. Update `src/app/page.tsx`
2. State machine: NOT_CONNECTED → STAKE → ACTIVE → DEAD
3. NOT_CONNECTED: Show global stats + START button
4. STAKE: Show StakeSlider
5. ACTIVE: Show DayCounter, Timer, CheckinButton, BonusBanner
6. DEAD: Show death message + START OVER

**Verification:**
- All states render correctly
- Transitions work

**Files Modified:**
- app/src/app/page.tsx

---

### Task 4.2: Build Leaderboard Screen
**Status:** [ ] Pending
**Depends On:** 3.5, 3.4

**Steps:**
1. Create `src/app/leaderboard/page.tsx`
2. Tabs: BY STREAK / BY STAKE
3. Fetch top 100 from API
4. Show user's rank at bottom if not in top 100
5. LeaderboardList and LeaderboardItem components

**Verification:**
- Leaderboard loads
- Tabs switch ranking
- User highlighted

**Files Created:**
- app/src/app/leaderboard/page.tsx
- app/src/components/leaderboard/LeaderboardList.tsx
- app/src/components/leaderboard/LeaderboardItem.tsx

---

### Task 4.3: Build Chain/Referral Screen
**Status:** [ ] Pending
**Depends On:** 3.3, 3.5

**Steps:**
1. Create `src/app/chain/page.tsx`
2. Show referral link with copy button
3. Stats: direct referrals, chain size, earnings
4. Lifeline progress bar
5. List of direct referrals with status

**Verification:**
- Link copies to clipboard
- Stats display correctly

**Files Created:**
- app/src/app/chain/page.tsx
- app/src/components/chain/ReferralLink.tsx
- app/src/components/chain/ReferralStats.tsx
- app/src/components/chain/LifelineProgress.tsx

---

### Task 4.4: Add Navigation
**Status:** [ ] Pending
**Depends On:** 4.1, 4.2, 4.3

**Steps:**
1. Add BottomNav to all screens
2. Highlight active tab
3. Icons: Streak (flame), Chain (users), Board (chart)

**Verification:**
- Navigation works between screens
- Active state correct

**Files Modified:**
- app/src/app/layout.tsx
- app/src/app/page.tsx
- app/src/app/leaderboard/page.tsx
- app/src/app/chain/page.tsx

---

## Phase 5: API & Backend

### Task 5.1: Create Stats API
**Status:** [ ] Pending
**Depends On:** 3.4

**Steps:**
1. Create `src/app/api/stats/route.ts`
2. Fetch GameState from chain
3. Return JSON: total_players, total_pool, last_death
4. Cache for 30 seconds

**Verification:**
- API returns stats
- Caching works

**Files Created:**
- app/src/app/api/stats/route.ts

---

### Task 5.2: Create Leaderboard API
**Status:** [ ] Pending
**Depends On:** 3.2

**Steps:**
1. Create `src/app/api/leaderboard/route.ts`
2. Fetch all Player accounts (getProgramAccounts)
3. Sort by streak_days or stake
4. Return top 100
5. Cache for 60 seconds

**Verification:**
- Returns sorted leaderboard
- Handles both sort types

**Files Created:**
- app/src/app/api/leaderboard/route.ts

---

### Task 5.3: Create Bonus Window Cron
**Status:** [ ] Pending
**Depends On:** 2.7

**Steps:**
1. Create `src/app/api/bonus-window/route.ts`
2. Authenticate with secret
3. Call start_bonus_window instruction
4. Set up Vercel cron (3-5 times per day, random)

**Verification:**
- Cron starts bonus windows
- Window appears in app

**Files Created:**
- app/src/app/api/bonus-window/route.ts
- vercel.json (cron config)

---

## Phase 6: Polish & Deploy

### Task 6.1: Add Loading States
**Status:** [ ] Pending
**Depends On:** 4.1-4.4

**Steps:**
1. Add loading spinners to all async operations
2. Skeleton loaders for data fetching
3. Transaction pending states

**Verification:**
- No jarring state changes
- User knows when loading

---

### Task 6.2: Add Error Handling
**Status:** [ ] Pending
**Depends On:** 4.1-4.4

**Steps:**
1. Toast notifications for errors
2. Graceful fallbacks
3. Retry buttons where appropriate

**Verification:**
- Errors show user-friendly messages
- Can recover from errors

---

### Task 6.3: PWA Configuration
**Status:** [ ] Pending
**Depends On:** 1.2

**Steps:**
1. Configure manifest.ts with app name, icons, theme
2. Add service worker for offline
3. Add install prompt handling
4. Test on Seeker device

**Verification:**
- App installable as PWA
- Icons correct
- Works offline (cached)

**Files Modified:**
- app/src/app/manifest.ts
- app/next.config.js

---

### Task 6.4: Deploy to Production
**Status:** [ ] Pending
**Depends On:** All above

**Steps:**
1. Deploy program to mainnet-beta
2. Initialize GameState with real treasury
3. Update frontend constants with mainnet program ID
4. Deploy frontend to Vercel
5. Submit to Solana dApp Store

**Verification:**
- App live at production URL
- Program on mainnet
- Submitted to dApp Store

---

## Progress Tracking

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| 1. Setup | 4 | 0 | Pending |
| 2. Program | 10 | 0 | Pending |
| 3. Frontend Core | 10 | 0 | Pending |
| 4. Screens | 4 | 0 | Pending |
| 5. API | 3 | 0 | Pending |
| 6. Polish | 4 | 0 | Pending |
| **Total** | **35** | **0** | **0%** |

---

## MVP Scope (3-Day Target)

**Day 1:** Phase 1 + Phase 2 (Setup + Solana Program)
**Day 2:** Phase 3 + Phase 4 (Frontend Core + Screens)
**Day 3:** Phase 5 + Phase 6 (API + Polish + Deploy)

## Post-MVP (v1.1)
- Guardian system
- Heir system
- Premium notifications
- Push notifications

---

*This plan is the SINGLE SOURCE OF TRUTH. Update status as tasks complete: [ ] → [x]*
