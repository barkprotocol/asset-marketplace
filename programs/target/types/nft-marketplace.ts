import { PublicKey } from '@solana/web3.js';
import { Idl, Program } from '@coral-xyz/anchor';

// Define the interface for the NFT Marketplace program
export interface NFTMarketplace {
  // Define the program instructions and their arguments
  methods: {
    initialize(): Promise<void>;
    mintNft(uri: string): Promise<void>;
    updateMetadata(uri: string): Promise<void>;
    transferNft(newOwner: PublicKey): Promise<void>;
    listNftForSale(salePrice: number): Promise<void>;
    purchaseNft(paymentMethod: PaymentMethod): Promise<void>;
    batchMintNfts(uris: string[]): Promise<void>;
  };
  // Define the structure of accounts used in the program
  accounts: {
    nftMetadata: {
      uri: string;
      owner: PublicKey;
      salePrice?: number;
    };
  };
}

// Define the payment method enum
export type PaymentMethod = 
  | { kind: 'SOL' }
  | { kind: 'SPLToken'; tokenMint: PublicKey; amount: number };

// Load the IDL (Interface Definition Language) file
export const IDL: Idl = {
  version: '0.1.0',
  name: 'nft_marketplace',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        { name: 'authority', isMut: true, isSigner: true }
      ],
      args: []
    },
    {
      name: 'mintNft',
      accounts: [
        { name: 'mint', isMut: true, isSigner: false },
        { name: 'tokenAccount', isMut: true, isSigner: false },
        { name: 'authority', isMut: true, isSigner: true },
        { name: 'nftMetadata', isMut: true, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false }
      ],
      args: [
        { name: 'uri', type: 'string' }
      ]
    },
    {
      name: 'updateMetadata',
      accounts: [
        { name: 'nftMetadata', isMut: true, isSigner: false },
        { name: 'authority', isMut: true, isSigner: true }
      ],
      args: [
        { name: 'uri', type: 'string' }
      ]
    },
    {
      name: 'transferNft',
      accounts: [
        { name: 'nftMetadata', isMut: true, isSigner: false },
        { name: 'authority', isMut: true, isSigner: true },
        { name: 'newOwner', isMut: true, isSigner: false }
      ],
      args: []
    },
    {
      name: 'burnNft',
      accounts: [
        { name: 'nftMetadata', isMut: true, isSigner: false },
        { name: 'mint', isMut: true, isSigner: false },
        { name: 'tokenAccount', isMut: true, isSigner: false },
        { name: 'authority', isMut: true, isSigner: true },
        { name: 'tokenProgram', isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: 'listNftForSale',
      accounts: [
        { name: 'nftMetadata', isMut: true, isSigner: false },
        { name: 'authority', isMut: true, isSigner: true }
      ],
      args: [
        { name: 'salePrice', type: 'u64' }
      ]
    },
    {
      name: 'purchaseNft',
      accounts: [
        { name: 'nftMetadata', isMut: true, isSigner: false },
        { name: 'buyer', isMut: true, isSigner: true },
        { name: 'seller', isMut: true, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false }
      ],
      args: [
        {
          name: 'paymentMethod',
          type: {
            kind: 'enum',
            variants: [
              { name: 'SOL' },
              {
                name: 'SPLToken',
                fields: [
                  { name: 'tokenMint', type: 'publicKey' },
                  { name: 'amount', type: 'u64' }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      name: 'batchMintNfts',
      accounts: [
        { name: 'mint', isMut: true, isSigner: false },
        { name: 'tokenAccount', isMut: true, isSigner: false },
        { name: 'authority', isMut: true, isSigner: true },
        { name: 'nftMetadata', isMut: true, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false }
      ],
      args: [
        {
          name: 'uris',
          type: {
            kind: 'vector',
            element: 'string'
          }
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'nftMetadata',
      type: {
        kind: 'struct',
        fields: [
          { name: 'uri', type: 'string' },
          { name: 'owner', type: 'publicKey' },
          { name: 'salePrice', type: { option: 'u64' } }
        ]
      }
    }
  ],
  metadata: {
    address: 'YOUR_PROGRAM_ID_HERE' // Update with the actual program ID
  }
};

// Create a type for the NFT Marketplace program
export type NFTMarketplaceProgram = Program<NFTMarketplace>;
