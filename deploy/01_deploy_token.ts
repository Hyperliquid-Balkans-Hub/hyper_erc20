import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as fs from 'fs';
import * as path from 'path';

const deployToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get token configuration from environment variables or use defaults
  const tokenName = process.env.TOKEN_NAME || 'MyToken';
  const tokenSymbol = process.env.TOKEN_SYMBOL || 'MTK';
  const tokenDecimals = process.env.TOKEN_DECIMALS || '18';
  const mintPercentage = parseInt(process.env.MINT_PERCENTAGE || '100');
  
  // For HyperERC20, we don't set initial supply in constructor - it's managed through minting
  const totalSupply = process.env.TOTAL_SUPPLY || '1000000'; // Used for display and minting calculations
  
  // Liquidity configuration
  const addLiquidity = process.env.ADD_LIQUIDITY === 'true';
  const liquidityTokenAmount = process.env.LIQUIDITY_TOKEN_AMOUNT || '10000';
  const liquidityHypeAmount = process.env.LIQUIDITY_HYPE_AMOUNT || '1';
  const liquiditySlippage = parseInt(process.env.LIQUIDITY_SLIPPAGE || '5');

  console.log('Deploying token with the following parameters:');
  console.log(`- Name: ${tokenName}`);
  console.log(`- Symbol: ${tokenSymbol}`);
  console.log(`- Total Supply: ${totalSupply}`);
  console.log(`- Decimals: ${tokenDecimals}`);
  console.log(`- Mint Percentage: ${mintPercentage}%`);
  console.log(`- Initial Mint Amount: ${Number(totalSupply) * mintPercentage / 100}`);
  console.log(`- Add Liquidity: ${addLiquidity ? 'Yes' : 'No'}`);
  if (addLiquidity) {
    console.log(`- Liquidity Token Amount: ${liquidityTokenAmount}`);
    console.log(`- Liquidity HYPE Amount: ${liquidityHypeAmount}`);
    console.log(`- Slippage Tolerance: ${liquiditySlippage}%`);
  }
  console.log(`- Deployer: ${deployer}`);

  const token = await deploy('HyperERC20', {
    from: deployer,
    args: [tokenName, tokenSymbol, tokenDecimals],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`\n✅ Token deployed successfully!`);
  console.log(`📍 Contract Address: ${token.address}`);
  console.log(`🔗 Transaction Hash: ${token.transactionHash}`);
  console.log(`⛽ Gas Used: ${token.receipt?.gasUsed?.toString()}`);
  console.log(`🔍 View on Purrsec: https://purrsec.com/address/${token.address}/transactions`);

  // Step 2: Mint initial tokens if percentage > 0
  if (mintPercentage > 0) {
    console.log(`\n🪙 Minting ${mintPercentage}% of total supply...`);
    
    const mintAmount = Math.floor(Number(totalSupply) * mintPercentage / 100);
    console.log(`💰 Minting ${mintAmount.toLocaleString()} ${tokenSymbol} tokens to deployer`);
    
    // Get the deployed contract instance
    const tokenContract = await hre.ethers.getContractAt('HyperERC20', token.address);
    
    // Mint tokens to deployer
    const mintTx = await tokenContract.mint(deployer, mintAmount);
    await mintTx.wait();
    
    console.log(`✅ Successfully minted ${mintAmount.toLocaleString()} ${tokenSymbol} tokens!`);
    console.log(`🔗 Mint Transaction: ${mintTx.hash}`);
    console.log(`⛽ Mint Gas Used: ${(await mintTx.wait()).gasUsed?.toString()}`);
  } else {
    console.log(`\n⏭️  Skipping initial mint (MINT_PERCENTAGE = 0%)`);
  }

  // Step 3: Add Liquidity to HyperSwap V2 (if enabled)
  if (addLiquidity) {
    console.log(`\n🏊 Adding liquidity to HyperSwap V2...`);
    
    try {
      // HyperSwap V2 Router address
      const ROUTER_ADDRESS = "0xD19222370B1944a5392f98028C3E70AFD3a673dF";
      
      // Load router ABI
      const routerABI = require('../abi/router_abi.json');
      
      // Get router contract
      const routerContract = await hre.ethers.getContractAt(routerABI.abi, ROUTER_ADDRESS);
      const signer = await hre.ethers.getSigner(deployer);
      const router = routerContract.connect(signer) as any;
      
      // Get WETH address from router
      const WETH_ADDRESS = await router.WETH() as string;
      console.log(`📍 WETH Address: ${WETH_ADDRESS}`);
      
      // Calculate amounts
      const tokenAmountDesired = hre.ethers.parseUnits(liquidityTokenAmount, tokenDecimals);
      const hyipeAmountDesired = hre.ethers.parseEther(liquidityHypeAmount);
      
      // Calculate minimum amounts with slippage
      const tokenAmountMin = tokenAmountDesired * BigInt(100 - liquiditySlippage) / BigInt(100);
      const hypeAmountMin = hyipeAmountDesired * BigInt(100 - liquiditySlippage) / BigInt(100);
      
      console.log(`💰 Token Amount: ${liquidityTokenAmount} ${tokenSymbol}`);
      console.log(`💰 HYPE Amount: ${liquidityHypeAmount} HYPE`);
      console.log(`📉 Slippage: ${liquiditySlippage}%`);
      
      // Approve token for router
      const tokenContract = await hre.ethers.getContractAt('HyperERC20', token.address);
      const tokenWithSigner = tokenContract.connect(signer) as any;
      
      console.log(`\n✅ Approving ${liquidityTokenAmount} ${tokenSymbol} for router...`);
      const approveTx = await tokenWithSigner.approve(ROUTER_ADDRESS, tokenAmountDesired);
      await approveTx.wait();
      console.log(`✅ Token approved successfully!`);
      
      // Add liquidity
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      
      console.log(`\n🏊 Adding liquidity to pool...`);
      const liquidityTx = await router.addLiquidityETH(
        token.address,
        tokenAmountDesired,
        tokenAmountMin,
        hypeAmountMin,
        deployer,
        deadline,
        { 
          value: hyipeAmountDesired,
          gasLimit: 500000 // Conservative gas limit
        }
      );
      
      const liquidityReceipt = await liquidityTx.wait();
      
      console.log(`✅ Liquidity added successfully!`);
      console.log(`🔗 Liquidity Transaction: ${liquidityTx.hash}`);
      console.log(`⛽ Liquidity Gas Used: ${liquidityReceipt.gasUsed?.toString()}`);
      console.log(`🔍 View on Purrsec: https://purrsec.com/address/${ROUTER_ADDRESS}/transactions`);
      console.log(`🏊 View Pool: https://app.hyperswap.exchange/#/pool`);
      
    } catch (error: any) {
      console.error(`❌ Failed to add liquidity:`, error.message || error);
      console.log(`⚠️  Deployment completed but liquidity addition failed.`);
      console.log(`💡 You can manually add liquidity at: https://app.hyperswap.exchange/#/add/${token.address}`);
    }
  } else {
    console.log(`\n⏭️  Skipping liquidity addition (ADD_LIQUIDITY = false)`);
    console.log(`💡 To add liquidity manually: https://app.hyperswap.exchange/#/add/${token.address}`);
  }

  // Create deployment history record
  const deploymentRecord = `# ${tokenName} (${tokenSymbol}) - Deployment Record

## Basic Information
- **Token Name:** ${tokenName}
- **Token Symbol:** ${tokenSymbol}
- **Decimals:** ${tokenDecimals}
- **Total Supply:** ${Number(totalSupply).toLocaleString()} ${tokenSymbol}
- **Initial Mint:** ${mintPercentage}% (${Math.floor(Number(totalSupply) * mintPercentage / 100).toLocaleString()} ${tokenSymbol})
- **Liquidity Added:** ${addLiquidity ? 'Yes' : 'No'}${addLiquidity ? ` (${liquidityTokenAmount} ${tokenSymbol} + ${liquidityHypeAmount} HYPE)` : ''}

## Deployment Details
- **Network:** ${hre.network.name === 'hyperliquid' ? 'Hyperliquid Mainnet (Chain ID: 999)' : hre.network.name}
- **Contract Address:** \`${token.address}\`
- **Transaction Hash:** \`${token.transactionHash}\`
- **Deployer Address:** \`${deployer}\`
- **Deployment Date:** ${new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z/, ' UTC')}
- **Gas Used:** ${token.receipt?.gasUsed?.toString() || 'N/A'}
- **Gas Price:** 1.0 Gwei (configured in hardhat.config.ts)

## Contract Functions (HyperERC20)
- ✅ Standard ERC20 (transfer, approve, etc.)
- ✅ Mintable (owner only)
- ✅ Burnable
- ✅ Ownable

## Links
- **View on Purrsec:** https://purrsec.com/address/${token.address}/transactions
- **View Transactions:** https://purrsec.com/address/${token.address}/transactions${addLiquidity ? `
- **HyperSwap Pool:** https://app.hyperswap.exchange/#/pool
- **Add More Liquidity:** https://app.hyperswap.exchange/#/add/${token.address}` : `
- **Add Liquidity:** https://app.hyperswap.exchange/#/add/${token.address}`}

## Notes
- Deployed successfully${hre.network.name === 'hyperliquid' ? ' with Big Blocks enabled' : ''}
- Initial minting: ${mintPercentage}% of total supply minted to deployer
- ${mintPercentage < 100 ? `Remaining ${100 - mintPercentage}% can be minted later by owner` : 'All tokens minted during deployment'}
- Owner can mint additional tokens if needed (up to remaining supply)
- Token holders can burn their own tokens
- Contract verification available via Sourcify at https://sourcify.parsec.finance

---
*This file was auto-generated on ${new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z/, ' UTC')}*
`;

  // Ensure deployment_history directory exists
  const historyDir = path.join(process.cwd(), 'deployment_history');
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  // Create filename with timestamp and token info
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${timestamp}_${tokenSymbol}_${token.address.slice(0, 8)}.md`;
  const filepath = path.join(historyDir, filename);

  // Write deployment record
  fs.writeFileSync(filepath, deploymentRecord);
  
  console.log(`📝 Deployment record saved: deployment_history/${filename}`);

  // Verify contract if not on localhost
  if (hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
    console.log('\n⏳ Waiting for block confirmations...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

    try {
      console.log('🔍 Attempting contract verification...');
      await hre.run('verify:verify', {
        address: token.address,
        constructorArguments: [tokenName, tokenSymbol, tokenDecimals], // HyperERC20 constructor: name, symbol, decimals
      });
      console.log('✅ Contract verified successfully!');
      console.log(`🔍 View verified contract: https://sourcify.parsec.finance/#/lookup/${token.address}`);
    } catch (error: any) {
      console.log('❌ Contract verification failed:', error.message || error);
      console.log('💡 You can verify manually later using: npm run verify:sourcify');
    }
  }
};

export default deployToken;
deployToken.tags = ['HyperERC20', 'token'];
