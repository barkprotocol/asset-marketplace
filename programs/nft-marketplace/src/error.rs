use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The provided metadata URI is invalid.")]
    InvalidMetadataUri,
    
    #[msg("The provided price is invalid.")]
    InvalidPrice,
    
    #[msg("Batch size must be between 1 and 10.")]
    InvalidBatchSize,
    
    #[msg("This NFT is not for sale.")]
    NotForSale,
    
    #[msg("The operation could not be completed due to ownership issues.")]
    OwnershipError,
}
