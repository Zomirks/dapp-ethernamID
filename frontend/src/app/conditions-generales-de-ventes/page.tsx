'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
	ArrowLeftIcon,
	ChevronRightIcon,
	FileTextIcon,
	Section,
	Subsection,
	WarningBox,
	InfoBox,
	DangerBox,
	TableOfContents,
	MobileToc,
	InfoTable,
	NumberedStep,
	DefinitionCard,
	ListItem,
	CTAFooter,
	TocItem,
} from "@/components/shared/LegalComponents";

// Table of Contents Data
const tocItems: TocItem[] = [
	{ id: "article-1", title: "Article 1", subtitle: "Identification du vendeur" },
	{ id: "article-2", title: "Article 2", subtitle: "Objet" },
	{ id: "article-3", title: "Article 3", subtitle: "Définitions" },
	{ id: "article-4", title: "Article 4", subtitle: "Champ d'application" },
	{ id: "article-5", title: "Article 5", subtitle: "Description du NFT" },
	{ id: "article-6", title: "Article 6", subtitle: "Prix" },
	{ id: "article-7", title: "Article 7", subtitle: "Processus de mint" },
	{ id: "article-8", title: "Article 8", subtitle: "Fourniture immédiate" },
	{ id: "article-9", title: "Article 9", subtitle: "Droit de rétractation" },
	{ id: "article-10", title: "Article 10", subtitle: "Absence de remboursement" },
	{ id: "article-11", title: "Article 11", subtitle: "Disponibilité du service" },
	{ id: "article-12", title: "Article 12", subtitle: "Obligations du client" },
	{ id: "article-13", title: "Article 13", subtitle: "Responsabilité" },
	{ id: "article-14", title: "Article 14", subtitle: "Propriété intellectuelle" },
	{ id: "article-15", title: "Article 15", subtitle: "Données personnelles" },
	{ id: "article-16", title: "Article 16", subtitle: "Transmission du NFT" },
	{ id: "article-17", title: "Article 17", subtitle: "Preuve & archivage" },
	{ id: "article-18", title: "Article 18", subtitle: "Modification des CGV" },
	{ id: "article-19", title: "Article 19", subtitle: "Nullité partielle" },
	{ id: "article-20", title: "Article 20", subtitle: "Droit applicable" },
	{ id: "article-21", title: "Article 21", subtitle: "Acceptation" },
];

export default function CGVPage() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [activeSection, setActiveSection] = useState("article-1");
	const [isTocOpen, setIsTocOpen] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	// Track active section on scroll
	useEffect(() => {
		const observerOptions = {
			rootMargin: "-20% 0px -60% 0px",
			threshold: 0
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveSection(entry.target.id);
				}
			});
		}, observerOptions);

		const timeoutId = setTimeout(() => {
			tocItems.forEach((item) => {
				const element = document.getElementById(item.id);
				if (element) observer.observe(element);
			});
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			observer.disconnect();
		};
	}, [isLoaded]);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="min-h-screen">
			{/* Mobile TOC */}
			<MobileToc
				isOpen={isTocOpen}
				onClose={() => setIsTocOpen(false)}
				items={tocItems}
				activeSection={activeSection}
				onSectionClick={scrollToSection}
				accentColor="cyan"
			/>

			{/* Main Layout */}
			<div className="flex gap-12">
				{/* Sidebar TOC - Desktop */}
				<aside className="hidden w-72 shrink-0 lg:block">
					<div className="sticky top-8">
						<div className="bento-card">
							<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-eternam-muted/50">
								Sommaire
							</h3>
							<div className="scrollbar-thin max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
								<TableOfContents
									items={tocItems}
									activeSection={activeSection}
									onSectionClick={scrollToSection}
									accentColor="cyan"
								/>
							</div>
						</div>
					</div>
				</aside>

				{/* Main Content */}
				<main className={`max-w-4xl flex-1 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
					{/* Header */}
					<header className="mb-16">
						<Link
							href="/"
							className="group mb-8 inline-flex items-center gap-2 text-eternam-muted transition-colors hover:text-eternam-light"
						>
							<ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
							<span className="text-sm">Retour à l'accueil</span>
						</Link>

						<div className="mb-6 flex items-center justify-between gap-4">
							<span className="badge badge-cyan">
								<FileTextIcon className="mr-1.5 h-3 w-3" />
								Document juridique
							</span>
							<button
								onClick={() => setIsTocOpen(!isTocOpen)}
								className="btn-secondary flex items-center gap-2 text-sm lg:hidden"
							>
								<span>Sommaire</span>
								<ChevronRightIcon className="h-4 w-4" />
							</button>
						</div>

						<h1 className="mb-6 text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
							<span className="text-gradient">Conditions Générales</span>
							<br />
							<span className="font-serif italic text-eternam-light/90">de Vente</span>
						</h1>

						<p className="mb-4 max-w-2xl text-lg leading-relaxed text-eternam-muted">
							Relatives au mint de NFT – Plateforme EternamID
						</p>

						<div className="flex items-center gap-4 text-sm text-eternam-muted/50">
							<span>Version du [DATE]</span>
							<span className="h-1 w-1 rounded-full bg-eternam-muted/30" />
							<span>Dernière mise à jour</span>
						</div>
					</header>

					{/* Content */}
					<div className="space-y-0">
						{/* Article 1 */}
						<Section id="article-1" title="Article 1 – Identification du vendeur">
							<p>Les présentes Conditions Générales de Vente (ci-après les « CGV ») sont proposées par :</p>
							<InfoTable rows={[
								{ label: "Dénomination sociale", value: "[DÉNOMINATION SOCIALE]" },
								{ label: "Forme juridique", value: "[forme juridique]" },
								{ label: "Capital", value: "[●] € (le cas échéant)" },
								{ label: "RCS", value: "[●] sous le numéro [●]" },
								{ label: "Siège social", value: "[adresse complète]" },
								{ label: "Contact", value: "[●]" },
							]} />
							<p className="text-sm text-eternam-muted/60">Ci-après le « Vendeur » et/ou la « Plateforme ».</p>
						</Section>

						{/* Article 2 */}
						<Section id="article-2" title="Article 2 – Objet">
							<p>Les CGV ont pour objet de définir les conditions dans lesquelles le Vendeur propose au Client :</p>
							<div className="my-6 space-y-3">
								<NumberedStep number={1}>
									Le mint (émission) de jetons non fongibles (« NFT ») sur une blockchain déterminée
								</NumberedStep>
								<NumberedStep number={2}>
									L'accès à un service numérique (espace, capsule, fonctionnalités, contenus, avantages digitaux) décrit sur la page de mint
								</NumberedStep>
								<NumberedStep number={3}>
									Les droits et obligations des parties
								</NumberedStep>
							</div>
							<p>Les CGV régissent exclusivement les opérations de mint réalisées via la Plateforme.</p>
						</Section>

						{/* Article 3 */}
						<Section id="article-3" title="Article 3 – Définitions">
							<div className="space-y-4">
								<DefinitionCard term="NFT" definition="Jeton numérique non fongible émis sur une blockchain, identifié par un identifiant unique (token ID), associé à des métadonnées." />
								<DefinitionCard term="Mint" definition="Opération technique consistant à créer et inscrire un NFT sur la blockchain via un smart contract." />
								<DefinitionCard term="Client" definition="Personne physique majeure agissant en qualité de consommateur (au sens du droit applicable)." />
								<DefinitionCard term="Service Numérique" definition="Fonctionnalités, interface, espace, contenus, accès ou avantages activés par la détention du NFT." />
								<DefinitionCard term="Wallet" definition="Portefeuille numérique (logiciel/extension/appareil) permettant de détenir et gérer des crypto-actifs et NFT." />
								<DefinitionCard term="Blockchain" definition="Registre distribué et décentralisé permettant l'émission et la traçabilité des transactions." />
							</div>
						</Section>

						{/* Article 4 */}
						<Section id="article-4" title="Article 4 – Champ d'application – Acceptation">
							<Subsection title="4.1 Application">
								<p>Les CGV s'appliquent à toute opération de mint sur la Plateforme.</p>
							</Subsection>
							<Subsection title="4.2 Prévalence">
								<p>Elles prévalent sur tout autre document, sauf conditions particulières acceptées par écrit.</p>
							</Subsection>
							<Subsection title="4.3 Déclarations du Client">
								<p>Le Client déclare :</p>
								<ul className="mt-3 space-y-2">
									<ListItem>être majeur et avoir la capacité juridique de contracter</ListItem>
									<ListItem>disposer d'un Wallet compatible et en maîtriser l'usage</ListItem>
									<ListItem>accepter le fonctionnement irréversible des transactions blockchain</ListItem>
								</ul>
							</Subsection>
						</Section>

						{/* Article 5 */}
						<Section id="article-5" title="Article 5 – Description du NFT et du service associé">
							<Subsection title="5.1 Nature et portée">
								<p>Le NFT proposé :</p>
								<ul className="mt-3 space-y-2">
									<ListItem>est émis sur la blockchain [Ethereum / Polygon / autre : ●] via le smart contract [adresse : ●] (si connu/figeable)</ListItem>
									<ListItem>constitue un droit d'accès numérique au Service décrit sur la page de mint [URL/slug]</ListItem>
								</ul>

								<WarningBox>
									<p className="mb-2 font-semibold">Le NFT ne constitue pas :</p>
									<ul className="space-y-1 text-eternam-amber/60">
										<li>• un instrument financier, produit d'investissement, titre, ni promesse de rendement</li>
										<li>• une garantie de valeur, de liquidité, ou de revente</li>
										<li>• une cession automatique de droits de propriété intellectuelle</li>
									</ul>
								</WarningBox>
							</Subsection>

							<Subsection title="5.2 Édition unique / multiple">
								<p>Le NFT peut être émis en exemplaire unique ou en édition multiple (supply totale annoncée avant mint : [●]).</p>
								<p className="mt-2">Chaque NFT dispose d'un identifiant distinct. Sauf mention contraire, les droits d'accès sont identiques.</p>
							</Subsection>

							<Subsection title="5.3 Service Numérique – conditions d'accès">
								<p>L'accès au Service Numérique est conditionné :</p>
								<ul className="mt-3 space-y-2">
									<ListItem>à la détention du NFT dans le Wallet du Client</ListItem>
									<ListItem>au respect des CGV et des règles d'usage du Service</ListItem>
									<ListItem>à la disponibilité technique raisonnable du Service (voir art. 11)</ListItem>
								</ul>
								<p className="mt-4">Le Vendeur peut mettre en place un mécanisme de vérification ("token-gating") pour contrôler la détention du NFT.</p>
							</Subsection>

							<Subsection title="5.4 Contenus &quot;on-chain&quot; / &quot;off-chain&quot;">
								<InfoBox>
									Le Client est informé que certaines données peuvent être inscrites sur la blockchain (publiques et difficilement supprimables), tandis que d'autres contenus peuvent être hébergés hors chaîne (serveurs/stockage tiers), ce qui peut impacter leur disponibilité.
								</InfoBox>
							</Subsection>
						</Section>

						{/* Article 6 */}
						<Section id="article-6" title="Article 6 – Prix">
							<Subsection title="6.1 Prix du mint">
								<p>Le prix est indiqué avant validation :</p>
								<ul className="mt-3 space-y-2">
									<ListItem>en euros TTC et/ou en crypto-actifs [préciser]</ListItem>
									<ListItem>hors frais de transaction blockchain ("gas fees"), à la charge du Client, variables et indépendants du Vendeur</ListItem>
								</ul>
							</Subsection>
							<Subsection title="6.2 Modification des prix">
								<p>Le Vendeur peut modifier ses prix à tout moment. Le prix applicable est celui affiché au moment de la validation du mint.</p>
							</Subsection>
						</Section>

						{/* Article 7 */}
						<Section id="article-7" title="Article 7 – Processus de mint – Conclusion du contrat">
							<p>Le mint s'effectue selon les étapes suivantes :</p>
							<div className="relative my-6">
								<div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-eternam-cyan/50 via-eternam-cyan/20 to-transparent" />
								<div className="space-y-4">
									{[
										"Consultation de la page de présentation du NFT",
										"Affichage des informations essentielles (prix, supply, droits, exclusions, rétractation)",
										"Acceptation expresse des CGV",
										"Connexion du Wallet",
										"Validation de la transaction (et, le cas échéant, paiement)",
										"Émission et attribution du NFT au Wallet du Client",
										"Accès au Service Numérique"
									].map((step, index) => (
										<div key={index} className="flex items-start gap-4 pl-1">
											<div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-eternam-cyan to-eternam-cyan-muted text-xs font-bold text-eternam-dark">
												{index + 1}
											</div>
											<p className="pt-1 text-eternam-muted">{step}</p>
										</div>
									))}
								</div>
							</div>
							<InfoBox>
								La confirmation on-chain (transaction validée) vaut conclusion définitive du contrat.
							</InfoBox>
						</Section>

						{/* Article 8 */}
						<Section id="article-8" title="Article 8 – Fourniture immédiate du contenu numérique">
							<p>Le Service Numérique est fourni immédiatement après le mint, sous réserve des délais/confirmations de la blockchain et des contraintes techniques.</p>
						</Section>

						{/* Article 9 */}
						<Section id="article-9" title="Article 9 – Droit de rétractation">
							<Subsection title="9.1 Principe">
								<p>Le droit de rétractation peut s'appliquer aux contrats conclus à distance selon la réglementation applicable.</p>
							</Subsection>
							<Subsection title="9.2 Exclusion (contenu numérique sans support matériel)">
								<WarningBox>
									<p>Le Client est informé que le droit de rétractation <strong>ne s'applique pas</strong> lorsque :</p>
									<ul className="mt-2 space-y-1 text-eternam-amber/60">
										<li>• l'exécution a commencé immédiatement après la conclusion du contrat</li>
										<li>• le Client a donné son accord exprès</li>
										<li>• et a reconnu perdre son droit de rétractation</li>
									</ul>
								</WarningBox>
							</Subsection>
							<Subsection title="9.3 Consentement exprès">
								<p>Avant le mint, le Client demande l'exécution immédiate et reconnaît renoncer à son droit de rétractation.</p>
								<DangerBox>
									<strong>➡️ Aucun remboursement ne pourra être exigé après mint</strong> (voir art. 10), sauf obligation légale impérative.
								</DangerBox>
							</Subsection>
						</Section>

						{/* Article 10 */}
						<Section id="article-10" title="Article 10 – Absence de remboursement / Irréversibilité">
							<p>Le Client reconnaît que :</p>
							<ul className="mt-4 space-y-2">
								<ListItem accentColor="rose">les transactions blockchain sont irréversibles</ListItem>
								<ListItem accentColor="rose">le NFT peut être transféré/échangé sans intervention du Vendeur</ListItem>
								<ListItem accentColor="rose">en conséquence, aucune annulation ni remboursement ne pourra être effectué après validation, sauf obligation légale impérative ou faute prouvée du Vendeur</ListItem>
							</ul>
						</Section>

						{/* Article 11 */}
						<Section id="article-11" title="Article 11 – Disponibilité, maintenance, évolutions du service">
							<Subsection title="11.1">
								<p>Le Vendeur met en œuvre des moyens raisonnables pour assurer l'accès au Service.</p>
							</Subsection>
							<Subsection title="11.2">
								<p>Des interruptions temporaires peuvent survenir (maintenance, incidents, mises à jour, dépendances tierces).</p>
							</Subsection>
							<Subsection title="11.3">
								<p>Le Vendeur peut faire évoluer le Service (améliorations, correctifs, sécurité). En cas de modification substantielle, le Vendeur informera le Client par tout moyen utile [modalité].</p>
							</Subsection>
						</Section>

						{/* Article 12 */}
						<Section id="article-12" title="Article 12 – Obligations du client – Usages interdits">
							<p>Le Client s'engage à :</p>
							<ul className="mt-4 space-y-2">
								<ListItem>conserver la sécurité de ses identifiants et clés privées</ListItem>
								<ListItem>ne pas utiliser le Service à des fins illicites, frauduleuses, diffamatoires, ou portant atteinte aux droits de tiers</ListItem>
								<ListItem>ne pas tenter de contourner les mécanismes de contrôle d'accès (token-gating), ni d'attaquer la Plateforme</ListItem>
							</ul>
							<WarningBox>
								En cas de violation grave, le Vendeur pourra suspendre l'accès au Service, sans préjudice d'éventuelles actions.
							</WarningBox>
						</Section>

						{/* Article 13 */}
						<Section id="article-13" title="Article 13 – Responsabilité">
							<Subsection title="13.1 Éléments hors contrôle">
								<p>Le Vendeur n'est pas responsable notamment :</p>
								<ul className="mt-3 space-y-2">
									<ListItem accentColor="muted">des dysfonctionnements, congestions, forks, ou évolutions de la blockchain</ListItem>
									<ListItem accentColor="muted">des pertes de clés privées, erreurs d'adresse, erreurs de Wallet, phishing, malwares</ListItem>
									<ListItem accentColor="muted">des frais de gas</ListItem>
									<ListItem accentColor="muted">des marketplaces ou services tiers (OpenSea, etc.) et de leurs conditions</ListItem>
								</ul>
							</Subsection>
							<Subsection title="13.2 Absence de garantie de valeur">
								<p>Le Vendeur ne garantit ni la valeur, ni la liquidité, ni la possibilité de revente du NFT.</p>
							</Subsection>
							<Subsection title="13.3 Limitation">
								<p>Dans les limites autorisées par la loi, la responsabilité du Vendeur est limitée au montant payé pour le mint concerné (hors gas fees) et exclut les dommages indirects (perte de chance, perte de profit, etc.).</p>
							</Subsection>
						</Section>

						{/* Article 14 */}
						<Section id="article-14" title="Article 14 – Propriété intellectuelle">
							<Subsection title="14.1">
								<p>Le mint n'emporte aucune cession automatique de droits de propriété intellectuelle.</p>
							</Subsection>
							<Subsection title="14.2">
								<p>Sauf mention contraire, le Client bénéficie uniquement d'un droit :</p>
								<ul className="mt-3 space-y-2">
									<ListItem>personnel, non exclusif, non transférable (hors revente du NFT)</ListItem>
									<ListItem>et non commercial</ListItem>
								</ul>
								<p className="mt-4">sur les contenus accessibles via le Service. Toute exploitation commerciale nécessite une autorisation écrite du Vendeur ou des ayants droit.</p>
							</Subsection>
						</Section>

						{/* Article 15 */}
						<Section id="article-15" title="Article 15 – Données personnelles">
							<p>Les données personnelles sont traitées conformément au RGPD et à la politique de confidentialité accessible sur la Plateforme : [lien].</p>
							<InfoBox>
								Le Client est informé que certaines données/transactions peuvent être publiques sur la blockchain, ce qui limite techniquement leur suppression.
							</InfoBox>
						</Section>

						{/* Article 16 */}
						<Section id="article-16" title="Article 16 – Transmission / Revente du NFT">
							<Subsection title="16.1">
								<p>La revente/transmission du NFT peut être possible si techniquement permise par le smart contract et/ou la blockchain.</p>
							</Subsection>
							<Subsection title="16.2">
								<p>En cas de transfert du NFT hors du Wallet du Client, le Client peut perdre l'accès au Service.</p>
							</Subsection>
							<Subsection title="16.3">
								<p>Le Vendeur n'assure aucune garantie sur les marchés secondaires (prix, fraude, liquidité).</p>
							</Subsection>
							<Subsection title="16.4 (Option royalties)">
								<p>Le smart contract peut prévoir des royalties sur revente : [●% / modalités].</p>
							</Subsection>
						</Section>

						{/* Article 17 */}
						<Section id="article-17" title="Article 17 – Preuve – Archivage">
							<p>Les enregistrements informatiques de la Plateforme et les données publiques de la blockchain feront foi, sauf preuve contraire, des transactions et échanges intervenus.</p>
						</Section>

						{/* Article 18 */}
						<Section id="article-18" title="Article 18 – Modification des CGV">
							<p>Le Vendeur peut modifier les CGV. Les CGV applicables sont celles acceptées au moment du mint.</p>
							<p className="mt-4">Pour l'accès au Service (dans la durée), les nouvelles versions pourront s'appliquer si elles sont nécessaires pour des raisons légales/sécurité/évolution et portées à la connaissance du Client.</p>
						</Section>

						{/* Article 19 */}
						<Section id="article-19" title="Article 19 – Nullité partielle">
							<p>Si une clause est déclarée nulle, les autres dispositions demeurent applicables.</p>
						</Section>

						{/* Article 20 */}
						<Section id="article-20" title="Article 20 – Droit applicable – Règlement des litiges">
							<p>Les CGV sont soumises au droit français.</p>
							<p className="mt-4">En cas de litige :</p>
							<ul className="mt-3 space-y-2">
								<ListItem>tentative de règlement amiable (contact : [email litiges])</ListItem>
								<ListItem>[si applicable] médiation de la consommation : [nom + coordonnées du médiateur]</ListItem>
								<ListItem>à défaut, tribunaux compétents [préciser]</ListItem>
							</ul>
						</Section>

						{/* Article 21 */}
						<Section id="article-21" title="Article 21 – Acceptation">
							<div className="rounded-3xl border border-eternam-cyan/20 bg-gradient-to-br from-eternam-cyan/10 to-eternam-cyan/5 p-8">
								<p className="text-lg leading-relaxed text-eternam-light/80">
									Le Client reconnaît avoir lu, compris et accepté sans réserve les présentes Conditions Générales de Vente avant tout mint.
								</p>
							</div>
						</Section>
					</div>

					{/* Footer CTA */}
					<CTAFooter
						title="Des questions ?"
						subtitle="Notre équipe est là pour vous accompagner"
						buttonText="Nous contacter"
						href="mailto:contact@eternamid.com"
						accentColor="cyan"
					/>
				</main>
			</div>
		</div>
	);
}