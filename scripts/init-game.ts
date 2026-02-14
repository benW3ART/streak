import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

const PROGRAM_ID = new PublicKey('Eyz3yhxzGKemxF7JYT3Q9LCVCKLkim6unnzH4cMprkxW');
const GAME_STATE_SEED = Buffer.from('game_state');

// Initialize discriminator (from Anchor)
const INIT_DISCRIMINATOR = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);

async function main() {
  // Load keypair
  const keypairPath = path.join(process.env.HOME || '', '.config/solana/id.json');
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  const authority = Keypair.fromSecretKey(Uint8Array.from(keypairData));

  console.log('Authority:', authority.publicKey.toBase58());

  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Derive game state PDA
  const [gameStatePda, bump] = PublicKey.findProgramAddressSync(
    [GAME_STATE_SEED],
    PROGRAM_ID
  );
  console.log('Game State PDA:', gameStatePda.toBase58());

  // Check if already initialized
  const existingAccount = await connection.getAccountInfo(gameStatePda);
  if (existingAccount) {
    console.log('Game state already initialized!');
    return;
  }

  // Use authority as treasury for simplicity
  const treasury = authority.publicKey;
  console.log('Treasury:', treasury.toBase58());

  // Create instruction
  const keys = [
    { pubkey: gameStatePda, isSigner: false, isWritable: true },
    { pubkey: treasury, isSigner: false, isWritable: false },
    { pubkey: authority.publicKey, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  const instruction = new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data: INIT_DISCRIMINATOR,
  });

  // Create and send transaction
  const tx = new Transaction().add(instruction);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = authority.publicKey;

  tx.sign(authority);

  console.log('Sending transaction...');
  const signature = await connection.sendRawTransaction(tx.serialize());
  console.log('Transaction signature:', signature);

  // Wait for confirmation
  await connection.confirmTransaction(signature);
  console.log('Game state initialized successfully!');

  // Verify
  const gameState = await connection.getAccountInfo(gameStatePda);
  console.log('Game state account size:', gameState?.data.length);
}

main().catch(console.error);
