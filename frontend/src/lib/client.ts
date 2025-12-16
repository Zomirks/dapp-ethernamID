import { createPublicClient, http } from "viem";
import { hardhat, sepolia } from "viem/chains";

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL)
})