// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EthernamID is ERC721, Ownable {
    address public teamWallet;
    uint256 private _nextTokenId;
    uint256 public constant _mintPrice = 120 * 10^6;
    uint256 public constant referralAmount = 20 * 10^6;
    address constant _usdcAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    
    IERC20 usdc = IERC20(_usdcAddress);
  
    struct Referral {
        bool isActive;
        uint256 balanceToClaim;
    }

    mapping(address => Referral) private referrals;
    mapping(bytes8 => address) private refCodeToAddress;

    event ReferralRegistered(bytes8 referralCode, address referralAddress);
    event ReferralRemoved(bytes8 referralCode, address referralAddress);
  
    /**
     * @dev Smart Contract Constructor
     * @param _teamWallet Wallet of the team
     */
    constructor(address _teamWallet) ERC721("Ethernam ID", "EID") Ownable(msg.sender) {
        teamWallet = _teamWallet;
    }
    
    /**
     * @dev message sender can mint
     */
    function mintEthernamID() external {
        require(_getUsdcBalanceOf(msg.sender) > _mintPrice, "Not enough balance");
        require(usdc.transferFrom(msg.sender, address(this), _mintPrice), "USDC transfer failed");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);

        ++_nextTokenId;
    }

    function mintEthernamID(bytes8 _refCode) external {
        address referrer = refCodeToAddress[_refCode];
        require(referrer != address(0), "Invalid referral code");
        require(referrals[refCodeToAddress[_refCode]].isActive == true, "RefCode isn't active");
        require(_getUsdcBalanceOf(msg.sender) > _mintPrice, "Not enough balance");
        require(usdc.transferFrom(msg.sender, address(this), _mintPrice), "USDC transfer failed");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);

        referrals[refCodeToAddress[_refCode]].balanceToClaim += referralAmount;
        
        ++_nextTokenId;
    }

    function _getUsdcBalanceOf(address _user) internal view returns (uint256) {
        return usdc.balanceOf(_user);
    }

    function addReferral(bytes8 _refCode, address _refAddress) external onlyOwner {
        require(refCodeToAddress[_refCode] == address(0), "Code is already in use");
        require(_refAddress != address(0), "Invalid address");
        require(_refCode != bytes8(0), "Invalid referral code");
        
        refCodeToAddress[_refCode] = _refAddress;
        referrals[_refAddress].isActive = true;

        emit ReferralRegistered(_refCode, _refAddress);
    }

    function removeReferral(bytes8 _refCode) external onlyOwner {
        address refAddress = refCodeToAddress[_refCode];
        require(refAddress != address(0), "This referral code doesn't exist");
        require(referrals[refAddress].balanceToClaim == 0, "Referral has balance to claim, you can't remove it");
        
        emit ReferralRemoved(_refCode, refAddress);
        
        delete refCodeToAddress[_refCode];
        delete referrals[refAddress];
    }
}
