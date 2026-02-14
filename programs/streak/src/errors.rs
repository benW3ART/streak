use anchor_lang::prelude::*;

#[error_code]
pub enum StreakError {
    #[msg("Player already has an active stake")]
    AlreadyStaked,

    #[msg("Stake amount is below minimum (0.05 SOL)")]
    BelowMinimumStake,

    #[msg("Insufficient funds in wallet")]
    InsufficientFunds,

    #[msg("Player does not have an active stake")]
    NotStaked,

    #[msg("Player has already checked in today")]
    AlreadyCheckedIn,

    #[msg("Player is dead (missed check-in)")]
    PlayerDead,

    #[msg("Player is not dead")]
    PlayerNotDead,

    #[msg("Player already processed")]
    AlreadyProcessed,

    #[msg("No bonus window is currently active")]
    NoBonusWindow,

    #[msg("Bonus window has expired")]
    BonusWindowExpired,

    #[msg("Already claimed this bonus window")]
    AlreadyClaimed,

    #[msg("No rewards to claim")]
    NoRewards,

    #[msg("Unauthorized - not the authority")]
    Unauthorized,

    #[msg("Invalid referrer")]
    InvalidReferrer,

    #[msg("Cannot refer yourself")]
    SelfReferral,

    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Invalid timestamp")]
    InvalidTimestamp,

    #[msg("Invalid check-in interval (must be > 0)")]
    InvalidInterval,
}
