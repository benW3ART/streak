'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useStreak } from '@/hooks/useStreak';
import { useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { MIN_STAKE, STAKE_PRESETS } from '@/lib/constants';

export default function Home() {
  const wallet = useWallet();
  const {
    player,
    gameState,
    loading,
    error,
    stake,
    checkin,
    withdraw,
    claimRewards,
    claimBonus,
    canCheckinToday,
    isPlayerDead,
    isBonusWindowActive,
    getCheckinInterval,
  } = useStreak();

  const [stakeAmount, setStakeAmount] = useState(MIN_STAKE.toString());
  const [referrer, setReferrer] = useState('');

  const handleStake = async () => {
    try {
      await stake(parseFloat(stakeAmount), referrer || undefined);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckin = async () => {
    try {
      await checkin();
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaimBonus = async () => {
    try {
      await claimBonus();
    } catch (e) {
      console.error(e);
    }
  };

  // Format SOL amount
  const formatSol = (lamports: bigint | number) => {
    return (Number(lamports) / LAMPORTS_PER_SOL).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">STREAK</h1>
          <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700 !rounded-lg !py-2 !px-4 !h-auto !text-sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {!wallet.connected ? (
          /* Landing Screen */
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-4xl">🔥</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Miss One Day.<br />
              <span className="text-orange-500">Lose Everything.</span>
            </h2>
            <p className="text-zinc-400 mb-8 max-w-sm">
              Stake SOL. Check in daily. Watch your stake grow. But miss one day?
              It all goes to the pool.
            </p>
            <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700 !rounded-xl !py-4 !px-8 !h-auto !text-lg !font-bold" />
          </div>
        ) : player && player.isActive && isPlayerDead() ? (
          /* Dead Player - Show Stake Form to Start Over */
          <div className="space-y-6 mt-4">
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                <span className="text-3xl">💀</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-500">YOU DIED</h2>
              <p className="text-zinc-400 mb-2">
                You missed a check-in and lost {formatSol(player.stake)} SOL.
              </p>
              <p className="text-zinc-500 text-sm">
                Previous streak: {player.streakDays} days
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold text-center">Start Over 🔥</h3>
              <div>
                <label className="block text-sm text-zinc-400 mb-3">Choose Stake Amount</label>
                <div className="grid grid-cols-5 gap-2">
                  {STAKE_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setStakeAmount(amount.toString())}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-colors ${
                        parseFloat(stakeAmount) === amount
                          ? 'bg-orange-600 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {amount} SOL
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStake}
                disabled={loading || parseFloat(stakeAmount) < MIN_STAKE}
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 rounded-xl font-bold text-lg transition-colors"
              >
                {loading ? 'Processing...' : `STAKE ${stakeAmount} SOL & RESTART 🔥`}
              </button>
            </div>
          </div>
        ) : player && player.isActive ? (
          /* Active Player Dashboard */
          <div className="space-y-6 mt-4">
            {/* Streak Display */}
            <div className="bg-zinc-900 rounded-2xl p-6 text-center border border-zinc-800">
              <p className="text-zinc-500 text-sm mb-2">YOUR STREAK</p>
              <div className="text-7xl font-bold text-orange-500 mb-2">
                {player.streakDays}
              </div>
              <p className="text-zinc-400">days</p>
              <p className="text-xs text-zinc-600 mt-2">
                Check-in every {Math.floor(getCheckinInterval() / 60)} min
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-xs mb-1">CURRENT STAKE</p>
                <p className="text-xl font-bold">{formatSol(player.stake)} SOL</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-xs mb-1">LIFELINES</p>
                <p className="text-xl font-bold">{player.lifelines} 💚</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-xs mb-1">REFERRALS</p>
                <p className="text-xl font-bold">{player.directReferrals}</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-xs mb-1">REWARDS</p>
                <p className="text-xl font-bold text-green-500">
                  {formatSol(player.pendingRewards)} SOL
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Check-in Button */}
              {canCheckinToday() ? (
                <button
                  onClick={handleCheckin}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 rounded-xl font-bold text-lg transition-colors"
                >
                  {loading ? 'Processing...' : 'CHECK IN 🔥'}
                </button>
              ) : (
                <div className="w-full py-4 px-6 bg-zinc-800 rounded-xl font-bold text-lg text-center text-zinc-500">
                  ✓ Checked in today
                </div>
              )}

              {/* Bonus Window Button */}
              {isBonusWindowActive() && (
                <button
                  onClick={handleClaimBonus}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-yellow-600 hover:bg-yellow-700 disabled:bg-zinc-700 rounded-xl font-bold transition-colors animate-pulse"
                >
                  🎁 CLAIM BONUS WINDOW
                </button>
              )}

              {/* Claim Rewards */}
              {player.pendingRewards > 0n && (
                <button
                  onClick={handleClaimRewards}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 rounded-xl font-bold transition-colors"
                >
                  Claim {formatSol(player.pendingRewards)} SOL Rewards
                </button>
              )}

              {/* Withdraw */}
              <button
                onClick={handleWithdraw}
                disabled={loading}
                className="w-full py-3 px-6 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 rounded-xl font-medium transition-colors"
              >
                Withdraw & Exit
              </button>
            </div>

            {/* Referral Link */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-500 text-xs mb-2">YOUR REFERRAL LINK</p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${wallet.publicKey?.toBase58().slice(0, 8)}`}
                  className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}?ref=${wallet.publicKey?.toBase58()}`);
                  }}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                Earn 5% when referrals die (3 levels deep). Get 1 lifeline per 3 referrals.
              </p>
            </div>
          </div>
        ) : player && !player.isActive ? (
          /* Inactive Player (died and processed) - Can Re-stake */
          <div className="space-y-6 mt-4">
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center">
                <span className="text-3xl">💀</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Game Over</h2>
              <p className="text-zinc-400 mb-2">
                Your previous streak ended. Ready to try again?
              </p>
              {player.referralEarnings > 0n && (
                <p className="text-sm text-green-500">Referral earnings preserved: {formatSol(player.referralEarnings)} SOL</p>
              )}
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold text-center">Play Again 🔥</h3>
              <div>
                <label className="block text-sm text-zinc-400 mb-3">Choose Stake Amount</label>
                <div className="grid grid-cols-5 gap-2">
                  {STAKE_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setStakeAmount(amount.toString())}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-colors ${
                        parseFloat(stakeAmount) === amount
                          ? 'bg-orange-600 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {amount} SOL
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStake}
                disabled={loading || parseFloat(stakeAmount) < MIN_STAKE}
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 rounded-xl font-bold text-lg transition-colors"
              >
                {loading ? 'Processing...' : `STAKE ${stakeAmount} SOL & PLAY 🔥`}
              </button>
            </div>
          </div>
        ) : (
          /* New Player - Stake Form */
          <div className="space-y-6 mt-4">
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Ready to Play?</h2>
              <p className="text-zinc-400">
                Stake SOL to enter. Min {MIN_STAKE} SOL.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-3">Choose Stake Amount</label>
                <div className="grid grid-cols-5 gap-2">
                  {STAKE_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setStakeAmount(amount.toString())}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-colors ${
                        parseFloat(stakeAmount) === amount
                          ? 'bg-orange-600 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {amount} SOL
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Referrer (optional)</label>
                <input
                  type="text"
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                  className="w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Wallet address"
                />
              </div>

              <button
                onClick={handleStake}
                disabled={loading || parseFloat(stakeAmount) < MIN_STAKE}
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 rounded-xl font-bold text-lg transition-colors"
              >
                {loading ? 'Processing...' : `STAKE ${stakeAmount} SOL & START 🔥`}
              </button>
            </div>

            {/* Game Stats */}
            {gameState && (
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-xs mb-3">GAME STATS</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl font-bold">{gameState.totalPlayers.toString()}</p>
                    <p className="text-xs text-zinc-500">Active Players</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{formatSol(gameState.totalPool)} SOL</p>
                    <p className="text-xs text-zinc-500">Total Pool</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 left-4 right-4 bg-red-900/90 text-red-100 px-4 py-3 rounded-xl max-w-lg mx-auto">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
