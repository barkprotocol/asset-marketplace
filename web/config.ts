import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { Marketplace, MarketplaceIDL } from '../target/types/marketplace';

// Program ID from IDL
export const MARKETPLACE_PROGRAM_ID = new PublicKey(MarketplaceIDL.address);

// Create the Anchor provider
export const provider = AnchorProvider.env();
export const program = new Program(MarketplaceIDL as Marketplace, MARKETPLACE_PROGRAM_ID, provider);
