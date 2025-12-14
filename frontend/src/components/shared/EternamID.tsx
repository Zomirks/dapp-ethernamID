'use client';

import { useEffect } from "react";
import Image from "next/image";

import { CONTRACT_USDC_ADDRESS, CONTRACT_USDC_ABI, CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";
import { useReadContract, useAccount } from 'wagmi';

import Faucet from "./Faucet";
import MintEternamID from "./MintEternamID";
import NFTBalance from "./NFTBalance";

// Icons
const WalletIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M3 5v14a2 2 0 0 0 2 2h16v-5" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const SparklesIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const UsersIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
		<circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

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

	const formattedBalance = (Number(usdcBalance ?? 0n) / 10 ** 6).toFixed(2);
	const totalSupply = NFTTotalSupply ? Number(NFTTotalSupply) : 0;

	return (
		<div className="space-y-6">
			<div className="bento-grid">
				<div className="bento-card col-span-6 row-span-1 flex items-center justify-between md:col-span-4">
					<div className="flex items-center gap-4">
						<div className="icon-box icon-box-cyan">
							<WalletIcon className="h-5 w-5 text-eternam-dark" />
						</div>
						<div>
							<p className="text-xs uppercase tracking-wider text-eternam-muted">
								Votre Balance
							</p>
							<div className="flex items-center gap-2">
								<span className="text-2xl font-bold text-eternam-light">
									{formattedBalance}
								</span>
								<span className="text-eternam-muted">USDC</span>
							</div>
						</div>
					</div>
					<Image
						src="/usd-logo.svg"
						alt="USDC Logo"
						width={32}
						height={32}
						className="opacity-60"
					/>
				</div>

				<div className="bento-card col-span-6 row-span-1 flex items-center justify-between md:col-span-4">
					<div className="flex items-center gap-4">
						<div className="icon-box icon-box-purple">
							<UsersIcon className="h-5 w-5 text-white" />
						</div>
						<div>
							<p className="text-xs uppercase tracking-wider text-eternam-muted">
								Capsules créées
							</p>
							<div className="flex items-center gap-2">
								<span className="text-2xl font-bold text-eternam-light">
									{totalSupply}
								</span>
								<span className="text-eternam-muted">NFTs</span>
							</div>
						</div>
					</div>
					<div className="status-dot status-dot-emerald" />
				</div>

				<div className="bento-card col-span-12 row-span-1 flex items-center justify-between md:col-span-4">
					<div className="flex items-center gap-4">
						<div className="icon-box icon-box-emerald">
							<SparklesIcon className="h-5 w-5 text-eternam-dark" />
						</div>
						<div>
							<p className="text-sm font-medium text-eternam-light">
								Besoin de USDC de test ?
							</p>
							<p className="text-xs text-eternam-muted">
								Utilisez le faucet testnet
							</p>
						</div>
					</div>
					<Faucet onFaucetSuccess={refetchBalance} />
				</div>
			</div>

			<div className="bento-grid">
				<div className="col-span-12 row-span-3 lg:col-span-7">
					<NFTBalance />
				</div>

				<div className="col-span-12 row-span-3 lg:col-span-5">
					<MintEternamID
						totalSupply={totalSupply}
						onMintSuccess={refetchNFTSupply}
					/>
				</div>
			</div>
		</div>
	);
};

export default EternamID;