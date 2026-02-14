use anchor_lang::prelude::*;
use crate::state::{GameState, Player};
use crate::constants::{GAME_STATE_SEED, PLAYER_SEED, DAILY_GROWTH_BPS, BPS_DENOMINATOR};
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct Checkin<'info> {
    #[account(
        mut,
        seeds = [GAME_STATE_SEED],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,

    #[account(
        mut,
        seeds = [PLAYER_SEED, user.key().as_ref()],
        bump = player.bump,
        constraint = player.wallet == user.key()
    )]
    pub player: Account<'info, Player>,

    pub user: Signer<'info>,
}

pub fn handler(ctx: Context<Checkin>) -> Result<()> {
    let player = &mut ctx.accounts.player;
    let game_state = &ctx.accounts.game_state;
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    // Use configurable interval (default 86400 = 24 hours)
    let interval = game_state.checkin_interval_seconds;
    let current_period = current_time / interval;

    // Validate player is active
    require!(player.is_active, StreakError::NotStaked);

    // Check if player should be dead (missed previous period)
    let last_checkin_period = player.last_checkin / interval;
    let start_period = player.start_day / interval;
    if last_checkin_period < current_period - 1 && start_period < current_period {
        return Err(StreakError::PlayerDead.into());
    }

    // Check if already checked in this period
    require!(last_checkin_period < current_period, StreakError::AlreadyCheckedIn);

    // Apply daily growth (0.1%)
    let growth = player.stake
        .checked_mul(DAILY_GROWTH_BPS)
        .ok_or(StreakError::Overflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(StreakError::Overflow)?;

    player.stake = player.stake.checked_add(growth).ok_or(StreakError::Overflow)?;
    player.streak_days = player.streak_days.checked_add(1).ok_or(StreakError::Overflow)?;
    player.last_checkin = current_time;

    // Note: In a real implementation, growth might come from the pool
    // For MVP, we just increase player's stake (funded by deaths)

    msg!("Check-in successful! Day: {}", player.streak_days);
    msg!("Interval: {} seconds ({} minutes)", interval, interval / 60);
    msg!("New stake: {} lamports (+{} growth)", player.stake, growth);

    Ok(())
}
