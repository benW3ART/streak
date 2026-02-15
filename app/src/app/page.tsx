'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useStreak } from '@/hooks/useStreak';
import { useState, useEffect } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { MIN_STAKE, STAKE_PRESETS } from '@/lib/constants';

// Landing page component for non-connected users
function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // Fake countdown for demo effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: "What happens if I miss a day?",
      a: "Your entire stake goes to the pool. No exceptions. That's the game."
    },
    {
      q: "How does the daily growth work?",
      a: "Every day you check in, your stake grows by 0.1% compound. Check in during bonus windows for an extra 0.05%."
    },
    {
      q: "What are lifelines?",
      a: "Lifelines let you skip one day without dying. You earn 1 lifeline for every 3 people you refer. They're automatically used when you'd otherwise die."
    },
    {
      q: "How do referrals work?",
      a: "When someone you referred dies, you get 5% of their stake. This goes 3 levels deep - you also earn from your referrals' referrals."
    },
    {
      q: "Can I withdraw anytime?",
      a: "Yes. You can withdraw your stake + growth at any time. But once you withdraw, your streak resets to zero."
    },
    {
      q: "What's the minimum stake?",
      a: "0.05 SOL. That's enough to make you care, but low enough to start."
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <span className="text-2xl font-black tracking-tight">
              STRE<span className="text-orange-500">A</span>K
            </span>
          </div>
          <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700 !rounded-lg !py-2 !px-4 !h-auto !text-sm !font-bold" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight">
            MISS ONE DAY.<br />
            <span className="text-orange-500">LOSE EVERYTHING.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto font-light">
            Stake SOL. Check in daily. Watch it compound.
            <br />
            <span className="text-zinc-500">But miss a single day? It all goes to the pool.</span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700 !rounded-xl !py-4 !px-8 !h-auto !text-lg !font-bold !shadow-lg !shadow-orange-600/30 hover:!shadow-orange-600/50 transition-shadow" />
            <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors font-medium">
              How does it work? ↓
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
              <div className="text-2xl md:text-3xl font-bold text-orange-500">0.1%</div>
              <div className="text-xs md:text-sm text-zinc-500">Daily Growth</div>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
              <div className="text-2xl md:text-3xl font-bold text-white">15%</div>
              <div className="text-xs md:text-sm text-zinc-500">Max Referral Cut</div>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
              <div className="text-2xl md:text-3xl font-bold text-white">0.05</div>
              <div className="text-xs md:text-sm text-zinc-500">SOL Min Stake</div>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone - Urgency Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-red-950/20 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-800/50 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-medium">DANGER ZONE</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            TIME IS RUNNING OUT
          </h2>
          
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl p-4 min-w-[80px]">
              <div className="text-4xl md:text-5xl font-mono font-bold text-red-500">
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-zinc-500 mt-1">HOURS</div>
            </div>
            <div className="text-4xl text-zinc-600 self-center">:</div>
            <div className="bg-zinc-900 rounded-xl p-4 min-w-[80px]">
              <div className="text-4xl md:text-5xl font-mono font-bold text-red-500">
                {String(countdown.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-zinc-500 mt-1">MINUTES</div>
            </div>
            <div className="text-4xl text-zinc-600 self-center">:</div>
            <div className="bg-zinc-900 rounded-xl p-4 min-w-[80px]">
              <div className="text-4xl md:text-5xl font-mono font-bold text-red-500">
                {String(countdown.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-zinc-500 mt-1">SECONDS</div>
            </div>
          </div>
          
          <p className="text-zinc-400 max-w-lg mx-auto">
            Every day at midnight UTC, players who haven&apos;t checked in die.
            <br />
            <span className="text-red-400 font-medium">Their stakes fuel the pool.</span>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16">
            HOW IT WORKS
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-2xl font-black">
                1
              </div>
              <div className="bg-zinc-900/50 rounded-2xl p-8 pt-12 border border-zinc-800/50 h-full">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-3">Stake SOL</h3>
                <p className="text-zinc-400">
                  Minimum 0.05 SOL. Your stake is your commitment. 
                  <span className="text-orange-500"> The higher your stake, the more you can grow.</span>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-2xl font-black">
                2
              </div>
              <div className="bg-zinc-900/50 rounded-2xl p-8 pt-12 border border-zinc-800/50 h-full">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold mb-3">Check In Daily</h3>
                <p className="text-zinc-400">
                  One tap per day. That&apos;s it. Your stake grows 0.1% each day you show up.
                  <span className="text-green-500"> Compound interest, but with consequences.</span>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-2xl font-black">
                3
              </div>
              <div className="bg-zinc-900/50 rounded-2xl p-8 pt-12 border border-zinc-800/50 h-full">
                <div className="text-4xl mb-4">💀</div>
                <h3 className="text-xl font-bold mb-3">Survive or Die</h3>
                <p className="text-zinc-400">
                  Miss a day? Game over. Your entire stake goes to the pool.
                  <span className="text-red-500"> No refunds. No mercy.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16">
            FEATURES
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-orange-600/50 transition-colors">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-bold mb-2">Bonus Windows</h3>
              <p className="text-sm text-zinc-400">
                Random 15-minute windows. Check in for +0.05% extra growth.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-orange-600/50 transition-colors">
              <div className="text-3xl mb-3">⛓️</div>
              <h3 className="font-bold mb-2">3-Level Referrals</h3>
              <p className="text-sm text-zinc-400">
                When your referrals die, you earn 5% of their stake. 3 levels deep.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-orange-600/50 transition-colors">
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-bold mb-2">Lifelines</h3>
              <p className="text-sm text-zinc-400">
                Earn 1 lifeline per 3 referrals. Skip one day without dying.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-orange-600/50 transition-colors">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Leaderboard</h3>
              <p className="text-sm text-zinc-400">
                Compete for the longest streak. Brag about your survival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12">
            THE NUMBERS
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-black text-orange-500">127</div>
              <div className="text-zinc-400 mt-2">Active Players</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white">42.5</div>
              <div className="text-zinc-400 mt-2">SOL in Pool</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white">89</div>
              <div className="text-zinc-400 mt-2">Longest Streak</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-red-500">312</div>
              <div className="text-zinc-400 mt-2">Total Deaths</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12">
            FAQ
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <span className="text-2xl text-zinc-500">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-4 text-zinc-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            READY TO <span className="text-orange-500">PLAY?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-8 max-w-lg mx-auto">
            Start with as little as 0.05 SOL. How long can you survive?
          </p>
          <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700 !rounded-xl !py-4 !px-8 !h-auto !text-lg !font-bold !shadow-lg !shadow-orange-600/30" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <span className="font-bold">STREAK</span>
            <span className="text-zinc-500 text-sm">Built on Solana</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Dashboard component for connected users
function Dashboard() {
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

  const formatSol = (lamports: bigint | number) => {
    return (Number(lamports) / LAMPORTS_PER_SOL).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h1 className="text-xl font-bold">
              STRE<span className="text-orange-500">A</span>K
            </h1>
          </div>
          <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700 !rounded-lg !py-2 !px-4 !h-auto !text-sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {player && player.isActive && isPlayerDead() ? (
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
                      {amount}
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
              {canCheckinToday() ? (
                <button
                  onClick={handleCheckin}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-600/20"
                >
                  {loading ? 'Processing...' : 'CHECK IN 🔥'}
                </button>
              ) : (
                <div className="w-full py-4 px-6 bg-zinc-800 rounded-xl font-bold text-lg text-center text-zinc-500">
                  ✓ Checked in today
                </div>
              )}

              {isBonusWindowActive() && (
                <button
                  onClick={handleClaimBonus}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-yellow-600 hover:bg-yellow-700 disabled:bg-zinc-700 rounded-xl font-bold transition-colors animate-pulse"
                >
                  🎁 CLAIM BONUS WINDOW
                </button>
              )}

              {player.pendingRewards > 0n && (
                <button
                  onClick={handleClaimRewards}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 rounded-xl font-bold transition-colors"
                >
                  Claim {formatSol(player.pendingRewards)} SOL Rewards
                </button>
              )}

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
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${wallet.publicKey?.toBase58().slice(0, 8)}...`}
                  className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}?ref=${wallet.publicKey?.toBase58()}`);
                  }}
                  className="px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium"
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
                <p className="text-sm text-green-500">
                  Referral earnings preserved: {formatSol(player.referralEarnings)} SOL
                </p>
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
                      {amount}
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-600/30">
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
                      {amount}
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
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-600/20"
              >
                {loading ? 'Processing...' : `STAKE ${stakeAmount} SOL & START 🔥`}
              </button>
            </div>

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

        {error && (
          <div className="fixed bottom-4 left-4 right-4 bg-red-900/90 text-red-100 px-4 py-3 rounded-xl max-w-lg mx-auto">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}

// Main page component - shows landing or dashboard based on wallet connection
export default function Home() {
  const wallet = useWallet();
  
  return wallet.connected ? <Dashboard /> : <LandingPage />;
}
