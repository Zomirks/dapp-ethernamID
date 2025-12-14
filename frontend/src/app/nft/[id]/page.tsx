'use client';

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAccount, usePublicClient } from 'wagmi';
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

interface DatabaseUser {
    id: number;
    nft_id: number;
    firstname: string | null;
    name: string | null;
    description: string | null;
    private_notes: string | null;
    hash: string | null;
    bornAt: string;
    createdAt: string;
}

// Icons
const ArrowLeftIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LockIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
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

const UserIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FileTextIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="10,9 9,9 8,9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HashIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="9" x2="20" y2="9" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="15" x2="20" y2="15" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="3" x2="8" y2="21" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="3" x2="14" y2="21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ShieldIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ExternalLinkIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="15,3 21,3 21,9" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ImageIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="8.5" r="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="21,15 16,10 5,21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LayersIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 2,7 12,12 22,7 12,2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2,17 12,22 22,17" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2,12 12,17 22,12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AlertCircleIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const NFTDetailPage = () => {
    const params = useParams();
    const tokenId = params.id as string;

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();

    const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
    const [databaseUser, setDatabaseUser] = useState<DatabaseUser | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);

    const isOwner = isConnected &&
        address &&
        ownerAddress &&
        address.toLowerCase() === ownerAddress.toLowerCase();

    const loadNFTData = useCallback(async () => {
        if (!publicClient || !tokenId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const owner = await publicClient.readContract({
                address: CONTRACT_ETERNAMID_ADDRESS,
                abi: CONTRACT_ETERNAMID_ABI,
                functionName: 'ownerOf',
                args: [BigInt(tokenId)],
            }) as `0x${string}`;

            setOwnerAddress(owner);

            const tokenURI = await publicClient.readContract({
                address: CONTRACT_ETERNAMID_ADDRESS,
                abi: CONTRACT_ETERNAMID_ABI,
                functionName: 'tokenURI',
                args: [BigInt(tokenId)],
            }) as string;

            const base64Data = tokenURI.replace('data:application/json;base64,', '');
            const jsonString = atob(base64Data);
            const parsedMetadata: NFTMetadata = JSON.parse(jsonString);
            setMetadata(parsedMetadata);

            try {
                const response = await fetch(`/api/users/${tokenId}`);
                if (response.ok) {
                    const userData = await response.json();
                    setDatabaseUser(userData);
                }
            } catch (dbError) {
                console.error('Error fetching database data:', dbError);
            }

        } catch (error) {
            console.error('Error loading NFT:', error);
            setNotFoundError(true);
        } finally {
            setIsLoading(false);
        }
    }, [publicClient, tokenId]);

    useEffect(() => {
        loadNFTData();
    }, [loadNFTData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const renderAttributeBadge = (attr: { trait_type: string; value: string }, index: number) => {
        const isParentAttribute = attr.trait_type === 'FatherID' || attr.trait_type === 'MotherID';
        const isClickable = isParentAttribute && attr.value !== 'Unknown';

        if (isClickable) {
            return (
                <Link key={index} href={`/nft/${attr.value}`}>
                    <span className="badge group cursor-pointer transition-all hover:border-eternam-cyan hover:bg-eternam-cyan/10 hover:text-eternam-cyan">
                        <span className="text-eternam-muted group-hover:text-eternam-cyan/70">{attr.trait_type}:</span>
                        <span className="ml-1 font-medium">{attr.value}</span>
                        <ExternalLinkIcon className="ml-1.5 h-3 w-3" />
                    </span>
                </Link>
            );
        }

        return (
            <span key={index} className="badge">
                <span className="text-eternam-muted">{attr.trait_type}:</span>
                <span className="ml-1 font-medium text-eternam-light">{attr.value}</span>
            </span>
        );
    };

    if (notFoundError) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="bento-card max-w-md text-center">
                    <div className="icon-box icon-box-subtle mx-auto mb-4 h-16 w-16">
                        <AlertCircleIcon className="h-8 w-8 text-eternam-muted" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-eternam-light">NFT introuvable</h2>
                    <p className="mb-6 text-eternam-muted">
                        Le NFT #{tokenId} n'existe pas encore.
                    </p>
                    <Link href="/">
                        <button className="btn-secondary">
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            Retour à l'accueil
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-2" />

                <div className="flex items-center justify-between">
                    <div className="h-10 w-64 animate-pulse rounded-lg bg-surface-2" />
                    <div className="flex gap-2">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-surface-2" />
                    </div>
                </div>

                <div className="bento-grid">
                    <div className="bento-card col-span-12 row-span-3 lg:col-span-6">
                        <div className="aspect-square w-full animate-pulse rounded-xl bg-surface-2" />
                    </div>

                    <div className="bento-card col-span-12 row-span-2 lg:col-span-6">
                        <div className="space-y-4">
                            <div className="h-6 w-40 animate-pulse rounded bg-surface-2" />
                            <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
                            <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
                        </div>
                    </div>

                    <div className="bento-card col-span-12 row-span-1 lg:col-span-6">
                        <div className="h-20 w-full animate-pulse rounded-lg bg-surface-2" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Link href="/">
                <button className="btn-secondary gap-2 text-sm">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Retour
                </button>
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-eternam-light">
                    {metadata?.name || `Eternam ID #${tokenId}`}
                </h1>
                <div className="flex gap-2">
                    {isOwner && (
                        <span className="badge badge-emerald">
                            <ShieldIcon className="mr-1 h-3 w-3" />
                            Propriétaire
                        </span>
                    )}
                    <span className="badge badge-cyan">#{tokenId}</span>
                </div>
            </div>

            <div className="bento-grid">
                <div className="bento-card col-span-12 row-span-3 lg:col-span-6">
                    <div className="section-header">
                        <div className="flex items-center gap-3">
                            <div className="icon-box icon-box-purple">
                                <ImageIcon className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-eternam-light">Capsule mémorielle</h2>
                        </div>
                    </div>

                    {metadata?.image ? (
                        <div className="aspect-square overflow-hidden rounded-xl bg-surface-2">
                            <img
                                src={metadata.image}
                                alt={metadata.name || 'NFT'}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-surface-2">
                            <ImageIcon className="h-16 w-16 text-eternam-muted/30" />
                        </div>
                    )}
                </div>

                <div className="bento-card col-span-12 row-span-2 lg:col-span-6">
                    <div className="section-header">
                        <div className="flex items-center gap-3">
                            <div className="icon-box icon-box-cyan">
                                <UserIcon className="h-5 w-5 text-eternam-dark" />
                            </div>
                            <h2 className="text-lg font-semibold text-eternam-light">Informations publiques</h2>
                        </div>
                    </div>

                    {databaseUser ? (
                        <div className="space-y-4">
                            {(databaseUser.firstname || databaseUser.name) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {databaseUser.firstname && (
                                        <div className="rounded-xl bg-surface-1 p-4">
                                            <p className="text-xs uppercase tracking-wider text-eternam-muted">Prénom</p>
                                            <p className="mt-1 text-lg font-semibold text-eternam-light">{databaseUser.firstname}</p>
                                        </div>
                                    )}
                                    {databaseUser.name && (
                                        <div className="rounded-xl bg-surface-1 p-4">
                                            <p className="text-xs uppercase tracking-wider text-eternam-muted">Nom</p>
                                            <p className="mt-1 text-lg font-semibold text-eternam-light">{databaseUser.name}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {databaseUser.bornAt && (
                                <div className="flex items-center gap-3 rounded-xl bg-surface-1 p-4">
                                    <CalendarIcon className="h-5 w-5 text-eternam-cyan" />
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-eternam-muted">Date de naissance</p>
                                        <p className="mt-0.5 font-medium text-eternam-light">{formatDate(databaseUser.bornAt)}</p>
                                    </div>
                                </div>
                            )}

                            {databaseUser.description && (
                                <>
                                    <div className="divider" />
                                    <div>
                                        <p className="mb-2 text-xs uppercase tracking-wider text-eternam-muted">Description</p>
                                        <p className="leading-relaxed text-eternam-light/80">{databaseUser.description}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="icon-box icon-box-subtle mb-3 h-12 w-12">
                                <UserIcon className="h-6 w-6 text-eternam-muted/50" />
                            </div>
                            <p className="text-sm text-eternam-muted">Aucune information publique disponible</p>
                        </div>
                    )}
                </div>

                {metadata?.attributes && metadata.attributes.length > 0 && (
                    <div className="bento-card col-span-12 row-span-1 lg:col-span-6">
                        <div className="section-header">
                            <div className="flex items-center gap-3">
                                <div className="icon-box icon-box-amber">
                                    <LayersIcon className="h-5 w-5 text-eternam-dark" />
                                </div>
                                <h2 className="text-lg font-semibold text-eternam-light">Attributs on-chain</h2>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {metadata.attributes.map((attr, index) => renderAttributeBadge(attr, index))}
                        </div>
                    </div>
                )}

                {isOwner && databaseUser ? (
                    <div className="bento-card col-span-12 row-span-2 border-eternam-emerald/30 lg:col-span-6">
                        <div className="section-header">
                            <div className="flex items-center gap-3">
                                <div className="icon-box icon-box-emerald">
                                    <LockIcon className="h-5 w-5 text-eternam-dark" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-eternam-light">Données privées</h2>
                                    <p className="text-xs text-eternam-muted">Visibles uniquement par le propriétaire</p>
                                </div>
                            </div>
                            <span className="badge badge-emerald">Accès autorisé</span>
                        </div>

                        <div className="space-y-4">
                            {databaseUser.private_notes && (
                                <div className="rounded-xl bg-eternam-emerald/5 p-4">
                                    <p className="mb-2 text-xs uppercase tracking-wider text-eternam-emerald/70">Notes privées</p>
                                    <p className="leading-relaxed text-eternam-light/80">{databaseUser.private_notes}</p>
                                </div>
                            )}

                            {databaseUser.hash && (
                                <div className="flex items-start gap-3 rounded-xl bg-surface-1 p-4">
                                    <HashIcon className="mt-0.5 h-4 w-4 shrink-0 text-eternam-muted" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs uppercase tracking-wider text-eternam-muted">Hash de vérification</p>
                                        <p className="mt-1 break-all font-mono text-xs text-eternam-light/70">{databaseUser.hash}</p>
                                    </div>
                                </div>
                            )}

                            <div className="divider" />
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="h-4 w-4 text-eternam-muted" />
                                <div>
                                    <p className="text-xs text-eternam-muted">Capsule créée le</p>
                                    <p className="font-medium text-eternam-light">{formatDate(databaseUser.createdAt)}</p>
                                </div>
                            </div>

                            {!databaseUser.private_notes && !databaseUser.hash && (
                                <p className="text-center text-sm text-eternam-muted">Aucune note privée enregistrée</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bento-card col-span-12 row-span-1 border-dashed lg:col-span-6">
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="icon-box icon-box-subtle mb-4 h-14 w-14">
                                <LockIcon className="h-7 w-7 text-eternam-muted/50" />
                            </div>
                            <p className="text-eternam-muted">
                                {isConnected
                                    ? "Vous n'êtes pas le propriétaire de ce NFT"
                                    : "Connectez-vous avec le wallet propriétaire pour voir les données privées"
                                }
                            </p>
                        </div>
                    </div>
                )}

                {metadata?.description && (
                    <div className="bento-card col-span-12 row-span-1">
                        <div className="section-header">
                            <div className="flex items-center gap-3">
                                <div className="icon-box icon-box-subtle">
                                    <FileTextIcon className="h-5 w-5 text-eternam-muted" />
                                </div>
                                <h2 className="text-lg font-semibold text-eternam-light">Description de la collection</h2>
                            </div>
                        </div>
                        <p className="leading-relaxed text-eternam-muted">{metadata.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NFTDetailPage;