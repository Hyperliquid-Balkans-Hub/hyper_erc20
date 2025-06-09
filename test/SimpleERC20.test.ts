import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SimpleERC20 } from '../typechain-types';

describe('SimpleERC20', function () {
  let token: SimpleERC20;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const TOKEN_NAME = 'Test Token';
  const TOKEN_SYMBOL = 'TST';
  const INITIAL_SUPPLY = 1000000;
  const DECIMALS = 18;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory('SimpleERC20');
    token = await TokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY, DECIMALS);
    await token.waitForDeployment();
  });

  describe('Deployment', function () {
    it('Should set the right token name and symbol', async function () {
      expect(await token.name()).to.equal(TOKEN_NAME);
      expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it('Should set the right decimals', async function () {
      expect(await token.decimals()).to.equal(DECIMALS);
    });

    it('Should assign the total supply to the owner', async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it('Should set the right owner', async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      const transferAmount = ethers.parseUnits('50', DECIMALS);

      await token.transfer(addr1.address, transferAmount);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);

      await token.connect(addr1).transfer(addr2.address, transferAmount);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      const overAmount = initialOwnerBalance + 1n;

      await expect(
        token.connect(addr1).transfer(owner.address, overAmount)
      ).to.be.revertedWithCustomError(token, 'ERC20InsufficientBalance');
    });
  });

  describe('Minting', function () {
    it('Should allow owner to mint tokens', async function () {
      const mintAmount = 1000;
      const initialSupply = await token.totalSupply();

      await token.mint(addr1.address, mintAmount);

      const newSupply = await token.totalSupply();
      const expectedIncrease = ethers.parseUnits(mintAmount.toString(), DECIMALS);

      expect(newSupply).to.equal(initialSupply + expectedIncrease);
    });

    it('Should not allow non-owner to mint tokens', async function () {
      await expect(token.connect(addr1).mint(addr2.address, 1000)).to.be.revertedWithCustomError(
        token,
        'OwnableUnauthorizedAccount'
      );
    });
  });

  describe('Burning', function () {
    it('Should allow users to burn their own tokens', async function () {
      const burnAmount = 1000;
      const initialSupply = await token.totalSupply();

      await token.burn(burnAmount);

      const newSupply = await token.totalSupply();
      const expectedDecrease = ethers.parseUnits(burnAmount.toString(), DECIMALS);

      expect(newSupply).to.equal(initialSupply - expectedDecrease);
    });

    it('Should fail if user tries to burn more tokens than they have', async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      const burnAmount = Number(ethers.formatUnits(ownerBalance, DECIMALS)) + 1;

      await expect(token.burn(burnAmount)).to.be.revertedWithCustomError(
        token,
        'ERC20InsufficientBalance'
      );
    });
  });
});
