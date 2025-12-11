'use client';

import { useEffect, useState } from "react";
import { CONTRACT_USDC_ADDRESS, CONTRACT_USDC_ABI, CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { Calendar as CalendarIcon, Sparkles, Check, Loader2 } from "lucide-react"
import Image from "next/image";

// ShadCN components Import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MintEternamIDProps {
    totalSupply: number;
    onMintSuccess?: () => void;
}

const MINT_PRICE = BigInt(120 * 10 ** 6); // 120 USDC

const MintEternamID = ({ totalSupply, onMintSuccess }: MintEternamIDProps) => {
    const { address } = useAccount();

    const [inputFirstName, setInputFirstName] = useState('');
    const [inputName, setInputName] = useState('');
    const [inputRefCode, setInputRefCode] = useState('');
    const [inputFatherID, setInputFatherID] = useState<number | ''>('');
    const [inputMotherID, setInputMotherID] = useState<number | ''>('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [acceptedCGV, setAcceptedCGV] = useState(false);
    const [validationError, setValidationError] = useState('');

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

    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    useEffect(() => {
        if (isMintSuccess) {
            resetForm();
            onMintSuccess?.();
        }
    }, [isMintSuccess, onMintSuccess]);

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
        setInputRefCode('');
        setInputFatherID('');
        setInputMotherID('');
        setDate(undefined);
        setAcceptedCGV(false);
        setValidationError('');
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

        if (validationError) return;

        mintNFT({
            address: CONTRACT_ETERNAMID_ADDRESS,
            abi: CONTRACT_ETERNAMID_ABI,
            functionName: 'mintEternamID',
            args: [inputRefCode, inputFatherID || 0, inputMotherID || 0],
        });
    };

    const hasParentConflict = inputFatherID && inputMotherID && inputFatherID === inputMotherID;
    const isApproveLoading = isApprovePending || isApproveConfirming;
    const isMintLoading = isMintPending || isMintConfirming;

    return (
        <Card className="w-full max-w-md border-2 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Créez une capsule
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        #{totalSupply + 1}
                    </Badge>
                </div>
                <CardDescription>
                    Immortalisez votre identité sur la blockchain
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleMint} className="space-y-6">
                    <FieldSet className="space-y-4">
                        <FieldLegend className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Identité
                        </FieldLegend>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="firstname-input" className="text-sm font-medium">
                                    Prénom
                                </FieldLabel>
                                <Input
                                    id="firstname-input"
                                    placeholder="John"
                                    value={inputFirstName}
                                    onChange={(e) => setInputFirstName(e.target.value)}
                                    className="mt-1.5"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name-input" className="text-sm font-medium">
                                    Nom
                                </FieldLabel>
                                <Input
                                    id="name-input"
                                    placeholder="Doe"
                                    value={inputName}
                                    onChange={(e) => setInputName(e.target.value)}
                                    className="mt-1.5"
                                    required
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="date" className="text-sm font-medium">
                                Date de naissance
                            </FieldLabel>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className={`w-full mt-1.5 justify-between font-normal ${!date && "text-muted-foreground"}`}
                                    >
                                        {date ? date.toLocaleDateString('fr-FR') : "Sélectionnez une date"}
                                        <CalendarIcon className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet className="space-y-4 mt-4">
                        <FieldLegend className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Arbre généalogique
                        </FieldLegend>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="fatherId-input" className="text-sm font-medium">
                                    ID NFT Père
                                </FieldLabel>
                                <Input
                                    id="fatherId-input"
                                    type="number"
                                    min={1}
                                    max={totalSupply}
                                    placeholder="Ex: 42"
                                    value={inputFatherID}
                                    onChange={(e) => setInputFatherID(e.target.value ? Number(e.target.value) : '')}
                                    className="mt-1.5"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="motherId-input" className="text-sm font-medium">
                                    ID NFT Mère
                                </FieldLabel>
                                <Input
                                    id="motherId-input"
                                    type="number"
                                    min={1}
                                    max={totalSupply}
                                    placeholder="Ex: 43"
                                    value={inputMotherID}
                                    onChange={(e) => setInputMotherID(e.target.value ? Number(e.target.value) : '')}
                                    className="mt-1.5"
                                />
                            </Field>
                        </div>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet className="space-y-4 mt-4">
                        <Field>
                            <FieldLabel htmlFor="refcode-input" className="text-sm font-medium">
                                Code de parrainage
                            </FieldLabel>
                            <Input
                                id="refcode-input"
                                value={inputRefCode}
                                onChange={(e) => setInputRefCode(e.target.value)}
                                className="mt-1.5"
                            />
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    <div className="flex items-center justify-between mt-4">
                        <span className="text-sm font-medium text-muted-foreground">Prix du mint</span>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/usd-logo.svg"
                                alt="USDC Logo"
                                width={24}
                                height={24}
                            />
                            <span className="text-xl font-bold">120 USDC</span>
                        </div>
                    </div>

                    <Field orientation="horizontal" className="flex items-start space-x-3 py-2">
                        <Checkbox
                            id="input-accept-cgv"
                            checked={acceptedCGV}
                            onCheckedChange={(checked) => setAcceptedCGV(checked as boolean)}
                            required
                        />
                        <div className="space-y-1 leading-none">
                            <FieldLabel htmlFor="input-accept-cgv" className="text-sm font-normal cursor-pointer">
                                J'accepte les{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Conditions Générales de Vente
                                </a>
                            </FieldLabel>
                        </div>
                    </Field>

                    <div className="pt-2">
                        {needsApproval ? (
                            <Button
                                type="button"
                                onClick={handleApprove}
                                disabled={isApproveLoading}
                                className="w-full h-12 text-base font-semibold"
                                variant="outline"
                            >
                                {isApproveLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Approbation en cours...
                                    </>
                                ) : (
                                    <>
                                        <Image
                                            src="/usd-logo.svg"
                                            alt="USDC"
                                            width={20}
                                            height={20}
                                            className="mr-2"
                                        />
                                        Approuver 120 USDC
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isMintLoading || !acceptedCGV || !!hasParentConflict}
                                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            >
                                {isMintLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Mint en cours...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Créer ma capsule
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {mintError && (
                        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                            <p className="text-destructive text-sm">
                                {mintError.message}
                            </p>
                        </div>
                    )}

                    {validationError && (
                        <p className="text-destructive text-sm mt-2">
                            {validationError}
                        </p>
                    )}

                    {isMintSuccess && (
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <p className="text-green-600 text-sm font-medium">
                                Capsule créée avec succès !
                            </p>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default MintEternamID;