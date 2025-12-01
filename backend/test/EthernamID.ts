import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setUpSmartContracts() {
	const [owner] = await ethers.getSigners();
	const ethernamID = await ethers.deployContract("EthernamID", [owner]);
	return { owner, ethernamID };
}

describe("EthernamID Contract", function () {
	let ethernamID: any;
	let owner: any;

	beforeEach(async () => {
		({ owner, ethernamID } = await setUpSmartContracts());
	});

	it("Should symbol & name be EID & Ethernam ID", async function () {
		expect(await ethernamID.symbol()).to.equal("EID");
		expect(await ethernamID.name()).to.equal("Ethernam ID");
	})
});
