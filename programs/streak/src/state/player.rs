use anchor_lang::prelude::*;
use crate::constants::SECONDS_PER_DAY;

#[account]
#[derive(Default)]
pub struct Player {
    /// Player's wallet address
    pub wallet: Pubkey,

    /// Current stake amount in lamports
    pub stake: u64,

    /// Current streak in days
    pub streak_days: u32,

    /// Unix timestamp of last check-in
    pub last_checkin: i64,

    /// UTC day number when player started (for grace period)
    pub start_day: i64,

    /// Pending rewards from referral deaths
    pub pending_rewards: u64,

    /// Whether player has an active stake
    pub is_active: bool,

    /// Wallet that referred this player (optional)
    pub referrer: Option<Pubkey>,

    /// Number of direct referrals
    pub direct_referrals: u32,

    /// Available lifelines
    pub lifelines: u8,

    /// Total lifelines ever used
    pub lifelines_used: u8,

    /// Last bonus window ID that was claimed
    pub last_bonus_claimed: u64,

    /// Total number of bonus claims ever
    pub total_bonus_claims: u32,

    /// Total earnings from referral deaths
    pub referral_earnings: u64,

    /// PDA bump seed
    pub bump: u8,
}

impl Player {
    pub const SIZE: usize = 8 + // discriminator
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
        64; // padding

    /// Get the UTC day number from a timestamp
    pub fn get_utc_day(timestamp: i64) -> i64 {
        timestamp / SECONDS_PER_DAY
    }

    /// Check if player has checked in on the given day
    pub fn has_checked_in_on_day(&self, day: i64) -> bool {
        Self::get_utc_day(self.last_checkin) >= day
    }

    /// Check if player has checked in today
    pub fn has_checked_in_today(&self, current_time: i64) -> bool {
        let today = Self::get_utc_day(current_time);
        self.has_checked_in_on_day(today)
    }

    /// Check if player missed yesterday's check-in (should die)
    pub fn should_die(&self, current_time: i64) -> bool {
        if !self.is_active {
            return false;
        }

        let today = Self::get_utc_day(current_time);
        let last_checkin_day = Self::get_utc_day(self.last_checkin);

        // Player dies if they haven't checked in since before today
        // and it's not their start day
        last_checkin_day < today - 1 ||
        (last_checkin_day < today && self.start_day < today)
    }

    /// Calculate lifelines earned from referrals
    pub fn calculate_lifelines(&self) -> u8 {
        (self.direct_referrals / 3) as u8
    }
}
