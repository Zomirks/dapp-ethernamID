'use client';

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract, usePublicClient } from 'wagmi';

import { CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface NFTMetadata {
	name: string;
	description: string;
	image: string;
	attributes: {
		trait_type: string;
		value: string;
	}[];
}

interface NFTData {
	tokenId: number;
	metadata: NFTMetadata | null;
}

const NFTBalance = () => {
	const { address, isConnected } = useAccount();
	const publicClient = usePublicClient();

	const [userNFTs, setUserNFTs] = useState<NFTData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const { data: totalSupply } = useReadContract({
		address: CONTRACT_ETERNAMID_ADDRESS,
		abi: CONTRACT_ETERNAMID_ABI,
		functionName: 'totalSupply'
	});

	const loadUserNFTs = useCallback(async () => {
		if (!address || !publicClient || !totalSupply) {
			setUserNFTs([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		const totalTokens = Number(totalSupply);
		const nfts: NFTData[] = [];

		for (let i = 1; i <= totalTokens; i++) {
			try {
				const owner = await publicClient.readContract({
					address: CONTRACT_ETERNAMID_ADDRESS,
					abi: CONTRACT_ETERNAMID_ABI,
					functionName: 'ownerOf',
					args: [BigInt(i)],
				});

				if (owner === address) {
					const tokenURI = await publicClient.readContract({
						address: CONTRACT_ETERNAMID_ADDRESS,
						abi: CONTRACT_ETERNAMID_ABI,
						functionName: 'tokenURI',
						args: [BigInt(i)],
					}) as string;

					// Décoder le base64
					const base64Data = tokenURI.replace('data:application/json;base64,', '');
					const jsonString = atob(base64Data);
					const metadata: NFTMetadata = JSON.parse(jsonString);

					nfts.push({ tokenId: i, metadata });
				}
			} catch (error) {
				console.error(`Erreur token ${i}:`, error);
			}
		}

		setUserNFTs(nfts);
		setIsLoading(false);
	}, [address, publicClient, totalSupply]);

	useEffect(() => {
		loadUserNFTs();
	}, [loadUserNFTs]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<h2 className="text-xl font-bold mb-4">Mes capsules EternamID</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-6 w-32" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-40 w-full mb-4" />
								<Skeleton className="h-4 w-2/3" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (userNFTs.length === 0) {
		return (
			<div className="space-y-4">
				<h2 className="text-xl font-bold mb-4">Mes capsules EternamID</h2>
				<div className="p-8 text-center text-gray-500 border rounded-lg">
					Vous ne possédez aucun Eternam ID pour le moment.
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold mb-4">Mes capsules EternamID</h2>
				<Badge variant="secondary">
					{userNFTs.length} NFT{userNFTs.length > 1 ? 's' : ''}
				</Badge>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{userNFTs.map((nft) => (
					<NFTCard key={nft.tokenId} nft={nft} />
				))}
			</div>
		</div>
	);
};

const NFTCard = ({ nft }: { nft: NFTData }) => {
	const { metadata } = nft;
	const imageUrl = metadata?.image || '';

	return (
		<Card className="overflow-hidden">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg">
					{metadata?.name || `Eternam ID #${nft.tokenId}`}
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{imageUrl && (
					<div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
						<img
							src={imageUrl}
							alt={metadata?.name || 'NFT'}
							className="w-full h-full object-contain"
						/>
					</div>
				)}

				{metadata?.attributes && metadata.attributes.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{metadata.attributes.map((attr, index) => (
							<Badge key={index} variant="outline" className="text-xs">
								{attr.trait_type}: {attr.value}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default NFTBalance;