// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title EternamID
 * @author Eternam Team
 * @notice A NFT Collection to unlock data stored for each NFT with on-chain SVG image and USDC-based minting with referral system
 * @dev Implements ERC721 with USDC payments, referral rewards, and fully on-chain metadata
 */
contract EternamID is ERC721, Ownable, ReentrancyGuardTransient {
    using Strings for uint256;

    address private immutable teamWallet;
    uint256 public tokenId;
    uint256 private constant MINT_PRICE = 120 * 10**6;
    uint256 private constant REFERRAL_AMOUNT = 20 * 10**6;

    string private imageURI;
    string public collectionDescription = "A NFT Collection to unlock data stored for each NFT";

    string constant SVG_IMAGE = "<svg id='Calque_2' data-name='Calque 2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><defs><style>.cls-1{fill:#fff;}.cls-2{fill:#132743;}</style></defs><g id='Calque_1-2' data-name='Calque 1'><rect class='cls-2' width='240' height='240'/><g><path class='cls-1' d='M60.47,126.5v-17.46h11.68v2.96h-8.11v4.22h7.5v2.92h-7.5v4.39h8.13v2.96h-11.71Z'/><path class='cls-1' d='M81.47,113.4v2.68h-7.77v-2.68h7.77ZM75.5,110.28h3.52v12.39c0,.41.09.72.28.92s.49.3.92.3c.13,0,.32-.02.56-.05s.43-.07.55-.1l.5,2.64c-.39.12-.78.2-1.17.25s-.76.07-1.11.07c-1.31,0-2.32-.32-3.01-.96s-1.04-1.56-1.04-2.75v-12.69Z'/><path class='cls-1' d='M89.44,126.76c-1.34,0-2.49-.27-3.46-.82s-1.71-1.32-2.23-2.33-.78-2.2-.78-3.59.26-2.54.77-3.55,1.25-1.81,2.19-2.38,2.05-.86,3.33-.86c.86,0,1.66.14,2.4.41s1.39.69,1.96,1.24,1,1.24,1.32,2.07.47,1.8.47,2.93v.98h-11v-2.2h9.28l-1.64.59c0-.68-.1-1.27-.31-1.78s-.52-.89-.93-1.17-.92-.42-1.52-.42-1.13.14-1.55.42-.75.66-.97,1.14-.33,1.03-.33,1.65v1.56c0,.76.13,1.39.38,1.91s.61.9,1.07,1.16.99.39,1.6.39c.41,0,.79-.06,1.12-.18s.62-.29.86-.52.42-.51.54-.85l3.19.6c-.21.72-.58,1.35-1.1,1.89s-1.18.96-1.96,1.26-1.69.45-2.71.45Z'/><path class='cls-1' d='M97.82,126.5v-13.1h3.4v2.29h.14c.24-.81.65-1.43,1.21-1.84s1.22-.62,1.95-.62c.18,0,.38,0,.59.03s.39.05.55.09v3.14c-.16-.05-.38-.1-.68-.13s-.58-.05-.84-.05c-.53,0-1.01.12-1.44.35s-.76.55-1,.96-.36.89-.36,1.44v7.45h-3.52Z'/><path class='cls-1' d='M111.28,118.92v7.58h-3.52v-13.1h3.32l.06,3.27h-.21c.34-1.09.87-1.94,1.56-2.54s1.6-.9,2.71-.9c.91,0,1.7.2,2.37.59s1.2.96,1.57,1.7.56,1.62.56,2.64v8.33h-3.52v-7.72c0-.81-.21-1.45-.63-1.91s-1-.69-1.74-.69c-.49,0-.93.11-1.32.32s-.69.53-.9.93-.32.9-.32,1.49Z'/><path class='cls-1' d='M126.36,126.76c-.83,0-1.57-.15-2.23-.44s-1.18-.73-1.56-1.31-.57-1.31-.57-2.17c0-.73.13-1.34.4-1.83s.64-.89,1.1-1.18.99-.52,1.58-.68,1.21-.27,1.86-.33c.76-.08,1.37-.15,1.83-.22s.8-.17,1.02-.32.32-.36.32-.64v-.06c0-.38-.08-.69-.23-.95s-.39-.46-.7-.59-.68-.21-1.12-.21-.85.07-1.18.21-.61.32-.82.54-.37.48-.47.76l-3.22-.53c.23-.77.6-1.41,1.12-1.95s1.17-.94,1.95-1.22,1.65-.42,2.63-.42c.7,0,1.39.08,2.05.25s1.26.43,1.79.78.95.81,1.25,1.38.46,1.24.46,2.03v8.82h-3.33v-1.82h-.12c-.21.41-.49.76-.84,1.07s-.78.55-1.27.73-1.07.27-1.72.27ZM127.36,124.28c.55,0,1.04-.11,1.46-.33s.74-.52.98-.89.35-.79.35-1.25v-1.42c-.1.08-.26.15-.47.21s-.45.12-.7.16-.51.09-.76.13-.47.07-.67.09c-.43.06-.81.16-1.14.3s-.58.33-.76.56-.27.53-.27.88c0,.34.09.62.26.85s.41.4.70.52.64.18,1.02.18Z'/><path class='cls-1' d='M136.64,126.5v-13.1h3.26l.18,3.26h-.26c.2-.8.5-1.46.9-1.97s.86-.88,1.39-1.12,1.09-.36,1.68-.36c.95,0,1.71.3,2.29.9s1,1.52,1.28,2.77h-.41c.2-.84.51-1.53.96-2.07s.96-.95,1.57-1.21,1.24-.39,1.9-.39c.8,0,1.52.18,2.15.53s1.12.86,1.49,1.52.54,1.47.54,2.42v8.84h-3.52v-8.17c0-.74-.2-1.29-.6-1.65s-.9-.54-1.48-.54c-.44,0-.82.1-1.14.29s-.57.46-.75.8-.26.75-.26,1.21v8.06h-3.4v-8.26c0-.64-.19-1.15-.57-1.53s-.87-.57-1.47-.57c-.41,0-.79.09-1.12.28s-.59.46-.79.83-.29.81-.29,1.33v7.92h-3.52Z'/><path class='cls-1' d='M162.2,109.04v17.46h-3.57v-17.46h3.57Z'/><path class='cls-1' d='M168.94,109.04v17.46h-3.57v-17.46h3.57ZM171.5,126.5h-4.52v-3.08h4.35c1.12,0,2.07-.2,2.83-.6s1.33-1.02,1.72-1.85.57-1.91.57-3.21-.19-2.36-.58-3.19-.96-1.45-1.71-1.85-1.69-.6-2.81-.6h-4.45v-3.08h4.66c1.75,0,3.26.35,4.52,1.05s2.23,1.7,2.91,3,1.02,2.86,1.02,4.67-.34,3.38-1.02,4.69-1.65,2.31-2.92,3.01-2.79,1.05-4.56,1.05Z'/></g></g></svg>";
    
    IERC20 immutable usdc;

    mapping(string => address) public refCodeToAddress;
    mapping(address => string) public addressToRefCode;
    mapping(address => uint256) private balanceToClaim;

    struct Parents {
        uint256 fatherId;
        uint256 motherId;
    }
    mapping(uint256 => Parents) private tokenParents;

    event ReferralRegistered(string indexed referralCode, address indexed referralAddress);
    event ReferralRemoved(string indexed referralCode, address indexed referralAddress);
    event BalanceClaimed(address indexed claimer, uint256 balanceClaimed);
    event EternamIDMinted(address indexed minter, uint256 indexed tokenId, address indexed referrer);
    event ParentsUpdated(uint256 indexed tokenId, uint256 fatherId, uint256 motherId);
    event CollectionDescriptionUpdated(string newDescription);
  
    /**
     * @notice Initializes the EternamID contract
     * @dev Sets up ERC721, ownership, USDC interface and encodes the SVG image
     * @param _teamWallet Address of the team wallet that receives mint payments
     * @param _usdcAddress Address of the USDC token contract
     */
    constructor(address _teamWallet, address _usdcAddress) ERC721("Eternam ID", "EID") Ownable(msg.sender) {
        teamWallet = _teamWallet;
        usdc = IERC20(_usdcAddress);
        imageURI = _svgToImageURI(SVG_IMAGE);
    }

    /**
    * @notice Mints an EternamID NFT with optional referral code and parent IDs
    * @dev Transfers MINT_PRICE USDC from msg.sender. If valid referral code provided,
    *      splits payment between team and referrer. Parents must be existing tokens or 0.
    * @param _refCode The referral code to apply (empty string if none)
    * @param _fatherId The father's token ID (0 if unknown/not set)
    * @param _motherId The mother's token ID (0 if unknown/not set)
    */
    function mintEternamID(string calldata _refCode, uint256 _fatherId, uint256 _motherId) external {
        uint256 currentTokenId = tokenId;
        require(_fatherId <= currentTokenId && _motherId <= currentTokenId, "Parent NFT doesn't exist");
        require(_fatherId == 0 || _motherId == 0 || _fatherId != _motherId, "Parents must be different");
        address referrer = refCodeToAddress[_refCode];
        require(referrer != msg.sender, "Cannot use own referral code");
        require(_getUsdcBalanceOf(msg.sender) >= MINT_PRICE, "Not enough balance");
        require(usdc.allowance(msg.sender, address(this)) >= MINT_PRICE, "Not enough USDC approved");
        require(usdc.transferFrom(msg.sender, address(this), MINT_PRICE), "USDC transfer failed");

        unchecked {
            ++currentTokenId;
        }
        tokenId = currentTokenId;

        if(referrer != address(0)) {
            balanceToClaim[teamWallet] += MINT_PRICE - REFERRAL_AMOUNT;
            balanceToClaim[referrer] += REFERRAL_AMOUNT;
        } else {
            balanceToClaim[teamWallet] += MINT_PRICE;
        }

        if(_fatherId != 0 || _motherId != 0) {
            tokenParents[currentTokenId] = Parents(_fatherId, _motherId);
            emit ParentsUpdated(currentTokenId, _fatherId, _motherId);
        }

        _safeMint(msg.sender, currentTokenId);

        emit EternamIDMinted(msg.sender, currentTokenId, referrer);
    }

    /**
     * @notice Gets the USDC balance of a user
     * @dev Internal helper function to check USDC balance
     * @param _user Address to check balance for
     * @return The USDC balance of the user
     */
    function _getUsdcBalanceOf(address _user) internal view returns (uint256) {
        return usdc.balanceOf(_user);
    }

    /**
     * @notice Register a referral code for an address
     * @dev Only callable by owner. Each address can only have one code, each code can only be used once
     * @param _refCode The referral code to register
     * @param _refAddress The address that will receive referral rewards
     */
    function addReferral(string calldata _refCode, address _refAddress) external onlyOwner {
        require(refCodeToAddress[_refCode] == address(0), "Code is already in use");
        require(bytes(addressToRefCode[_refAddress]).length == 0, "Address has already a Referral code");
        require(_refAddress != address(0), "Invalid address");
        
        refCodeToAddress[_refCode] = _refAddress;
        addressToRefCode[_refAddress] = _refCode;

        emit ReferralRegistered(_refCode, _refAddress);
    }

    /**
     * @notice Removes an existing referral code
     * @dev Only callable by owner. Clears both mappings for the referral
     * @param _refCode The referral code to remove
     */
    function removeReferral(string calldata _refCode) external onlyOwner {
        address refAddress = refCodeToAddress[_refCode];
        require(refAddress != address(0), "This referral code doesn't exist");
        
        delete refCodeToAddress[_refCode];
        delete addressToRefCode[refAddress];
        
        emit ReferralRemoved(_refCode, refAddress);
    }

    /**
     * @notice Change the collection description
     * @dev Only callable by owner.
     * @param _newDescription The new description for the NFT collection
     */
    function setCollectionDescription(string calldata _newDescription) external onlyOwner {
        collectionDescription = _newDescription;
        emit CollectionDescriptionUpdated(_newDescription);
    }

    /**
    * @notice Updates the parent IDs for an existing token
    * @dev Only callable by contract owner. Parents must be existing tokens or 0.
    *      A token cannot reference itself as a parent.
    *      WARNING: This function does not prevent circular references across multiple tokens.
    *      The owner is responsible for maintaining genealogical consistency.
    * @param _tokenId The token ID to update parents for
    * @param _fatherId The father's token ID (0 if unknown/not set)
    * @param _motherId The mother's token ID (0 if unknown/not set)
    */
    function setParents(uint256 _tokenId, uint256 _fatherId, uint256 _motherId) external onlyOwner {
        require(_ownerOf(_tokenId) != address(0), "TokenId doesn't exist");
        require(_fatherId <= tokenId && _motherId <= tokenId, "Parent Token ID doesn't exist");
        require(_fatherId != _tokenId && _motherId != _tokenId, "Cannot be self parent");
        require(_fatherId == 0 || _motherId == 0 || _fatherId != _motherId, "Parents must be different");

        tokenParents[_tokenId] = Parents(_fatherId, _motherId);
        
        emit ParentsUpdated(_tokenId, _fatherId, _motherId);
    }

    /**
     * @notice Allows referrer to claim their accumulated USDC balance
     * @dev Protected against reentrancy. Sets balance to 0 before transfer (CEI pattern)
     */
    function claimBalance() external nonReentrant {
        uint256 amount = balanceToClaim[msg.sender];
        require(amount > 0, "You have nothing to claim");
        balanceToClaim[msg.sender] = 0;
        
        require(usdc.transfer(msg.sender, amount), "Transaction Failed");

        emit BalanceClaimed(msg.sender, amount);
    }

    /**
     * @notice Returns the claimable USDC balance for a given address
     * @param _addr The address to check
     * @return The amount of USDC available to claim
     */
    function getBalanceToClaim(address _addr) external view returns (uint256){
        return balanceToClaim[_addr];
    }

    /**
     * @notice Returns the total USDC balance held by this contract
     * @return The USDC balance of this contract
     */
    function getContractBalance() external view returns (uint256){
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Returns the metadata URI for a given token
     * @dev Generates fully on-chain JSON metadata with embedded SVG image
     * @param _tokenId The token ID to get metadata for
     * @return The base64-encoded JSON metadata URI
     */
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_ownerOf(_tokenId) != address(0), "Token doesn't exist");

        Parents memory parents = tokenParents[_tokenId];

        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "Eternam ID #',
                    _tokenId.toString(),
                    '","description": "',
                    collectionDescription,
                    '", "image": "data:image/svg+xml;base64,',
                    getSVG(),
                    '", "attributes": [',
                    '{"trait_type": "FatherID", "value": "',
                    parents.fatherId == 0 ? "Unknown" : parents.fatherId.toString(),
                    '"},',
                    '{"trait_type": "MotherID", "value": "',
                    parents.motherId == 0 ? "Unknown" : parents.motherId.toString(),
                    '"}',
                    ']}'
                )
            )
        );

        return string(abi.encodePacked(_baseURI(), json));
    }

    /**
     * @notice Encodes an SVG string to base64
     * @dev Pure function for SVG encoding
     * @param svg The SVG string to encode
     * @return The base64-encoded SVG string
     */
    function _svgToImageURI(string memory svg) internal pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return svgBase64Encoded;
    }

    /**
     * @notice Returns the base URI for token metadata
     * @dev Overrides ERC721 _baseURI to return data URI scheme
     * @return The base URI string for JSON metadata
     */
    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    /**
     * @notice Returns the base64-encoded SVG image
     * @return The stored base64-encoded SVG string
     */
    function getSVG() public view returns (string memory) {
        return imageURI;
    }

    /**
     * @notice Returns the total number of tokens minted
     * @dev Equivalent to the current tokenId value
     * @return The total supply of minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return tokenId;
    }

    /**
     * @notice Rescues ERC20 tokens accidentally sent to this contract
     * @dev Only callable by owner. Cannot rescue USDC to protect user funds
     * @param _token Address of the ERC20 token to rescue
     * @param _amount Amount of tokens to rescue
     */
    function rescueTokens(address _token, uint256 _amount) external onlyOwner {
        require(_token != address(usdc), "Cannot rescue USDC");
        require(IERC20(_token).transfer(owner(), _amount), "Rescue transfer failed");
    }
}
