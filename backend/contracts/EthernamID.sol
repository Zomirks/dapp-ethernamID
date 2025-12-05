// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EthernamID is ERC721, Ownable {
    address private teamWallet;
    uint256 private _nextTokenId;
    uint256 private constant _mintPrice = 120;
    uint256 private constant referralAmount = 20;
    
    IERC20 usdc;

    mapping(string => address) public refCodeToAddress;
    mapping(address => string) public addressToRefCode;

    event ReferralRegistered(string indexed referralCode, address indexed referralAddress);
    event ReferralRemoved(string referralCode, address referralAddress);
    event EthernamIDMinted(address indexed minter, uint256 indexed tokenId, address indexed referrer);
  
    /**
     * @dev Smart Contract Constructor
     * @param _teamWallet Wallet of the team
     */
    constructor(address _teamWallet, address _usdcAddress) ERC721("Ethernam ID", "EID") Ownable(msg.sender) {
        teamWallet = _teamWallet;
        usdc = IERC20(_usdcAddress);
    }
    
    /**
     * @dev message sender can mint
     */
    function mintEthernamID() external {
        require(_getUsdcBalanceOf(msg.sender) >= _mintPrice, "Not enough balance");
        require(usdc.allowance(msg.sender, address(this)) >= _mintPrice, "Not enough USDC approved");
        require(usdc.transferFrom(msg.sender, address(this), _mintPrice), "USDC transfer failed");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);

        ++_nextTokenId;
        emit EthernamIDMinted(msg.sender, tokenId, address(0));
    }

    function mintEthernamID(string memory _refCode) external {
        address referrer = refCodeToAddress[_refCode];
        require(referrer != address(0), "Invalid referral code");
        require(_getUsdcBalanceOf(msg.sender) >= _mintPrice, "Not enough balance");
        require(usdc.allowance(msg.sender, address(this)) >= _mintPrice, "Not enough USDC approved");
        require(usdc.transferFrom(msg.sender, address(this), _mintPrice), "USDC transfer failed");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);

        referrals[refCodeToAddress[_refCode]].balanceToClaim += referralAmount;
        
        ++_nextTokenId;
        emit EthernamIDMinted(msg.sender, tokenId, referrer);
    }

    function _getUsdcBalanceOf(address _user) internal view returns (uint256) {
        return usdc.balanceOf(_user);
    }

    function addReferral(string memory _refCode, address _refAddress) external onlyOwner {
        require(refCodeToAddress[_refCode] == address(0), "Code is already in use");
        require(bytes(addressToRefCode[_refAddress]).length == 0, "Address has already a Referral code");
        require(_refAddress != address(0), "Invalid address");
        
        refCodeToAddress[_refCode] = _refAddress;
        addressToRefCode[_refAddress] = _refCode;

        emit ReferralRegistered(_refCode, _refAddress);
    }

    function removeReferral(string memory _refCode) external onlyOwner {
        address refAddress = refCodeToAddress[_refCode];
        require(refAddress != address(0), "This referral code doesn't exist");
        
        emit ReferralRemoved(_refCode, refAddress);
        
        delete refCodeToAddress[_refCode];
        delete addressToRefCode[refAddress];
    }
}
