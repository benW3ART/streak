'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor';
import { IDL, type PlayerAccount, type GameStateAccount } from '@/lib/idl';
import { PROGRAM_ID, GAME_STATE_SEED, PLAYER_SEED, MIN_STAKE_LAMPORTS } from '@/lib/constants';

export function useStreak() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [player, setPlayer] = useState<PlayerAccount | null>(null);
  const [gameState, setGameState] = useState<GameStateAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize program
  useEffect(() => {
    if (wallet.publicKey && wallet.signTransaction && wallet.signAllTransactions) {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
      );
      const prog = new Program(IDL as any, provider);
      setProgram(prog);
    }
  }, [connection, wallet]);

  // Get PDAs
  const getGameStatePDA = useCallback(() => {
    const [pda] = PublicKey.findProgramAddressSync(
      [GAME_STATE_SEED],
      PROGRAM_ID
    );
    return pda;
  }, []);

  const getPlayerPDA = useCallback((walletPubkey: PublicKey) => {
    const [pda] = PublicKey.findProgramAddressSync(
      [PLAYER_SEED, walletPubkey.toBuffer()],
      PROGRAM_ID
    );
    return pda;
  }, []);

  // Fetch game state
  const fetchGameState = useCallback(async () => {
    if (!program) return null;
    try {
      const gameStatePDA = getGameStatePDA();
      const account = await (program.account as any).gameState.fetch(gameStatePDA);
      const state: GameStateAccount = {
        authority: account.authority.toBase58(),
        treasury: account.treasury.toBase58(),
        totalPlayers: BigInt(account.totalPlayers.toString()),
        totalPool: BigInt(account.totalPool.toString()),
        lastDeathTimestamp: BigInt(account.lastDeathTimestamp.toString()),
        totalDeaths: BigInt(account.totalDeaths.toString()),
        currentBonusWindow: BigInt(account.currentBonusWindow.toString()),
        bonusWindowEnd: BigInt(account.bonusWindowEnd.toString()),
        checkinIntervalSeconds: BigInt(account.checkinIntervalSeconds.toString()),
        bump: account.bump
      };
      setGameState(state);
      return state;
    } catch (e) {
      console.error('Failed to fetch game state:', e);
      return null;
    }
  }, [program, getGameStatePDA]);

  // Fetch player account
  const fetchPlayer = useCallback(async () => {
    if (!program || !wallet.publicKey) return null;
    try {
      const playerPDA = getPlayerPDA(wallet.publicKey);
      const account = await (program.account as any).player.fetch(playerPDA);
      const playerData: PlayerAccount = {
        wallet: account.wallet.toBase58(),
        stake: BigInt(account.stake.toString()),
        streakDays: account.streakDays,
        lastCheckin: BigInt(account.lastCheckin.toString()),
        startDay: BigInt(account.startDay.toString()),
        pendingRewards: BigInt(account.pendingRewards.toString()),
        isActive: account.isActive,
        referrer: account.referrer?.toBase58() || null,
        directReferrals: account.directReferrals,
        lifelines: account.lifelines,
        lifelinesUsed: account.lifelinesUsed,
        lastBonusClaimed: BigInt(account.lastBonusClaimed.toString()),
        totalBonusClaims: account.totalBonusClaims,
        referralEarnings: BigInt(account.referralEarnings.toString()),
        bump: account.bump
      };
      setPlayer(playerData);
      return playerData;
    } catch (e) {
      console.error('Failed to fetch player:', e);
      setPlayer(null);
      return null;
    }
  }, [program, wallet.publicKey, getPlayerPDA]);

  // Stake SOL
  const stake = useCallback(async (amount: number, referrer?: string) => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }
    setLoading(true);
    setError(null);
    try {
      const amountLamports = Math.floor(amount * LAMPORTS_PER_SOL);
      if (amountLamports < MIN_STAKE_LAMPORTS) {
        throw new Error(`Minimum stake is ${MIN_STAKE_LAMPORTS / LAMPORTS_PER_SOL} SOL`);
      }

      const gameStatePDA = getGameStatePDA();
      const playerPDA = getPlayerPDA(wallet.publicKey);

      let referrerPubkey: PublicKey | null = null;
      let referrerPlayerPDA: PublicKey | null = null;

      if (referrer) {
        try {
          referrerPubkey = new PublicKey(referrer);
          referrerPlayerPDA = getPlayerPDA(referrerPubkey);
        } catch {
          throw new Error('Invalid referrer address');
        }
      }

      // Build instruction manually to handle optional accounts
      // stake discriminator: sha256("global:stake")[:8]
      const discriminator = new Uint8Array([206, 176, 202, 18, 200, 209, 179, 108]);

      // Encode amount (u64 LE)
      const amountBigInt = BigInt(amountLamports);
      const amountBuffer = new Uint8Array(8);
      for (let i = 0; i < 8; i++) {
        amountBuffer[i] = Number((amountBigInt >> BigInt(i * 8)) & BigInt(0xff));
      }

      // Encode referrer option (1 byte tag + 32 bytes pubkey if Some)
      let referrerBuffer: Uint8Array;
      if (referrerPubkey) {
        referrerBuffer = new Uint8Array(33);
        referrerBuffer[0] = 1;
        referrerBuffer.set(referrerPubkey.toBytes(), 1);
      } else {
        referrerBuffer = new Uint8Array([0]);
      }

      const data = new Uint8Array(discriminator.length + amountBuffer.length + referrerBuffer.length);
      data.set(discriminator, 0);
      data.set(amountBuffer, discriminator.length);
      data.set(referrerBuffer, discriminator.length + amountBuffer.length);

      const keys = [
        { pubkey: gameStatePDA, isSigner: false, isWritable: true },
        { pubkey: playerPDA, isSigner: false, isWritable: true },
        ...(referrerPlayerPDA ? [{ pubkey: referrerPlayerPDA, isSigner: false, isWritable: true }] : []),
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ];

      const ix = new (await import('@solana/web3.js')).TransactionInstruction({
        keys,
        programId: PROGRAM_ID,
        data: Buffer.from(data),
      });

      const tx = new (await import('@solana/web3.js')).Transaction().add(ix);
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      await fetchPlayer();
      await fetchGameState();
      return signature;
    } catch (e: any) {
      console.error('Stake error:', e);
      const msg = e.message || 'Failed to stake';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [wallet, connection, getGameStatePDA, getPlayerPDA, fetchPlayer, fetchGameState]);

  // Check in
  const checkin = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }
    setLoading(true);
    setError(null);
    try {
      const gameStatePDA = getGameStatePDA();
      const playerPDA = getPlayerPDA(wallet.publicKey);

      const tx = await program.methods
        .checkin()
        .accounts({
          gameState: gameStatePDA,
          player: playerPDA,
          user: wallet.publicKey,
        })
        .rpc();

      await connection.confirmTransaction(tx, 'confirmed');
      await fetchPlayer();
      return tx;
    } catch (e: any) {
      const msg = e.message || 'Failed to check in';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, connection, getGameStatePDA, getPlayerPDA, fetchPlayer]);

  // Claim bonus
  const claimBonus = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }
    setLoading(true);
    setError(null);
    try {
      const gameStatePDA = getGameStatePDA();
      const playerPDA = getPlayerPDA(wallet.publicKey);

      const tx = await program.methods
        .claimBonus()
        .accounts({
          gameState: gameStatePDA,
          player: playerPDA,
          user: wallet.publicKey,
        })
        .rpc();

      await connection.confirmTransaction(tx, 'confirmed');
      await fetchPlayer();
      return tx;
    } catch (e: any) {
      const msg = e.message || 'Failed to claim bonus';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, connection, getGameStatePDA, getPlayerPDA, fetchPlayer]);

  // Withdraw
  const withdraw = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }
    setLoading(true);
    setError(null);
    try {
      const gameStatePDA = getGameStatePDA();
      const playerPDA = getPlayerPDA(wallet.publicKey);

      const tx = await program.methods
        .withdraw()
        .accounts({
          gameState: gameStatePDA,
          player: playerPDA,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await connection.confirmTransaction(tx, 'confirmed');
      await fetchPlayer();
      await fetchGameState();
      return tx;
    } catch (e: any) {
      const msg = e.message || 'Failed to withdraw';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, connection, getGameStatePDA, getPlayerPDA, fetchPlayer, fetchGameState]);

  // Claim rewards
  const claimRewards = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }
    setLoading(true);
    setError(null);
    try {
      const gameStatePDA = getGameStatePDA();
      const playerPDA = getPlayerPDA(wallet.publicKey);

      const tx = await program.methods
        .claimRewards()
        .accounts({
          gameState: gameStatePDA,
          player: playerPDA,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await connection.confirmTransaction(tx, 'confirmed');
      await fetchPlayer();
      return tx;
    } catch (e: any) {
      const msg = e.message || 'Failed to claim rewards';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey, connection, getGameStatePDA, getPlayerPDA, fetchPlayer]);

  // Process own death (finalize death on-chain)
  const processDeath = useCallback(async () => {
    if (!program || !wallet.publicKey || !gameState) {
      throw new Error('Wallet not connected or game state not loaded');
    }
    setLoading(true);
    setError(null);
    try {
      const gameStatePDA = getGameStatePDA();
      const playerPDA = getPlayerPDA(wallet.publicKey);
      const treasury = new PublicKey(gameState.treasury);

      // Build instruction manually to handle optional accounts
      const discriminator = Buffer.from([114, 251, 43, 80, 207, 177, 198, 62]);

      const keys = [
        { pubkey: gameStatePDA, isSigner: false, isWritable: true },
        { pubkey: treasury, isSigner: false, isWritable: true },
        { pubkey: playerPDA, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ];

      const ix = new (await import('@solana/web3.js')).TransactionInstruction({
        keys,
        programId: PROGRAM_ID,
        data: discriminator,
      });

      const tx = new (await import('@solana/web3.js')).Transaction().add(ix);
      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      await fetchPlayer();
      await fetchGameState();
      return signature;
    } catch (e: any) {
      console.error('Process death error:', e);
      // Try to extract meaningful error from logs
      let msg = 'Failed to process death';
      if (e.logs) {
        const errorLog = e.logs.find((log: string) => log.includes('Error') || log.includes('failed'));
        if (errorLog) msg = errorLog;
      } else if (e.message) {
        msg = e.message;
      }
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, wallet, gameState, connection, getGameStatePDA, getPlayerPDA, fetchPlayer, fetchGameState]);

  // Check if player is dead (missed a check-in period)
  const isPlayerDead = useCallback(() => {
    if (!player || !player.isActive || !gameState) return false;
    const now = Math.floor(Date.now() / 1000);
    const lastCheckin = Number(player.lastCheckin);
    const startDay = Number(player.startDay);
    const interval = Number(gameState.checkinIntervalSeconds);
    const lastCheckinPeriod = Math.floor(lastCheckin / interval);
    const currentPeriod = Math.floor(now / interval);
    const startPeriod = Math.floor(startDay / interval);
    // Player dies if they haven't checked in this period and it's not their start period
    return lastCheckinPeriod < currentPeriod - 1 ||
           (lastCheckinPeriod < currentPeriod && startPeriod < currentPeriod);
  }, [player, gameState]);

  // Check if can check in this period (uses configurable interval from game state)
  const canCheckinToday = useCallback(() => {
    if (!player || !player.isActive || !gameState) return false;
    if (isPlayerDead()) return false; // Can't check in if dead
    const now = Math.floor(Date.now() / 1000);
    const lastCheckin = Number(player.lastCheckin);
    const interval = Number(gameState.checkinIntervalSeconds);
    const lastCheckinPeriod = Math.floor(lastCheckin / interval);
    const currentPeriod = Math.floor(now / interval);
    return lastCheckinPeriod < currentPeriod;
  }, [player, gameState, isPlayerDead]);

  // Check if bonus window is active
  const isBonusWindowActive = useCallback(() => {
    if (!gameState) return false;
    const now = Math.floor(Date.now() / 1000);
    return now < Number(gameState.bonusWindowEnd);
  }, [gameState]);

  // Get time until next check-in period (in seconds)
  const getTimeUntilNextCheckin = useCallback(() => {
    if (!gameState) return 0;
    const now = Math.floor(Date.now() / 1000);
    const interval = Number(gameState.checkinIntervalSeconds);
    const currentPeriod = Math.floor(now / interval);
    const nextPeriodStart = (currentPeriod + 1) * interval;
    return nextPeriodStart - now;
  }, [gameState]);

  // Get current check-in interval in seconds
  const getCheckinInterval = useCallback(() => {
    if (!gameState) return 86400; // Default to 24 hours
    return Number(gameState.checkinIntervalSeconds);
  }, [gameState]);

  // Refresh data
  const refresh = useCallback(async () => {
    await Promise.all([fetchGameState(), fetchPlayer()]);
  }, [fetchGameState, fetchPlayer]);

  // Initial fetch
  useEffect(() => {
    if (program) {
      refresh();
    }
  }, [program, refresh]);

  return {
    program,
    player,
    gameState,
    loading,
    error,
    stake,
    checkin,
    claimBonus,
    withdraw,
    claimRewards,
    processDeath,
    canCheckinToday,
    isPlayerDead,
    isBonusWindowActive,
    getTimeUntilNextCheckin,
    getCheckinInterval,
    refresh,
    getPlayerPDA,
    getGameStatePDA,
  };
}
