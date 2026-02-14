/**
 * STREAK Initialize Script
 * This script initializes the game state after program deployment
 *
 * Run with: npx ts-node scripts/initialize.ts
 */

import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import * as fs from 'fs';
import * as path from 'path';

// Load IDL
const IDL = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../target/idl/streak.json'), 'utf-8')
);

// Constants
const PROGRAM_ID = new PublicKey('Ai4ywwPiquWt9RpgqoumBs95EYEJpcUefcktksLSWx2V');
const GAME_STATE_SEED = Buffer.from('game_state');

async function main() {
  console.log('=== STREAK Game Initializer ===\n');

  // Load keypair from default Solana CLI location
  const keypairPath = process.env.HOME + '/.config/solana/id.json';
  if (!fs.existsSync(keypairPath)) {
    console.error('Error: Keypair not found at', keypairPath);
    console.error('Run: solana-keygen new');
    process.exit(1);
  }

  const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

  console.log('Authority:', keypair.publicKey.toBase58());

  // Connect to devnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const balance = await connection.getBalance(keypair.publicKey);
  console.log('Balance:', balance / 1e9, 'SOL\n');

  // Create provider
  const wallet = new Wallet(keypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });

  // Create program
  const program = new Program(IDL, provider);

  // Get game state PDA
  const [gameStatePDA, bump] = PublicKey.findProgramAddressSync(
    [GAME_STATE_SEED],
    PROGRAM_ID
  );
  console.log('Game State PDA:', gameStatePDA.toBase58());
  console.log('Bump:', bump);

  // Check if already initialized
  try {
    const gameState = await (program.account as any).gameState.fetch(gameStatePDA);
    console.log('\n✅ Game state already initialized!');
    console.log('Authority:', gameState.authority.toBase58());
    console.log('Total Players:', gameState.totalPlayers.toString());
    console.log('Total Pool:', gameState.totalPool.toString(), 'lamports');
    process.exit(0);
  } catch (e) {
    console.log('\nGame state not found, initializing...\n');
  }

  // Initialize game state
  try {
    const tx = await program.methods
      .initialize()
      .accounts({
        gameState: gameStatePDA,
        authority: keypair.publicKey,
      })
      .signers([keypair])
      .rpc();

    console.log('✅ Game state initialized!');
    console.log('Transaction:', tx);
    console.log('\nView on Solana Explorer:');
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  } catch (e: any) {
    console.error('❌ Error initializing:', e.message);
    process.exit(1);
  }
}

main().catch(console.error);
