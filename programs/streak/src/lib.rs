use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("Eyz3yhxzGKemxF7JYT3Q9LCVCKLkim6unnzH4cMprkxW");

#[program]
pub mod streak {
    use super::*;

    /// Initialize the game state (one-time setup)
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    /// Stake SOL to enter the game
    pub fn stake(ctx: Context<Stake>, amount: u64, referrer: Option<Pubkey>) -> Result<()> {
        instructions::stake::handler(ctx, amount, referrer)
    }

    /// Daily check-in to keep streak alive
    pub fn checkin(ctx: Context<Checkin>) -> Result<()> {
        instructions::checkin::handler(ctx)
    }

    /// Claim bonus during active window
    pub fn claim_bonus(ctx: Context<ClaimBonus>) -> Result<()> {
        instructions::claim_bonus::handler(ctx)
    }

    /// Process a player's death (permissionless crank)
    pub fn process_death(ctx: Context<ProcessDeath>) -> Result<()> {
        instructions::process_death::handler(ctx)
    }

    /// Withdraw stake and exit the game
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        instructions::withdraw::handler(ctx)
    }

    /// Claim pending rewards from referral deaths
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        instructions::claim_rewards::handler(ctx)
    }

    /// Start a new bonus window (authority only)
    pub fn start_bonus_window(ctx: Context<StartBonusWindow>, window_id: u64) -> Result<()> {
        instructions::start_bonus_window::handler(ctx, window_id)
    }

    /// Set the check-in interval (authority only, for testing)
    pub fn set_checkin_interval(ctx: Context<SetCheckinInterval>, interval_seconds: i64) -> Result<()> {
        instructions::set_checkin_interval::handler(ctx, interval_seconds)
    }
}
