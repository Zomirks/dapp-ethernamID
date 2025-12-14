'use client';

import { useState, useEffect } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { CONTRACT_USDC_ADDRESS, CONTRACT_USDC_ABI } from "@/utils/constants";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

interface FaucetProps {
    onFaucetSuccess?: () => void;
}

const DropletIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AlertIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
    </svg>
);

const LoaderIcon = ({ className = "" }: { className?: string }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
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

    useEffect(() => {
        if (!isOpen) {
            setValidationError('');
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="btn-secondary gap-2">
                    <DropletIcon className="h-4 w-4" />
                    <span className="md:hidden lg:inline-block">Faucet</span>
                </button>
            </DialogTrigger>

            <DialogContent className="dialog-content overflow-hidden border-border-default bg-eternam-dark p-0 sm:max-w-md [&>button]:z-20">
                <div className="bg-glow-cyan absolute -right-32 -top-32 opacity-50" />
                <div className="bg-glow-amber absolute -bottom-24 -left-24 opacity-30" />

                <div className="relative p-6">
                    <DialogHeader className="space-y-3">
                        <div className="icon-box icon-box-cyan mx-auto h-14 w-14">
                            <DropletIcon className="h-7 w-7 text-eternam-dark" />
                        </div>

                        <DialogTitle className="text-center text-xl font-bold text-eternam-light">
                            Faucet USDC
                        </DialogTitle>

                        <p className="text-center text-sm text-eternam-muted">
                            Mintez des USDC de test pour utiliser la dApp
                        </p>
                    </DialogHeader>

                    <div className="space-y-5 pt-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="faucet-input"
                                    className={`text-sm font-medium ${validationError ? "text-eternam-rose" : "text-eternam-muted"}`}
                                >
                                    Montant d'USDC
                                </label>
                                <span className="badge">Testnet</span>
                            </div>

                            <div className="relative">
                                <input
                                    id="faucet-input"
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={inputFaucet || ''}
                                    placeholder="Ex: 120"
                                    onChange={(e) => setInputFaucet(Number(e.target.value))}
                                    className={`input-eternam h-12 pr-16 ${validationError ? "border-eternam-rose/50 focus:border-eternam-rose" : ""}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !writeIsPending && !isConfirming) {
                                            handleMintToken();
                                        }
                                    }}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-eternam-muted">
                                    USDC
                                </div>
                            </div>

                            {validationError && (
                                <div className="field-error">
                                    <AlertIcon className="h-3.5 w-3.5" />
                                    {validationError}
                                </div>
                            )}
                        </div>

                        {isConfirmed && (
                            <div className="alert-success">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-eternam-emerald">
                                    <CheckIcon className="h-3 w-3 text-eternam-dark" />
                                </div>
                                <span>USDC mintés avec succès !</span>
                            </div>
                        )}

                        <button
                            onClick={handleMintToken}
                            disabled={writeIsPending || isConfirming}
                            className="btn-primary h-12 w-full"
                        >
                            {writeIsPending || isConfirming ? (
                                <div className="flex items-center gap-2">
                                    <LoaderIcon className="h-4 w-4" />
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
                        </button>

                        <p className="text-center text-xs text-eternam-muted/50">
                            Les tokens de test n'ont aucune valeur réelle
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Faucet;