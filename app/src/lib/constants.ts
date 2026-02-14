import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey('Eyz3yhxzGKemxF7JYT3Q9LCVCKLkim6unnzH4cMprkxW');

export const GAME_STATE_SEED = Buffer.from('game_state');
export const PLAYER_SEED = Buffer.from('player');

export const MIN_STAKE = 0.05; // SOL
export const MAX_STAKE = 2; // SOL
export const MIN_STAKE_LAMPORTS = 50_000_000; // 0.05 SOL in lamports
export const MAX_STAKE_LAMPORTS = 2_000_000_000; // 2 SOL in lamports
export const STAKE_PRESETS = [0.05, 0.1, 0.5, 1, 2]; // SOL amounts for preset buttons
export const DAILY_GROWTH_BPS = 10; // 0.1%
export const PROTOCOL_FEE_BPS = 300; // 3%
export const REFERRAL_CUT_BPS = 500; // 5%
export const BONUS_AMOUNT = 100_000; // lamports
export const BONUS_DURATION_SECONDS = 900; // 15 minutes
export const LIFELINES_PER_REFERRALS = 3;
export const MAX_REFERRAL_LEVELS = 3;
export const SECONDS_PER_DAY = 86400;
