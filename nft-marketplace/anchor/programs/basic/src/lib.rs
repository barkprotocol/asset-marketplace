use anchor_lang::prelude::*;

declare_id!("GVQzxj9SjBQZiQpEJZVU9sKDNo62ynKH9jq6FUMti1w7");

#[program]
pub mod basic {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
