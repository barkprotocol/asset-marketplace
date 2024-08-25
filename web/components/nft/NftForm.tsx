import React, { useState } from 'react';
import { useAnchorWallet, useConnection, useProgram } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, web3, BN } from '@coral-xyz/anchor';

const NftForm: React.FC = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const program = useProgram() as Program;

  const [uri, setUri] = useState<string>('');
  const [salePrice, setSalePrice] = useState<number>(0);
  const [feeAmount, setFeeAmount] = useState<number>(0);

  const handleMint = async () => {
    try {
      await program.rpc.mintNft(uri, {
        accounts: {
          mint: new PublicKey('MintPublicKey'),
          tokenAccount: new PublicKey('TokenAccountPublicKey'),
          nftMetadata: new PublicKey('NftMetadataPublicKey'),
          authority: wallet?.publicKey || new PublicKey(''),
          tokenProgram: web3.TokenProgram.publicKey,
        },
        signers: [wallet?.publicKey || new PublicKey('')],
      });
      alert('NFT Minted Successfully');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT');
    }
  };

  const handleListForSale = async () => {
    try {
      await program.rpc.listNftForSale(new BN(salePrice), {
        accounts: {
          nftMetadata: new PublicKey('NftMetadataPublicKey'),
          authority: wallet?.publicKey || new PublicKey(''),
        },
        signers: [wallet?.publicKey || new PublicKey('')],
      });
      alert('NFT Listed for Sale');
    } catch (error) {
      console.error('Error listing NFT for sale:', error);
      alert('Failed to list NFT for sale');
    }
  };

  return (
    <div>
      <h1>NFT Marketplace</h1>
      <input
        type="text"
        placeholder="NFT URI"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />
      <button onClick={handleMint}>Mint NFT</button>
      <input
        type="number"
        placeholder="Sale Price"
        value={salePrice}
        onChange={(e) => setSalePrice(Number(e.target.value))}
      />
      <button onClick={handleListForSale}>List NFT for Sale</button>
    </div>
  );
};

export default NftForm;
