'use client';

import { useEffect, useState } from "react";
import { CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

// ShadCN UI
import { Button } from "@/components/ui/button";
import AddReferral from "./referrals/AddReferral";
import RemoveReferral from "./referrals/RemoveReferral";

interface ClaimProps {
    onClaimSuccess?: () => void;
}

const Referral = ({ onClaimSuccess }: ClaimProps) => {
    const { address } = useAccount();

    const { data: hash, error: writeError, writeContract, isPending: writeIsPending } = useWriteContract()

    const { data: owner } = useReadContract({
        address: CONTRACT_ETERNAMID_ADDRESS,
        abi: CONTRACT_ETERNAMID_ABI,
        functionName: "owner",
    });
    const isAdmin = address == owner;

    const { data: contractBalance } = useReadContract({
        address: CONTRACT_ETERNAMID_ADDRESS,
        abi: CONTRACT_ETERNAMID_ABI,
        functionName: "getContractBalance",
    }) as { data?: bigint };

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const { data: balanceToClaim, } = useReadContract({
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
        })
    }

    useEffect(() => {
        if (isConfirmed) {
            if (onClaimSuccess) {
                onClaimSuccess();
            }
        }
    }, [isConfirmed, onClaimSuccess]);

    return (
        <div>
            {isAdmin && (
                <>
                    <p>
                        Balance actuelle du smart Contract : {contractBalance ? Number(contractBalance) / 1e6 : "0"} USDC
                    </p>

                    <AddReferral />
                    <RemoveReferral />
                </>
            )}

            <p>
                Balance que vous pouvez réclamer : {balanceToClaim ? Number(balanceToClaim) / 1e6 : "0"} USDC
            </p>
            <Button
                onClick={handleClaimReferral}
            >
                Récupérer</Button>
        </div>
    )
}
export default Referral