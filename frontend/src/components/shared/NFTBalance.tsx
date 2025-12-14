'use client';

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import Link from "next/link";

import { CONTRACT_ETERNAMID_ADDRESS, CONTRACT_ETERNAMID_ABI } from "@/utils/constants";

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

// Icons
const ExternalLinkIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
		<polyline points="15,3 21,3 21,9" strokeLinecap="round" strokeLinejoin="round" />
		<line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const LayersIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<polygon points="12,2 2,7 12,12 22,7 12,2" strokeLinecap="round" strokeLinejoin="round" />
		<polyline points="2,17 12,22 22,17" strokeLinecap="round" strokeLinejoin="round" />
		<polyline points="2,12 12,17 22,12" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const ImageIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
		<circle cx="8.5" cy="8.5" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
		<polyline points="21,15 16,10 5,21" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const NFTBalance = () => {
	const { address } = useAccount();
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
			<div className="bento-card h-full">
				<div className="section-header">
					<div className="flex items-center gap-3">
						<div className="icon-box icon-box-purple">
							<LayersIcon className="h-5 w-5 text-white" />
						</div>
						<h2 className="text-xl font-bold text-eternam-light">Mes capsules EternamID</h2>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{[1, 2, 3].map((i) => (
						<div key={i} className="animate-pulse rounded-xl border border-border-subtle bg-surface-1 p-4">
							<div className="mb-4 flex items-center justify-between">
								<div className="h-5 w-32 rounded bg-surface-2" />
								<div className="h-5 w-12 rounded bg-surface-2" />
							</div>
							<div className="aspect-square w-full rounded-lg bg-surface-2" />
							<div className="mt-4 h-10 w-full rounded-lg bg-surface-2" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (userNFTs.length === 0) {
		return (
			<div className="bento-card h-full">
				<div className="section-header">
					<div className="flex items-center gap-3">
						<div className="icon-box icon-box-purple">
							<LayersIcon className="h-5 w-5 text-white" />
						</div>
						<h2 className="text-xl font-bold text-eternam-light">Mes capsules EternamID</h2>
					</div>
				</div>

				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div className="icon-box icon-box-subtle mb-4 h-16 w-16">
						<ImageIcon className="h-8 w-8 text-eternam-muted/50" />
					</div>
					<p className="text-eternam-muted">Vous ne possédez aucune capsule EternamID pour le moment.</p>
					<p className="mt-1 text-sm text-eternam-muted/50">Créez votre première capsule mémorielle !</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bento-card h-full">
			<div className="section-header">
				<div className="flex items-center gap-3">
					<div className="icon-box icon-box-purple">
						<LayersIcon className="h-5 w-5 text-white" />
					</div>
					<h2 className="text-xl font-bold text-eternam-light">Mes capsules EternamID</h2>
				</div>
				<span className="badge badge-emerald">
					{userNFTs.length} NFT{userNFTs.length > 1 ? 's' : ''}
				</span>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
		<div className="group overflow-hidden rounded-xl border border-border-subtle bg-surface-1 transition-all duration-300 hover:border-border-default hover:shadow-lg hover:shadow-eternam-cyan/5">
			<div className="flex items-center justify-between border-b border-border-subtle p-4">
				<h3 className="truncate font-semibold text-eternam-light">
					{metadata?.name || `Eternam ID #${nft.tokenId}`}
				</h3>
				<span className="badge">#{nft.tokenId}</span>
			</div>

			<div className="p-4">
				{imageUrl ? (
					<div className="aspect-square overflow-hidden rounded-lg bg-surface-2">
						<img
							src={imageUrl}
							alt={metadata?.name || 'NFT'}
							className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
				) : (
					<div className="flex aspect-square items-center justify-center rounded-lg bg-surface-2">
						<ImageIcon className="h-12 w-12 text-eternam-muted/30" />
					</div>
				)}
			</div>

			<div className="p-4 pt-0">
				<Link href={`/nft/${nft.tokenId}`}>
					<button className="btn-secondary h-10 w-full text-sm">
						<ExternalLinkIcon className="mr-2 h-4 w-4" />
						Voir les détails
					</button>
				</Link>
			</div>
		</div>
	);
};

export default NFTBalance;