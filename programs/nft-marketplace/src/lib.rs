use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};
use spl_token::state::Account as SplTokenAccount;
use std::str::FromStr;
use crate::utils::*;
use crate::error::*;
use crate::state::*;

pub mod nft_marketplace {
    pub use crate::nft_marketplace::*;
    pub mod instructions;
    pub mod state;
    pub mod utils;
    pub mod error;
}

declare_id!("YourProgramID"); // Replace with your actual program ID

#[program]
pub mod nft_marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialization logic here
        Ok(())
    }

    pub fn mint_nft(ctx: Context<MintNft>, uri: String) -> Result<()> {
        validate_metadata_uri(&uri)?;

        let mint = &ctx.accounts.mint;
        let token_program = &ctx.accounts.token_program;
        let authority = &ctx.accounts.authority;
        let token_account = &ctx.accounts.token_account;

        check_ownership(authority, &ctx.accounts.authority.key())?;

        token::mint_to(
            CpiContext::new(
                token_program.to_account_info(),
                token::MintTo {
                    mint: mint.to_account_info(),
                    to: token_account.to_account_info(),
                    authority: authority.to_account_info(),
                },
            ),
            1,
        )?;

        let nft_metadata = &mut ctx.accounts.nft_metadata;
        nft_metadata.uri = uri;
        nft_metadata.owner = authority.key();

        emit!(NftMinted {
            mint: mint.key(),
            token_account: token_account.key(),
            authority: authority.key(),
            uri,
        });

        Ok(())
    }

    pub fn update_metadata(ctx: Context<UpdateMetadata>, new_uri: String) -> Result<()> {
        validate_metadata_uri(&new_uri)?;

        let nft_metadata = &mut ctx.accounts.nft_metadata;
        let authority = &ctx.accounts.authority;

        check_ownership(authority, &nft_metadata.owner)?;

        nft_metadata.uri = new_uri;

        emit!(MetadataUpdated {
            nft_metadata: nft_metadata.key(),
            authority: authority.key(),
            new_uri,
        });

        Ok(())
    }

    pub fn transfer_nft(ctx: Context<TransferNft>, new_owner: Pubkey) -> Result<()> {
        let nft_metadata = &mut ctx.accounts.nft_metadata;
        let authority = &ctx.accounts.authority;

        check_ownership(authority, &nft_metadata.owner)?;

        nft_metadata.owner = new_owner;

        emit!(NftTransferred {
            nft_metadata: nft_metadata.key(),
            old_owner: authority.key(),
            new_owner,
        });

        Ok(())
    }

    pub fn burn_nft(ctx: Context<BurnNft>) -> Result<()> {
        let nft_metadata = &mut ctx.accounts.nft_metadata;
        let mint = &ctx.accounts.mint;
        let token_account = &ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;
        let token_program = &ctx.accounts.token_program;

        check_ownership(authority, &nft_metadata.owner)?;

        token::burn(
            CpiContext::new(
                token_program.to_account_info(),
                token::Burn {
                    mint: mint.to_account_info(),
                    from: token_account.to_account_info(),
                    authority: authority.to_account_info(),
                },
            ),
            1,
        )?;

        nft_metadata.uri = "".to_string();
        nft_metadata.owner = Pubkey::default();

        emit!(NftBurned {
            nft_metadata: nft_metadata.key(),
            authority: authority.key(),
        });

        Ok(())
    }

    pub fn list_nft_for_sale(ctx: Context<ListNftForSale>, price: u64) -> Result<()> {
        validate_price(price)?;

        let nft_metadata = &mut ctx.accounts.nft_metadata;
        let authority = &ctx.accounts.authority;

        check_ownership(authority, &nft_metadata.owner)?;

        nft_metadata.sale_price = Some(price);

        emit!(NftListedForSale {
            nft_metadata: nft_metadata.key(),
            authority: authority.key(),
            price,
        });

        Ok(())
    }

    pub fn purchase_nft(ctx: Context<PurchaseNft>, payment_method: PaymentMethod) -> Result<()> {
        let nft_metadata = &mut ctx.accounts.nft_metadata;
        let buyer = &ctx.accounts.buyer;
        let seller = &ctx.accounts.seller;
        let sale_price = nft_metadata.sale_price.ok_or(ErrorCode::NotForSale)?;

        validate_price(sale_price)?;

        let creator_fee = calculate_creator_fee(sale_price);
        let bark_fee = calculate_bark_fee(sale_price);
        let total_fee = creator_fee + bark_fee;

        let transfer_amount = sale_price - total_fee;

        match payment_method {
            PaymentMethod::SOL => {
                // Transfer SOL
                **buyer.to_account_info().try_borrow_mut_lamports()? -= sale_price;
                **seller.to_account_info().try_borrow_mut_lamports()? += transfer_amount;

                // Transfer fees to creator and BARK
                let creator = Pubkey::from_str("CREATOR_PUBLIC_KEY_HERE")?; // Replace with actual creator public key
                let bark_wallet = Pubkey::from_str("BARK_WALLET_PUBLIC_KEY_HERE")?; // Replace with actual BARK wallet public key

                **buyer.to_account_info().try_borrow_mut_lamports()? -= creator_fee;
                **creator.to_account_info().try_borrow_mut_lamports()? += creator_fee;

                **buyer.to_account_info().try_borrow_mut_lamports()? -= bark_fee;
                **bark_wallet.to_account_info().try_borrow_mut_lamports()? += bark_fee;
            }
            PaymentMethod::SPLToken { token_mint, amount } => {
                // Transfer SPL Token
                let token_program = &ctx.accounts.token_program;
                let token_account_from = &ctx.accounts.token_account_from;
                let token_account_to = &ctx.accounts.token_account_to;

                token::transfer(
                    CpiContext::new(
                        token_program.to_account_info(),
                        Transfer {
                            from: token_account_from.to_account_info(),
                            to: token_account_to.to_account_info(),
                            authority: buyer.to_account_info(),
                        },
                    ),
                    amount,
                )?;

                // Transfer fees in SPL Token
                let creator_account = &ctx.accounts.creator_token_account;
                let bark_account = &ctx.accounts.bark_token_account;

                token::transfer(
                    CpiContext::new(
                        token_program.to_account_info(),
                        Transfer {
                            from: token_account_from.to_account_info(),
                            to: creator_account.to_account_info(),
                            authority: buyer.to_account_info(),
                        },
                    ),
                    creator_fee,
                )?;

                token::transfer(
                    CpiContext::new(
                        token_program.to_account_info(),
                        Transfer {
                            from: token_account_from.to_account_info(),
                            to: bark_account.to_account_info(),
                            authority: buyer.to_account_info(),
                        },
                    ),
                    bark_fee,
                )?;
            }
        }

        nft_metadata.owner = buyer.key();
        nft_metadata.sale_price = None;

        emit!(NftPurchased {
            nft_metadata: nft_metadata.key(),
            seller: seller.key(),
            buyer: buyer.key(),
            sale_price,
        });

        Ok(())
    }

    pub fn batch_mint_nfts(ctx: Context<BatchMintNfts>, uris: Vec<String>) -> Result<()> {
        if uris.is_empty() || uris.len() > 10 {
            return Err(ErrorCode::InvalidBatchSize.into());
        }

        for uri in uris {
            validate_metadata_uri(&uri)?;

            let mint = &ctx.accounts.mint;
            let token_program = &ctx.accounts.token_program;
            let authority = &ctx.accounts.authority;
            let token_account = &ctx.accounts.token_account;

            check_ownership(authority, &ctx.accounts.authority.key())?;

            token::mint_to(
                CpiContext::new(
                    token_program.to_account_info(),
                    token::MintTo {
                        mint: mint.to_account_info(),
                        to: token_account.to_account_info(),
                        authority: authority.to_account_info(),
                    },
                ),
                1,
            )?;

            let nft_metadata = &mut ctx.accounts.nft_metadata;
            nft_metadata.uri = uri;
            nft_metadata.owner = authority.key();
        }

        Ok(())
    }
}
