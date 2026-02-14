use anchor_lang::prelude::*;
use crate::state::GameState;
use crate::constants::GAME_STATE_SEED;
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct SetCheckinInterval<'info> {
    #[account(
        mut,
        seeds = [GAME_STATE_SEED],
        bump = game_state.bump,
        has_one = authority @ StreakError::Unauthorized
    )]
    pub game_state: Account<'info, GameState>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetCheckinInterval>, interval_seconds: i64) -> Result<()> {
    require!(interval_seconds > 0, StreakError::InvalidInterval);

    let game_state = &mut ctx.accounts.game_state;
    let old_interval = game_state.checkin_interval_seconds;
    game_state.checkin_interval_seconds = interval_seconds;

    msg!("Check-in interval updated: {} -> {} seconds", old_interval, interval_seconds);
    msg!("That's {} minutes", interval_seconds / 60);

    Ok(())
}
