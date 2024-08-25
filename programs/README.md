# NFT Marketplace Program

The NFT Marketplace program built using Anchor on the Solana blockchain. This README will guide you through setting up the development environment, deploying the smart contract, and interacting with the program.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Deployment](#deployment)
- [Interaction](#interaction)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## File Structure

```
nft-marketplace/
├── programs/
│   ├── src/
│   │   ├── lib.rs
│   │   ├── instructions.rs
│   │   ├── state.rs
│   │   ├── error.rs
│   │   ├── utils.rs
│   │   └── mod.rs
│   └── Cargo.toml
├── target/
│   ├── idl/
│   │   └── nft_marketplace.json
│   └── programs/
│       └── nft_marketplace.so
├── frontend/web
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── migrations/
│   └── deploy.ts
├── tests/
│   └── nft_marketplace.spec.ts
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: [Download and install](https://nodejs.org/).
- **Rust**: [Install from rust-lang.org](https://www.rust-lang.org/).
- **Anchor CLI**: Install Anchor CLI for Solana smart contract development.
  ```bash
  cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.31.1
  ```
- **Solana CLI**: Install Solana CLI tools.
  ```bash
  sh -c "$(curl -sSfL https://release.solana.com/v1.18.16/install)"
  ```

## Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/barkprotocol/nft-marketplace.git
cd nft-marketplace
```

### 2. Initialize the Anchor Project

Navigate to the project directory and build the Anchor project:

```bash
cd programs
anchor build
```

### 3. Install Dependencies

In the project root, install the necessary dependencies for the frontend:

```bash
cd frontend/web
npm install
```

## Deployment

### 1. Configure Environment

Create a `.env` file in the root of the project with the following content:

```bash
NETWORK_URL=https://api.devnet.solana.com
SOLANA_KEYPAIR=path/to/your/solana/keypair.json
```

### 2. Deploy the Program

Deploy your smart contract to the Solana blockchain:

```bash
cd programs
anchor deploy
```

## Interaction

### 1. Configure the Frontend

Update the `src/anchorConfig.ts` file with your program ID:

```typescript
import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID_HERE");
export { PROGRAM_ID };
```

### 2. Start the Frontend

Navigate to the frontend directory and start the development server:

```bash
cd ../frontend/web
npm run dev
```

Visit `http://localhost:3000` to interact with your NFT marketplace.

## Testing

### 1. Run Tests

Run the tests for your smart contract to ensure everything is functioning as expected:

```bash
cd programs
anchor test
```

## Troubleshooting

- **Clipboard Access Error**: If you encounter issues with clipboard access in Gitpod, ensure that your browser has granted the necessary permissions or try using a different browser.
- **Deployment Issues**: If you face problems during deployment, check your `.env` configuration and ensure you have a valid keypair and network URL.
- **Connection Errors**: Ensure that your frontend is correctly configured with the right Solana network URL and program ID.

## License

The MIT License - see the [LICENSE](LICENSE) file for details.
