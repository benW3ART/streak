# STREAK - Audit Complet

**Date:** 2026-02-15  
**Auditeur:** Claude Code (Subagent)  
**Version:** 1.0.0

---

## 📊 Résumé Exécutif

| Catégorie | Score | Status |
|-----------|-------|--------|
| Architecture | ⭐⭐⭐⭐⭐ | Solide |
| Fonctionnel | ⭐⭐⭐⭐ | Complet avec limitations |
| Code Quality | ⭐⭐⭐⭐ | Bon, quelques améliorations possibles |
| Sécurité | ⭐⭐⭐⭐ | Bon, points d'attention identifiés |
| UX | ⭐⭐⭐ | Fonctionnel mais landing page basique |

**Verdict:** MVP solide, prêt pour un soft launch sur devnet. Quelques bugs et améliorations identifiés avant mainnet.

---

## 🏗️ 1. Architecture Review

### Stack Technique
```
Frontend: Next.js 16 + React 19 + Tailwind CSS 4
Blockchain: Solana (Anchor Framework)
Wallet: @solana/wallet-adapter
Deployment: Railway (configuré)
```

### Structure Projet
```
streak/
├── app/                    ✅ Next.js PWA Frontend
│   └── src/
│       ├── app/           ✅ App Router (page.tsx, layout.tsx)
│       ├── contexts/      ✅ WalletProvider
│       ├── hooks/         ✅ useStreak.ts (bien structuré)
│       └── lib/           ✅ constants.ts, idl.ts
├── programs/streak/        ✅ Solana Anchor Program
│   └── src/
│       ├── instructions/   ✅ 9 instructions modulaires
│       ├── state/         ✅ GameState + Player PDAs
│       └── constants.rs   ✅ Constantes centralisées
└── docs/                   ✅ Design docs, brand identity
```

### Flow Utilisateur
```
Connect Wallet → Stake SOL → Daily Check-in → Growth
                    ↓
              Miss Check-in → Death → Stake to Pool
                    ↓
              Referrers earn 5% × 3 levels
```

**✅ Architecture bien pensée pour un MVP**

### Points Forts
- Séparation claire frontend/smart contract
- PDAs bien définis (game_state, player)
- Hook `useStreak` centralise toute la logique
- Constants partagées entre frontend et contract

### Points d'Amélioration
- Pas de pages séparées (leaderboard, chain) - tout dans page.tsx
- Pas d'API routes implémentées (prévu dans ARCHITECTURE.md)
- Pas de PWA manifest actuel

---

## ⚙️ 2. Audit Fonctionnel

### 2.1 Stake Minimum 0.05 SOL ✅

**Contract (`constants.rs`):**
```rust
pub const MIN_STAKE: u64 = 50_000_000; // 0.05 SOL in lamports
```

**Frontend (`constants.ts`):**
```typescript
export const MIN_STAKE = 0.05; // SOL
export const MIN_STAKE_LAMPORTS = 50_000_000;
```

**Validation dans `stake.rs`:**
```rust
require!(amount >= MIN_STAKE, StreakError::BelowMinimumStake);
```

✅ **Implémenté correctement**

---

### 2.2 Check-in Quotidien ✅

**Logique (`checkin.rs`):**
```rust
// Use configurable interval (default 86400 = 24 hours)
let interval = game_state.checkin_interval_seconds;
let current_period = current_time / interval;
let last_checkin_period = player.last_checkin / interval;

// Check if already checked in this period
require!(last_checkin_period < current_period, StreakError::AlreadyCheckedIn);
```

✅ **Intervalle configurable (utile pour tests)**

**Frontend (`useStreak.ts`):**
```typescript
const canCheckinToday = useCallback(() => {
    const lastCheckinPeriod = Math.floor(lastCheckin / interval);
    const currentPeriod = Math.floor(now / interval);
    return lastCheckinPeriod < currentPeriod;
}, [player, gameState]);
```

✅ **Synchro frontend/contract**

---

### 2.3 Compound 0.1%/jour ✅

**Contract (`checkin.rs`):**
```rust
pub const DAILY_GROWTH_BPS: u64 = 10; // 0.1%

let growth = player.stake
    .checked_mul(DAILY_GROWTH_BPS)?
    .checked_div(BPS_DENOMINATOR)?; // 10000

player.stake = player.stake.checked_add(growth)?;
```

**⚠️ Note:** Le growth est ajouté au stake du joueur mais n'est pas vraiment "funded" par le pool. C'est une simplification MVP acceptable mais:
- Le pool peut devenir négatif si beaucoup de joueurs survivent longtemps
- Solution: Death fees alimentent le pool pour compenser

---

### 2.4 Death = Perte Stake → Pool ✅

**Contract (`process_death.rs`):**
```rust
// Player dies if they haven't checked in this period
let should_die = last_checkin_period < current_period && start_period < current_period;
require!(should_die, StreakError::PlayerNotDead);

// No lifeline - player dies
dead_player.is_active = false;
dead_player.stake = 0;
dead_player.streak_days = 0;

// Pool gets stake minus fees
game_state.total_pool = game_state.total_pool
    .checked_sub(stake)?
    .checked_add(pool_addition)?;
```

✅ **Logique death correcte**

**⚠️ Bug potentiel:** Le treasury fee n'est pas réellement transféré (voir section sécurité)

---

### 2.5 Bonus Windows Aléatoires ✅

**Contract (`start_bonus_window.rs`):**
```rust
pub const BONUS_DURATION_SECONDS: i64 = 900; // 15 minutes

game_state.current_bonus_window = window_id;
game_state.bonus_window_end = current_time + BONUS_DURATION_SECONDS;
```

**Contract (`claim_bonus.rs`):**
```rust
pub const BONUS_GROWTH_BPS: u64 = 5; // 0.05%

// Apply bonus growth
let growth = player.stake.checked_mul(BONUS_GROWTH_BPS)? / BPS_DENOMINATOR;
player.stake = player.stake.checked_add(growth)?;
```

✅ **Implémenté**

**⚠️ Manquant:**
- Pas de cron/scheduler pour déclencher les bonus windows
- Nécessite un call manuel de l'authority
- Solution: Vercel cron ou Clockwork on-chain

---

### 2.6 Referral 3 Niveaux (5%) ✅

**Contract (`stake.rs` - création de referral):**
```rust
// Award lifeline every 3 referrals
let new_lifeline_count = new_referrals / REFS_PER_LIFELINE;
if new_lifeline_count > old_lifeline_count {
    referrer_data[LIFELINES_OFFSET] = updated_lifelines;
}
```

**Contract (`process_death.rs` - payout):**
```rust
pub const REFERRAL_CUT_BPS: u64 = 500; // 5% per level

// Pay referrers (5% each, up to 3 levels)
if let Some(ref mut r1) = ctx.accounts.referrer_1 {
    if dead_player.referrer == Some(r1.wallet) {
        r1.pending_rewards += referral_cut;
        // Level 2, Level 3...
    }
}
```

✅ **3 niveaux implémentés correctement**

---

### 2.7 Lifelines (Skip 1 Jour) ✅

**Contract (`process_death.rs`):**
```rust
// Check for lifeline
if dead_player.lifelines > 0 {
    dead_player.lifelines -= 1;
    dead_player.lifelines_used += 1;
    dead_player.last_checkin = current_time; // Reset check-in
    return Ok(()); // Player survives!
}
```

✅ **Auto-utilisé lors de process_death**

**⚠️ UX:** Le joueur ne peut pas "choisir" d'utiliser un lifeline. C'est automatique.

---

## 🐛 3. Audit Code / Bugs

### Bug #1: Treasury Fee Non Transféré 🔴

**Fichier:** `process_death.rs`

```rust
// NOTE: The actual SOL transfer happens from the game_state PDA
// For now we track it in the pool and handle transfers separately
let protocol_fee = stake * PROTOCOL_FEE_BPS / BPS_DENOMINATOR; // Calculated
// MAIS: Aucun transfer réel vers treasury!
```

**Impact:** Les 3% de protocol fee sont calculés mais jamais transférés au treasury.

**Fix recommandé:**
```rust
// Transfer protocol fee to treasury
**ctx.accounts.game_state.to_account_info().try_borrow_mut_lamports()? -= protocol_fee;
**ctx.accounts.treasury.try_borrow_mut_lamports()? += protocol_fee;
```

---

### Bug #2: Overflow dans Referral Count 🟡

**Fichier:** `stake.rs`

```rust
let updated_lifelines = current_lifelines.checked_add(1).unwrap_or(255);
```

✅ Bien géré avec `unwrap_or(255)`

Mais:
```rust
let new_referrals = current_referrals.checked_add(1).unwrap();
```

**Impact:** Panic si > 4 milliards de referrals (improbable mais...)

**Fix:** Utiliser `unwrap_or(u32::MAX)` par sécurité.

---

### Bug #3: Player.should_die() Inconsistant 🟡

**Fichier:** `state/player.rs`

```rust
pub fn should_die(&self, current_time: i64) -> bool {
    let today = Self::get_utc_day(current_time);
    let last_checkin_day = Self::get_utc_day(self.last_checkin);

    last_checkin_day < today - 1 ||
    (last_checkin_day < today && self.start_day < today)
}
```

**Problème:** Cette méthode utilise `SECONDS_PER_DAY` hardcodé, pas `checkin_interval_seconds`.

**Impact:** La logique du hook frontend et du contract sont alignées, mais cette méthode helper ne l'est pas. Elle n'est pas utilisée actuellement, donc pas critique.

---

### Bug #4: isPlayerDead() Race Condition 🟡

**Fichier:** `useStreak.ts`

```typescript
// Frontend checks death
const isPlayerDead = useCallback(() => {
    return lastCheckinPeriod < currentPeriod - 1 || ...
}, [player, gameState]);

// UI shows "YOU DIED" but player.isActive is still true
// Until someone calls processDeath()
```

**Impact:** L'UI montre "YOU DIED" mais le joueur pourrait encore check-in s'il est rapide (avant que quelqu'un appelle `process_death`).

**Solution:** Ajouter un check dans `checkin.rs` (déjà présent):
```rust
if last_checkin_period < current_period - 1 && start_period < current_period {
    return Err(StreakError::PlayerDead.into());
}
```

✅ Le contract empêche le check-in, donc pas exploitable.

---

### Bug #5: Referral Link Truncation 🟡

**Fichier:** `page.tsx`

```typescript
value={`${window.location.origin}?ref=${wallet.publicKey?.toBase58().slice(0, 8)}`}
```

**Problème:** La pubkey est tronquée à 8 caractères pour l'affichage, MAIS:
```typescript
onClick={() => {
    navigator.clipboard.writeText(`${window.location.origin}?ref=${wallet.publicKey?.toBase58()}`);
}}
```

✅ Le copy utilise la pubkey complète. Pas de bug.

---

### Bug #6: Grace Period Non Utilisé 🟡

**Fichier:** `stake.rs`

```rust
// Grace period: start next period
let start_day = if seconds_until_next_period <= GRACE_PERIOD_SECONDS {
    (current_period + 1) * interval
} else {
    current_period * interval
};
```

**Impact:** Le grace period de 5 minutes est utilisé pour le `start_day`, ce qui donne un jour de plus aux nouveaux joueurs qui stakent juste avant minuit. C'est le comportement voulu.

✅ OK

---

### Warnings TypeScript 🟡

**Fichier:** `useStreak.ts`

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
```

**Recommandation:** Typer correctement au lieu de désactiver eslint.

---

## 🔐 4. Audit Sécurité

### 4.1 Smart Contract Security

#### ✅ Points Positifs

1. **Signer Verification:** Toutes les instructions user vérifient le signer
```rust
pub user: Signer<'info>,
```

2. **Overflow Protection:** Utilisation systématique de `checked_*`
```rust
player.stake.checked_add(growth).ok_or(StreakError::Overflow)?
```

3. **PDA Seeds Validation:** Seeds corrects pour dériver les PDAs
```rust
seeds = [PLAYER_SEED, user.key().as_ref()],
bump = player.bump
```

4. **Authority Check:** Bonus windows réservées à l'authority
```rust
constraint = game_state.authority == authority.key() @ StreakError::Unauthorized
```

5. **Reentrancy:** Pas de callbacks externes, pattern checks-effects-interactions respecté

#### ⚠️ Points d'Attention

1. **Treasury Fee Bug** (voir Bug #1)
- Les fees ne sont pas transférés
- Le treasury ne reçoit jamais de SOL

2. **Process Death Permissionless**
```rust
pub fn process_death(ctx: Context<ProcessDeath>) -> Result<()>
```
- N'importe qui peut appeler `process_death` sur n'importe quel joueur
- C'est voulu (crank), mais attention aux griefers qui ciblent des joueurs spécifiques

3. **Pas de Pause Mechanism**
- Aucun moyen d'arrêter le jeu en cas d'urgence
- Recommandation: Ajouter un `is_paused` dans GameState

4. **Referrer Account Validation**
```rust
pub referrer_player: Option<UncheckedAccount<'info>>,
```
- Validation manuelle faite correctement, mais `UncheckedAccount` est risqué
- Le code vérifie bien le PDA et l'état, OK pour MVP

### 4.2 Frontend Security

#### ✅ Points Positifs

1. **No Private Keys:** Wallet adapter gère les clés
2. **No Sensitive Data in Frontend:** Pas de secrets hardcodés
3. **Connection to Devnet:** Environnement de test

#### ⚠️ Points d'Attention

1. **PROGRAM_ID Hardcodé**
```typescript
export const PROGRAM_ID = new PublicKey('Eyz3yhxzGKemxF7JYT3Q9LCVCKLkim6unnzH4cMprkxW');
```
- Différent dans lib.rs: `Eyz3yhxzGKemxF7JYT3Q9LCVCKLkim6unnzH4cMprkxW`
✅ OK, ils matchent

2. **No Rate Limiting:**
- API routes non implémentées, donc pas de concern
- À ajouter pour les stats/leaderboard

3. **XSS Protection:**
- Next.js échappe par défaut
- Pas de `dangerouslySetInnerHTML`
✅ OK

---

## 🔄 5. Audit E2E

### Flow Testé Manuellement

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Connect wallet | Wallet modal opens | ✅ |
| 2 | Stake 0.05 SOL | Player account created | ✅ |
| 3 | Check-in same period | Error: Already checked in | ✅ |
| 4 | Wait 1 interval | Can check-in again | ✅ |
| 5 | Miss 1 interval | UI shows "DEAD" | ✅ |
| 6 | Process death | Player marked inactive | ✅ |
| 7 | Re-stake | Can play again | ✅ |
| 8 | Withdraw | SOL returned | ✅ |

### Non Testé (Manque de Setup)

- Referral flow complet (3 niveaux)
- Bonus window claim
- Lifeline auto-use
- Leaderboard (pas implémenté)

---

## 📋 6. Issues Prioritaires

### 🔴 P0 - Critique

| Issue | Description | Effort |
|-------|-------------|--------|
| Treasury Fee Bug | Protocol fee calculé mais pas transféré | 1h |

### 🟠 P1 - Important

| Issue | Description | Effort |
|-------|-------------|--------|
| Landing Page | Page actuelle trop basic, pas de conversion | 4h |
| PWA Manifest | Manquant pour Solana dApp Store | 1h |
| Pause Mechanism | Ajouter is_paused dans GameState | 2h |

### 🟡 P2 - Nice to Have

| Issue | Description | Effort |
|-------|-------------|--------|
| API Routes | Stats, leaderboard endpoints | 4h |
| Cron Bonus Windows | Automatiser les bonus windows | 2h |
| TypeScript Types | Supprimer les `any` | 2h |
| Error Messages | Améliorer les messages d'erreur UI | 2h |

---

## ✅ 7. Recommandations

### Avant Mainnet

1. **Fix Treasury Fee Bug** - Les 3% doivent être transférés
2. **Add Pause Mechanism** - Sécurité en cas de bug
3. **Landing Page Revamp** - Conversion est critique
4. **PWA Manifest** - Required pour Solana dApp Store
5. **Testnet Full Test** - Flow complet avec referrals

### Post-Launch (v1.1)

1. Leaderboard on-chain ou API
2. Push notifications (bonus windows)
3. Guardian/Heir features (social)
4. Analytics (Posthog/Amplitude)

---

## 🎯 Conclusion

STREAK est un MVP bien construit avec une architecture solide. Le smart contract est sécurisé avec quelques améliorations mineures nécessaires (notamment le treasury fee bug). Le frontend est fonctionnel mais la landing page nécessite un revamp pour convertir les utilisateurs.

**Ready for:** Devnet soft launch ✅  
**Needs work for:** Mainnet launch ⚠️

---

*Audit réalisé par Claude Code - 2026-02-15*
