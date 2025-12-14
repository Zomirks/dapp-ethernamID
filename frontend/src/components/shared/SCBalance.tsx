'use client';

import { useEffect } from "react";
import { CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

interface ClaimProps {
	onClaimSuccess?: () => void;
}

// --- ICONS ---
const WalletIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M3 5v14a2 2 0 0 0 2 2h16v-5" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const CoinsIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<circle cx="8" cy="8" r="6" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M18.09 10.37A6 6 0 1 1 10.34 18" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M7 6h1v4" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M16.71 13.88l.7.71-2.82 2.82" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const SCBalance = ({ onClaimSuccess }: ClaimProps) => {
	const { address } = useAccount();

	const { data: hash, writeContract, isPending: writeIsPending } = useWriteContract();

	const { data: contractBalance } = useReadContract({
		address: CONTRACT_ETERNAMID_ADDRESS,
		abi: CONTRACT_ETERNAMID_ABI,
		functionName: "getContractBalance",
	}) as { data?: bigint };

	const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
		hash,
	});

	const { data: balanceToClaim } = useReadContract({
		address: CONTRACT_ETERNAMID_ADDRESS,
		abi: CONTRACT_ETERNAMID_ABI,
		functionName: "getBalanceToClaim",
		args: [address]
	}) as { data?: bigint };

	const handleClaimReferral = () => {
		writeContract({
			address: CONTRACT_ETERNAMID_ADDRESS,
			abi: CONTRACT_ETERNAMID_ABI,
			functionName: 'claimBalance',
		});
	};

	useEffect(() => {
		if (isConfirmed && onClaimSuccess) {
			onClaimSuccess();
		}
	}, [isConfirmed, onClaimSuccess]);

	const formattedContractBalance = contractBalance ? (Number(contractBalance) / 1e6).toFixed(2) : "0.00";
	const formattedClaimBalance = balanceToClaim ? (Number(balanceToClaim) / 1e6).toFixed(2) : "0.00";
	const hasClaimableBalance = balanceToClaim && Number(balanceToClaim) > 0;

	return (
		<div className="bento-card">
				{/* Header Section */}
				<div className="mb-6 sm:mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
							<WalletIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
						</div>
						<div>
							<h1 className="text-xl sm:text-2xl font-bold text-white">Gestion des Balances</h1>
							<p className="text-white/50 text-xs sm:text-sm">Consultez et réclamez vos fonds USDC</p>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
					{/* Contract Balance */}
					<div className="rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 transition-all duration-300 hover:border-amber-500/30">
						<p className="text-[10px] sm:text-xs text-amber-400/70 uppercase tracking-wider mb-1">Smart Contract</p>
						<p className="text-xl sm:text-3xl font-bold text-amber-400">
							{formattedContractBalance}
						</p>
						<p className="text-[10px] sm:text-xs text-amber-400/50 mt-0.5">USDC</p>
					</div>

					{/* Claimable Balance */}
					<div className={`
                        rounded-xl sm:rounded-2xl p-3 sm:p-5 border transition-all duration-300
                        ${hasClaimableBalance
							? 'border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 hover:border-cyan-500/30'
							: 'border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:border-white/[0.12]'
						}
                    `}>
						<p className={`text-[10px] sm:text-xs uppercase tracking-wider mb-1 ${hasClaimableBalance ? 'text-cyan-400/70' : 'text-white/40'}`}>
							À réclamer
						</p>
						<p className={`text-xl sm:text-3xl font-bold ${hasClaimableBalance ? 'text-cyan-400' : 'bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent'}`}>
							{formattedClaimBalance}
						</p>
						<p className={`text-[10px] sm:text-xs mt-0.5 ${hasClaimableBalance ? 'text-cyan-400/50' : 'text-white/30'}`}>USDC</p>
					</div>
				</div>

				{/* Claim Section */}
				<div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/[0.12]">
					{/* Section Header */}
					<div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.08] flex items-center justify-between">
						<h3 className="text-base sm:text-lg font-semibold text-white">Réclamation</h3>
						{hasClaimableBalance && (
							<span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-full uppercase tracking-wider bg-cyan-500/20 text-cyan-400">
								Fonds disponibles
							</span>
						)}
					</div>

					{/* Content */}
					<div className="p-4 sm:p-6 space-y-4">
						{/* Info Message */}
						{!hasClaimableBalance ? (
							<div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
								<div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
									<CoinsIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white/20" />
								</div>
								<p className="text-white/40 text-sm">Aucun fonds à réclamer</p>
								<p className="text-white/20 text-xs mt-1">Vos gains de parrainage apparaîtront ici</p>
							</div>
						) : (
							<div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
								<div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
									<CoinsIcon className="h-7 w-7 sm:h-8 sm:w-8 text-cyan-400" />
								</div>
								<p className="text-white text-sm sm:text-base font-medium">
									Vous avez <span className="text-cyan-400 font-bold">{formattedClaimBalance} USDC</span> à réclamer
								</p>
								<p className="text-white/40 text-xs mt-1">Cliquez sur le bouton ci-dessous pour récupérer vos fonds</p>
							</div>
						)}

						{/* Success Message */}
						{isConfirmed && (
							<div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
								<div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
									<CheckIcon className="h-3 w-3 text-white" />
								</div>
								<span className="text-emerald-400 text-sm font-medium">
									Fonds réclamés avec succès !
								</span>
							</div>
						)}

						{/* Claim Button */}
						<button
							onClick={handleClaimReferral}
							disabled={writeIsPending || isConfirming || !hasClaimableBalance}
							className={`
                                w-full h-11 sm:h-12 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                                ${hasClaimableBalance
									? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
									: 'bg-white/5 text-white/30 cursor-not-allowed'
								}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
						>
							{writeIsPending || isConfirming ? (
								<>
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									<span>
										{writeIsPending ? 'Confirmation...' : 'Transaction en cours...'}
									</span>
								</>
							) : (
								<>
									<CoinsIcon className="h-4 w-4" />
									<span>{hasClaimableBalance ? 'Réclamer mes fonds' : 'Aucun fonds à réclamer'}</span>
								</>
							)}
						</button>
					</div>
				</div>

				<p className="text-center text-white/20 text-[10px] sm:text-xs mt-4 sm:mt-6">
					Les fonds proviennent des commissions de parrainage
				</p>
			</div>
	);
};

export default SCBalance;