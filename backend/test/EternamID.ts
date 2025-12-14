import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

// Mock USDC with 6 decimals
async function deployMockUSDC() {
	const MockERC20 = await ethers.getContractFactory("MockERC20");
	const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
	return usdc;
}

async function setUpSmartContracts() {
	const [owner, user1, user2, teamWallet] = await ethers.getSigners();
	const usdc = await deployMockUSDC();
	const eternamID = await ethers.deployContract("EternamID", [teamWallet.address, await usdc.getAddress()]);
	return { owner, user1, user2, teamWallet, usdc, eternamID };
}

async function setUpWithUSDCBalance() {
	let eternamID: any, usdc: any;
	let owner, user1, user2, teamWallet: any;
	({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpSmartContracts());

	const mintPrice = 120n * 10n ** 6n;
	await usdc.mint(user1.address, mintPrice * 10n);
	await usdc.mint(user2.address, mintPrice * 10n);
	await usdc.connect(user1).approve(await eternamID.getAddress(), mintPrice * 10n);
	await usdc.connect(user2).approve(await eternamID.getAddress(), mintPrice * 10n);

	return { owner, user1, user2, teamWallet, usdc, eternamID };
}

async function setUpWithMintedToken() {
	let eternamID: any, usdc: any;
	let owner, user1, user2, teamWallet: any;
	({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithUSDCBalance());

	const hash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
	await eternamID.connect(user1).mintEternamID(hash, "", 0, 0);

	return { owner, user1, user2, teamWallet, usdc, eternamID };
}

async function setUpWithReferral() {
	let eternamID: any, usdc: any;
	let owner, user1, user2, teamWallet: any;
	({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithUSDCBalance());

	await eternamID.addReferral("MUSIC2024", user2.address);

	return { owner, user1, user2, teamWallet, usdc, eternamID };
}

// helper pour générer des hash rapidement
const makeHash = (data: string) => ethers.keccak256(ethers.toUtf8Bytes(data));


describe("EternamID contract", function () {
	let eternamID: any, usdc: any;
	let owner: any, user1: any, user2: any, teamWallet: any;

	const MINT_PRICE = 120n * 10n ** 6n;
	const REFERRAL_AMOUNT = 20n * 10n ** 6n;

	describe("constructor", function () {
		it("deploys with correct name and symbol", async function () {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpSmartContracts());

			expect(await eternamID.name()).to.equal("Eternam ID");
			expect(await eternamID.symbol()).to.equal("EID");
		});

		it("starts with tokenId at 0", async function () {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpSmartContracts());
			expect(await eternamID.tokenId()).to.equal(0);
			expect(await eternamID.totalSupply()).to.equal(0);
		});
	});

	describe("mintEternamID", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithUSDCBalance());
		});

		it("mints a token and assigns ownership", async function () {
			await eternamID.connect(user1).mintEternamID(makeHash("mon_identite_123"), "", 0, 0);

			expect(await eternamID.totalSupply()).to.equal(1);
			expect(await eternamID.ownerOf(1)).to.equal(user1.address);
		});

		it("stores the hash on-chain", async function () {
			const hash = makeHash("donnees_sensibles_xyz");
			await eternamID.connect(user1).mintEternamID(hash, "", 0, 0);
			expect(await eternamID.getTokenHash(1)).to.equal(hash);
		});

		it("transfers 120 USDC from minter", async function () {
			const balanceBefore = await usdc.balanceOf(user1.address);
			await eternamID.connect(user1).mintEternamID(makeHash("test"), "", 0, 0);
			const balanceAfter = await usdc.balanceOf(user1.address);

			expect(balanceBefore - balanceAfter).to.equal(MINT_PRICE);
		});

		it("credits full amount to team when no referral", async function () {
			await eternamID.connect(user1).mintEternamID(makeHash("abc"), "", 0, 0);
			expect(await eternamID.getBalanceToClaim(teamWallet.address)).to.equal(MINT_PRICE);
		});

		it("Should revert if hash is missing", async function () {
			await expect(eternamID.connect(user1).mintEternamID(ethers.ZeroHash, "", 0, 0))
				.to.be.revertedWithCustomError(eternamID, "HashIsRequired");
		});

		it("reverts when user has no USDC", async function () {
			const [, , , , brokeUser] = await ethers.getSigners();
			await expect(eternamID.connect(brokeUser).mintEternamID(makeHash("x"), "", 0, 0))
				.to.be.revertedWithCustomError(eternamID, "InsufficientUSDCBalance");
		});

		it("reverts without approval", async function () {
			await usdc.mint(owner.address, MINT_PRICE);
			await expect(eternamID.connect(owner).mintEternamID(makeHash("y"), "", 0, 0))
				.to.be.revertedWithCustomError(eternamID, "InsufficientUSDCAllowance");
		});

		it("emits EternamIDMinted", async function () {
			const hash = makeHash("event_test");
			await expect(eternamID.connect(user1).mintEternamID(hash, "", 0, 0))
				.to.emit(eternamID, "EternamIDMinted")
				.withArgs(hash, user1.address, 1, ethers.ZeroAddress);
		});
	});

	describe("mintEternamID with parents", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithMintedToken());
		});

		it("can mint with only father set", async function () {
			await eternamID.connect(user1).mintEternamID(makeHash("enfant_1"), "", 1, 0);
			expect(await eternamID.totalSupply()).to.equal(2);
		});

		it("can mint with both parents", async function () {
			await eternamID.connect(user1).mintEternamID(makeHash("mere"), "", 0, 0);
			await eternamID.connect(user1).mintEternamID(makeHash("enfant_complet"), "", 1, 2);
			expect(await eternamID.totalSupply()).to.equal(3);
		});

		it("rejects non-existing father", async function () {
			await expect(eternamID.connect(user1).mintEternamID(makeHash("orphelin"), "", 999, 0))
				.to.be.revertedWithCustomError(eternamID, "ParentNFTDoesNotExist");
		});

		it("rejects non-existing mother", async function () {
			await expect(eternamID.connect(user1).mintEternamID(makeHash("orphelin2"), "", 0, 888))
				.to.be.revertedWithCustomError(eternamID, "ParentNFTDoesNotExist");
		});

		it("rejects same parent for both", async function () {
			await expect(eternamID.connect(user1).mintEternamID(makeHash("clone?"), "", 1, 1))
				.to.be.revertedWithCustomError(eternamID, "ParentsMustBeDifferent");
		});

		it("emits ParentsUpdated when parents are set", async function () {
			await expect(eternamID.connect(user1).mintEternamID(makeHash("fils"), "", 1, 0))
				.to.emit(eternamID, "ParentsUpdated")
				.withArgs(2, 1, 0);
		});
	});

	describe("addReferral", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpSmartContracts());
		});

		it("registers a new referral code", async function () {
			await eternamID.addReferral("PARRAIN_MUSIC", user1.address);

			expect(await eternamID.refCodeToAddress("PARRAIN_MUSIC")).to.equal(user1.address);
			expect(await eternamID.addressToRefCode(user1.address)).to.equal("PARRAIN_MUSIC");
		});

		it("rejects duplicate codes", async function () {
			await eternamID.addReferral("CODE123", user1.address);
			await expect(eternamID.addReferral("CODE123", user2.address))
				.to.be.revertedWithCustomError(eternamID, "ReferralCodeAlreadyInUse");
		});

		it("rejects if address already has a code", async function () {
			await eternamID.addReferral("FIRST", user1.address);
			await expect(eternamID.addReferral("SECOND", user1.address))
				.to.be.revertedWithCustomError(eternamID, "AddressAlreadyHasReferralCode");
		});

		it("rejects zero address", async function () {
			await expect(eternamID.addReferral("VOID", ethers.ZeroAddress))
				.to.be.revertedWithCustomError(eternamID, "InvalidAddress");
		});

		it("only owner can add referrals", async function () {
			await expect(eternamID.connect(user1).addReferral("HACK", user2.address))
				.to.be.revertedWithCustomError(eternamID, "OwnableUnauthorizedAccount")
				.withArgs(user1.address);
		});

		it("emits ReferralRegistered", async function () {
			await expect(eternamID.addReferral("NEW_REF", user1.address))
				.to.emit(eternamID, "ReferralRegistered")
				.withArgs("NEW_REF", user1.address);
		});
	});

	describe("removeReferral", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpSmartContracts());
			await eternamID.addReferral("TO_DELETE", user1.address);
		});

		it("removes existing referral", async function () {
			await eternamID.removeReferral("TO_DELETE");
			expect(await eternamID.refCodeToAddress("TO_DELETE")).to.equal(ethers.ZeroAddress);
			expect(await eternamID.addressToRefCode(user1.address)).to.equal("");
		});

		it("rejects unknown code", async function () {
			await expect(eternamID.removeReferral("NOPE"))
				.to.be.revertedWithCustomError(eternamID, "ReferralCodeDoesNotExist");
		});

		it("only owner", async function () {
			await expect(eternamID.connect(user1).removeReferral("TO_DELETE"))
				.to.be.revertedWithCustomError(eternamID, "OwnableUnauthorizedAccount");
		});

		it("emits ReferralRemoved", async function () {
			await expect(eternamID.removeReferral("TO_DELETE"))
				.to.emit(eternamID, "ReferralRemoved")
				.withArgs("TO_DELETE", user1.address);
		});
	});

	describe("mintEternamID with referral code", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithReferral());
		});

		it("splits payment: 100 to team, 20 to referrer", async function () {
			await eternamID.connect(user1).mintEternamID(makeHash("referred_mint"), "MUSIC2024", 0, 0);

			expect(await eternamID.getBalanceToClaim(teamWallet.address)).to.equal(MINT_PRICE - REFERRAL_AMOUNT);
			expect(await eternamID.getBalanceToClaim(user2.address)).to.equal(REFERRAL_AMOUNT);
		});

		it("includes referrer in event", async function () {
			const hash = makeHash("ref_event");
			await expect(eternamID.connect(user1).mintEternamID(hash, "MUSIC2024", 0, 0))
				.to.emit(eternamID, "EternamIDMinted")
				.withArgs(hash, user1.address, 1, user2.address);
		});

		it("can't use your own referral code", async function () {
			await expect(eternamID.connect(user2).mintEternamID(makeHash("self_ref"), "MUSIC2024", 0, 0))
				.to.be.revertedWithCustomError(eternamID, "CannotUseOwnReferralCode");
		});

		it("unknown code = no referral & all to team", async function () {
			await eternamID.connect(user1).mintEternamID(makeHash("fake_code"), "FAKE123", 0, 0);
			expect(await eternamID.getBalanceToClaim(teamWallet.address)).to.equal(MINT_PRICE);
		});
	});

	describe("claimBalance", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithReferral());
			await eternamID.connect(user1).mintEternamID(makeHash("to_claim"), "MUSIC2024", 0, 0);
		});

		it("referrer can claim their 20 USDC", async function () {
			const before = await usdc.balanceOf(user2.address);
			await eternamID.connect(user2).claimBalance();
			const after = await usdc.balanceOf(user2.address);

			expect(after - before).to.equal(REFERRAL_AMOUNT);
		});

		it("resets balance to 0 after claim", async function () {
			await eternamID.connect(user2).claimBalance();
			expect(await eternamID.getBalanceToClaim(user2.address)).to.equal(0);
		});

		it("team can also claim", async function () {
			await eternamID.connect(teamWallet).claimBalance();
			expect(await eternamID.getBalanceToClaim(teamWallet.address)).to.equal(0);
		});

		it("reverts if nothing to claim", async function () {
			await expect(eternamID.connect(user1).claimBalance())
				.to.be.revertedWithCustomError(eternamID, "NothingToClaim");
		});

		it("emits BalanceClaimed", async function () {
			await expect(eternamID.connect(user2).claimBalance())
				.to.emit(eternamID, "BalanceClaimed")
				.withArgs(user2.address, REFERRAL_AMOUNT);
		});
	});

	describe("setParents", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithMintedToken());
			await eternamID.connect(user1).mintEternamID(makeHash("p2"), "", 0, 0);
			await eternamID.connect(user1).mintEternamID(makeHash("p3"), "", 0, 0);
		});

		it("Should revert for non-existing token id", async function () {
			await expect(eternamID.setParents(999, 1, 2))
				.to.be.revertedWithCustomError(eternamID, "TokenDoesNotExist");
		});

		it("Should revert for non-existing parent id", async function () {
			await expect(eternamID.setParents(1, 999, 0))
				.to.be.revertedWithCustomError(eternamID, "ParentTokenDoesNotExist");
		});

		it("can't be your own parent", async function () {
			await expect(eternamID.setParents(1, 1, 0))
				.to.be.revertedWithCustomError(eternamID, "CannotBeSelfParent");
		});

		it("parents must be different", async function () {
			await expect(eternamID.setParents(3, 1, 1))
				.to.be.revertedWithCustomError(eternamID, "ParentsMustBeDifferent");
		});
	});

	describe("tokenURI", function () {
		beforeEach(async () => {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithMintedToken());
		});

		it("returns base64 encoded JSON", async function () {
			const uri = await eternamID.tokenURI(1);
			expect(uri).to.include("data:application/json;base64,");
		});

		it("Should revert for non-existing token", async function () {
			await expect(eternamID.tokenURI(42))
				.to.be.revertedWithCustomError(eternamID, "TokenDoesNotExist");
		});

		// TODO: tester que les attributs FatherID/MotherID sont corrects dans le JSON
	});

	describe("getTokenHash", function () {
		it("returns stored hash", async function () {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithUSDCBalance());
			const hash = makeHash("JohnDoe");
			await eternamID.connect(user1).mintEternamID(hash, "", 0, 0);
			expect(await eternamID.getTokenHash(1)).to.equal(hash);
		});

		it("Should revert for non-existing token", async function () {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpSmartContracts());
			await expect(eternamID.getTokenHash(1))
				.to.be.revertedWithCustomError(eternamID, "TokenDoesNotExist");
		});
	});

	describe("getContractBalance", function () {
		it("returns USDC held by contract", async function () {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithUSDCBalance());
			await eternamID.connect(user1).mintEternamID(makeHash("getContractBalance"), "", 0, 0);
			expect(await eternamID.getContractBalance()).to.equal(MINT_PRICE);
		});

		it("decreases after claim", async function () {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithUSDCBalance());
			await eternamID.connect(user1).mintEternamID(makeHash("getContractBalance"), "", 0, 0);
			await eternamID.connect(teamWallet).claimBalance();
			expect(await eternamID.getContractBalance()).to.equal(0);
		});
	});

	describe("totalSupply", function () {
		it("Should increment total supply", async function () {
			({ owner, user1, user2, teamWallet, usdc, eternamID } = await setUpWithUSDCBalance());

			await eternamID.connect(user1).mintEternamID(makeHash("mint1"), "", 0, 0);
			await eternamID.connect(user1).mintEternamID(makeHash("mint2"), "", 0, 0);
			await eternamID.connect(user2).mintEternamID(makeHash("mint3"), "", 0, 0);

			expect(await eternamID.totalSupply()).to.equal(3);
		});
	});
});