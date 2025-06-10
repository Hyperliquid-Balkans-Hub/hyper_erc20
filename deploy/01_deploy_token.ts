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
  const initialSupply = process.env.INITIAL_SUPPLY || '1000000';
  const tokenDecimals = process.env.TOKEN_DECIMALS || '18';
  const mintPercentage = parseInt(process.env.MINT_PERCENTAGE || '100');

  console.log('Deploying token with the following parameters:');
  console.log(`- Name: ${tokenName}`);
  console.log(`- Symbol: ${tokenSymbol}`);
  console.log(`- Total Supply: ${initialSupply}`);
  console.log(`- Decimals: ${tokenDecimals}`);
  console.log(`- Mint Percentage: ${mintPercentage}%`);
  console.log(`- Initial Mint Amount: ${Number(initialSupply) * mintPercentage / 100}`);
  console.log(`- Deployer: ${deployer}`);

  const token = await deploy('SimpleERC20', {
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
    
    const mintAmount = Math.floor(Number(initialSupply) * mintPercentage / 100);
    console.log(`💰 Minting ${mintAmount.toLocaleString()} ${tokenSymbol} tokens to deployer`);
    
    // Get the deployed contract instance
    const tokenContract = await hre.ethers.getContractAt('SimpleERC20', token.address);
    
    // Mint tokens to deployer
    const mintTx = await tokenContract.mint(deployer, mintAmount);
    await mintTx.wait();
    
    console.log(`✅ Successfully minted ${mintAmount.toLocaleString()} ${tokenSymbol} tokens!`);
    console.log(`🔗 Mint Transaction: ${mintTx.hash}`);
    console.log(`⛽ Mint Gas Used: ${(await mintTx.wait()).gasUsed?.toString()}`);
  } else {
    console.log(`\n⏭️  Skipping initial mint (MINT_PERCENTAGE = 0%)`);
  }

  // Create deployment history record
  const deploymentRecord = `# ${tokenName} (${tokenSymbol}) - Deployment Record

## Basic Information
- **Token Name:** ${tokenName}
- **Token Symbol:** ${tokenSymbol}
- **Decimals:** ${tokenDecimals}
- **Total Supply:** ${Number(initialSupply).toLocaleString()} ${tokenSymbol}
- **Initial Mint:** ${mintPercentage}% (${Math.floor(Number(initialSupply) * mintPercentage / 100).toLocaleString()} ${tokenSymbol})

## Deployment Details
- **Network:** ${hre.network.name === 'hyperliquid' ? 'Hyperliquid Mainnet (Chain ID: 999)' : hre.network.name}
- **Contract Address:** \`${token.address}\`
- **Transaction Hash:** \`${token.transactionHash}\`
- **Deployer Address:** \`${deployer}\`
- **Deployment Date:** ${new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z/, ' UTC')}
- **Gas Used:** ${token.receipt?.gasUsed?.toString() || 'N/A'}
- **Gas Price:** 1.0 Gwei (configured in hardhat.config.ts)

## Contract Functions
- ✅ Standard ERC20 (transfer, approve, etc.)
- ✅ Mintable (owner only)
- ✅ Burnable
- ✅ Ownable

## Links
- **View on Purrsec:** https://purrsec.com/address/${token.address}/transactions
- **View Transactions:** https://purrsec.com/address/${token.address}/transactions

## Notes
- Deployed successfully${hre.network.name === 'hyperliquid' ? ' with Big Blocks enabled' : ''}
- Initial minting: ${mintPercentage}% of total supply minted to deployer
- ${mintPercentage < 100 ? `Remaining ${100 - mintPercentage}% can be minted later by owner` : 'All tokens minted during deployment'}
- Owner can mint additional tokens if needed (up to remaining supply)
- Token holders can burn their own tokens
- Contract verification is not available on Hyperliquid

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
  // if (hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
  //   console.log('\n⏳ Waiting for block confirmations...');
  //   await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

  //   try {
  //     await hre.run('verify:verify', {
  //       address: token.address,
  //       constructorArguments: [tokenName, tokenSymbol, initialSupply, tokenDecimals],
  //     });
  //     console.log('✅ Contract verified successfully!');
  //   } catch (error) {
  //     console.log('❌ Contract verification failed:', error);
  //   }
  // }
};

export default deployToken;
deployToken.tags = ['SimpleERC20', 'token'];
