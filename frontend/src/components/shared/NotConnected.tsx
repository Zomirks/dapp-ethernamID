'use client';

import React, { useState, useEffect } from "react";

// Icons
const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const ChainIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const TreeIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M12 22v-7l-2-2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M17 8v.8A6 6 0 0 1 13.8 20v0H10v0A6 6 0 0 1 6.8 8.8V8a6 6 0 0 1 12 0z" strokeLinecap="round" strokeLinejoin="round" />
		<path d="m14 15-2-2" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const KeyIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const BotIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<rect x="3" y="11" width="18" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
		<circle cx="12" cy="5" r="2" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M12 7v4" strokeLinecap="round" strokeLinejoin="round" />
		<line x1="8" y1="16" x2="8" y2="16" strokeLinecap="round" strokeLinejoin="round" />
		<line x1="16" y1="16" x2="16" y2="16" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const QRIcon = ({ className = "" }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
		<rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
		<rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
		<rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

export default function NotConnected() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	return (
		<div className="min-h-screen">
			{/* Bento Grid Layout */}
			<div className="bento-grid">

				{/* Hero Card - Large */}
				<div
					className={`bento-card col-span-12 row-span-3 flex flex-col justify-between overflow-hidden md:col-span-8 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '100ms' }}
				>
					{/* Background effects */}
					<div className="bg-glow-cyan absolute -right-32 -top-32" />
					<div className="bg-glow-amber absolute -bottom-24 -left-24 opacity-30" />

					<div className="relative z-10">
						<span className="badge badge-cyan mb-6">
							Blockchain Arweave
						</span>
						<h1 className="mb-4 text-4xl font-bold leading-[1.1] md:text-6xl">
							<span className="text-gradient">Mémoire</span>
							<br />
							<span className="font-serif italic text-eternam-light/90">éternelle</span>
						</h1>
						<p className="max-w-md text-lg leading-relaxed text-eternam-muted">
							Préservez l'histoire de vos proches pour toujours sur le permaweb.
						</p>
					</div>

					<div className="relative z-10 flex flex-wrap items-center gap-4">
						<button className="btn-primary group">
							Créer une capsule
							<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</button>
						<button className="btn-secondary">
							En savoir plus
						</button>
					</div>
				</div>

				{/* Stats Card */}
				<div
					className={`bento-card col-span-6 row-span-2 flex flex-col justify-between md:col-span-4 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '200ms' }}
				>
					<span className="text-xs uppercase tracking-wider text-eternam-muted">Marché France</span>
					<div>
						<p className="text-5xl font-bold text-gradient">650K</p>
						<p className="mt-1 text-sm text-eternam-muted">décès par an</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="status-dot status-dot-cyan" />
						<span className="text-xs text-eternam-muted">4500+ services funéraires</span>
					</div>
				</div>

				{/* Price Card - Amber */}
				<div
					className={`bento-card-amber col-span-6 row-span-1 flex items-center justify-between rounded-bento p-6 md:col-span-4 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '300ms' }}
				>
					<div>
						<p className="text-xs font-medium uppercase tracking-wider text-eternam-dark/60">À partir de</p>
						<p className="text-3xl font-bold text-eternam-dark">120 USDC</p>
					</div>
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-eternam-dark/10">
						<span className="text-2xl">💎</span>
					</div>
				</div>

				{/* Feature 1 - Blockchain */}
				<div
					className={`bento-card col-span-12 row-span-2 flex flex-col justify-between md:col-span-4 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '400ms' }}
				>
					<div className="icon-box icon-box-cyan">
						<ChainIcon className="h-6 w-6 text-eternam-dark" />
					</div>
					<div>
						<h3 className="mb-2 text-xl font-semibold text-eternam-light">Stockage permanent</h3>
						<p className="text-sm leading-relaxed text-eternam-muted">
							Données stockées sur Arweave. Une seule transaction, une éternité de stockage.
						</p>
					</div>
				</div>

				{/* Feature 2 - Family Tree */}
				<div
					className={`bento-card col-span-12 row-span-2 flex flex-col justify-between md:col-span-4 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '500ms' }}
				>
					<div className="icon-box icon-box-emerald">
						<TreeIcon className="h-6 w-6 text-eternam-dark" />
					</div>
					<div>
						<h3 className="mb-2 text-xl font-semibold text-eternam-light">Arbre généalogique</h3>
						<p className="text-sm leading-relaxed text-eternam-muted">
							Génération automatique des liens familiaux. Les futures générations pourront remonter leur histoire.
						</p>
					</div>
				</div>

				{/* Feature 3 - NFT Keys */}
				<div
					className={`bento-card col-span-12 row-span-2 flex flex-col justify-between md:col-span-4 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '600ms' }}
				>
					<div className="icon-box icon-box-purple">
						<KeyIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h3 className="mb-2 text-xl font-semibold text-eternam-light">NFT-clés d'accès</h3>
						<p className="text-sm leading-relaxed text-eternam-muted">
							Contenu privé protégé par des NFT non-spéculatifs. Héritage numérique automatisé vers les descendants.
						</p>
					</div>
				</div>

				{/* Quote Card - Wide */}
				<div
					className={`bento-card col-span-12 row-span-2 flex flex-col justify-center overflow-hidden md:col-span-8 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '700ms' }}
				>
					<div className="absolute -right-20 -top-20 font-serif text-[200px] text-eternam-light/[0.03]">"</div>
					<blockquote className="relative z-10 font-serif text-2xl italic leading-relaxed text-eternam-light/80 md:text-3xl">
						Nous mourons deux fois : notre mort physique, et quand toutes traces de nous disparaissent.
					</blockquote>
				</div>

				{/* AI Assistant Card */}
				<div
					className={`bento-card col-span-12 row-span-2 flex flex-col justify-between md:col-span-4 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '800ms' }}
				>
					<div className="flex items-start justify-between">
						<div className="icon-box icon-box-rose animate-float">
							<BotIcon className="h-6 w-6 text-white" />
						</div>
						<span className="badge badge-cyan">IA</span>
					</div>
					<div>
						<h3 className="mb-2 text-xl font-semibold text-eternam-light">Assistant empathique</h3>
						<p className="text-sm leading-relaxed text-eternam-muted">
							Une IA vous accompagne avec bienveillance dans la création de votre capsule mémorielle.
						</p>
					</div>
				</div>

				{/* QR Code Card */}
				<div
					className={`bento-card col-span-6 row-span-2 flex flex-col items-center justify-center text-center md:col-span-3 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '900ms' }}
				>
					<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-2">
						<QRIcon className="h-10 w-10 text-eternam-light" />
					</div>
					<p className="font-medium text-eternam-light">QR Code</p>
					<p className="text-xs text-eternam-muted">Plaque inox gravée</p>
				</div>

				{/* Partners Card */}
				<div
					className={`bento-card col-span-6 row-span-2 flex flex-col justify-between md:col-span-3 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '1000ms' }}
				>
					<span className="text-xs uppercase tracking-wider text-eternam-muted">Partenaires</span>
					<div className="flex -space-x-2">
						{['🏛️', '⚱️', '🕊️'].map((emoji, i) => (
							<div
								key={i}
								className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-eternam-dark bg-surface-2"
							>
								{emoji}
							</div>
						))}
					</div>
					<p className="text-sm text-eternam-muted">Services funéraires certifiés</p>
				</div>

				{/* CTA Card */}
				<div
					className={`bento-card-highlight col-span-12 row-span-2 flex items-center justify-between rounded-bento p-8 md:col-span-6 ${isLoaded ? 'animate-fade-in-up opacity-100' : 'opacity-0'
						}`}
					style={{ animationDelay: '1100ms' }}
				>
					<div>
						<h3 className="mb-2 text-2xl font-bold text-eternam-dark">Prêt à commencer ?</h3>
						<p className="text-eternam-dark/70">Créez votre première capsule mémorielle</p>
					</div>
					<button className="group flex items-center gap-2 rounded-full bg-eternam-dark px-6 py-3 font-semibold text-eternam-light transition-all hover:bg-eternam-darker">
						Démarrer
						<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</button>
				</div>

			</div>

			{/* Marquee */}
			<div className="mt-12 overflow-hidden border-y border-border-subtle py-4">
				<div className="flex animate-marquee whitespace-nowrap">
					{[...Array(2)].map((_, i) => (
						<div key={i} className="mr-8 flex items-center gap-8">
							{['Blockchain', 'Arweave', 'NFT', 'Permaweb', 'Éternité', 'Mémoire', 'Héritage', 'Web3'].map((word, j) => (
								<React.Fragment key={j}>
									<span className="text-2xl font-bold text-eternam-light/20">{word}</span>
									<span className="text-eternam-light/20">•</span>
								</React.Fragment>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}