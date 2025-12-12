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
} from "@/components/ui/dialog";

import { CONTRACT_USDC_ADDRESS, CONTRACT_USDC_ABI } from "@/utils/constants";

// Wagmi Hooks to interact with the blockchain
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'

interface FaucetProps {
    onFaucetSuccess?: () => void;
}

// Droplet Icon
const DropletIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round" />
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

const Faucet = ({ onFaucetSuccess }: FaucetProps) => {
    const { data: hash, writeContract, isPending: writeIsPending } = useWriteContract();
    const { address } = useAccount();

    const [inputFaucet, setInputFaucet] = useState(0);
    const [validationError, setValidationError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const handleMintToken = async () => {
        setValidationError('');

        if (!inputFaucet || inputFaucet === 0) {
            setValidationError('Indiquez un nombre valide');
            return;
        }

        const tokenToMint = inputFaucet * 10 ** 6;

        writeContract({
            address: CONTRACT_USDC_ADDRESS,
            abi: CONTRACT_USDC_ABI,
            functionName: 'mint',
            args: [address, tokenToMint],
        });
    };

    useEffect(() => {
        if (isConfirmed) {
            setInputFaucet(0);
            if (onFaucetSuccess) {
                onFaucetSuccess();
            }
            setTimeout(() => setIsOpen(false), 1500);
        }
    }, [isConfirmed, onFaucetSuccess]);

    // Reset state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setValidationError('');
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
                >
                    <DropletIcon className="h-4 w-4" />
                    Faucet
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md border-white/10 bg-[#0a0a0a] p-0 overflow-hidden [&>button]:z-20">
                {/* Gradient background effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="relative p-6">
                    <DialogHeader className="space-y-3">
                        {/* Icon */}
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <DropletIcon className="h-7 w-7 text-white" />
                        </div>

                        <DialogTitle className="text-xl font-bold text-center text-white">
                            Faucet USDC
                        </DialogTitle>

                        <p className="text-sm text-white/50 text-center">
                            Mintez des USDC de test pour utiliser la dApp
                        </p>
                    </DialogHeader>

                    <div className="space-y-5 pt-6">
                        {/* Input Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="faucet-input"
                                    className={`text-sm font-medium ${validationError ? "text-rose-400" : "text-white/70"}`}
                                >
                                    Montant d'USDC
                                </Label>
                                <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/5">
                                    Testnet
                                </span>
                            </div>

                            <div className="relative">
                                <Input
                                    id="faucet-input"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={inputFaucet || ''}
                                    placeholder="Ex: 120"
                                    onChange={(e) => setInputFaucet(Number(e.target.value))}
                                    className={`
                                        h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30
                                        focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all
                                        ${validationError ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20" : ""}
                                    `}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !writeIsPending && !isConfirming) {
                                            handleMintToken();
                                        }
                                    }}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/40 font-medium">
                                    USDC
                                </div>
                            </div>

                            {/* Error Message */}
                            {validationError && (
                                <div className="flex items-center gap-2 text-rose-400 text-xs">
                                    <AlertIcon className="h-3.5 w-3.5" />
                                    {validationError}
                                </div>
                            )}
                        </div>

                        {/* Success Message */}
                        {isConfirmed && (
                            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <CheckIcon className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-emerald-400 text-sm font-medium">
                                    USDC mintés avec succès !
                                </span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            onClick={handleMintToken}
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
                                    <DropletIcon className="h-4 w-4" />
                                    Mint USDC
                                </span>
                            )}
                        </Button>

                        {/* Info footer */}
                        <p className="text-xs text-white/30 text-center">
                            Les tokens de test n'ont aucune valeur réelle
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Faucet;