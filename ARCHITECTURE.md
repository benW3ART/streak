# Technical Architecture

**Project:** STREAK
**Version:** 1.0
**Date:** 2026-01-29

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) | PWA support, fast SSR, mobile-optimized |
| **Language** | TypeScript (strict) | Type safety for financial logic |
| **Styling** | Tailwind CSS | Utility-first, matches design system |
| **Blockchain** | Solana | Target platform (Seeker), fast & cheap txs |
| **Smart Contract** | Anchor (Rust) | Standard for Solana, safer than raw |
| **Wallet** | Solana Mobile Wallet Adapter | Seed Vault integration |
| **RPC** | Helius / Quicknode | Reliable Solana RPC |
| **Hosting** | Vercel | PWA deployment, edge functions |
| **Cron** | Vercel Cron / Clockwork | Bonus windows, death processing |

## Project Structure

```
streak/
├── app/                          # Next.js PWA Frontend
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── page.tsx          # Home (connect/stake/streak)
│   │   │   ├── leaderboard/
│   │   │   │   └── page.tsx      # Leaderboard screen
│   │   │   ├── chain/
│   │   │   │   └── page.tsx      # Referrals screen
│   │   │   ├── api/
│   │   │   │   ├── bonus-window/
│   │   │   │   │   └── route.ts  # Start bonus window (cron)
│   │   │   │   ├── stats/
│   │   │   │   │   └── route.ts  # Global stats
│   │   │   │   └── leaderboard/
│   │   │   │       └── route.ts  # Leaderboard data
│   │   │   ├── layout.tsx        # Root layout + providers
│   │   │   └── manifest.ts       # PWA manifest
│   │   ├── components/
│   │   │   ├── ui/               # Base components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Slider.tsx
│   │   │   │   └── Badge.tsx
│   │   │   ├── streak/           # Streak feature
│   │   │   │   ├── DayCounter.tsx
│   │   │   │   ├── StakeSlider.tsx
│   │   │   │   ├── CheckinButton.tsx
│   │   │   │   ├── Timer.tsx
│   │   │   │   └── BonusBanner.tsx
│   │   │   ├── chain/            # Referral feature
│   │   │   │   ├── ReferralLink.tsx
│   │   │   │   ├── ReferralStats.tsx
│   │   │   │   └── LifelineProgress.tsx
│   │   │   ├── leaderboard/
│   │   │   │   ├── LeaderboardList.tsx
│   │   │   │   └── LeaderboardItem.tsx
│   │   │   └── layout/
│   │   │       ├── BottomNav.tsx
│   │   │       └── Logo.tsx
│   │   ├── lib/
│   │   │   ├── solana/
│   │   │   │   ├── provider.tsx  # Wallet provider setup
│   │   │   │   ├── program.ts    # Anchor program client
│   │   │   │   └── hooks.ts      # useProgram, usePlayer, etc.
│   │   │   ├── utils/
│   │   │   │   ├── format.ts     # Format SOL, addresses, time
│   │   │   │   ├── time.ts       # UTC calculations
│   │   │   │   └── constants.ts  # Program ID, RPC URL
│   │   │   └── design-tokens.ts  # Colors, fonts from brand
│   │   ├── hooks/
│   │   │   ├── usePlayer.ts      # Player account state
│   │   │   ├── useGameState.ts   # Global game state
│   │   │   ├── useBonusWindow.ts # Bonus window state
│   │   │   └── useCountdown.ts   # Timer hook
│   │   └── types/
│   │       ├── player.ts         # Player type from IDL
│   │       └── game.ts           # GameState type from IDL
│   ├── public/
│   │   ├── icons/                # PWA icons
│   │   └── fonts/                # Bebas Neue, Space Mono
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── programs/                     # Solana Program (Anchor)
│   └── streak/
│       ├── src/
│       │   ├── lib.rs            # Program entry
│       │   ├── state/
│       │   │   ├── mod.rs
│       │   │   ├── game_state.rs # Global state account
│       │   │   └── player.rs     # Player account
│       │   ├── instructions/
│       │   │   ├── mod.rs
│       │   │   ├── initialize.rs
│       │   │   ├── stake.rs
│       │   │   ├── checkin.rs
│       │   │   ├── claim_bonus.rs
│       │   │   ├── process_death.rs
│       │   │   ├── withdraw.rs
│       │   │   └── start_bonus_window.rs
│       │   ├── errors.rs         # Custom errors
│       │   └── constants.rs      # Min stake, fee %, etc.
│       ├── Cargo.toml
│       └── Anchor.toml
│
├── tests/                        # Integration tests
│   └── streak.ts                 # Anchor tests
│
├── scripts/
│   ├── deploy.sh                 # Deploy program
│   └── init-game.ts              # Initialize game state
│
├── docs/                         # Design docs (existing)
│   ├── STREAK-BRAND-IDENTITY.md
│   ├── STREAK-UI-SCREENS.html
│   └── streak-landing-page.html
│
├── .claude/
│   ├── plan.md                   # SINGLE SOURCE OF TRUTH
│   └── discovery/
│       └── DISCOVERY.xml
│
├── ARCHITECTURE.md               # This file
├── CLAUDE.md                     # Project instructions
└── package.json                  # Workspace root
```

## On-Chain Data Model

### GameState (PDA: `["game_state"]`)

```rust
pub struct GameState {
    pub authority: Pubkey,           // Admin wallet
    pub treasury: Pubkey,            // Protocol fee recipient
    pub total_players: u64,          // Active player count
    pub total_pool: u64,             // SOL in pool (lamports)
    pub last_death_timestamp: i64,   // Last death Unix time
    pub total_deaths: u64,           // Cumulative deaths
    pub current_bonus_window: u64,   // Current window ID (0 = none)
    pub bonus_window_end: i64,       // Window end timestamp
    pub bump: u8,                    // PDA bump
}
```

### Player (PDA: `["player", wallet.key()]`)

```rust
pub struct Player {
    pub wallet: Pubkey,              // Owner wallet
    pub stake: u64,                  // Current stake (lamports)
    pub streak_days: u32,            // Consecutive check-ins
    pub last_checkin: i64,           // Last check-in timestamp
    pub start_day: i64,              // UTC day when started
    pub pending_rewards: u64,        // Unclaimed from deaths
    pub is_active: bool,             // Has active stake
    pub referrer: Option<Pubkey>,    // Who referred them
    pub direct_referrals: u32,       // Direct referral count
    pub lifelines: u8,               // Available lifelines
    pub lifelines_used: u8,          // Total used
    pub last_bonus_claimed: u64,     // Last window ID claimed
    pub total_bonus_claims: u32,     // Lifetime bonuses
    pub referral_earnings: u64,      // Total from referrals
    pub bump: u8,                    // PDA bump
}
```

## Program Instructions

| Instruction | Signer | Description |
|-------------|--------|-------------|
| `initialize` | Authority | Create GameState (one-time) |
| `stake` | User | Deposit SOL, create Player account |
| `checkin` | User | Daily check-in, grow stake 0.1% |
| `claim_bonus` | User | Claim active bonus window (+0.05%) |
| `start_bonus_window` | Authority | Start 15-min bonus window |
| `process_death` | Anyone (crank) | Process missed check-in |
| `withdraw` | User | Exit game, return stake |
| `claim_rewards` | User | Claim pending referral rewards |

## Business Rules (On-Chain)

| Rule | Value | Constant Name |
|------|-------|---------------|
| Minimum stake | 0.05 SOL | `MIN_STAKE` |
| Daily growth | 0.1% | `DAILY_GROWTH_BPS` (10) |
| Bonus growth | 0.05% | `BONUS_GROWTH_BPS` (5) |
| Protocol fee | 3% | `PROTOCOL_FEE_BPS` (300) |
| Referral cut | 5% per level | `REFERRAL_CUT_BPS` (500) |
| Max referral depth | 3 levels | `MAX_REFERRAL_DEPTH` |
| Lifelines per 3 refs | 1 | `REFS_PER_LIFELINE` |
| Bonus window duration | 15 min | `BONUS_DURATION` (900) |
| Grace period | 5 min before midnight | `GRACE_PERIOD` (300) |

## Frontend State Management

```typescript
// Wallet connection via @solana/wallet-adapter-react
const { connected, publicKey, signTransaction } = useWallet();

// Player state from on-chain
const { player, refetch } = usePlayer(publicKey);

// Game state (global stats)
const { gameState } = useGameState();

// Derived state
const hasCheckedInToday = isToday(player.lastCheckin);
const canCheckIn = player.isActive && !hasCheckedInToday;
const isInDangerZone = getTimeUntilMidnightUTC() < 3600;
const isBonusActive = gameState.bonusWindowEnd > Date.now() / 1000;
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stats` | GET | Global stats (cached) |
| `/api/leaderboard` | GET | Top 100 by streak/stake |
| `/api/bonus-window` | POST | Start bonus window (cron, authenticated) |

## Security Considerations

1. **On-Chain Security**
   - All funds held by program PDA
   - Signer verification on all user instructions
   - Overflow checks with checked_math
   - No admin extraction of user funds

2. **Frontend Security**
   - Wallet adapter handles key management
   - No private keys in frontend
   - RPC calls only, no signing without user

3. **Crank Security**
   - `process_death` is permissionless (anyone can crank)
   - Authority-only for `start_bonus_window`
   - Rate limiting on API routes

## Deployment

1. **Program**: Deploy to Solana mainnet-beta
2. **Frontend**: Vercel (auto-deploy on push to main)
3. **dApp Store**: Submit PWA to Solana dApp Store

## Performance Targets

- Page load: < 2s (LCP)
- Transaction confirm: < 5s
- Stats refresh: 30s interval
- Leaderboard: Cached 60s

---

*Architecture optimized for 3-day MVP timeline. Social features (Guardian, Heir) deferred to v1.1.*
