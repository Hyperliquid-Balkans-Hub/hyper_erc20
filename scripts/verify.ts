import { run } from "hardhat";

async function main() {
  // Contract details from deployment
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x9af33524cF693c622311E6A675f29942af647166";
  const contractName = process.env.CONTRACT_NAME || "HyperERC20";
  
  // Constructor arguments from deployment (HyperERC20 takes: name, symbol, decimals)
  const constructorArgs = [
    process.env.TOKEN_NAME || "Balkan Hub Token",
    process.env.TOKEN_SYMBOL || "BHT", 
    process.env.TOKEN_DECIMALS || "18"
  ];

  console.log("🔍 Verifying contract on Hyperliquid HyperEVM...");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`📝 Contract Name: ${contractName}`);
  console.log(`🔧 Constructor Args:`, constructorArgs);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
      contract: `contracts/${contractName}.sol:${contractName}`,
    });

    console.log("✅ Contract verified successfully!");
    console.log(`🔍 View verified contract: https://sourcify.parsec.finance/#/lookup/${contractAddress}`);
    
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure the contract address is correct");
      console.log("2. Verify constructor arguments match deployment");
      console.log("3. Ensure you're using the correct contract name");
      console.log("4. Try running from the project root directory");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 