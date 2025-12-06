// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";

contract EthernamID is ERC721, Ownable, ReentrancyGuardTransient {
    address private teamWallet;
    uint256 private _nextTokenId;
    uint256 private constant _mintPrice = 120 * 10**6;
    uint256 private constant referralAmount = 20 * 10**6;
    
    IERC20 usdc;

    mapping(string => address) public refCodeToAddress;
    mapping(address => string) public addressToRefCode;

    mapping(address => uint256) private balanceToClaim;

    event ReferralRegistered(string indexed referralCode, address indexed referralAddress);
    event ReferralRemoved(string indexed referralCode, address indexed referralAddress);
    event BalanceClaimed(address indexed Address, uint256 balanceClaimed);
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

        balanceToClaim[teamWallet] += _mintPrice;

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

        balanceToClaim[teamWallet] += _mintPrice - referralAmount;
        balanceToClaim[referrer] += referralAmount;
        
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

    function claimBalance() external nonReentrant {
        uint256 amount = balanceToClaim[msg.sender];
        require(amount > 0, "You have nothing to claim");
        balanceToClaim[msg.sender] = 0;
        
        require(usdc.transfer(msg.sender, amount), "Transaction Failed");

        emit BalanceClaimed(msg.sender, amount);
    }

    function getBalanceToClaim(address _addr) external view returns (uint256){
        return balanceToClaim[_addr];
    }

    function getContractBalance() external view onlyOwner returns (uint256){
        return usdc.balanceOf(address(this));
    }
}
