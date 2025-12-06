import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MockERC20", (m) => {
    const account = m.getAccount(0);
    const teamWallet = m.getAccount(1);
    const usdc = m.contract("MockERC20", ["USDC", "USDC", 6]);
    m.call(usdc, "mint", [account, 200 * 10 ** 6]);

    const ethernamID = m.contract("EthernamID", [teamWallet, usdc]);

    m.call(usdc, "approve", [ethernamID, 120]);
    m.call(ethernamID, "mintEthernamID()");

    return { usdc, ethernamID };
});
