export type Streak = {
  address: string;
  metadata: {
    name: string;
    version: string;
    spec: string;
    description: string;
  };
  instructions: Array<{
    name: string;
    discriminator: number[];
    accounts: Array<{
      name: string;
      writable?: boolean;
      signer?: boolean;
      optional?: boolean;
      pda?: {
        seeds: Array<{
          kind: string;
          value?: number[];
          path?: string;
        }>;
      };
      address?: string;
    }>;
    args: Array<{
      name: string;
      type: string | { option: string };
    }>;
  }>;
  accounts: Array<{
    name: string;
    discriminator: number[];
  }>;
  errors: Array<{
    code: number;
    name: string;
    msg: string;
  }>;
  types: Array<{
    name: string;
    type: {
      kind: string;
      fields: Array<{
        name: string;
        type: string | { option: string };
      }>;
    };
  }>;
};

export const IDL: Streak = {
  address: "Eyz3yhxzGKemxF7JYT3Q9LCVCKLkim6unnzH4cMprkxW",
  metadata: {
    name: "streak",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Daily check-in game for Solana Seeker"
  },
  instructions: [
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "authority", writable: true, signer: true },
        { name: "treasury", writable: false },
        { name: "system_program", address: "11111111111111111111111111111111" }
      ],
      args: []
    },
    {
      name: "stake",
      discriminator: [206, 176, 202, 18, 200, 209, 179, 108],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "player", writable: true, pda: { seeds: [{ kind: "const", value: [112, 108, 97, 121, 101, 114] }, { kind: "account", path: "user" }] } },
        { name: "referrer_player", writable: true, optional: true },
        { name: "user", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" }
      ],
      args: [
        { name: "amount", type: "u64" },
        { name: "referrer", type: { option: "pubkey" } }
      ]
    },
    {
      name: "checkin",
      discriminator: [223, 175, 165, 27, 123, 7, 54, 252],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "player", writable: true, pda: { seeds: [{ kind: "const", value: [112, 108, 97, 121, 101, 114] }, { kind: "account", path: "user" }] } },
        { name: "user", signer: true }
      ],
      args: []
    },
    {
      name: "claim_bonus",
      discriminator: [143, 250, 0, 123, 176, 198, 110, 71],
      accounts: [
        { name: "game_state", pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "player", writable: true, pda: { seeds: [{ kind: "const", value: [112, 108, 97, 121, 101, 114] }, { kind: "account", path: "user" }] } },
        { name: "user", signer: true }
      ],
      args: []
    },
    {
      name: "process_death",
      discriminator: [114, 251, 43, 80, 207, 177, 198, 62],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "treasury", writable: true },
        { name: "dead_player", writable: true },
        { name: "referrer_1", writable: true, optional: true },
        { name: "referrer_2", writable: true, optional: true },
        { name: "referrer_3", writable: true, optional: true },
        { name: "system_program", address: "11111111111111111111111111111111" }
      ],
      args: []
    },
    {
      name: "withdraw",
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "player", writable: true, pda: { seeds: [{ kind: "const", value: [112, 108, 97, 121, 101, 114] }, { kind: "account", path: "user" }] } },
        { name: "user", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" }
      ],
      args: []
    },
    {
      name: "claim_rewards",
      discriminator: [4, 144, 132, 71, 116, 23, 151, 80],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "player", writable: true, pda: { seeds: [{ kind: "const", value: [112, 108, 97, 121, 101, 114] }, { kind: "account", path: "user" }] } },
        { name: "user", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" }
      ],
      args: []
    },
    {
      name: "start_bonus_window",
      discriminator: [56, 48, 189, 106, 43, 77, 143, 1],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "authority", signer: true }
      ],
      args: [
        { name: "window_id", type: "u64" }
      ]
    },
    {
      name: "set_checkin_interval",
      discriminator: [242, 110, 65, 89, 69, 181, 199, 100],
      accounts: [
        { name: "game_state", writable: true, pda: { seeds: [{ kind: "const", value: [103, 97, 109, 101, 95, 115, 116, 97, 116, 101] }] } },
        { name: "authority", signer: true }
      ],
      args: [
        { name: "interval_seconds", type: "i64" }
      ]
    }
  ],
  accounts: [
    { name: "GameState", discriminator: [144, 94, 208, 172, 248, 99, 134, 120] },
    { name: "Player", discriminator: [205, 222, 112, 7, 165, 155, 206, 218] }
  ],
  errors: [
    { code: 6000, name: "AlreadyStaked", msg: "Player already has an active stake" },
    { code: 6001, name: "BelowMinimumStake", msg: "Stake amount is below minimum (0.05 SOL)" },
    { code: 6002, name: "InsufficientFunds", msg: "Insufficient funds in wallet" },
    { code: 6003, name: "NotStaked", msg: "Player does not have an active stake" },
    { code: 6004, name: "AlreadyCheckedIn", msg: "Player has already checked in today" },
    { code: 6005, name: "PlayerDead", msg: "Player is dead (missed check-in)" },
    { code: 6006, name: "PlayerNotDead", msg: "Player is not dead" },
    { code: 6007, name: "AlreadyProcessed", msg: "Player already processed" },
    { code: 6008, name: "NoBonusWindow", msg: "No bonus window is currently active" },
    { code: 6009, name: "BonusWindowExpired", msg: "Bonus window has expired" },
    { code: 6010, name: "AlreadyClaimed", msg: "Already claimed this bonus window" },
    { code: 6011, name: "NoRewards", msg: "No rewards to claim" },
    { code: 6012, name: "Unauthorized", msg: "Unauthorized - not the authority" },
    { code: 6013, name: "InvalidReferrer", msg: "Invalid referrer" },
    { code: 6014, name: "SelfReferral", msg: "Cannot refer yourself" },
    { code: 6015, name: "Overflow", msg: "Arithmetic overflow" },
    { code: 6016, name: "InvalidTimestamp", msg: "Invalid timestamp" },
    { code: 6017, name: "InvalidInterval", msg: "Invalid check-in interval (must be > 0)" }
  ],
  types: [
    {
      name: "GameState",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "pubkey" },
          { name: "treasury", type: "pubkey" },
          { name: "total_players", type: "u64" },
          { name: "total_pool", type: "u64" },
          { name: "last_death_timestamp", type: "i64" },
          { name: "total_deaths", type: "u64" },
          { name: "current_bonus_window", type: "u64" },
          { name: "bonus_window_end", type: "i64" },
          { name: "checkin_interval_seconds", type: "i64" },
          { name: "bump", type: "u8" }
        ]
      }
    },
    {
      name: "Player",
      type: {
        kind: "struct",
        fields: [
          { name: "wallet", type: "pubkey" },
          { name: "stake", type: "u64" },
          { name: "streak_days", type: "u32" },
          { name: "last_checkin", type: "i64" },
          { name: "start_day", type: "i64" },
          { name: "pending_rewards", type: "u64" },
          { name: "is_active", type: "bool" },
          { name: "referrer", type: { option: "pubkey" } },
          { name: "direct_referrals", type: "u32" },
          { name: "lifelines", type: "u8" },
          { name: "lifelines_used", type: "u8" },
          { name: "last_bonus_claimed", type: "u64" },
          { name: "total_bonus_claims", type: "u32" },
          { name: "referral_earnings", type: "u64" },
          { name: "bump", type: "u8" }
        ]
      }
    }
  ]
};

export interface GameStateAccount {
  authority: string;
  treasury: string;
  totalPlayers: bigint;
  totalPool: bigint;
  lastDeathTimestamp: bigint;
  totalDeaths: bigint;
  currentBonusWindow: bigint;
  bonusWindowEnd: bigint;
  checkinIntervalSeconds: bigint;
  bump: number;
}

export interface PlayerAccount {
  wallet: string;
  stake: bigint;
  streakDays: number;
  lastCheckin: bigint;
  startDay: bigint;
  pendingRewards: bigint;
  isActive: boolean;
  referrer: string | null;
  directReferrals: number;
  lifelines: number;
  lifelinesUsed: number;
  lastBonusClaimed: bigint;
  totalBonusClaims: number;
  referralEarnings: bigint;
  bump: number;
}
