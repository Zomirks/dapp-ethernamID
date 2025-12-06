import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EternamIDModule", (m) => {
    const deployer = m.getAccount(0);
    const eternamID = m.contract("EternamID", [deployer]);


    return { eternamID };
});
