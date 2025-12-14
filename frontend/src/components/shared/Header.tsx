'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from 'wagmi';

import { Button } from "@/components/ui/button";

// Logo Icon
const LogoIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Header = () => {
    const { isConnected } = useAccount();

    return (
        <header className="glass-subtle sticky top-0 z-50 w-full border-b border-border-subtle">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-eternam-cyan to-eternam-cyan-muted shadow-lg shadow-eternam-cyan/20">
                        <LogoIcon className="h-5 w-5 text-eternam-dark" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-eternam-light">
                        EternamID
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            mounted,
                        }) => {
                            const ready = mounted;
                            const connected = ready && account && chain;

                            return (
                                <div
                                    {...(!ready && {
                                        'aria-hidden': true,
                                        style: {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <button
                                                    onClick={openConnectModal}
                                                    className="btn-primary"
                                                >
                                                    Connecter Wallet
                                                </button>
                                            );
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <button
                                                    onClick={openChainModal}
                                                    className="btn-secondary border-eternam-rose/50 text-eternam-rose"
                                                >
                                                    Mauvais réseau
                                                </button>
                                            );
                                        }

                                        return (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={openChainModal}
                                                    className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3 py-2 text-sm transition-colors hover:border-border-default"
                                                >
                                                    {chain.hasIcon && (
                                                        <div
                                                            className="h-4 w-4 overflow-hidden rounded-full"
                                                            style={{ background: chain.iconBackground }}
                                                        >
                                                            {chain.iconUrl && (
                                                                <img
                                                                    alt={chain.name ?? 'Chain icon'}
                                                                    src={chain.iconUrl}
                                                                    className="h-4 w-4"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                    <span className="hidden text-eternam-muted sm:inline">
                                                        {chain.name}
                                                    </span>
                                                </button>

                                                <button
                                                    onClick={openAccountModal}
                                                    className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3 py-2 text-sm font-medium text-eternam-light transition-colors hover:border-border-default"
                                                >
                                                    {account.displayName}
                                                    {account.displayBalance && (
                                                        <span className="hidden text-eternam-muted sm:inline">
                                                            ({account.displayBalance})
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>

                    {isConnected && (
                        <Button asChild className="btn-secondary hidden sm:flex">
                            <Link href="/profil">Profil</Link>
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;