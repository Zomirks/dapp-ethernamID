import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EternamID", (m) => {
    const account = m.getAccount(0);
    const teamWallet = m.getAccount(1);
    const usdc = m.contract("MockERC20", ["USDC", "USDC", 6]);
    m.call(usdc, "mint", [account, 200 * 10 ** 6]);

    const eternamID = m.contract("EternamID", [teamWallet, usdc]);

    m.call(usdc, "approve", [eternamID, 120 * 10 ** 6]);

    return { usdc, eternamID };
});
