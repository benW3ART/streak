use anchor_lang::prelude::*;
use crate::state::GameState;
use crate::constants::{GAME_STATE_SEED, SECONDS_PER_DAY};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = GameState::SIZE,
        seeds = [GAME_STATE_SEED],
        bump
    )]
    pub game_state: Account<'info, GameState>,

    /// CHECK: Treasury wallet to receive protocol fees
    pub treasury: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let game_state = &mut ctx.accounts.game_state;

    game_state.authority = ctx.accounts.authority.key();
    game_state.treasury = ctx.accounts.treasury.key();
    game_state.total_players = 0;
    game_state.total_pool = 0;
    game_state.last_death_timestamp = 0;
    game_state.total_deaths = 0;
    game_state.current_bonus_window = 0;
    game_state.bonus_window_end = 0;
    game_state.checkin_interval_seconds = SECONDS_PER_DAY; // Default: 24 hours
    game_state.bump = ctx.bumps.game_state;

    msg!("Game initialized with authority: {}", game_state.authority);
    msg!("Treasury: {}", game_state.treasury);
    msg!("Check-in interval: {} seconds", game_state.checkin_interval_seconds);

    Ok(())
}
