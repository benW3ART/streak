use anchor_lang::prelude::*;

// Staking
pub const MIN_STAKE: u64 = 50_000_000; // 0.05 SOL in lamports
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

// Growth rates (basis points, 1 bp = 0.01%)
pub const DAILY_GROWTH_BPS: u64 = 10; // 0.1%
pub const BONUS_GROWTH_BPS: u64 = 5; // 0.05%
pub const BPS_DENOMINATOR: u64 = 10_000;

// Fees (basis points)
pub const PROTOCOL_FEE_BPS: u64 = 300; // 3%
pub const REFERRAL_CUT_BPS: u64 = 500; // 5% per level

// Referral
pub const MAX_REFERRAL_DEPTH: u8 = 3;
pub const REFS_PER_LIFELINE: u32 = 3;

// Time
pub const SECONDS_PER_DAY: i64 = 86_400;
pub const GRACE_PERIOD_SECONDS: i64 = 300; // 5 minutes before midnight
pub const BONUS_DURATION_SECONDS: i64 = 900; // 15 minutes

// Seeds
pub const GAME_STATE_SEED: &[u8] = b"game_state";
pub const PLAYER_SEED: &[u8] = b"player";
pub const VAULT_SEED: &[u8] = b"vault";

// Account sizes
pub const GAME_STATE_SIZE: usize = 8 + // discriminator
    32 + // authority
    32 + // treasury
    8 + // total_players
    8 + // total_pool
    8 + // last_death_timestamp
    8 + // total_deaths
    8 + // current_bonus_window
    8 + // bonus_window_end
    1 + // bump
    64; // padding for future use

pub const PLAYER_SIZE: usize = 8 + // discriminator
    32 + // wallet
    8 + // stake
    4 + // streak_days
    8 + // last_checkin
    8 + // start_day
    8 + // pending_rewards
    1 + // is_active
    33 + // referrer (Option<Pubkey>)
    4 + // direct_referrals
    1 + // lifelines
    1 + // lifelines_used
    8 + // last_bonus_claimed
    4 + // total_bonus_claims
    8 + // referral_earnings
    1 + // bump
    64; // padding for future use
