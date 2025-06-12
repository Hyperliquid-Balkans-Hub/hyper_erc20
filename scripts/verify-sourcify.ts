import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import FormData from 'form-data';

async function main() {
  // Contract details
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x9af33524cF693c622311E6A675f29942af647166";
  const chainId = "999"; // Hyperliquid HyperEVM
  
  console.log("🔍 Verifying contract with Sourcify...");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🌐 Chain ID: ${chainId}`);

  try {
    // First, check if already verified
    console.log("\n📋 Checking if contract is already verified...");
    const checkUrl = `https://sourcify.parsec.finance/verify/check-by-addresses?addresses=${contractAddress}&chainIds=${chainId}`;
    
    try {
      const checkResponse = await axios.get(checkUrl);
      if (checkResponse.data && checkResponse.data[0] && checkResponse.data[0].status === "perfect") {
        console.log("✅ Contract is already verified!");
        console.log(`🔍 View verified contract: https://sourcify.parsec.finance/#/lookup/${contractAddress}`);
        return;
      }
    } catch (error) {
      console.log("📝 Contract not yet verified, proceeding with verification...");
    }

    // Read contract files
    const contractName = process.env.CONTRACT_NAME || "HyperERC20";
    const contractPath = path.join(process.cwd(), 'contracts', `${contractName}.sol`);
    const artifactPath = path.join(process.cwd(), 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
    const debugPath = path.join(process.cwd(), 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.dbg.json`);
    
    if (!fs.existsSync(contractPath)) {
      throw new Error(`Contract file not found: ${contractPath}`);
    }
    
    if (!fs.existsSync(debugPath)) {
      throw new Error(`Debug file not found: ${debugPath}. Run 'npm run compile' first.`);
    }

    const contractSource = fs.readFileSync(contractPath, 'utf8');
    const debugInfo = JSON.parse(fs.readFileSync(debugPath, 'utf8'));
    const buildInfoPath = path.join(process.cwd(), 'artifacts', 'build-info', path.basename(debugInfo.buildInfo));
    
    if (!fs.existsSync(buildInfoPath)) {
      throw new Error(`Build info file not found: ${buildInfoPath}`);
    }
    
    const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    const metadata = buildInfo.output.contracts[`contracts/${contractName}.sol`][contractName].metadata;

    // Prepare form data with source files and metadata
    const form = new FormData();
    form.append('address', contractAddress);
    form.append('chain', chainId);
    form.append('files', contractSource, `${contractName}.sol`);
    
    // Add the metadata.json file
    const metadataBuffer = Buffer.from(metadata, 'utf8');
    form.append('files', metadataBuffer, {
      filename: 'metadata.json',
      contentType: 'application/json'
    });
    
    // Also include any imported OpenZeppelin contracts if they exist
    const openzeppelinPath = path.join(process.cwd(), 'node_modules', '@openzeppelin', 'contracts');
    if (fs.existsSync(openzeppelinPath)) {
      // Add OpenZeppelin imports that our HyperERC20 contract uses
      const imports = [
        'token/ERC20/ERC20.sol',
        'access/Ownable.sol',
        'token/ERC20/IERC20.sol',
        'token/ERC20/extensions/IERC20Metadata.sol',
        'utils/Context.sol',
        'interfaces/draft-IERC6093.sol'
      ];
      
      for (const importPath of imports) {
        const fullImportPath = path.join(openzeppelinPath, importPath);
        if (fs.existsSync(fullImportPath)) {
          const importSource = fs.readFileSync(fullImportPath, 'utf8');
          form.append('files', importSource, `@openzeppelin/contracts/${importPath}`);
        }
      }
    }

    // Submit to Sourcify
    console.log("\n📤 Submitting to Sourcify...");
    const verifyUrl = 'https://sourcify.parsec.finance/verify';
    
    const response = await axios.post(verifyUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.status === 200) {
      console.log("✅ Contract verified successfully!");
      console.log(`🔍 View verified contract: https://sourcify.parsec.finance/#/lookup/${contractAddress}`);
      console.log(`📊 Verification result:`, response.data);
    } else {
      console.log("⚠️ Verification response:", response.status, response.data);
    }

  } catch (error: any) {
    console.error("❌ Verification failed:", error.message);
    
    if (error.response) {
      console.log("📊 Response status:", error.response.status);
      console.log("📊 Response data:", error.response.data);
    }
    
    console.log("\n🔧 Troubleshooting tips:");
    console.log("1. Make sure you've compiled the contracts: npm run compile");
    console.log("2. Check that the contract address is correct");
    console.log("3. Ensure the contract was deployed with the same source code");
    console.log("4. Try again in a few minutes (Sourcify might be busy)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 