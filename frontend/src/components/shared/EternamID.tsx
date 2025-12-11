'use client';

import { useEffect, useState } from "react";

import { CONTRACT_USDC_ADDRESS, CONTRACT_USDC_ABI, CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";

// Wagmi Hooks to interact with the blockchain
import {useReadContract, useAccount } from 'wagmi'

import Image from "next/image";
import Faucet from "./Faucet";
import MintEternamID from "./MintEternamID";
import NFTBalance from "./NFTBalance";

const EternamID = () => {
	const { address } = useAccount();

	const { data: NFTTotalSupply, refetch: refetchNFTSupply } = useReadContract({
		address: CONTRACT_ETERNAMID_ADDRESS,
		abi: CONTRACT_ETERNAMID_ABI,
		functionName: 'totalSupply',
	});

	const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
		address: CONTRACT_USDC_ADDRESS,
		abi: CONTRACT_USDC_ABI,
		functionName: 'balanceOf',
		args: [address]
	});

	useEffect(() => {
		refetchBalance();
		refetchNFTSupply();
	}, []);

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<div>
					<p>Votre Balance:</p>
					<div className="flex gap-2">
						{Number(usdcBalance ?? 0n) / 10 ** 6} USDC
						<Image
							src="/usd-logo.svg"
							alt="USDC Logo"
							width={16}
							height={16}
						/>
					</div>
				</div>

				<Faucet onFaucetSuccess={refetchBalance} />
			</div>

			<div className="grid grid-cols-2 gap-x-4">
				<NFTBalance />
				<MintEternamID 
					totalSupply={NFTTotalSupply ? Number(NFTTotalSupply) : 0}
					onMintSuccess={refetchNFTSupply}
				/>
			</div>

		</div>
	)
}

export default EternamID