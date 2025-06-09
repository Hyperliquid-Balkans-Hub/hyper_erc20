# ERC20 Token Deployer for Hyperliquid

A simple, ready-to-use Hardhat setup for deploying ERC20 tokens on Hyperliquid testnet. Just add your private key and deploy!

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A wallet with Hyperliquid testnet tokens

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and add your private key:

```bash
cp env.example .env
```

Edit `.env` and add your private key:

```bash
# Private key for deploying contracts (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Optional: Token configuration
TOKEN_NAME=MyToken
TOKEN_SYMBOL=MTK
INITIAL_SUPPLY=1000000
TOKEN_DECIMALS=18
```

**⚠️ Important:** Never commit your `.env` file or share your private key!

### 3. Deploy Your Token

Deploy to Hyperliquid mainnet:

```bash
npm run deploy
```

That's it! Your ERC20 token will be deployed and verified automatically.

**⚠️ Important:** This deploys to Hyperliquid mainnet (Chain ID 999). Make sure you have:

- Real HYPE tokens for gas fees
- $100+ USDC on HyperCore for big blocks access

## 🔧 Configuration Options

You can customize your token by setting these environment variables in your `.env` file:

| Variable         | Description                           | Default   | Example        |
| ---------------- | ------------------------------------- | --------- | -------------- |
| `TOKEN_NAME`     | Full name of your token               | "MyToken" | "Awesome Coin" |
| `TOKEN_SYMBOL`   | Token symbol/ticker                   | "MTK"     | "AWE"          |
| `INITIAL_SUPPLY` | Initial token supply (in token units) | "1000000" | "500000"       |
| `TOKEN_DECIMALS` | Number of decimals                    | "18"      | "6"            |

## 📋 Available Commands

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `npm run compile`      | Compile smart contracts         |
| `npm run deploy`       | Deploy to Hyperliquid mainnet   |
| `npm run deploy:local` | Deploy to local hardhat network |
| `npm run test`         | Run contract tests              |
| `npm run verify`       | Verify contracts on Hyperliquid |
| `npm run clean`        | Clean compiled artifacts        |
| `npm run node`         | Start local Hardhat node        |

## 🔍 Contract Features

The `SimpleERC20` contract includes:

- ✅ Standard ERC20 functionality (transfer, approve, etc.)
- ✅ Mintable (only by owner)
- ✅ Burnable (by token holders)
- ✅ Ownable (with OpenZeppelin)
- ✅ Configurable decimals
- ✅ Built with OpenZeppelin contracts (secure & audited)

### Contract Functions

**Standard ERC20:**

- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spending
- `transferFrom(from, to, amount)` - Transfer from approved amount
- `balanceOf(account)` - Get balance
- `totalSupply()` - Get total supply

**Additional Features:**

- `mint(to, amount)` - Mint new tokens (owner only)
- `burn(amount)` - Burn your own tokens
- `burnFrom(from, amount)` - Burn tokens from approved account

## 🌐 Network Configuration

### Hyperliquid Mainnet

- **RPC URL:** `https://rpc.hyperliquid.xyz/evm`
- **Chain ID:** 999
- **Explorer:** https://explorer.hyperliquid.xyz
- **Bridge:** Get HYPE tokens from:
  - https://hybridge.xyz/?refUser=209f2f41 (HyBridge)
  - https://www.relay.link/bridge/hyperevm?fromChainId=999&fromCurrency=0x0000000000000000000000000000000000000000&toCurrency=0x0000000000000000000000000000000000000000 (Relay)
  - https://app.debridge.finance/ (DeBridge)
  - https://www.gas.zip/ (Gas.zip)

### Adding to MetaMask

To add Hyperliquid mainnet to MetaMask:

1. Open MetaMask
2. Go to Settings > Networks > Add Network
3. Enter these details:
   - **Network Name:** Hyperliquid
   - **RPC URL:** `https://rpc.hyperliquid.xyz/evm`
   - **Chain ID:** 999
   - **Currency Symbol:** HYPE
   - **Block Explorer:** `https://explorer.hyperliquid.xyz`

## 📁 Project Structure

```
erc20/
├── contracts/
│   └── SimpleERC20.sol          # ERC20 token contract
├── deploy/
│   └── 01_deploy_token.ts       # Deployment script
├── test/
│   └── SimpleERC20.test.ts      # Contract tests
├── hardhat.config.ts            # Hardhat configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── env.example                 # Environment variables example
└── README.md                   # This file
```

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

The tests cover:

- Contract deployment
- Token transfers
- Minting functionality
- Burning functionality
- Access control

## 🔐 Security Considerations

- **Private Key Safety:** Never share or commit your private key
- **Testnet First:** Always test on testnet before mainnet
- **Code Review:** Review the contract code before deploying
- **Gas Estimation:** Check gas costs before large deployments

## ⚡ Big Blocks Configuration

### What are Big Blocks?

Hyperliquid supports two block modes:

- **Fast Blocks** (default): ~1.8 second block times, 5M gas limit
- **Big Blocks**: ~10 second block times, 30M gas limit

ERC20 token deployment requires **Big Blocks** due to the higher gas requirements (up to 25M gas).

### Prerequisites for Big Blocks

1. **💰 $100+ USDC on HyperCore**

   - You need at least $100 USDC deposited on HyperCore (Hyperliquid's central limit order book)
   - This requirement ensures you're a serious user and prevents spam
   - You can deposit USDC at: https://app.hyperliquid.xyz/trade

2. **🔧 Enable Big Blocks**

   - Visit: https://hyperevm-block-toggle.vercel.app
   - Connect your wallet with 100+ USDC on HyperCore
   - Toggle to "Big Blocks" mode
   - Wait for confirmation (takes 1-2 minutes)

3. **⛽ Gas Tokens**
   - You still need HYPE tokens for gas fees
   - Get HYPE from:
     - https://hybridge.xyz/?refUser=209f2f41 (HyBridge)
     - https://www.relay.link/bridge/hyperevm?fromChainId=999&fromCurrency=0x0000000000000000000000000000000000000000&toCurrency=0x0000000000000000000000000000000000000000 (Relay)
     - https://app.debridge.finance/ (DeBridge)
     - https://www.gas.zip/ (Gas.zip)

### Step-by-Step Big Blocks Setup

1. **Check Your HyperCore Balance**

   ```
   1. Go to https://app.hyperliquid.xyz/
   2. Connect your wallet
   3. Check if you have 100+ USDC in your account
   4. If not, deposit USDC using the bridge
   ```

2. **Enable Big Blocks**

   ```
   1. Visit https://hyperevm-block-toggle.vercel.app
   2. Connect the same wallet
   3. Click "Enable Big Blocks"
   4. Wait for the transaction to confirm
   ```

3. **Deploy Your Token**

   ```bash
   npm run deploy
   ```

4. **Disable Big Blocks (Recommended)**
   ```
   After deployment, go back to the toggle app and switch back to "Fast Blocks"
   This ensures faster transaction processing for normal operations
   ```

### Why Big Blocks Are Needed

ERC20 contracts with OpenZeppelin dependencies are complex and require significant gas:

- Token deployment: ~15-20M gas
- Contract verification: Additional gas overhead
- Total requirement: Up to 25M gas

Fast blocks (5M gas limit) cannot accommodate these deployments, hence the need for Big Blocks (30M gas limit).

## 🐛 Troubleshooting

### Common Issues

**1. "insufficient funds" error**

- Make sure your wallet has enough HYPE tokens for gas
- Bridge HYPE tokens from:
  - https://hybridge.xyz/?refUser=209f2f41 (HyBridge)
  - https://www.relay.link/bridge/hyperevm?fromChainId=999&fromCurrency=0x0000000000000000000000000000000000000000&toCurrency=0x0000000000000000000000000000000000000000 (Relay)
  - https://app.debridge.finance/ (DeBridge)
  - https://www.gas.zip/ (Gas.zip)

**2. "nonce too high" error**

- Reset your MetaMask account: Settings > Advanced > Reset Account

**3. "network not found" error**

- Check your RPC URL in `hardhat.config.ts`
- Ensure you're connected to the right network

**4. Deployment stuck**

- Increase gas price in `hardhat.config.ts`
- Check network status

**5. "exceeds block gas limit" error**

This is the most common error when deploying ERC20 contracts on Hyperliquid.

**❌ Common causes:**

- You don't have 100+ USDC on HyperCore
- Big blocks are not enabled
- You're trying to deploy during fast blocks mode

**✅ Solutions:**

- Ensure you have 100+ USDC on HyperCore: https://app.hyperliquid.xyz/trade
- Enable big blocks: https://hyperevm-block-toggle.vercel.app
- Wait 2-3 minutes after enabling big blocks before deploying
- Verify big blocks are active (blocks should take ~10 seconds instead of ~1.8)

### Getting Help

- Check Hyperliquid Discord for support
- Review Hardhat documentation
- Open an issue in this repository

## 📄 Contract Verification

Contracts are automatically verified after deployment. You can also manually verify:

```bash
npx hardhat verify --network hyperliquid <CONTRACT_ADDRESS> "TokenName" "SYMBOL" "1000000" "18"
```

## 🎯 Example Deployment Output

```
Deploying token with the following parameters:
- Name: MyToken
- Symbol: MTK
- Initial Supply: 1000000
- Decimals: 18
- Deployer: 0x1234...5678

✅ Token deployed successfully!
📍 Contract Address: 0xabcd...efgh
🔗 Transaction Hash: 0x1234...5678
⛽ Gas Used: 1,234,567

⏳ Waiting for block confirmations...
✅ Contract verified successfully!
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Ready to deploy your token? Just run `npm run deploy`! 🚀**

---

## 🔴 Support This Project

If this repository helped you deploy your token successfully and you'd like to give back, consider sending a small donation to support continued development:

**🔴 Donation Address (any chain):**
```
0xB1620c0547744DeDD30F40a863c09D1964532F8C
```

**🔴 Every contribution helps maintain and improve this tool for the community! 🙏**
