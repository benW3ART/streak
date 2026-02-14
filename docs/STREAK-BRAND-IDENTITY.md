# STREAK — Brand Identity & Design System
## For Claude Code Implementation

---

## 1. BRAND ESSENCE

### Positioning
- **One-liner:** "Your stake grows every day you show up."
- **Tagline:** "One tap. Real SOL. Watch it compound."
- **Challenge:** "How long can you survive?"

### Personality
- **Tense** — Coiled, aware that time is always running
- **Minimal** — 30 seconds max per interaction, no decoration for decoration's sake
- **Honest** — Real stakes, real consequences, no pretense
- **Addictive** — Designed to become essential, like brushing teeth

### Voice & Tone
**We are:** Direct, honest, slightly dark humor, never preachy
**We are NOT:** Cute, corporate, crypto-bro, apologetic

**Copy examples (USE):**
- "Day 47. Don't miss it."
- "Your friend died. You inherited 0.023 SOL."
- "Bonus window in 12 minutes."
- "You missed yesterday. Everything is gone."
- "+0.1% • See you tomorrow."

**Copy examples (NEVER USE):**
- "Great job on your streak! Keep it up! 🎉"
- "Oops! Looks like you missed a day!"
- "Join our amazing community!"
- No emojis in serious moments
- No "WAGMI", "LFG", "ser", "fren"

---

## 2. COLOR PALETTE

### Primary Colors
```
STREAK Orange    #FF4D00    Primary brand, CTAs, alive state, day counter
Ember            #FF6B35    Hover states, warmth, growth indicators
Charcoal         #0D0D0D    Primary background
Ash              #1A1A1A    Secondary background, cards base
Card             #222222    Card backgrounds, elevated surfaces
```

### Accent Colors
```
Alive Green      #00FF88    Success states, check-in confirmation only
Warning White    #FFFFFF    Death notifications, high contrast alerts
Gold             #FFD700    Achievements, top streakers, rare events
Blood Red        #CC0000    Death state, danger zone, final warnings
```

### Ecosystem Colors (for badges/integrations)
```
Solana Purple    #9945FF    Solana branding elements
Solana Green     #14F195    Seeker/Solana ecosystem elements
```

### Gradients
```css
/* The Burn - alive to dead transition */
background: linear-gradient(135deg, #FF4D00 0%, #CC0000 100%);

/* The Glow - active state, pulsing */
background: linear-gradient(135deg, #FF4D00 0%, #FF6B35 100%);

/* The Fade - background depth */
background: linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%);

/* Danger Zone */
background: linear-gradient(180deg, rgba(204, 0, 0, 0.3) 0%, #1A1A1A 100%);

/* SKR/Solana ecosystem */
background: linear-gradient(135deg, rgba(153, 69, 255, 0.15) 0%, rgba(20, 241, 149, 0.15) 100%);
```

### Color Usage Rules
- Orange dominates: urgency without panic
- Green ONLY appears on success (rare, meaningful, relief)
- White as warning: counterintuitive, memorable
- No blue, no purple (except Solana badges), no "crypto gradients"
- Dark theme always — Charcoal (#0D0D0D) base

---

## 3. TYPOGRAPHY

### Font Stack
```css
/* Primary - Display, Headlines, Day Counter */
font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;

/* Secondary - Body, UI elements, technical info */
font-family: 'Space Mono', 'Courier New', monospace;

/* Tertiary - Small UI, settings, legal */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale
```
Day Counter:     Bebas Neue Black, 72-180px (responsive)
Headlines H1:    Bebas Neue Bold, 32-48px
Headlines H2:    Bebas Neue Bold, 24-36px
Headlines H3:    Bebas Neue Bold, 18-24px
Body:            Space Mono Regular, 14-16px
UI Labels:       Space Mono Bold, 11-14px
Fine Print:      Inter Regular, 10-12px
```

### Typography Rules
- Day counter is ALWAYS the largest element on any screen
- Headlines in ALL CAPS (Bebas Neue only)
- Body text in sentence case
- Never justify text — left align everything
- Line height: 1.6 for body, 1.1 for headlines
- Letter spacing: 0.02-0.05em for Bebas Neue, 0 for Space Mono

---

## 4. SPACING & LAYOUT

### Spacing Scale (8px base)
```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
2xl:  48px
3xl:  64px
```

### Border Radius
```
Small (buttons, inputs):    8px
Medium (cards):             12px
Large (modals, sheets):     16px
Phone mockup:               40px
Full round (badges):        9999px
```

### Container
```css
/* Mobile-first, max-width approach */
.container {
    width: 100%;
    max-width: 480px;  /* Mobile */
    margin: 0 auto;
    padding: 0 20px;
}

@media (min-width: 768px) {
    .container { max-width: 720px; }
}

@media (min-width: 1024px) {
    .container { max-width: 1000px; }
}
```

---

## 5. COMPONENTS

### Buttons

#### Primary Button (Check-in, CTAs)
```css
.btn-primary {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 0.1em;
    padding: 16px 32px;
    background: #FF4D00;
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(255, 77, 0, 0.3);
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background: #FF6B35;
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(255, 77, 0, 0.4);
}

.btn-primary:active {
    transform: scale(0.98);
}

/* Success state after check-in */
.btn-primary.success {
    background: #00FF88;
    color: #0D0D0D;
}
```

#### Secondary Button
```css
.btn-secondary {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    padding: 12px 24px;
    background: transparent;
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
}

.btn-secondary:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
}
```

### Cards
```css
.card {
    background: #222222;
    border-radius: 12px;
    padding: 24px;
}

.card-elevated {
    background: #222222;
    border-radius: 16px;
    padding: 32px 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-danger {
    background: linear-gradient(180deg, rgba(204, 0, 0, 0.2) 0%, #222222 100%);
    border: 1px solid rgba(204, 0, 0, 0.3);
}

.card-success {
    border: 1px solid rgba(0, 255, 136, 0.3);
}
```

### Input Fields
```css
.input {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    padding: 14px 16px;
    background: #1A1A1A;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #FFFFFF;
}

.input:focus {
    border-color: #FF4D00;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 77, 0, 0.1);
}
```

### Badges
```css
.badge {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.05em;
    padding: 6px 12px;
    border-radius: 9999px;
}

.badge-orange {
    background: rgba(255, 77, 0, 0.15);
    color: #FF4D00;
    border: 1px solid rgba(255, 77, 0, 0.3);
}

.badge-green {
    background: rgba(0, 255, 136, 0.1);
    color: #00FF88;
    border: 1px solid rgba(0, 255, 136, 0.3);
}

.badge-gold {
    background: rgba(255, 215, 0, 0.1);
    color: #FFD700;
    border: 1px solid rgba(255, 215, 0, 0.3);
}
```

---

## 6. APP STATES

### State: Alive (Default)
```
Background:      #0D0D0D (Charcoal)
Day Counter:     #FF4D00 (STREAK Orange)
Timer:           rgba(255, 255, 255, 0.6)
Button:          #FF4D00 with glow
Mood:            Calm tension
```

### State: Bonus Window Active
```
Background:      Slightly brighter, subtle pulse
Day Counter:     #FF6B35 (Ember)
Timer:           #FF4D00, larger, countdown visible
Button:          Glowing intensified, pulsing animation
Mood:            Urgent opportunity
```

### State: Danger Zone (<1 hour remaining)
```
Background:      Gradient shift toward red
Day Counter:     #CC0000 (Blood Red)
Timer:           Large, pulsing, #CC0000
Button:          #CC0000 background
Mood:            Panic, urgency
```

### State: Check-in Confirmed
```
Background:      Brief flash of #00FF88
Day Counter:     Increments with animation
Timer:           Resets to full
Button:          #00FF88 with "✓ DAY XX"
Mood:            Relief, satisfaction
Duration:        2 seconds, then return to Alive
```

### State: Death
```
Background:      Pure black (#000000)
Day Counter:     #FFFFFF, shows "0"
Text:            #FFFFFF, stark
Button:          Hidden or "START OVER"
Mood:            Finality, silence
Message:         "You lost X.XXX SOL"
```

---

## 7. ANIMATIONS

### Check-in Button Pulse
```css
@keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 30px rgba(255, 77, 0, 0.4); }
    50% { box-shadow: 0 0 50px rgba(255, 77, 0, 0.6); }
}

.checkin-btn {
    animation: pulse-glow 2s ease-in-out infinite;
}
```

### Counter Increment
```css
@keyframes counter-bump {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
```

### Success Flash
```css
@keyframes success-flash {
    0% { background: #00FF88; }
    100% { background: #0D0D0D; }
}
```

### Danger Pulse
```css
@keyframes danger-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.danger-state .timer {
    animation: danger-pulse 1s ease-in-out infinite;
}
```

### Timing Guidelines
- Micro-interactions: 150-200ms
- State transitions: 300ms
- Page transitions: 400ms
- Success confirmation: 2000ms visible
- Easing: ease-out for entrances, ease-in for exits

---

## 8. ICONOGRAPHY

### Style
- Minimal line icons
- 2px stroke weight
- Rounded line caps
- Single color (orange, white, or contextual)

### Core Icons (describe or use Lucide/Feather)
```
🔥 Flame        → Streak/alive indicator
💀 Skull        → Death
⏱️ Clock        → Timer/bonus window
🛡️ Shield       → Guardian
👤 Person       → Heir/profile
⛓️ Chain links  → Referral chain
💚 Heart        → Lifeline
📈 Arrow up     → Growth
✓ Check         → Success/confirmed
```

### Icon Sizes
```
Navigation:      24px
In-card:         20px
Badges:          16px
Inline text:     14px
```

---

## 9. SOUND & HAPTICS

### Sound Design (describe for implementation)
```
Check-in confirmation:    Short warm tone, heartbeat resuming, 0.3s
Bonus window caught:      Brighter, higher pitch, "cha-ching" quality, 0.5s
Near deadline warning:    Low pulsing, heartbeat rhythm, loops
Death:                    Single low tone, flatline quality, 1.5s
Friend death:             Notification tone, slightly ominous, 0.8s
```

### Haptics (iOS/Android)
```
Check-in press:           Strong single tap (UIImpactFeedbackGenerator.heavy)
Bonus caught:             Double tap (success pattern)
Death:                    Long vibration (1s)
Friend death:             Triple pulse (notification pattern)
```

---

## 10. MOBILE-FIRST LAYOUT

### Screen Priority (top to bottom)
1. Day Counter — ALWAYS largest, always visible
2. Time until deadline
3. Check-in button
4. Current stake value
5. Secondary info (growth rate, bonus windows)

### Navigation (Bottom Tab Bar)
```
Tab 1: Streak (home, check-in) — Flame icon
Tab 2: Chain (referrals, guardians, heirs) — Users icon
Tab 3: Board (leaderboard) — Chart icon
```

### Safe Areas
- Respect iOS notch/Dynamic Island
- Bottom navigation: 60px height + safe area
- Top: 44px + notch height

---

## 11. KEY SCREENS

### 1. Main Screen (Check-in)
```
Layout:
├── Header (Logo, minimal)
├── Main Content (centered)
│   ├── Day Counter (huge, orange, glowing)
│   ├── "Day Streak" label
│   ├── Current Stake value
│   ├── Timer countdown
│   └── CHECK IN button (prominent)
└── Bottom Nav
```

### 2. Bonus Window Active
```
Same as Main but:
- Overlay or banner showing "BONUS WINDOW"
- Countdown for window (12:34 remaining)
- Button text: "CATCH BONUS"
- More intense glow/pulse
```

### 3. Death Screen
```
Layout:
├── Black background
├── Centered content
│   ├── "0" in white
│   ├── "You lost X.XXX SOL"
│   ├── Empty space (silence)
│   └── "START OVER" button (subtle)
└── No bottom nav
```

### 4. Chain Screen
```
Layout:
├── Header ("Your Chain")
├── Stats row (total refs, earnings from deaths)
├── Sections:
│   ├── Your Referrals (L1, L2, L3 breakdown)
│   ├── Your Guardian (who watches you)
│   ├── Your Heir (who inherits)
│   └── People you Guard
└── Bottom Nav
```

### 5. Leaderboard
```
Layout:
├── Header ("Survivors")
├── Filter tabs (Longest Streak / Highest Stake)
├── List of top streakers
│   ├── Rank
│   ├── Address/name (truncated)
│   ├── Day count
│   └── Stake value
└── Bottom Nav
```

---

## 12. TECHNICAL SPECS

### Supported Platforms
- Primary: Android (Seeker phone, Solana dApp Store)
- Secondary: Web app (any Solana wallet)
- Future: iOS (if policy allows)

### Wallet Integration
- Primary: Seed Vault (Seeker native)
- Fallback: Phantom, Solflare, Backpack via Mobile Wallet Adapter

### Transaction Types
```
1. Stake entry         — Lock SOL, start streak
2. Daily check-in      — Sign transaction, increment day
3. Bonus window catch  — Sign transaction, add bonus
4. Guardian ping       — On-chain notification
5. Lifeline use        — Auto-triggered, burns lifeline
6. Claim chain death   — Receive % from referral death
7. Withdraw (death)    — Stake distributed to pool
```

### Gas Estimates
- Per transaction: ~0.000005 SOL (~$0.001)
- Daily (all bonus windows): ~0.00003 SOL (~$0.006)
- Monthly active user: ~$0.30

### Data to Track
```
User:
- wallet_address
- current_streak (days)
- stake_amount (lamports)
- last_checkin (timestamp)
- growth_rate (base + bonuses)
- lifelines_count
- referrer_address
- heir_address
- guardian_slots[3]

Global:
- total_pool (lamports)
- total_deaths_this_week
- leaderboard_cache
```

---

## 13. LOGO USAGE

### Primary Logo
```
Text: "STREAK" in Bebas Neue
The "A" is replaced/colored in STREAK Orange (#FF4D00)
Rest of letters: White (#FFFFFF) on dark, Charcoal (#0D0D0D) on light
```

### App Icon
```
Shape: Rounded square (platform standard)
Background: STREAK Orange (#FF4D00)
Icon: White flame symbol, centered
No text on icon
```

### Logo Clear Space
- Minimum padding: Height of the flame on all sides
- Never rotate, stretch, or modify

### Logo on Backgrounds
```
Dark backgrounds:   White text, Orange "A"
Light backgrounds:  Charcoal text, Orange "A"
Orange backgrounds: All white
```

---

## 14. DO's AND DON'Ts

### DO ✅
- Lead with the day counter (always largest)
- Make check-in button unmissable
- Use orange as primary action color
- Be direct in copy
- Respect users' time (30 second interactions)
- Acknowledge stakes honestly
- Make death feel meaningful
- Celebrate survival milestones
- Generate on-chain transaction for every interaction

### DON'T ❌
- Use blue or purple (too "crypto")
- Use cartoon mascots
- Soften the death language
- Add unnecessary animations
- Use "community" unironically
- Apologize for the mechanics
- Use stock photography
- Use generic crypto imagery (rockets, moons)
- Make the check-in button small
- Hide the deadline timer
- Use emojis in serious UI moments

---

## 15. FILE NAMING CONVENTIONS

```
Assets:
streak-logo-white.svg
streak-logo-dark.svg
streak-icon-app.png (1024x1024)
streak-flame-icon.svg

Components:
Button.tsx / Button.vue / button.svelte
Card.tsx
DayCounter.tsx
Timer.tsx
CheckinButton.tsx

Screens:
MainScreen.tsx
ChainScreen.tsx
LeaderboardScreen.tsx
DeathScreen.tsx
OnboardingScreen.tsx

Styles:
colors.ts (or CSS variables)
typography.ts
spacing.ts
animations.ts
```

---

## 16. QUICK REFERENCE

### Colors (copy-paste ready)
```css
:root {
    --streak-orange: #FF4D00;
    --ember: #FF6B35;
    --charcoal: #0D0D0D;
    --ash: #1A1A1A;
    --card: #222222;
    --alive-green: #00FF88;
    --white: #FFFFFF;
    --gold: #FFD700;
    --blood-red: #CC0000;
    --solana-purple: #9945FF;
    --solana-green: #14F195;
}
```

### Fonts (Google Fonts import)
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Key Metrics
```
Min stake:           0.05 SOL
Daily growth:        0.1% base
Bonus window boost:  +0.02% each (4 per day)
Max daily growth:    0.18%
Referral levels:     3 (5% / 3% / 2%)
Protocol fee:        3% of deaths
Lifeline earn:       Every 3 referrals
Max lifelines:       3 stored
Guardian slots:      3 max
Heir:                1 (50% on death)
```

---

*This document is the single source of truth for STREAK's visual and interaction design. When in doubt, refer here.*
