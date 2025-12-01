import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EthernamIDModule", (m) => {
    const deployer = m.getAccount(0);
    const ethernamID = m.contract("EthernamID", [deployer]);


    return { ethernamID };
});
