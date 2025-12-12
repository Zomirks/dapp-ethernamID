// EternamID Landing Page - Bento Style
// Next.js + TailwindCSS + shadcn/ui inspired

"use client";

import React, { useState, useEffect } from "react";

// Arrow Icon
const ArrowRight = ({ className = "" }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

// Main Landing Page Component
export default function EternamIDLanding() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			{/* Custom CSS */}
			<style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .bento-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .bento-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .gradient-cyan {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
        }
        
        .gradient-amber {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

			{/* Navigation */}
			{/* <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-lg font-semibold">EternamID</span>
					</div>
					<div className="hidden md:flex items-center gap-8 text-sm text-white/60">
						<a href="#" className="hover:text-white transition-colors">Solution</a>
						<a href="#" className="hover:text-white transition-colors">Fonctionnalités</a>
						<a href="#" className="hover:text-white transition-colors">Tarifs</a>
						<a href="#" className="hover:text-white transition-colors">Contact</a>
					</div>
					<div className="flex items-center gap-3">
						<button className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
							Connexion
						</button>
						<button className="px-5 py-2.5 text-sm bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors">
							Lancer l'app
						</button>
					</div>
				</div>
			</nav> */}

			{/* Main Bento Grid */}
			<main className="pt-24 px-6 pb-12">
				<div className="max-w-7xl mx-auto">

					{/* Bento Grid Layout */}
					<div className="grid grid-cols-12 gap-4 auto-rows-[140px]">

						{/* Hero Card - Large */}
						<div
							className={`col-span-12 md:col-span-8 row-span-3 bento-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '100ms' }}
						>
							<div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
							<div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

							<div className="relative z-10">
								<span className="inline-block px-3 py-1 text-xs font-medium bg-white/10 rounded-full text-cyan-400 mb-6">
									Blockchain Arweave
								</span>
								<h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-4">
									<span className="text-gradient">Mémoire</span>
									<br />
									<span className="font-serif italic text-white/90">éternelle</span>
								</h1>
								<p className="text-white/50 text-lg max-w-md leading-relaxed">
									Préservez l'histoire de vos proches pour toujours sur le permaweb.
								</p>
							</div>

							<div className="relative z-10 flex items-center gap-4">
								<button className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-cyan-400 transition-all">
									Créer une capsule
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</button>
								<button className="px-6 py-3 border border-white/20 rounded-full text-white/70 hover:bg-white/5 hover:text-white transition-all">
									En savoir plus
								</button>
							</div>
						</div>

						{/* Stats Card */}
						<div
							className={`col-span-6 md:col-span-4 row-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '200ms' }}
						>
							<span className="text-xs text-white/40 uppercase tracking-wider">Marché France</span>
							<div>
								<p className="text-5xl font-bold text-gradient">650K</p>
								<p className="text-white/50 text-sm mt-1">décès par an</p>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
								<span className="text-xs text-white/40">4500+ services funéraires</span>
							</div>
						</div>

						{/* Price Card - Amber accent */}
						<div
							className={`col-span-6 md:col-span-4 row-span-1 gradient-amber rounded-3xl p-6 flex items-center justify-between transition-all duration-700 hover:scale-[1.02] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '300ms' }}
						>
							<div>
								<p className="text-black/60 text-xs font-medium uppercase tracking-wider">À partir de</p>
								<p className="text-3xl font-bold text-black">120 USDC</p>
							</div>
							<div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
								<span className="text-2xl">💎</span>
							</div>
						</div>

						{/* Feature 1 - Blockchain */}
						<div
							className={`col-span-12 md:col-span-4 row-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '400ms' }}
						>
							<div className="w-14 h-14 gradient-cyan rounded-2xl flex items-center justify-center text-2xl">
								🔗
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Stockage permanent</h3>
								<p className="text-white/50 text-sm leading-relaxed">
									Données stockées sur Arweave. Une seule transaction, une éternité de stockage.
								</p>
							</div>
						</div>

						{/* Feature 2 - Family Tree */}
						<div
							className={`col-span-12 md:col-span-4 row-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '500ms' }}
						>
							<div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl">
								🌳
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Arbre généalogique</h3>
								<p className="text-white/50 text-sm leading-relaxed">
									Génération automatique des liens familiaux. Les futures générations pourront remonter leur histoire.
								</p>
							</div>
						</div>

						{/* Feature 3 - NFT Keys */}
						<div
							className={`col-span-12 md:col-span-4 row-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '600ms' }}
						>
							<div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl">
								🔑
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">NFT-clés d'accès</h3>
								<p className="text-white/50 text-sm leading-relaxed">
									Contenu privé protégé par des NFT non-spéculatifs. Héritage numérique automatisé vers les descendants.
								</p>
							</div>
						</div>

						{/* Quote Card - Wide */}
						<div
							className={`col-span-12 md:col-span-8 row-span-2 bento-card rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '700ms' }}
						>
							<div className="absolute -right-20 -top-20 text-[200px] font-serif text-white/[0.03]">"</div>
							<blockquote className="text-2xl md:text-3xl font-serif italic text-white/80 leading-relaxed relative z-10">
								Nous mourons deux fois : notre mort physique, et quand toutes traces de nous disparaissent.
							</blockquote>
						</div>

						{/* AI Assistant Card */}
						<div
							className={`col-span-12 md:col-span-4 row-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '800ms' }}
						>
							<div className="flex items-start justify-between">
								<div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center text-2xl animate-float">
									🤖
								</div>
								<span className="px-2 py-1 text-[10px] bg-rose-500/20 text-rose-400 rounded-full font-medium">IA</span>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Assistant empathique</h3>
								<p className="text-white/50 text-sm leading-relaxed">
									Une IA vous accompagne avec bienveillance dans la création de votre capsule mémorielle.
								</p>
							</div>
						</div>

						{/* QR Code Card */}
						<div
							className={`col-span-6 md:col-span-3 row-span-2 bento-card rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '900ms' }}
						>
							<div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
								<div className="grid grid-cols-3 gap-1">
									{[...Array(9)].map((_, i) => (
										<div key={i} className={`w-3 h-3 rounded-sm ${i % 2 === 0 ? 'bg-white' : 'bg-white/30'}`} />
									))}
								</div>
							</div>
							<p className="text-sm font-medium">QR Code</p>
							<p className="text-xs text-white/40">Plaque inox gravée</p>
						</div>

						{/* Partners Card */}
						<div
							className={`col-span-6 md:col-span-3 row-span-2 bento-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '1000ms' }}
						>
							<span className="text-xs text-white/40 uppercase tracking-wider">Partenaires</span>
							<div className="flex -space-x-2">
								{['🏛️', '⚱️', '🕊️'].map((emoji, i) => (
									<div key={i} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
										{emoji}
									</div>
								))}
							</div>
							<p className="text-sm text-white/50">Services funéraires certifiés</p>
						</div>

						{/* CTA Card */}
						<div
							className={`col-span-12 md:col-span-6 row-span-2 gradient-cyan rounded-3xl p-8 flex items-center justify-between transition-all duration-700 hover:scale-[1.01] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
							style={{ transitionDelay: '1100ms' }}
						>
							<div>
								<h3 className="text-2xl font-bold text-white mb-2">Prêt à commencer ?</h3>
								<p className="text-white/70">Créez votre première capsule mémorielle</p>
							</div>
							<button className="group flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 rounded-full font-semibold hover:bg-black hover:text-white transition-all">
								Démarrer
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</button>
						</div>

					</div>

					{/* Marquee */}
					<div className="mt-12 overflow-hidden border-y border-white/10 py-4">
						<div className="flex animate-marquee whitespace-nowrap">
							{[...Array(2)].map((_, i) => (
								<div key={i} className="flex items-center gap-8 mr-8">
									{['Blockchain', 'Arweave', 'NFT', 'Permaweb', 'Éternité', 'Mémoire', 'Héritage', 'Web3'].map((word, j) => (
										<React.Fragment key={j}>
											<span className="text-2xl font-bold text-white/20">{word}</span>
											<span className="text-white/20">•</span>
										</React.Fragment>
									))}
								</div>
							))}
						</div>
					</div>

				</div>
			</main>
		</div>
	);
}