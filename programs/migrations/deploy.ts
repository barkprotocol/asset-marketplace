import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { readFileSync } from "fs";
import path from "path";

require('dotenv').config();

const { NETWORK_URL, SOLANA_KEYPAIR } = process.env;

// Set up provider and program
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Define the program ID and path to the IDL
const PROGRAM_ID = new PublicKey("YourProgramID"); // Replace with actual program ID
const IDL_PATH = path.resolve(__dirname, '../target/idl/nft_marketplace.json');
const idl = JSON.parse(readFileSync(IDL_PATH, 'utf8'));

// Load the program
const program = new Program(idl, PROGRAM_ID, provider);

async function main() {
    // Deploy the program (adjust this based on your deployment strategy)
    const tx = await program.methods.initialize().rpc();
    console.log(`Deployment transaction ID: ${tx}`);
}

main().catch(err => {
    console.error("Deployment failed:", err);
});
