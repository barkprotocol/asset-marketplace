# NFT Marketplace 

Bootstrapped Solana Dapp Scaffold

## **1. Set Up the Development Environment**

### **1.1. Install Prerequisites**

Ensure you have the following tools installed:

- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
- **Rust**: Install Rust from [rust-lang.org](https://www.rust-lang.org/).
- **Anchor**: Install Anchor CLI for Solana smart contract development.

  ```bash
  cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.31.1
  ```

- **Solana CLI**: Install Solana CLI tools.

  ```bash
  sh -c "$(curl -sSfL https://release.solana.com/v1.18.16/install)"
  ```

### **1.2. Verify Installations**

Ensure that Rust, Anchor, and Solana CLI are installed correctly:

```bash
rustc --version
anchor --version
solana --version
```

## **2. Create a New Anchor Project**

### **2.1. Initialize the Anchor Project**

Navigate to your workspace directory and create a new Anchor project:

```bash
cd nft-marketplace
```

### **2.2. Build and Test**

Build and test your Anchor project to ensure everything is set up correctly:

```bash
anchor build
anchor test
```

## **3. Set Up the Frontend with Next.js**

### **3.1. Initialize a Next.js Project**

In a new directory or as a subdirectory within your `solana-dapp`, create a new Next.js project:

```bash
npx create-next-app frontend --typescript
cd frontend
```

### **3.2. Install Dependencies**

Add necessary dependencies for Solana and Anchor integration:

```bash
npm install @solana/web3.js @coral-xyz/anchor @solana/spl-token
```

### **3.3. Configure the Solana Connection**

Create a configuration file for Solana in `frontend`:

**File: `frontend/src/config/solana.ts`**

```typescript
import { Connection } from '@solana/web3.js';

// Configure the connection to the Solana devnet
export const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
```

### **3.4. Connect to the Solana Smart Contract**

Create a file to interact with your smart contract:

**File: `frontend/src/anchorConfig.ts`**

```typescript
import { AnchorProvider, Program, web3 } from '@@coral-xyz/anchor';
import { connection } from './config/solana';

// Load your IDL and program address
const IDL = require('./path/to/idl.json'); // Adjust the path
const PROGRAM_ID = new web3.PublicKey('YOUR_PROGRAM_ID');

export const provider = new AnchorProvider(connection, window.solana, { commitment: 'confirmed' });
export const program = new Program(IDL, PROGRAM_ID, provider);
```

## **4. Develop the Frontend**

### **4.1. Create a Basic Page**

Update `pages/index.tsx` to include basic interaction with your smart contract:

**File: `frontend/pages/index.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { program, provider } from '../src/anchorConfig';
import { PublicKey } from '@solana/web3.js';

const Home = () => {
  const [status, setStatus] = useState<string>('');

  const handleMint = async () => {
    try {
      // Replace with actual interaction logic
      const tx = await program.methods.mintNft().accounts({
        // Add necessary accounts here
      }).rpc();
      setStatus(`Transaction successful: ${tx}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      // Handle Phantom Wallet connection
    } else {
      setStatus('Please install Phantom wallet');
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Solana NFT Marketplace</h1>
      <button onClick={handleMint} className="bg-blue-500 text-white p-2 mt-2">
        Mint NFT
      </button>
      <div>Status: {status}</div>
    </div>
  );
};

export default Home;
```

### **4.2. Style with Tailwind CSS**

If you haven’t set up Tailwind CSS yet, follow the Tailwind setup for Next.js:

**Install Tailwind CSS:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure Tailwind in `tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Add Tailwind directives to `styles/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## **5. Deploy and Test**

### **5.1. Deploy the Anchor Program**

Deploy your smart contract to Solana:

```bash
anchor deploy
```

### **5.2. Run the Frontend**

Start the Next.js development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to interact with your dapp.