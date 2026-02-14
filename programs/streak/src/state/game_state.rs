use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct GameState {
    /// Admin authority who can start bonus windows
    pub authority: Pubkey,

    /// Treasury wallet for protocol fees
    pub treasury: Pubkey,

    /// Total number of active players
    pub total_players: u64,

    /// Total SOL in the pool (lamports)
    pub total_pool: u64,

    /// Timestamp of the last death
    pub last_death_timestamp: i64,

    /// Total number of deaths ever
    pub total_deaths: u64,

    /// Current bonus window ID (0 = no active window)
    pub current_bonus_window: u64,

    /// Timestamp when current bonus window ends
    pub bonus_window_end: i64,

    /// Check-in interval in seconds (default: 86400 = 24 hours)
    /// Can be set lower for testing (e.g., 300 = 5 minutes)
    pub checkin_interval_seconds: i64,

    /// PDA bump seed
    pub bump: u8,
}

impl GameState {
    pub const SIZE: usize = 8 + // discriminator
        32 + // authority
        32 + // treasury
        8 + // total_players
        8 + // total_pool
        8 + // last_death_timestamp
        8 + // total_deaths
        8 + // current_bonus_window
        8 + // bonus_window_end
        8 + // checkin_interval_seconds
        1 + // bump
        56; // padding (reduced from 64)

    pub fn is_bonus_window_active(&self, current_time: i64) -> bool {
        self.current_bonus_window > 0 && current_time < self.bonus_window_end
    }
}
