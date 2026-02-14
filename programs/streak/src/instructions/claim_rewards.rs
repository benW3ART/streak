use anchor_lang::prelude::*;
use crate::state::{GameState, Player};
use crate::constants::{GAME_STATE_SEED, PLAYER_SEED};
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
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

pub fn handler(ctx: Context<ClaimRewards>) -> Result<()> {
    let player = &mut ctx.accounts.player;
    let game_state = &ctx.accounts.game_state;

    // Validate there are rewards to claim
    require!(player.pending_rewards > 0, StreakError::NoRewards);

    let rewards = player.pending_rewards;

    // Transfer SOL from game state PDA to user
    let game_state_info = ctx.accounts.game_state.to_account_info();
    let user_info = ctx.accounts.user.to_account_info();

    **game_state_info.try_borrow_mut_lamports()? = game_state_info
        .lamports()
        .checked_sub(rewards)
        .ok_or(StreakError::InsufficientFunds)?;

    **user_info.try_borrow_mut_lamports()? = user_info
        .lamports()
        .checked_add(rewards)
        .ok_or(StreakError::Overflow)?;

    // Reset pending rewards
    player.pending_rewards = 0;

    msg!("Claimed {} lamports in rewards", rewards);

    Ok(())
}
