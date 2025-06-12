import { run } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

interface DeploymentInfo {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;
  contractName: string;
}

function getLatestDeployment(): DeploymentInfo {
  const historyDir = path.join(process.cwd(), 'deployment_history');
  
  if (!fs.existsSync(historyDir)) {
    throw new Error('No deployment history found. Please deploy a contract first.');
  }

  // Get all deployment files (exclude README.md and example files)
  const files = fs.readdirSync(historyDir)
    .filter(file => file.endsWith('.md') && !file.includes('README') && !file.includes('example'))
    .sort()
    .reverse(); // Get latest first

  if (files.length === 0) {
    throw new Error('No deployment records found. Please deploy a contract first.');
  }

  const latestFile = files[0];
  const filePath = path.join(historyDir, latestFile);
  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`📁 Reading deployment info from: ${latestFile}`);

  // Parse the deployment information from the markdown file
  const contractAddressMatch = content.match(/\*\*Contract Address:\*\* `([^`]+)`/);
  const tokenNameMatch = content.match(/\*\*Token Name:\*\* ([^\n]+)/);
  const tokenSymbolMatch = content.match(/\*\*Token Symbol:\*\* ([^\n]+)/);
  const decimalsMatch = content.match(/\*\*Decimals:\*\* ([^\n]+)/);

  if (!contractAddressMatch || !tokenNameMatch || !tokenSymbolMatch || !decimalsMatch) {
    throw new Error(`Could not parse deployment information from ${latestFile}`);
  }

  return {
    contractAddress: contractAddressMatch[1],
    tokenName: tokenNameMatch[1],
    tokenSymbol: tokenSymbolMatch[1],
    tokenDecimals: decimalsMatch[1],
    contractName: 'HyperERC20' // We know this is always HyperERC20
  };
}

async function main() {
  try {
    // Get deployment info from latest deployment history
    const deployment = getLatestDeployment();
    
    // Constructor arguments from deployment (HyperERC20 takes: name, symbol, decimals)
    const constructorArgs = [
      deployment.tokenName,
      deployment.tokenSymbol,
      deployment.tokenDecimals
    ];

    console.log("🔍 Verifying contract on Hyperliquid HyperEVM...");
    console.log(`📍 Contract Address: ${deployment.contractAddress}`);
    console.log(`📝 Contract Name: ${deployment.contractName}`);
    console.log(`🏷️  Token: ${deployment.tokenName} (${deployment.tokenSymbol})`);
    console.log(`🔧 Constructor Args:`, constructorArgs);

    await run("verify:verify", {
      address: deployment.contractAddress,
      constructorArguments: constructorArgs,
      contract: `contracts/${deployment.contractName}.sol:${deployment.contractName}`,
    });

    console.log("✅ Contract verified successfully!");
    console.log(`🔍 View verified contract: https://sourcify.parsec.finance/#/lookup/${deployment.contractAddress}`);
    
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure you have deployed a contract first");
      console.log("2. Verify the deployment history file contains correct information");
      console.log("3. Ensure you're using the correct contract name");
      console.log("4. Try running from the project root directory");
      console.log("5. You can override with env vars: CONTRACT_ADDRESS, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 