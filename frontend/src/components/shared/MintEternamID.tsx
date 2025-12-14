'use client';

import { useEffect, useState } from "react";
import { keccak256, encodePacked } from 'viem';
import Image from "next/image";

import { CONTRACT_USDC_ADDRESS, CONTRACT_USDC_ABI, CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface MintEternamIDProps {
    totalSupply: number;
    onMintSuccess?: () => void;
}

const SparklesIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalendarIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LoaderIcon = ({ className = "" }: { className?: string }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
);

const AlertIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
    </svg>
);

const MINT_PRICE = BigInt(120 * 10 ** 6);
const MAX_TEXTAREA_LENGTH = 500;

const MintEternamID = ({ totalSupply, onMintSuccess }: MintEternamIDProps) => {
    const { address } = useAccount();

    const [inputFirstName, setInputFirstName] = useState('');
    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputPrivateNotes, setInputPrivateNotes] = useState('');
    const [inputRefCode, setInputRefCode] = useState('');
    const [inputFatherID, setInputFatherID] = useState<number | ''>('');
    const [inputMotherID, setInputMotherID] = useState<number | ''>('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [acceptedCGV, setAcceptedCGV] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [currentHash, setCurrentHash] = useState<`0x${string}` | null>(null);

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_USDC_ADDRESS,
        abi: CONTRACT_USDC_ABI,
        functionName: 'allowance',
        args: [address, CONTRACT_ETERNAMID_ADDRESS],
    }) as { data: bigint | undefined; refetch: () => void };

    const {
        data: approveHash,
        writeContract: approveUsdc,
        isPending: isApprovePending
    } = useWriteContract();

    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    const {
        data: mintHash,
        writeContract: mintNFT,
        isPending: isMintPending,
        error: mintError
    } = useWriteContract();

    const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
        hash: mintHash,
    });

    const generateHash = (): `0x${string}` => {
        const dataToHash = encodePacked(
            ['string', 'string', 'string', 'string', 'string'],
            [inputFirstName, inputName, inputDescription, inputPrivateNotes, date?.toISOString() || '']
        );
        return keccak256(dataToHash);
    };

    const saveUserToDatabase = async (hash: string) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nft_id: totalSupply + 1,
                    firstname: inputFirstName,
                    name: inputName,
                    description: inputDescription,
                    private_notes: inputPrivateNotes,
                    hash: hash,
                    bornAt: date?.toISOString(),
                }),
            });

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
            const user = await response.json();
            console.log('User sauvegardé:', user);
        } catch (error) {
            console.error('Erreur sauvegarde BDD:', error);
        }
    };

    useEffect(() => {
        if (isApproveSuccess) refetchAllowance();
    }, [isApproveSuccess, refetchAllowance]);

    useEffect(() => {
        if (isMintSuccess && mintHash && currentHash) {
            saveUserToDatabase(currentHash).then(() => {
                resetForm();
                onMintSuccess?.();
            });
        }
    }, [isMintSuccess, mintHash, currentHash]);

    useEffect(() => {
        if (inputFatherID && inputMotherID && inputFatherID === inputMotherID) {
            setValidationError('Les IDs du père et de la mère doivent être différents');
        } else {
            setValidationError('');
        }
    }, [inputFatherID, inputMotherID]);

    const resetForm = () => {
        setInputFirstName('');
        setInputName('');
        setInputDescription('');
        setInputPrivateNotes('');
        setInputRefCode('');
        setInputFatherID('');
        setInputMotherID('');
        setDate(undefined);
        setAcceptedCGV(false);
        setValidationError('');
        setCurrentHash(null);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_TEXTAREA_LENGTH) setInputDescription(e.target.value);
    };

    const handlePrivateNotesChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_TEXTAREA_LENGTH) setInputPrivateNotes(e.target.value);
    };

    const needsApproval = (allowance ?? 0n) < MINT_PRICE;

    const handleApprove = () => {
        approveUsdc({
            address: CONTRACT_USDC_ADDRESS,
            abi: CONTRACT_USDC_ABI,
            functionName: 'approve',
            args: [CONTRACT_ETERNAMID_ADDRESS, MINT_PRICE],
        });
    };

    const handleMint = (e: React.FormEvent) => {
        e.preventDefault();
        const hash = generateHash();
        setCurrentHash(hash);
        if (validationError) return;

        mintNFT({
            address: CONTRACT_ETERNAMID_ADDRESS,
            abi: CONTRACT_ETERNAMID_ABI,
            functionName: 'mintEternamID',
            args: [hash, inputRefCode ?? "", inputFatherID ?? 0, inputMotherID ?? 0]
        });
    };

    const hasParentConflict = inputFatherID && inputMotherID && inputFatherID === inputMotherID;
    const isApproveLoading = isApprovePending || isApproveConfirming;
    const isMintLoading = isMintPending || isMintConfirming;

    return (
        <div className="bento-card h-full">
            <div className="section-header">
                <div className="flex items-center gap-3">
                    <div className="icon-box icon-box-amber">
                        <SparklesIcon className="h-5 w-5 text-eternam-dark" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-eternam-light">Créez une capsule</h2>
                        <p className="text-sm text-eternam-muted">Immortalisez votre identité sur la blockchain</p>
                    </div>
                </div>
                <span className="badge badge-cyan">#{totalSupply + 1}</span>
            </div>

            <form onSubmit={handleMint} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-eternam-muted">
                        Identité
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="field-group">
                            <label htmlFor="firstname-input" className="field-label">Prénom</label>
                            <Input
                                id="firstname-input"
                                placeholder="John"
                                value={inputFirstName}
                                onChange={(e) => setInputFirstName(e.target.value)}
                                className="input-eternam"
                                required
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="name-input" className="field-label">Nom</label>
                            <Input
                                id="name-input"
                                placeholder="Doe"
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                className="input-eternam"
                                required
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label htmlFor="date" className="field-label">Date de naissance</label>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    id="date"
                                    className={`input-eternam flex h-10 w-full items-center justify-between ${!date && "text-eternam-muted/50"}`}
                                >
                                    {date ? date.toLocaleDateString('fr-FR') : "Sélectionnez une date"}
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden border-border-default bg-eternam-dark p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        setCalendarOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="divider" />

                <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-eternam-muted">
                        Arbre généalogique
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="field-group">
                            <label htmlFor="fatherId-input" className="field-label">ID NFT Père</label>
                            <Input
                                id="fatherId-input"
                                type="number"
                                min={1}
                                max={totalSupply}
                                placeholder="Ex: 42"
                                value={inputFatherID}
                                onChange={(e) => setInputFatherID(e.target.value ? Number(e.target.value) : '')}
                                className="input-eternam"
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="motherId-input" className="field-label">ID NFT Mère</label>
                            <Input
                                id="motherId-input"
                                type="number"
                                min={1}
                                max={totalSupply}
                                placeholder="Ex: 43"
                                value={inputMotherID}
                                onChange={(e) => setInputMotherID(e.target.value ? Number(e.target.value) : '')}
                                className="input-eternam"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="field-group">
                        <label htmlFor="public-desc-input" className="field-label">Description</label>
                        <p className="field-description">Ces données seront publiques</p>
                        <Textarea
                            id="public-desc-input"
                            value={inputDescription}
                            onChange={handleDescriptionChange}
                            className="input-eternam min-h-[80px] resize-none"
                            maxLength={MAX_TEXTAREA_LENGTH}
                        />
                        <span className="text-xs text-eternam-muted/50">{inputDescription.length}/{MAX_TEXTAREA_LENGTH}</span>
                    </div>
                </div>

                <div className="divider" />

                <div className="space-y-4">
                    <div className="field-group">
                        <label htmlFor="private-desc-input" className="field-label">Notes privées</label>
                        <p className="field-description">Accessibles uniquement avec le NFT</p>
                        <Textarea
                            id="private-desc-input"
                            value={inputPrivateNotes}
                            onChange={handlePrivateNotesChanges}
                            className="input-eternam min-h-[80px] resize-none"
                            maxLength={MAX_TEXTAREA_LENGTH}
                        />
                        <span className="text-xs text-eternam-muted/50">{inputPrivateNotes.length}/{MAX_TEXTAREA_LENGTH}</span>
                    </div>
                </div>

                <div className="divider" />

                <div className="field-group">
                    <label htmlFor="refcode-input" className="field-label">Code de parrainage</label>
                    <Input
                        id="refcode-input"
                        value={inputRefCode}
                        onChange={(e) => setInputRefCode(e.target.value)}
                        className="input-eternam"
                        placeholder="Optionnel"
                    />
                </div>

                <div className="divider" />

                <div className="flex items-center justify-between rounded-xl bg-surface-2 p-4">
                    <span className="text-sm font-medium text-eternam-muted">Prix du mint</span>
                    <div className="flex items-center gap-2">
                        <Image src="/usd-logo.svg" alt="USDC Logo" width={24} height={24} />
                        <span className="text-xl font-bold text-eternam-light">120 USDC</span>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Checkbox
                        id="input-accept-cgv"
                        checked={acceptedCGV}
                        onCheckedChange={(checked) => setAcceptedCGV(checked as boolean)}
                        className="border-border-default data-[state=checked]:bg-eternam-cyan data-[state=checked]:border-eternam-cyan"
                        required
                    />
                    <label htmlFor="input-accept-cgv" className="cursor-pointer text-sm leading-relaxed text-eternam-muted">
                        J'accepte les{' '}
                        <a href="/conditions-generales-de-ventes" target="_blank" className="text-eternam-cyan underline-offset-2 hover:underline">
                            Conditions Générales de Vente
                        </a>
                    </label>
                </div>

                <div className="pt-2">
                    {needsApproval ? (
                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={isApproveLoading}
                            className="btn-secondary h-12 w-full"
                        >
                            {isApproveLoading ? (
                                <>
                                    <LoaderIcon className="mr-2 h-5 w-5" />
                                    Approbation en cours...
                                </>
                            ) : (
                                <>
                                    <Image src="/usd-logo.svg" alt="USDC" width={20} height={20} className="mr-2" />
                                    Approuver 120 USDC
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isMintLoading || !acceptedCGV || !!hasParentConflict}
                            className="btn-primary h-12 w-full"
                        >
                            {isMintLoading ? (
                                <>
                                    <LoaderIcon className="mr-2 h-5 w-5" />
                                    Mint en cours...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="mr-2 h-5 w-5" />
                                    Créer ma capsule
                                </>
                            )}
                        </button>
                    )}
                </div>

                {mintError && (
                    <div className="alert-error">
                        <AlertIcon className="h-4 w-4" />
                        <p>{mintError.message}</p>
                    </div>
                )}

                {validationError && (
                    <div className="alert-error">
                        <AlertIcon className="h-4 w-4" />
                        <p>{validationError}</p>
                    </div>
                )}

                {isMintSuccess && (
                    <div className="alert-success">
                        <CheckIcon className="h-5 w-5" />
                        <span>Capsule créée avec succès !</span>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MintEternamID;