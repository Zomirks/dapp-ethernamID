import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setUpSmartContracts() {
	const [owner] = await ethers.getSigners();
	const eternamID = await ethers.deployContract("EternamID", [owner]);
	return { owner, eternamID };
}

describe("EternamID Contract", function () {
	let eternamID: any;
	let owner: any;

	beforeEach(async () => {
		({ owner, eternamID } = await setUpSmartContracts());
	});

	it("Should symbol & name be EID & Eternam ID", async function () {
		expect(await eternamID.symbol()).to.equal("EID");
		expect(await eternamID.name()).to.equal("Eternam ID");
	});
});
