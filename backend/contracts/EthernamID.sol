// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EthernamID is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant _mintPrice = 120;
    uint256 public constant referralAmount = 20;
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
     * @param initialOwner Smart Contract Owner
     */
    constructor(address initialOwner) ERC721("Ethernam ID", "EID") Ownable(initialOwner) {}
    
    /**
     * @dev message sender can mint
     */
    function mintEthernamID() external {
        require(_getUsdcBalanceOf(msg.sender) > _mintPrice * 10^6, "Not enough balance");
        require(usdc.transferFrom(msg.sender, address(this), _mintPrice * 10^6), "USDC transfer failed");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);

        ++_nextTokenId;
    }

    function mintEthernamID(bytes8 _refCode) external {
        address referrer = refCodeToAddress[_refCode];
        require(referrer != address(0), "Invalid referral code");
        require(referrals[refCodeToAddress[_refCode]].isActive == true, "RefCode isn't active");
        require(_getUsdcBalanceOf(msg.sender) > _mintPrice * 10^6, "Not enough balance");
        require(usdc.transferFrom(msg.sender, address(this), _mintPrice * 10^6), "USDC transfer failed");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);

        referrals[refCodeToAddress[_refCode]].balanceToClaim += referralAmount;
        
        ++_nextTokenId;
    }

    function _getUsdcBalanceOf(address _user) internal view returns (uint256) {
        return usdc.balanceOf(_user);
    }

    function addReferral(bytes calldata _refCode, address _refAddress) external onlyOwner {
        require(referrals[_refCode].balanceToClaim == 0, "Referral has balance to claim, you can't change the address");
        referrals[_refCode].referralAddress = _refAddress;
        emit ReferralRegistered(_refCode, _refAddress);
    }

    function removeReferral(bytes memory _refCode) external onlyOwner {
        require(referrals[_refCode].balanceToClaim == 0, "Referral has balance to claim, you can't change the address");
        emit ReferralRemoved(_refCode, referrals[_refCode].referralAddress);
        referrals[_refCode].referralAddress = address(0);
    }
}
