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

// Wagmi Hooks
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// --- ICONS ---

// Trash Icon (Pour la suppression)
const TrashIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" strokeLinejoin="round" />
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

const RemoveReferral = () => {
    // State management
    const [inputReferralCode, setInputReferralCode] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Wagmi hooks
    const { data: hash, writeContract, isPending: writeIsPending, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Handler
    const handleRemoveReferral = async () => {
        setValidationError('');

        // Basic Validation
        if (!inputReferralCode.trim()) {
            setValidationError('Veuillez entrer le code à supprimer.');
            return;
        }

        writeContract({
            address: CONTRACT_ETERNAMID_ADDRESS,
            abi: CONTRACT_ETERNAMID_ABI,
            functionName: 'removeReferral',
            args: [inputReferralCode]
        });
    };

    useEffect(() => {
        if (isConfirmed) {
            setInputReferralCode('');
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
                    className="gap-2 border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/50 transition-all"
                >
                    <TrashIcon className="h-4 w-4" />
                    Remove Referral
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md border-white/10 bg-[#0a0a0a] p-0 overflow-hidden [&>button]:z-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="relative p-6">
                    <DialogHeader className="space-y-3">
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <TrashIcon className="h-7 w-7 text-white" />
                        </div>

                        <DialogTitle className="text-xl font-bold text-center text-white">
                            Supprimer un Parrainage
                        </DialogTitle>

                        <DialogDescription className="text-sm text-white/50 text-center">
                            Cette action retirera définitivement le code de parrainage du contrat.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 pt-6">

                        {/* --- Input 1: Referral Code --- */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="remove-ref-code"
                                className="text-sm font-medium text-white/70"
                            >
                                Code de Parrainage à supprimer
                            </Label>
                            <Input
                                id="remove-ref-code"
                                type="text"
                                value={inputReferralCode}
                                placeholder="Entrez le code..."
                                onChange={(e) => setInputReferralCode(e.target.value)}
                                disabled={writeIsPending || isConfirming}
                                className={`
                                    h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30
                                    focus:border-rose-500/50 focus:ring-rose-500/20 transition-all
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
                                    Parrainage supprimé avec succès !
                                </span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            onClick={handleRemoveReferral}
                            disabled={writeIsPending || isConfirming}
                            className="w-full h-12 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {writeIsPending || isConfirming ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    <span>
                                        {writeIsPending ? 'Confirmation...' : 'Suppression en cours...'}
                                    </span>
                                </div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <TrashIcon className="h-4 w-4" />
                                    Supprimer le code
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RemoveReferral;