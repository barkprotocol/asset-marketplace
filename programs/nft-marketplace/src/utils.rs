use anchor_lang::prelude::*;
use crate::error::*;

pub fn validate_metadata_uri(uri: &str) -> Result<()> {
    if uri.is_empty() || uri.len() > 200 {
        return Err(ErrorCode::InvalidMetadataUri.into());
    }
    Ok(())
}

pub fn validate_price(price: u64) -> Result<()> {
    if price == 0 {
        return Err(ErrorCode::InvalidPrice.into());
    }
    Ok(())
}

pub fn check_ownership(signer: &Signer<'_>, owner: &Pubkey) -> Result<()> {
    if signer.key() != *owner {
        return Err(ErrorCode::OwnershipError.into());
    }
    Ok(())
}

pub fn calculate_creator_fee(price: u64) -> u64 {
    // Example fee calculation: 5% of the sale price
    price * 5 / 100
}

pub fn calculate_bark_fee(price: u64) -> u64 {
    // Example BARK fee calculation: 2% of the sale price
    price * 2 / 100
}
