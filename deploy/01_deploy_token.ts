import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const deployToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get token configuration from environment variables or use defaults
  const tokenName = process.env.TOKEN_NAME || 'MyToken';
  const tokenSymbol = process.env.TOKEN_SYMBOL || 'MTK';
  const initialSupply = process.env.INITIAL_SUPPLY || '1000000';
  const tokenDecimals = process.env.TOKEN_DECIMALS || '18';

  console.log('Deploying token with the following parameters:');
  console.log(`- Name: ${tokenName}`);
  console.log(`- Symbol: ${tokenSymbol}`);
  console.log(`- Initial Supply: ${initialSupply}`);
  console.log(`- Decimals: ${tokenDecimals}`);
  console.log(`- Deployer: ${deployer}`);

  const token = await deploy('SimpleERC20', {
    from: deployer,
    args: [tokenName, tokenSymbol, initialSupply, tokenDecimals],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`\n✅ Token deployed successfully!`);
  console.log(`📍 Contract Address: ${token.address}`);
  console.log(`🔗 Transaction Hash: ${token.transactionHash}`);
  console.log(`⛽ Gas Used: ${token.receipt?.gasUsed?.toString()}`);

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
