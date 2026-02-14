import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';
import BN from 'bn.js';

const PROGRAM_ID = new PublicKey('Eyz3yhxzGKemxF7JYT3Q9LCVCKLkim6unnzH4cMprkxW');
const GAME_STATE_SEED = Buffer.from('game_state');

// set_checkin_interval discriminator (sha256("global:set_checkin_interval")[:8])
const SET_INTERVAL_DISCRIMINATOR = Buffer.from([242, 110, 65, 89, 69, 181, 199, 100]);

async function main() {
  // Get interval from command line args (in minutes)
  const intervalMinutes = parseInt(process.argv[2] || '1440'); // Default: 24 hours = 1440 minutes
  const intervalSeconds = intervalMinutes * 60;

  console.log(`Setting check-in interval to ${intervalMinutes} minutes (${intervalSeconds} seconds)`);

  // Load keypair
  const keypairPath = path.join(process.env.HOME || '', '.config/solana/id.json');
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  const authority = Keypair.fromSecretKey(Uint8Array.from(keypairData));

  console.log('Authority:', authority.publicKey.toBase58());

  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Derive game state PDA
  const [gameStatePda] = PublicKey.findProgramAddressSync(
    [GAME_STATE_SEED],
    PROGRAM_ID
  );
  console.log('Game State PDA:', gameStatePda.toBase58());

  // Create instruction data
  const intervalBn = new BN(intervalSeconds);
  const data = Buffer.concat([
    SET_INTERVAL_DISCRIMINATOR,
    intervalBn.toArrayLike(Buffer, 'le', 8),
  ]);

  // Create instruction
  const keys = [
    { pubkey: gameStatePda, isSigner: false, isWritable: true },
    { pubkey: authority.publicKey, isSigner: true, isWritable: false },
  ];

  const instruction = new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
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
  console.log(`Check-in interval set to ${intervalMinutes} minutes successfully!`);
}

main().catch(console.error);
