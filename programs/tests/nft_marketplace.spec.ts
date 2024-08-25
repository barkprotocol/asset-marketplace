import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { IDL as MarketplaceIDL } from '../target/types/marketplace'; // Adjust path as necessary

describe('nft_marketplace', () => {
    // Initialize the provider
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const programId = new PublicKey("YourProgramID"); // Replace with actual program ID
    const program = new Program(MarketplaceIDL as any, programId, provider);

    // Define keypairs
    let authority: Keypair;
    let mint: Keypair;
    let tokenAccount: Keypair;
    let nftMetadata: PublicKey;
    let nftMetadataAccount: anchor.web3.AccountInfo<Buffer>;

    // Create and fund accounts before tests
    before(async () => {
        authority = Keypair.generate();
        mint = Keypair.generate();
        tokenAccount = Keypair.generate();
        
        // Airdrop SOL to keypairs
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(authority.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
            "confirmed"
        );

        // Create associated token account
        const createTokenAccountTx = new Transaction().add(
            anchor.spl.Token.createAssociatedTokenAccountInstruction(
                anchor.spl.TOKEN_PROGRAM_ID,
                anchor.spl.TOKEN_PROGRAM_ID,
                mint.publicKey,
                tokenAccount.publicKey,
                authority.publicKey,
                authority.publicKey
            )
        );

        await provider.sendAndConfirm(createTokenAccountTx, [authority]);

        // Create NFT Metadata account
        const nftMetadataAccountData = anchor.web3.Keypair.generate();
        nftMetadata = nftMetadataAccountData.publicKey;

        // Initialize NFT Metadata account
        await program.methods.initialize().accounts({
            authority: authority.publicKey,
        }).signers([authority]).rpc();
    });

    // Test NFT minting
    it('Should mint an NFT', async () => {
        await program.methods.mintNft('https://example.com/metadata')
            .accounts({
                mint: mint.publicKey,
                tokenAccount: tokenAccount.publicKey,
                authority: authority.publicKey,
                nftMetadata: nftMetadata,
                systemProgram: SystemProgram.programId,
                tokenProgram: anchor.spl.TOKEN_PROGRAM_ID,
            })
            .signers([authority])
            .rpc();

        // Fetch the NFT metadata account
        nftMetadataAccount = await program.account.nftMetadata.fetch(nftMetadata);

        // Validate NFT metadata
        assert.equal(nftMetadataAccount.uri, 'https://example.com/metadata');
        assert.equal(nftMetadataAccount.owner.toString(), authority.publicKey.toString());
    });

    // Test updating NFT metadata
    it('Should update NFT metadata', async () => {
        await program.methods.updateMetadata('https://example.com/new_metadata')
            .accounts({
                nftMetadata: nftMetadata,
                authority: authority.publicKey,
            })
            .signers([authority])
            .rpc();

        // Fetch the updated NFT metadata
        nftMetadataAccount = await program.account.nftMetadata.fetch(nftMetadata);

        // Validate updated NFT metadata
        assert.equal(nftMetadataAccount.uri, 'https://example.com/new_metadata');
    });

    // Test transferring NFT
    it('Should transfer NFT ownership', async () => {
        const newOwner = Keypair.generate();

        // Fund new owner's account
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(newOwner.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
            "confirmed"
        );

        await program.methods.transferNft(newOwner.publicKey)
            .accounts({
                nftMetadata: nftMetadata,
                authority: authority.publicKey,
            })
            .signers([authority])
            .rpc();

        // Fetch the NFT metadata to verify ownership transfer
        nftMetadataAccount = await program.account.nftMetadata.fetch(nftMetadata);

        // Validate new ownership
        assert.equal(nftMetadataAccount.owner.toString(), newOwner.publicKey.toString());
    });

    // Test listing NFT for sale
    it('Should list NFT for sale', async () => {
        const salePrice = 1000000; // Example price in lamports

        await program.methods.listNftForSale(salePrice)
            .accounts({
                nftMetadata: nftMetadata,
                authority: authority.publicKey,
            })
            .signers([authority])
            .rpc();

        // Fetch the NFT metadata to verify sale listing
        nftMetadataAccount = await program.account.nftMetadata.fetch(nftMetadata);

        // Validate sale listing
        assert.equal(nftMetadataAccount.salePrice.toNumber(), salePrice);
    });

    // Test purchasing NFT
    it('Should purchase NFT', async () => {
        const buyer = Keypair.generate();
        const salePrice = 1000000; // Must match the price set in the previous test

        // Fund buyer's account
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
            "confirmed"
        );

        // Execute the purchase
        await program.methods.purchaseNft()
            .accounts({
                nftMetadata: nftMetadata,
                buyer: buyer.publicKey,
                seller: authority.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([buyer])
            .rpc();

        // Fetch the NFT metadata to verify purchase
        nftMetadataAccount = await program.account.nftMetadata.fetch(nftMetadata);

        // Validate new ownership and sale price reset
        assert.equal(nftMetadataAccount.owner.toString(), buyer.publicKey.toString());
        assert.isNull(nftMetadataAccount.salePrice);
    });

    // Clean up after tests
    after(async () => {
        // Optionally, implement cleanup logic if necessary
    });
});
