use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Mint};

#[account]
pub struct NftMetadata {
    pub uri: String,
    pub owner: Pubkey,
    pub sale_price: Option<u64>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 64)]
    pub nft_metadata: Account<'info, NftMetadata>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct TransferNft<'info> {
    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct BurnNft<'info> {
    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ListNftForSale<'info> {
    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct PurchaseNft<'info> {
    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,
    pub buyer: Signer<'info>,
    pub seller: Account<'info, Signer>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub token_account_from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token_account_to: Account<'info, TokenAccount>,
    #[account(mut)]
    pub creator_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub bark_token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct BatchMintNfts<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub nft_metadata: Account<'info, NftMetadata>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
