# HyperERC20 Token Deployer for Hyperliquid HyperEVM

A simple, ready-to-use Hardhat setup for deploying HyperERC20 tokens on **Hyperliquid HyperEVM Mainnet**. Just add your private key and deploy!

# 🚀 QUICK START GUIDE

**🔴 IMPORTANT: You need $100+ USDC on HyperCore to deploy HyperERC20 tokens!**

## Step 1: Install Dependencies
```bash
npm install
```

**If you get dependency conflicts, try:**
```bash
npm install --legacy-peer-deps
```

## Step 2: Setup Environment File
```bash
cp env.example .env
```

Edit `.env` file with your details:
```bash
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Your token details
TOKEN_NAME=YourTokenName
TOKEN_SYMBOL=YTN
TOKEN_DECIMALS=18
MINT_PERCENTAGE=100

# Optional: Auto-add liquidity to HyperSwap V2
ADD_LIQUIDITY=false
LIQUIDITY_TOKEN_AMOUNT=10000
LIQUIDITY_HYPE_AMOUNT=1
LIQUIDITY_SLIPPAGE=5
```

## Step 3: Prepare Your Wallet
1. **Get HYPE tokens** for gas fees from:
   - https://www.relay.link/bridge/hyperevm (Relay)
   - https://hybridge.xyz/?refUser=209f2f41 (HyBridge)

2. **Deposit $100+ USDC to HyperCore**:
   - https://www.relay.link/bridge/hyperevm (Relay)
   - Deposit at least $100 USDC to your account

## Step 4: Enable Big Blocks
1. Visit https://hyperevm-block-toggle.vercel.app
2. Connect your wallet (must have $100+ USDC on HyperCore)
3. Toggle to "Big Blocks" mode
4. Wait 2-3 minutes for activation

## Step 5: Deploy Your Token
```bash
npm run deploy
```

## Step 6: Switch Back to Fast Blocks (Recommended)
1. Return to https://hyperevm-block-toggle.vercel.app
2. Toggle back to "Fast Blocks"

**🎉 Done! Your ERC20 token is now deployed on Hyperliquid HyperEVM Mainnet!**

**🔍 View your token:** After deployment, you can view your token and transactions at https://purrsec.com

**📝 Deployment Record:** A detailed deployment record is automatically saved in the `deployment_history/` folder

---

# 📖 DETAILED DOCUMENTATION

## 🔧 Configuration Options

You can customize your token by setting these environment variables in your `.env` file:

| Variable         | Description                           | Default   | Example        |
| ---------------- | ------------------------------------- | --------- | -------------- |
| `TOKEN_NAME`     | Full name of your token               | "MyToken" | "Awesome Coin" |
| `TOKEN_SYMBOL`   | Token symbol/ticker                   | "MTK"     | "AWE"          |
| `TOKEN_DECIMALS` | Number of decimals                    | "18"      | "6"            |
| `MINT_PERCENTAGE`| % of supply to mint initially (1-100) | "100"     | "50"           |
| `ADD_LIQUIDITY`  | Add liquidity to HyperSwap V2         | "false"   | "true"         |
| `LIQUIDITY_TOKEN_AMOUNT` | Token amount for liquidity   | "10000"   | "5000"         |
| `LIQUIDITY_HYPE_AMOUNT` | HYPE amount for liquidity     | "1"       | "0.5"          |
| `LIQUIDITY_SLIPPAGE` | Slippage tolerance (1-50)        | "5"       | "10"           |

## 📋 Available Commands

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `npm run compile`      | Compile smart contracts         |
| `npm run deploy`       | Deploy to Hyperliquid mainnet   |
| `npm run deploy:local` | Deploy to local hardhat network |
| `npm run test`         | Run contract tests              |
| `npm run verify`       | Verify using custom script (auto-reads deployment) |
| `npm run verify:hardhat`| Verify using Hardhat built-in (may have API issues) |
| `npm run clean`        | Clean compiled artifacts        |
| `npm run node`         | Start local Hardhat node        |

## 🔍 Contract Features

The `HyperERC20` contract includes:

- ✅ Standard ERC20 functionality (transfer, approve, etc.)
- ✅ Mintable (only by owner)
- ✅ Burnable (by token holders)
- ✅ Ownable (with OpenZeppelin)
- ✅ Configurable decimals
- ✅ Controlled initial minting (configurable percentage)
- ✅ Built with OpenZeppelin contracts (secure & audited)

## 🪙 Minting Process

The deployment process consists of two steps:

1. **Deploy Contract**: Creates the token contract without minting any tokens
2. **Initial Mint**: Mints a configurable percentage of the total supply to the deployer

### Minting Configuration

- **`MINT_PERCENTAGE=100`**: Mints 100% of total supply immediately (default)
- **`MINT_PERCENTAGE=50`**: Mints 50% initially, leaves 50% for future minting
- **`MINT_PERCENTAGE=0`**: No initial minting, all tokens can be minted later

This gives you full control over token distribution and allows for:
- **Gradual token release** (mint 10% initially, rest over time)
- **Community distribution** (mint 0% initially, distribute via airdrops)
- **Traditional launch** (mint 100% to deployer for immediate distribution)

## 🏊 Automated Liquidity Addition

For convenience, the deployment script can automatically add initial liquidity to HyperSwap V2 after token deployment.

### 🔧 Configuration

Set `ADD_LIQUIDITY=true` in your `.env` file to enable automated liquidity addition:

```bash
ADD_LIQUIDITY=true
LIQUIDITY_TOKEN_AMOUNT=10000    # Amount of your token to add
LIQUIDITY_HYPE_AMOUNT=1         # Amount of HYPE to pair with
LIQUIDITY_SLIPPAGE=5            # Slippage tolerance (1-50%)
```

### 📋 Requirements

- **Sufficient HYPE balance** for liquidity and gas fees
- **Sufficient token balance** (minted during deployment)
- **Big Blocks enabled** (for higher gas limits)

### 🚀 Process

When enabled, the deployment script will:

1. **Deploy your token contract**
2. **Mint specified percentage** to deployer
3. **Approve tokens** for HyperSwap Router
4. **Add liquidity** to create HYPE/YourToken pool
5. **Provide trading links** for immediate access

### ⚠️ Important Notes

- **Test with small amounts first** on a test deployment
- **Liquidity addition is optional** - set `ADD_LIQUIDITY=false` to skip
- **Manual backup available** - if automated addition fails, you get manual links
- **Slippage protection** - transactions will revert if price moves too much

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

### Hyperliquid HyperEVM Mainnet

- **Network Name:** Hyperliquid HyperEVM
- **RPC URL:** `https://rpc.hyperliquid.xyz/evm`
- **Chain ID:** 999
- **Explorer:** https://purrsec.com (Only working explorer for HyperEVM)
- **Bridge:** Get HYPE tokens from:
  - https://hybridge.xyz/?refUser=209f2f41 (HyBridge)
  - https://www.relay.link/bridge/hyperevm?fromChainId=999&fromCurrency=0x0000000000000000000000000000000000000000&toCurrency=0x0000000000000000000000000000000000000000 (Relay)
  - https://app.debridge.finance/ (DeBridge)
  - https://www.gas.zip/ (Gas.zip)

### Adding to MetaMask

To add Hyperliquid HyperEVM to MetaMask:

1. Open MetaMask
2. Go to Settings > Networks > Add Network
3. Enter these details:
   - **Network Name:** Hyperliquid HyperEVM
   - **RPC URL:** `https://rpc.hyperliquid.xyz/evm`
   - **Chain ID:** 999
   - **Currency Symbol:** HYPE
   - **Explorer:** `https://purrsec.com`

## 📁 Project Structure

```
erc20/
├── abi/
│   └── router_abi.json          # HyperSwap V2 Router ABI
├── contracts/
│   └── HyperERC20.sol           # ERC20 token contract for HyperEVM
├── deploy/
│   └── 01_deploy_token.ts       # Deployment script with liquidity
├── deployment_history/          # Auto-generated deployment records
│   ├── README.md               # Deployment history guide
│   └── *.md                    # Individual deployment records
├── test/
│   └── HyperERC20.test.ts       # Contract tests
├── hardhat.config.ts            # Hardhat configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── env.example                 # Environment variables example
└── README.md                   # This file
```

## 📝 Deployment History

Every time you deploy a token, a detailed record is automatically created in the `deployment_history/` folder. Each record includes:

- **Token Details**: Name, symbol, supply, decimals
- **Deployment Info**: Contract address, transaction hash, gas usage
- **Network Info**: Chain ID, deployer address, timestamp
- **Direct Links**: Links to view your contract on Purrsec
- **Notes**: Additional information about the deployment

### Example Deployment Record
```
2024-01-15T14-30-25_MTK_0x1234abcd.md
```

This helps you:
- 📋 Keep track of all your deployed tokens
- 🔍 Quickly find contract addresses and transaction hashes
- 📊 Compare gas costs across different deployments
- 🔗 Access direct links to view contracts on Purrsec
- 📤 Share deployment details with others

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

Hyperliquid HyperEVM supports two block modes:

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

**Great news!** Contract verification is now available on Hyperliquid HyperEVM using **Sourcify** through Parsec!

### 🔍 Verification Methods

#### Method 1: Using Hardhat (Recommended)

After deploying your contract, verify it using:

```bash
# Using the verification script (easiest - auto-reads latest deployment)
npm run verify

# Or manually with contract address and constructor args
npx hardhat verify --network hyperliquid 0xYourContractAddress "TokenName" "SYMBOL" "18"
```

#### Method 2: Using Environment Variables

Set your contract details in `.env`:

```bash
CONTRACT_ADDRESS=0xYourContractAddress
CONTRACT_NAME=HyperERC20
TOKEN_NAME=YourTokenName
TOKEN_SYMBOL=YTN
TOKEN_DECIMALS=18
```

Then run:
```bash
npm run verify
```

#### Method 3: CLI Verification

You can also verify using the Foundry CLI if you have it installed:

```bash
forge verify-contract 0xYourContractAddress contracts/HyperERC20.sol:HyperERC20 \
  --chain-id 999 \
  --verifier sourcify \
  --verifier-url https://sourcify.parsec.finance/verify \
  --constructor-args $(cast abi-encode "constructor(string,string,uint8)" "TokenName" "SYMBOL" 18)
```

### 📋 Verification Benefits

- ✅ **Source Code Visibility**: View your contract source code publicly
- ✅ **Enhanced Trust**: Users can verify contract functionality
- ✅ **Better Integration**: Improved support with tools and explorers
- ✅ **Debugging**: Easier to debug transactions and contract interactions

### 🔗 Verification Links

- **Sourcify Interface**: https://sourcify.parsec.finance
- **Lookup Verified Contracts**: https://sourcify.parsec.finance/#/lookup/YOUR_CONTRACT_ADDRESS
- **View Transactions**: https://purrsec.com/address/YOUR_CONTRACT_ADDRESS/transactions

### 🐛 Troubleshooting Verification

If verification fails, try these steps:

1. **Check Constructor Arguments**: Ensure they match exactly what was used during deployment
2. **Verify Contract Name**: Make sure you're using the correct contract name (e.g., `HyperERC20`)
3. **Compiler Version**: Ensure you're using Solidity 0.8.24 (set in hardhat.config.ts)
4. **Run from Root**: Execute verification commands from the project root directory
5. **Check Network**: Ensure you're connected to Hyperliquid HyperEVM (Chain ID: 999)

**Example successful verification:**
```bash
✅ Contract verified successfully!
🔍 View verified contract: https://sourcify.parsec.finance/#/lookup/0x9af33524cF693c622311E6A675f29942af647166
```

## 🔄 Adding Your Token to HyperSwap

After deploying your HyperERC20 token, you can make it tradeable on HyperSwap, the leading DEX on Hyperliquid HyperEVM.

### 📋 Requirements & Token Listing

**⚠️ Important:** HyperSwap has specific requirements for token listings. Before proceeding, make sure to review the listing requirements at:

🔗 **Token List Repository:** https://github.com/HyperSwap-Labs/hyperswap-token-list

### 🏊 Adding Liquidity

Once your token meets the requirements, you can add it to a liquidity pool:

1. **Visit HyperSwap:** https://app.hyperswap.exchange/#/add/HYPE
2. **Connect your wallet** (the same one used for deployment)
3. **Select your token** using your contract address
4. **Add liquidity** by pairing with HYPE or other tokens
5. **Create the pool** and start trading

### 📝 Submitting to Token List

To get your token officially listed on HyperSwap:

1. **Fork the repository:** https://github.com/HyperSwap-Labs/hyperswap-token-list
2. **Add your token details** following their format
3. **Submit a Pull Request** with all required information
4. **Wait for review** by the HyperSwap team

### 🎯 Benefits of Being Listed

- ✅ **Easier discovery** by traders
- ✅ **Official token logo** display
- ✅ **Better integration** with HyperSwap UI
- ✅ **Increased trading volume** potential
- ✅ **Enhanced credibility** for your project

**💡 Pro Tip:** Having sufficient liquidity and meeting community standards significantly improves your chances of getting listed!

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
🔍 View on Purrsec: https://purrsec.com/address/0xabcd...efgh/transactions

🪙 Minting 100% of total supply...
💰 Minting 1,000,000 MTK tokens to deployer
✅ Successfully minted 1,000,000 MTK tokens!

🏊 Adding liquidity to HyperSwap V2...
💰 Token Amount: 10000 MTK
💰 HYPE Amount: 1 HYPE
✅ Liquidity added successfully!
🏊 View Pool: https://app.hyperswap.exchange/#/pool

📝 Deployment record saved: deployment_history/2024-01-15T14-30-25_MTK_0xabcdefgh.md

⏳ Waiting for block confirmations...
✅ Contract deployed successfully!
🔍 View your contract at: https://purrsec.com
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
