use anchor_lang::prelude::*;
use crate::state::{GameState, Player};
use crate::constants::{GAME_STATE_SEED, PLAYER_SEED, PROTOCOL_FEE_BPS, REFERRAL_CUT_BPS, BPS_DENOMINATOR};
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct ProcessDeath<'info> {
    #[account(
        mut,
        seeds = [GAME_STATE_SEED],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,

    /// CHECK: Treasury receives protocol fees
    #[account(
        mut,
        constraint = treasury.key() == game_state.treasury
    )]
    pub treasury: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [PLAYER_SEED, dead_player.wallet.as_ref()],
        bump = dead_player.bump
    )]
    pub dead_player: Account<'info, Player>,

    /// Level 1 referrer (optional)
    #[account(mut)]
    pub referrer_1: Option<Account<'info, Player>>,

    /// Level 2 referrer (optional)
    #[account(mut)]
    pub referrer_2: Option<Account<'info, Player>>,

    /// Level 3 referrer (optional)
    #[account(mut)]
    pub referrer_3: Option<Account<'info, Player>>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ProcessDeath>) -> Result<()> {
    let dead_player = &mut ctx.accounts.dead_player;
    let game_state = &mut ctx.accounts.game_state;
    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    // Use configurable interval
    let interval = game_state.checkin_interval_seconds;
    let current_period = current_time / interval;

    // Validate player is active
    require!(dead_player.is_active, StreakError::NotStaked);

    // Check if player should actually die
    let last_checkin_period = dead_player.last_checkin / interval;
    let start_period = dead_player.start_day / interval;

    // Player dies if they haven't checked in this period and it's not their start period
    let should_die = last_checkin_period < current_period && start_period < current_period;
    require!(should_die, StreakError::PlayerNotDead);

    // Check for lifeline
    if dead_player.lifelines > 0 {
        // Use lifeline - player survives
        dead_player.lifelines = dead_player.lifelines.checked_sub(1).unwrap();
        dead_player.lifelines_used = dead_player.lifelines_used.checked_add(1).unwrap_or(255);
        dead_player.last_checkin = current_time; // Reset check-in to today

        msg!("Lifeline used! Player survives. Remaining lifelines: {}", dead_player.lifelines);
        return Ok(());
    }

    // No lifeline - player dies
    let stake = dead_player.stake;

    // Calculate distributions
    let protocol_fee = stake
        .checked_mul(PROTOCOL_FEE_BPS)
        .ok_or(StreakError::Overflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(StreakError::Overflow)?;

    let referral_cut = stake
        .checked_mul(REFERRAL_CUT_BPS)
        .ok_or(StreakError::Overflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(StreakError::Overflow)?;

    let mut total_referral_paid: u64 = 0;

    // Pay referrers (5% each, up to 3 levels)
    if let Some(ref mut r1) = ctx.accounts.referrer_1 {
        if dead_player.referrer == Some(r1.wallet) {
            r1.pending_rewards = r1.pending_rewards.checked_add(referral_cut).ok_or(StreakError::Overflow)?;
            r1.referral_earnings = r1.referral_earnings.checked_add(referral_cut).ok_or(StreakError::Overflow)?;
            total_referral_paid = total_referral_paid.checked_add(referral_cut).ok_or(StreakError::Overflow)?;

            // Level 2
            if let Some(ref mut r2) = ctx.accounts.referrer_2 {
                if r1.referrer == Some(r2.wallet) {
                    r2.pending_rewards = r2.pending_rewards.checked_add(referral_cut).ok_or(StreakError::Overflow)?;
                    r2.referral_earnings = r2.referral_earnings.checked_add(referral_cut).ok_or(StreakError::Overflow)?;
                    total_referral_paid = total_referral_paid.checked_add(referral_cut).ok_or(StreakError::Overflow)?;

                    // Level 3
                    if let Some(ref mut r3) = ctx.accounts.referrer_3 {
                        if r2.referrer == Some(r3.wallet) {
                            r3.pending_rewards = r3.pending_rewards.checked_add(referral_cut).ok_or(StreakError::Overflow)?;
                            r3.referral_earnings = r3.referral_earnings.checked_add(referral_cut).ok_or(StreakError::Overflow)?;
                            total_referral_paid = total_referral_paid.checked_add(referral_cut).ok_or(StreakError::Overflow)?;
                        }
                    }
                }
            }
        }
    }

    // Calculate pool addition (stake - protocol fee - referral cuts)
    let pool_addition = stake
        .checked_sub(protocol_fee)
        .ok_or(StreakError::Overflow)?
        .checked_sub(total_referral_paid)
        .ok_or(StreakError::Overflow)?;

    // Transfer protocol fee to treasury
    // Note: The actual SOL transfer happens from the game_state PDA
    // For now we track it in the pool and handle transfers separately

    // Update game state
    game_state.total_deaths = game_state.total_deaths.checked_add(1).ok_or(StreakError::Overflow)?;
    game_state.total_players = game_state.total_players.checked_sub(1).ok_or(StreakError::Overflow)?;
    game_state.last_death_timestamp = current_time;
    // Pool changes: loses the player's stake, but keeps pool_addition
    game_state.total_pool = game_state.total_pool
        .checked_sub(stake)
        .ok_or(StreakError::Overflow)?
        .checked_add(pool_addition)
        .ok_or(StreakError::Overflow)?;

    // Mark player as dead
    dead_player.is_active = false;
    dead_player.stake = 0;
    dead_player.streak_days = 0;

    msg!("Player died! Lost: {} lamports", stake);
    msg!("Protocol fee: {} lamports", protocol_fee);
    msg!("Referral payouts: {} lamports", total_referral_paid);
    msg!("Added to pool: {} lamports", pool_addition);

    Ok(())
}
