use anchor_lang::prelude::*;
use crate::state::GameState;
use crate::constants::{GAME_STATE_SEED, BONUS_DURATION_SECONDS};
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct StartBonusWindow<'info> {
    #[account(
        mut,
        seeds = [GAME_STATE_SEED],
        bump = game_state.bump,
        constraint = game_state.authority == authority.key() @ StreakError::Unauthorized
    )]
    pub game_state: Account<'info, GameState>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<StartBonusWindow>, window_id: u64) -> Result<()> {
    let game_state = &mut ctx.accounts.game_state;
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    // Set new bonus window
    game_state.current_bonus_window = window_id;
    game_state.bonus_window_end = current_time + BONUS_DURATION_SECONDS;

    msg!("Bonus window {} started!", window_id);
    msg!("Ends at: {}", game_state.bonus_window_end);

    Ok(())
}
