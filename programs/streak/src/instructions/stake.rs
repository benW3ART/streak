use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::{GameState, Player};
use crate::constants::{GAME_STATE_SEED, PLAYER_SEED, MIN_STAKE, GRACE_PERIOD_SECONDS, REFS_PER_LIFELINE};
use crate::errors::StreakError;

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(
        mut,
        seeds = [GAME_STATE_SEED],
        bump = game_state.bump
    )]
    pub game_state: Account<'info, GameState>,

    #[account(
        init_if_needed,
        payer = user,
        space = Player::SIZE,
        seeds = [PLAYER_SEED, user.key().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,

    /// Optional referrer's player account - validated manually in handler
    /// CHECK: This account is validated manually because optional PDA accounts
    /// cannot have seed constraints that reference their own fields
    #[account(mut)]
    pub referrer_player: Option<UncheckedAccount<'info>>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Stake>, amount: u64, referrer: Option<Pubkey>) -> Result<()> {
    // Validate minimum stake
    require!(amount >= MIN_STAKE, StreakError::BelowMinimumStake);

    // Validate user has enough funds
    require!(
        ctx.accounts.user.lamports() >= amount,
        StreakError::InsufficientFunds
    );

    let player = &mut ctx.accounts.player;

    // Check if player already has an active stake (prevent double staking)
    // If wallet is set and is_active is true, they're already playing
    if player.wallet != Pubkey::default() && player.is_active {
        return Err(StreakError::AlreadyStaked.into());
    }

    // Check if this is a re-stake (player died and is starting over)
    let is_restake = player.wallet != Pubkey::default() && !player.is_active;

    // Validate referrer if provided (only for new players, not re-stakes)
    if !is_restake {
        if let Some(ref_pubkey) = referrer {
            require!(ref_pubkey != ctx.accounts.user.key(), StreakError::SelfReferral);

            // Validate referrer player account if provided
            if let Some(ref referrer_acc_info) = ctx.accounts.referrer_player {
                // Verify it's the correct PDA
                let (expected_pda, _bump) = Pubkey::find_program_address(
                    &[PLAYER_SEED, ref_pubkey.as_ref()],
                    ctx.program_id
                );
                require!(referrer_acc_info.key() == expected_pda, StreakError::InvalidReferrer);

                // Deserialize and validate the referrer account
                let referrer_data = referrer_acc_info.try_borrow_data()?;
                // Skip 8-byte discriminator
                if referrer_data.len() < 8 + 32 + 8 + 4 + 8 + 8 + 8 + 1 {
                    return Err(StreakError::InvalidReferrer.into());
                }
                // Check wallet matches (starts at offset 8 after discriminator)
                let wallet_bytes: [u8; 32] = referrer_data[8..40].try_into().unwrap();
                let referrer_wallet = Pubkey::from(wallet_bytes);
                require!(referrer_wallet == ref_pubkey, StreakError::InvalidReferrer);

                // Check is_active (offset: 8 + 32 + 8 + 4 + 8 + 8 + 8 = 76)
                let is_active = referrer_data[76] != 0;
                require!(is_active, StreakError::InvalidReferrer);
            }
        }
    }

    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;
    let game_state = &ctx.accounts.game_state;
    let interval = game_state.checkin_interval_seconds;

    // Calculate current period based on configurable interval
    let current_period = current_time / interval;

    // Check for grace period (last 5 minutes of period)
    let seconds_into_period = current_time % interval;
    let seconds_until_next_period = interval - seconds_into_period;
    let start_day = if seconds_until_next_period <= GRACE_PERIOD_SECONDS {
        // Grace period: start next period (store as timestamp of period start)
        (current_period + 1) * interval
    } else {
        // Normal: start this period (store as timestamp of period start)
        current_period * interval
    };

    // Transfer SOL from user to game state PDA
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.game_state.to_account_info(),
        },
    );
    system_program::transfer(cpi_context, amount)?;

    // Preserve some stats for re-stakers
    let prev_referral_earnings = if is_restake { player.referral_earnings } else { 0 };
    let prev_direct_referrals = if is_restake { player.direct_referrals } else { 0 };
    let prev_lifelines = if is_restake { player.lifelines } else { 0 };
    let prev_referrer = if is_restake { player.referrer } else { referrer };

    // Initialize/reset player account
    player.wallet = ctx.accounts.user.key();
    player.stake = amount;
    player.streak_days = 1;
    player.last_checkin = current_time;
    player.start_day = start_day;
    player.pending_rewards = 0;
    player.is_active = true;
    player.referrer = prev_referrer;
    player.direct_referrals = prev_direct_referrals;
    player.lifelines = prev_lifelines;
    player.lifelines_used = 0;
    player.last_bonus_claimed = 0;
    player.total_bonus_claims = 0;
    player.referral_earnings = prev_referral_earnings;
    player.bump = ctx.bumps.player;

    // Update referrer's direct_referrals count and lifelines (only for new players)
    // Since referrer_player is an UncheckedAccount, we need to manually update it
    if !is_restake && referrer.is_some() {
        if let Some(ref referrer_acc_info) = ctx.accounts.referrer_player {
            let mut referrer_data = referrer_acc_info.try_borrow_mut_data()?;

            // Player struct layout after 8-byte discriminator:
            // wallet: 32, stake: 8, streak_days: 4, last_checkin: 8, start_day: 8,
            // pending_rewards: 8, is_active: 1, referrer: 33, direct_referrals: 4, lifelines: 1
            // direct_referrals offset: 8 + 32 + 8 + 4 + 8 + 8 + 8 + 1 + 33 = 110
            // lifelines offset: 110 + 4 = 114

            const DIRECT_REFERRALS_OFFSET: usize = 110;
            const LIFELINES_OFFSET: usize = 114;

            // Read current direct_referrals (u32 little-endian)
            let current_referrals = u32::from_le_bytes(
                referrer_data[DIRECT_REFERRALS_OFFSET..DIRECT_REFERRALS_OFFSET + 4].try_into().unwrap()
            );
            let new_referrals = current_referrals.checked_add(1).unwrap();

            // Write new direct_referrals
            referrer_data[DIRECT_REFERRALS_OFFSET..DIRECT_REFERRALS_OFFSET + 4]
                .copy_from_slice(&new_referrals.to_le_bytes());

            // Award lifeline every 3 referrals
            let new_lifeline_count = new_referrals / REFS_PER_LIFELINE;
            let old_lifeline_count = current_referrals / REFS_PER_LIFELINE;
            if new_lifeline_count > old_lifeline_count {
                // Read current lifelines (u8)
                let current_lifelines = referrer_data[LIFELINES_OFFSET];
                let updated_lifelines = current_lifelines.checked_add(1).unwrap_or(255);
                referrer_data[LIFELINES_OFFSET] = updated_lifelines;
            }
        }
    }

    // Update game state
    let game_state = &mut ctx.accounts.game_state;
    game_state.total_players = game_state.total_players.checked_add(1).ok_or(StreakError::Overflow)?;
    game_state.total_pool = game_state.total_pool.checked_add(amount).ok_or(StreakError::Overflow)?;

    if is_restake {
        msg!("Player re-staked {} lamports (starting over)", amount);
    } else {
        msg!("Player staked {} lamports", amount);
    }
    msg!("Start day: {}", start_day);

    Ok(())
}
