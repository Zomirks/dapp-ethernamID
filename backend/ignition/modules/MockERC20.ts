import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MockERC20", (m) => {
    const account = m.getAccount(0);
    const teamWallet = m.getAccount(1);
    const usdc = m.contract("MockERC20", ["USDC", "USDC", 6]);
    m.call(usdc, "mint", [account, 200 * 10 ** 6]);

    const eternamID = m.contract("EternamID", [teamWallet, usdc]);

    m.call(usdc, "approve", [eternamID, 120]);

    return { usdc, eternamID };
});
