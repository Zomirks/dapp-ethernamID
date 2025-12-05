import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MockERC20", (m) => {
    const account = m.getAccount(0);
    const usdc = m.contract("MockERC20", ["USDC", "USDC"]);

    m.call(usdc, "mint", [account, 200]);

    return { usdc };
});
