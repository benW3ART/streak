use anchor_lang::prelude::*;
use crate::state::{GameState, Player};
use crate::constants::{GAME_STATE_SEED, PLAYER_SEED};
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct Withdraw<'info> {
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

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Withdraw>) -> Result<()> {
    let player = &mut ctx.accounts.player;

    // Validate player is active
    require!(player.is_active, StreakError::NotStaked);

    // Calculate total to withdraw (stake + pending rewards)
    let total_withdraw = player.stake
        .checked_add(player.pending_rewards)
        .ok_or(StreakError::Overflow)?;

    // Store values before modifying player
    let player_stake = player.stake;
    let streak_achieved = player.streak_days;

    // Reset player (keep account for re-staking)
    player.is_active = false;
    player.stake = 0;
    player.streak_days = 0;
    player.pending_rewards = 0;

    // Transfer SOL from game state PDA to user
    let game_state_info = ctx.accounts.game_state.to_account_info();
    let user_info = ctx.accounts.user.to_account_info();

    **game_state_info.try_borrow_mut_lamports()? = game_state_info
        .lamports()
        .checked_sub(total_withdraw)
        .ok_or(StreakError::InsufficientFunds)?;

    **user_info.try_borrow_mut_lamports()? = user_info
        .lamports()
        .checked_add(total_withdraw)
        .ok_or(StreakError::Overflow)?;

    // Update game state
    let game_state = &mut ctx.accounts.game_state;
    game_state.total_players = game_state.total_players.checked_sub(1).ok_or(StreakError::Overflow)?;
    game_state.total_pool = game_state.total_pool.checked_sub(player_stake).ok_or(StreakError::Overflow)?;

    msg!("Withdrew {} lamports", total_withdraw);
    msg!("Final streak: {} days", streak_achieved);

    Ok(())
}
