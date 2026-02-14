# STREAK - Daily Check-in Game for Solana Seeker

**Miss One Day. Lose Everything.**

STREAK is a daily check-in game built for Solana Seeker mobile devices. Stake SOL, check in daily, and watch your stake grow. Miss a day? Your entire stake goes to the pool.

## Game Mechanics

### Core Loop
- **Stake**: Minimum 0.05 SOL to enter
- **Check-in**: Daily check-in required to maintain your streak
- **Growth**: Stake grows 0.1% daily compound
- **Death**: Miss one day = lose entire stake to pool

### Features
- **Bonus Windows**: Random 1-hour windows where check-ins earn extra rewards
- **Referral Chain**: Earn 5% when referrals "die" (3 levels deep)
- **Lifelines**: Skip one day penalty (earn 1 per 3 referrals)
- **Leaderboard**: Compete for longest streaks

### Revenue Model
- 3% protocol fee on deaths
- Lifeline purchases (SOL or compressed NFTs)
- Premium push notifications (fiat)

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Blockchain**: Solana (Anchor Framework)
- **Wallet**: Mobile Wallet Adapter (Seed Vault compatible)
- **Deployment**: PWA for Solana Seeker dApp Store

## Project Structure

```
streak/
├── app/                    # Next.js frontend PWA
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (WalletProvider)
│   │   ├── hooks/         # Custom hooks (useStreak)
│   │   └── lib/           # Constants, IDL, utilities
│   └── public/            # Static assets, PWA manifest
├── programs/
│   └── streak/            # Solana program (Anchor)
│       └── src/
│           ├── lib.rs
│           ├── state.rs
│           ├── errors.rs
│           └── instructions/
├── scripts/               # Deployment and initialization scripts
└── target/
    └── deploy/            # Built program binary
```

## Quick Start

### Prerequisites
- Node.js 18+
- Rust & Cargo
- Solana CLI
- Anchor CLI

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/streak.git
cd streak

# Install dependencies
npm install

# Build the Solana program
cd programs/streak
anchor build --no-idl
cd ../..
```

### Development

```bash
# Start the frontend
npm run dev

# Open http://localhost:3000
```

### Deployment

1. **Get devnet SOL**
```bash
solana airdrop 2
```

2. **Deploy the program**
```bash
bash scripts/deploy.sh
```

3. **Initialize game state**
```bash
npx ts-node scripts/initialize.ts
```

4. **Deploy frontend**
```bash
npm run build
# Deploy to Vercel, Netlify, or your hosting provider
```

## Program Instructions

| Instruction | Description |
|-------------|-------------|
| `initialize` | Creates the game state account (admin only) |
| `stake` | Stakes SOL and registers as a player |
| `checkin` | Daily check-in to maintain streak |
| `withdraw` | Withdraw stake + rewards and exit game |
| `claim_rewards` | Claim pending referral rewards |
| `claim_bonus` | Claim bonus during active windows |
| `process_death` | Mark dead players (crank operation) |
| `start_bonus_window` | Start a bonus window (admin) |

## Environment Variables

Create `.env.local` in the `app/` directory:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=Ai4ywwPiquWt9RpgqoumBs95EYEJpcUefcktksLSWx2V
```

## Program ID

**Devnet**: `Ai4ywwPiquWt9RpgqoumBs95EYEJpcUefcktksLSWx2V`

## Security Considerations

- All user funds are held in PDAs controlled by the program
- Withdrawals transfer SOL directly back to users
- No admin withdrawal capability (trustless)
- Streak death detection runs via crank

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

---

Built for the Solana Seeker Mobile gaming ecosystem.
