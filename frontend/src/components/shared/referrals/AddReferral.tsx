'use client';

import { useState, useEffect } from "react";

// ShadCN components Import
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription
} from "@/components/ui/dialog";

import { CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";

// Wagmi Hooks to interact with the blockchain
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// --- ICONS ---

// User Plus Icon (Pour le parrainage)
const UserPlusIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
		<circle cx="8.5" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
		<line x1="20" y1="8" x2="20" y2="14" strokeLinecap="round" strokeLinejoin="round" />
		<line x1="23" y1="11" x2="17" y2="11" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

// Check Icon
const CheckIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

// Alert Icon
const AlertIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<circle cx="12" cy="12" r="10" />
		<path d="M12 8v4m0 4h.01" strokeLinecap="round" />
	</svg>
);

const AddReferral = () => {
	const [inputReferralCode, setInputReferralCode] = useState('');
	const [inputReferralAddress, setInputReferralAddress] = useState('');
	const [validationError, setValidationError] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const { data: hash, writeContract, isPending: writeIsPending, reset } = useWriteContract();

	const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
		hash,
	});

	const handleAddReferral = async () => {
		setValidationError('');

		if (!inputReferralCode.trim()) {
			setValidationError('Le code de parrainage est requis.');
			return;
		}
		if (!inputReferralAddress.trim() || !inputReferralAddress.startsWith('0x') || inputReferralAddress.length !== 42) {
			setValidationError('Adresse Ethereum invalide.');
			return;
		}

		writeContract({
			address: CONTRACT_ETERNAMID_ADDRESS,
			abi: CONTRACT_ETERNAMID_ABI,
			functionName: 'addReferral',
			args: [inputReferralCode, inputReferralAddress]
		});
	};

	useEffect(() => {
		if (isConfirmed) {
			setInputReferralCode('');
			setInputReferralAddress('');
			setTimeout(() => setIsOpen(false), 2000);
		}
	}, [isConfirmed]);

	useEffect(() => {
		if (!isOpen) {
			setValidationError('');
			reset();
		}
	}, [isOpen, reset]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="gap-2 border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
				>
					<UserPlusIcon className="h-4 w-4" />
					Add Referral
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md border-white/10 bg-[#0a0a0a] p-0 overflow-hidden [&>button]:z-20">
				<div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

				<div className="relative p-6">
					<DialogHeader className="space-y-3">
						<div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
							<UserPlusIcon className="h-7 w-7 text-white" />
						</div>

						<DialogTitle className="text-xl font-bold text-center text-white">
							Ajouter un Parrainage
						</DialogTitle>

						<DialogDescription className="text-sm text-white/50 text-center">
							Associez un code unique à une adresse de parrainage.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-5 pt-6">

						{/* --- Input 1: Referral Code --- */}
						<div className="space-y-2">
							<Label
								htmlFor="ref-code"
								className="text-sm font-medium text-white/70"
							>
								Code de Parrainage
							</Label>
							<Input
								id="ref-code"
								type="text"
								value={inputReferralCode}
								placeholder="Ex: SOCFUN67"
								onChange={(e) => setInputReferralCode(e.target.value)}
								disabled={writeIsPending || isConfirming}
								className={`
                                    h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30
                                    focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all
                                `}
							/>
						</div>

						{/* --- Input 2: Wallet Address --- */}
						<div className="space-y-2">
							<Label
								htmlFor="ref-address"
								className="text-sm font-medium text-white/70"
							>
								Adresse du Wallet
							</Label>
							<Input
								id="ref-address"
								type="text"
								value={inputReferralAddress}
								placeholder="0x..."
								onChange={(e) => setInputReferralAddress(e.target.value)}
								disabled={writeIsPending || isConfirming}
								className={`
                                    h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono text-sm
                                    focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all
                                `}
							/>
						</div>

						{/* Error Message */}
						{validationError && (
							<div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
								<AlertIcon className="h-3.5 w-3.5 shrink-0" />
								{validationError}
							</div>
						)}

						{/* Success Message */}
						{isConfirmed && (
							<div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
								<div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
									<CheckIcon className="h-3 w-3 text-white" />
								</div>
								<span className="text-emerald-400 text-sm font-medium">
									Parrainage ajouté avec succès !
								</span>
							</div>
						)}

						{/* Submit Button */}
						<Button
							onClick={handleAddReferral}
							disabled={writeIsPending || isConfirming}
							className="w-full h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{writeIsPending || isConfirming ? (
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									<span>
										{writeIsPending ? 'Confirmation...' : 'Transaction en cours...'}
									</span>
								</div>
							) : (
								<span className="flex items-center gap-2">
									<UserPlusIcon className="h-4 w-4" />
									Enregistrer
								</span>
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddReferral;