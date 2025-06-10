// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleERC20
 * @dev A simple ERC20 token with basic functionality
 */
contract SimpleERC20 is ERC20, Ownable {
    uint8 private _decimals;
    
    /**
     * @dev Constructor that sets up the token without minting.
     * Initial minting is done separately after deployment for better control.
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param decimals_ The number of decimals for the token
     */
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _decimals = decimals_;
        // Initial supply is minted after deployment via mint() function
    }
    
    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint additional tokens (only owner)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint (in token units, not wei)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount * 10**_decimals);
    }
    
    /**
     * @dev Burn tokens from the caller's account
     * @param amount The amount of tokens to burn (in token units, not wei)
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount * 10**_decimals);
    }
    
    /**
     * @dev Burn tokens from a specific account (requires allowance)
     * @param from The account to burn tokens from
     * @param amount The amount of tokens to burn (in token units, not wei)
     */
    function burnFrom(address from, uint256 amount) public {
        _burn(from, amount * 10**_decimals);
    }
} 