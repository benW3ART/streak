use anchor_lang::prelude::*;
use crate::state::{GameState, Player};
use crate::constants::{GAME_STATE_SEED, PLAYER_SEED, BONUS_GROWTH_BPS, BPS_DENOMINATOR};
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct ClaimBonus<'info> {
    #[account(
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

pub fn handler(ctx: Context<ClaimBonus>) -> Result<()> {
    let game_state = &ctx.accounts.game_state;
    let player = &mut ctx.accounts.player;
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    // Validate player is active
    require!(player.is_active, StreakError::NotStaked);

    // Check if bonus window is active
    require!(
        game_state.is_bonus_window_active(current_time),
        StreakError::NoBonusWindow
    );

    // Check if player already claimed this window
    require!(
        player.last_bonus_claimed < game_state.current_bonus_window,
        StreakError::AlreadyClaimed
    );

    // Apply bonus growth (0.05%)
    let growth = player.stake
        .checked_mul(BONUS_GROWTH_BPS)
        .ok_or(StreakError::Overflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(StreakError::Overflow)?;

    player.stake = player.stake.checked_add(growth).ok_or(StreakError::Overflow)?;
    player.last_bonus_claimed = game_state.current_bonus_window;
    player.total_bonus_claims = player.total_bonus_claims.checked_add(1).ok_or(StreakError::Overflow)?;

    msg!("Bonus claimed! Window: {}", game_state.current_bonus_window);
    msg!("Bonus growth: {} lamports", growth);
    msg!("New stake: {} lamports", player.stake);

    Ok(())
}
