'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
    ArrowLeftIcon,
    ChevronRightIcon,
    ShieldIcon,
    Section,
    Subsection,
    WarningBox,
    InfoBox,
    PrivacyBox,
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
    { id: "article-1", title: "Article 1", subtitle: "Objet" },
    { id: "article-2", title: "Article 2", subtitle: "Responsable de traitement" },
    { id: "article-3", title: "Article 3", subtitle: "Définitions" },
    { id: "article-4", title: "Article 4", subtitle: "Données traitées" },
    { id: "article-5", title: "Article 5", subtitle: "Blockchain & Hachage" },
    { id: "article-6", title: "Article 6", subtitle: "Finalités" },
    { id: "article-7", title: "Article 7", subtitle: "Bases légales" },
    { id: "article-8", title: "Article 8", subtitle: "Destinataires" },
    { id: "article-9", title: "Article 9", subtitle: "Transferts hors UE" },
    { id: "article-10", title: "Article 10", subtitle: "Durées de conservation" },
    { id: "article-11", title: "Article 11", subtitle: "Sécurité" },
    { id: "article-12", title: "Article 12", subtitle: "Droits des utilisateurs" },
    { id: "article-13", title: "Article 13", subtitle: "Réclamation (CNIL)" },
    { id: "article-14", title: "Article 14", subtitle: "Cookies / Traceurs" },
    { id: "article-15", title: "Article 15", subtitle: "Mise à jour" },
];

export default function RGPDPage() {
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
                accentColor="purple"
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
                                    accentColor="purple"
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
                            <span className="inline-flex items-center gap-2 rounded-full border border-eternam-purple/30 bg-eternam-purple/10 px-3 py-1 text-xs font-medium text-eternam-purple">
                                <ShieldIcon className="h-3 w-3" />
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
                            <span className="text-gradient">Politique de</span>
                            <br />
                            <span className="font-serif italic text-eternam-light/90">Confidentialité</span>
                        </h1>

                        <p className="mb-4 max-w-2xl text-lg leading-relaxed text-eternam-muted">
                            Plateforme EternamID – Protection de vos données personnelles
                        </p>

                        <div className="flex items-center gap-4 text-sm text-eternam-muted/50">
                            <span>Version du [DATE]</span>
                            <span className="h-1 w-1 rounded-full bg-eternam-muted/30" />
                            <span>Conformité RGPD</span>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="space-y-0">
                        {/* Article 1 */}
                        <Section id="article-1" title="Article 1 – Objet">
                            <p>La présente Politique de confidentialité a pour objet d'informer les utilisateurs (ci-après l'« Utilisateur ») de la Plateforme « [●] » des conditions dans lesquelles leurs données à caractère personnel sont collectées, utilisées, stockées et protégées.</p>
                            <PrivacyBox>
                                <p>Cette politique est établie conformément au <strong>Règlement (UE) 2016/679 (RGPD)</strong> et à la <strong>loi Informatique et Libertés</strong>.</p>
                            </PrivacyBox>
                        </Section>

                        {/* Article 2 */}
                        <Section id="article-2" title="Article 2 – Identité du Responsable de Traitement">
                            <p>Le Responsable de traitement est :</p>
                            <InfoTable rows={[
                                { label: "Dénomination sociale", value: "[DÉNOMINATION SOCIALE]" },
                                { label: "Forme juridique", value: "[forme juridique]" },
                                { label: "RCS", value: "[●] sous le numéro [●]" },
                                { label: "Siège social", value: "[adresse complète]" },
                                { label: "E-mail", value: "[●]" },
                            ]} />
                            <p className="text-sm text-eternam-muted/60">Ci-après le « Responsable ».</p>
                            <div className="mt-6 rounded-xl border border-eternam-purple/20 bg-eternam-purple/10 p-4">
                                <p className="text-sm text-eternam-purple/80">
                                    <strong>Contact RGPD / DPO (si applicable) :</strong> [Nom / Email]
                                    <br />
                                    <strong>À défaut :</strong> rgpd@domaine.fr
                                </p>
                            </div>
                        </Section>

                        {/* Article 3 */}
                        <Section id="article-3" title="Article 3 – Définitions">
                            <div className="space-y-4">
                                <DefinitionCard term="Donnée personnelle" definition="Toute information se rapportant à une personne physique identifiée ou identifiable." accentColor="purple" />
                                <DefinitionCard term="Traitement" definition="Toute opération effectuée sur des données personnelles (collecte, conservation, etc.)." accentColor="purple" />
                                <DefinitionCard term="Sous-traitant" definition="Prestataire traitant des données pour le compte du Responsable (hébergeur, support, etc.)." accentColor="purple" />
                                <DefinitionCard term="Wallet" definition="Portefeuille numérique permettant de détenir des crypto-actifs et NFT." accentColor="purple" />
                                <DefinitionCard term="Blockchain" definition="Registre distribué décentralisé sur lequel sont inscrites des transactions et des NFT." accentColor="purple" />
                                <DefinitionCard term="Hachage (SHA-256)" definition="Fonction cryptographique à sens unique transformant une donnée en empreinte ('hash')." accentColor="purple" />
                            </div>
                        </Section>

                        {/* Article 4 */}
                        <Section id="article-4" title="Article 4 – Données Traitées">
                            <Subsection title="4.1 Données d'identification et de contact (si collectées)">
                                <ul className="mt-3 space-y-2">
                                    <ListItem accentColor="purple">Nom, prénom</ListItem>
                                    <ListItem accentColor="purple">Adresse e-mail, téléphone</ListItem>
                                    <ListItem accentColor="purple">Identifiants nécessaires à la gestion de la relation (ID client, tickets support)</ListItem>
                                </ul>
                            </Subsection>

                            <Subsection title="4.2 Données liées au wallet et à la blockchain">
                                <ul className="mt-3 space-y-2">
                                    <ListItem accentColor="purple">Adresse(s) publique(s) de wallet</ListItem>
                                    <ListItem accentColor="purple">Identifiants de transactions (hash de transaction), token ID, smart contract, réseau blockchain utilisé</ListItem>
                                    <ListItem accentColor="purple">Éléments techniques nécessaires à la preuve et à la délivrance du service</ListItem>
                                </ul>
                            </Subsection>

                            <Subsection title="4.3 Données techniques de navigation et de sécurité">
                                <ul className="mt-3 space-y-2">
                                    <ListItem accentColor="purple">Adresse IP, logs, informations navigateur/terminal</ListItem>
                                    <ListItem accentColor="purple">Données de sécurité (détection d'incidents, anti-fraude), dans la limite nécessaire</ListItem>
                                </ul>
                            </Subsection>

                            <Subsection title="4.4 Contenus hébergés (Web2)">
                                <ul className="mt-3 space-y-2">
                                    <ListItem accentColor="purple">Photos, vidéos et fichiers associés au Service Numérique</ListItem>
                                    <ListItem accentColor="purple">Métadonnées (date d'envoi, taille, format)</ListItem>
                                </ul>
                                <InfoBox>
                                    Ces contenus sont stockés sur une infrastructure Web2 (hébergement web), et non directement sur la blockchain.
                                </InfoBox>
                            </Subsection>
                        </Section>

                        {/* Article 5 */}
                        <Section id="article-5" title="Article 5 – Données sur Blockchain & Hachage SHA-256">
                            <Subsection title="5.1 Absence d'inscription de données personnelles en clair">
                                <p>Le responsable s'efforce de ne jamais inscrire de données personnelles en clair sur la blockchain.</p>
                            </Subsection>

                            <Subsection title="5.2 Hachage SHA-256">
                                <p>Certaines informations susceptibles d'être liées à l'Utilisateur peuvent être hachées en SHA-256 avant d'être associées à un NFT et/ou inscrites on-chain, afin d'éviter l'inscription d'informations personnelles lisibles.</p>
                                <WarningBox>
                                    <p>L'Utilisateur est informé que le hachage constitue en principe une <strong>pseudonymisation</strong> (et pas nécessairement une anonymisation) : une donnée hachée peut rester une donnée personnelle si elle peut être rattachée à une personne via des informations complémentaires.</p>
                                </WarningBox>
                            </Subsection>

                            <Subsection title="5.3 Immutabilité de la blockchain">
                                <DangerBox>
                                    <strong>⚠️ Important :</strong> Les informations inscrites sur une blockchain publique sont durables et difficilement modifiables/supprimables. Le Responsable ne peut donc pas garantir l'effacement ou la modification d'éléments déjà inscrits on-chain.
                                </DangerBox>
                            </Subsection>
                        </Section>

                        {/* Article 6 */}
                        <Section id="article-6" title="Article 6 – Finalités des Traitements">
                            <p>Les données sont traitées pour les finalités suivantes :</p>
                            <div className="my-6 space-y-3">
                                <NumberedStep number={1} accentColor="purple">
                                    <span className="font-medium text-eternam-light/90">Fourniture du Service</span>
                                    <span className="mt-1 block text-sm text-eternam-muted/60">Permettre le mint, attribuer le NFT, donner accès au Service Numérique, gérer l'accès token-gated</span>
                                </NumberedStep>
                                <NumberedStep number={2} accentColor="purple">
                                    <span className="font-medium text-eternam-light/90">Gestion de la relation client</span>
                                    <span className="mt-1 block text-sm text-eternam-muted/60">Support, assistance, demandes, réclamations</span>
                                </NumberedStep>
                                <NumberedStep number={3} accentColor="purple">
                                    <span className="font-medium text-eternam-light/90">Sécurité</span>
                                    <span className="mt-1 block text-sm text-eternam-muted/60">Prévention fraude, sécurisation des accès, maintenance, preuve technique</span>
                                </NumberedStep>
                                <NumberedStep number={4} accentColor="purple">
                                    <span className="font-medium text-eternam-light/90">Obligations légales</span>
                                    <span className="mt-1 block text-sm text-eternam-muted/60">Comptabilité, facturation, gestion des litiges et obligations réglementaires</span>
                                </NumberedStep>
                                <NumberedStep number={5} accentColor="purple">
                                    <span className="font-medium text-eternam-light/90">Communication (si applicable)</span>
                                    <span className="mt-1 block text-sm text-eternam-muted/60">Informations relatives au Service, newsletters/offres (selon consentement requis)</span>
                                </NumberedStep>
                            </div>
                        </Section>

                        {/* Article 7 */}
                        <Section id="article-7" title="Article 7 – Bases Légales (RGPD)">
                            <p>Les traitements reposent sur :</p>
                            <div className="my-6 space-y-4">
                                <DefinitionCard term="L'exécution du contrat (CGV)" definition="Mint et fourniture du Service" accentColor="purple" />
                                <DefinitionCard term="L'intérêt légitime" definition="Sécurité, prévention fraude, amélioration et continuité du Service" accentColor="purple" />
                                <DefinitionCard term="Les obligations légales" definition="Conservation des pièces comptables, gestion des litiges" accentColor="purple" />
                                <DefinitionCard term="Le consentement" definition="Lorsque requis (ex. prospection électronique, cookies non essentiels)" accentColor="purple" />
                            </div>
                        </Section>

                        {/* Article 8 */}
                        <Section id="article-8" title="Article 8 – Destinataires des Données">
                            <p>Les données peuvent être communiquées :</p>
                            <ul className="mt-4 space-y-2">
                                <ListItem accentColor="purple">aux personnels habilités du Responsable</ListItem>
                                <ListItem accentColor="purple">à des sous-traitants (hébergeur, prestataire support, outils techniques), strictement pour les besoins du Service</ListItem>
                                <ListItem accentColor="purple">aux autorités compétentes lorsque la loi l'exige</ListItem>
                            </ul>
                            <PrivacyBox>
                                Les sous-traitants sont soumis à des obligations contractuelles de confidentialité et de sécurité.
                            </PrivacyBox>
                        </Section>

                        {/* Article 9 */}
                        <Section id="article-9" title="Article 9 – Transferts Hors Union Européenne">
                            <p>Les données sont, par principe, hébergées et traitées dans l'Union européenne.</p>
                            <p className="mt-4">Si un transfert hors UE/EEE est nécessaire, il est encadré par des garanties appropriées (ex. clauses contractuelles types de la Commission européenne) et l'Utilisateur en est informé.</p>
                            <div className="mt-6 rounded-xl border border-border-subtle bg-surface-1 p-4">
                                <p className="text-sm italic text-eternam-muted/60">
                                    (À compléter selon vos prestataires : [hébergeur], [pays], [base de transfert].)
                                </p>
                            </div>
                        </Section>

                        {/* Article 10 */}
                        <Section id="article-10" title="Article 10 – Durées de Conservation">
                            <p>Sauf obligation légale ou nécessité particulière :</p>
                            <div className="my-6 rounded-2xl border border-border-subtle bg-surface-1 p-6">
                                <div className="grid gap-4 text-sm">
                                    <div className="flex items-start justify-between border-b border-border-subtle pb-3">
                                        <span className="text-eternam-muted/80">Données de relation client</span>
                                        <span className="text-right font-medium text-eternam-light/80">Durée de la relation + [X] ans</span>
                                    </div>
                                    <div className="flex items-start justify-between border-b border-border-subtle pb-3">
                                        <span className="text-eternam-muted/80">Données de facturation/comptabilité</span>
                                        <span className="text-right font-medium text-eternam-light/80">10 ans (obligation légale)</span>
                                    </div>
                                    <div className="flex items-start justify-between border-b border-border-subtle pb-3">
                                        <span className="text-eternam-muted/80">Logs techniques/sécurité</span>
                                        <span className="text-right font-medium text-eternam-light/80">[6 à 12 mois]</span>
                                    </div>
                                    <div className="flex items-start justify-between border-b border-border-subtle pb-3">
                                        <span className="text-eternam-muted/80">Contenus (photos/vidéos)</span>
                                        <span className="text-right font-medium text-eternam-light/80">Durée d'accès au Service + [X] mois</span>
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <span className="text-eternam-muted/80">Données on-chain</span>
                                        <span className="text-right font-medium text-eternam-amber/80">Durée non maîtrisable</span>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Article 11 */}
                        <Section id="article-11" title="Article 11 – Sécurité">
                            <p>Le Responsable met en œuvre des mesures techniques et organisationnelles adaptées, incluant notamment :</p>
                            <ul className="mt-4 space-y-2">
                                <ListItem accentColor="purple">Contrôle des accès, habilitations</ListItem>
                                <ListItem accentColor="purple">Chiffrement des communications (TLS/HTTPS)</ListItem>
                                <ListItem accentColor="purple">Sécurisation des environnements, sauvegardes</ListItem>
                                <ListItem accentColor="purple">Pseudonymisation/hachage SHA-256 lorsque pertinent</ListItem>
                                <ListItem accentColor="purple">Procédures de gestion d'incidents</ListItem>
                            </ul>
                            <WarningBox>
                                <p><strong>Responsabilité de l'Utilisateur :</strong> L'Utilisateur est responsable de la sécurité de son Wallet et de ses clés privées. Le Responsable ne demande jamais les clés privées.</p>
                            </WarningBox>
                        </Section>

                        {/* Article 12 */}
                        <Section id="article-12" title="Article 12 – Droits des Utilisateurs">
                            <p>Conformément au RGPD, l'Utilisateur dispose des droits suivants :</p>
                            <div className="my-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                                {[
                                    { title: "Accès", desc: "Obtenir une copie de vos données" },
                                    { title: "Rectification", desc: "Corriger des données inexactes" },
                                    { title: "Effacement", desc: "Demander la suppression" },
                                    { title: "Limitation", desc: "Restreindre le traitement" },
                                    { title: "Opposition", desc: "S'opposer au traitement" },
                                    { title: "Portabilité", desc: "Récupérer vos données" },
                                    { title: "Retrait du consentement", desc: "À tout moment" },
                                    { title: "Directives post-mortem", desc: "Droit français" },
                                ].map((right, index) => (
                                    <div key={index} className="rounded-xl border border-border-subtle bg-surface-1 p-4">
                                        <h4 className="text-sm font-semibold text-eternam-purple">{right.title}</h4>
                                        <p className="mt-1 text-xs text-eternam-muted/60">{right.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4">Pour exercer ses droits : <span className="text-eternam-purple">[email RGPD]</span>, en précisant l'objet de la demande et en justifiant de son identité.</p>

                            <Subsection title="Limite spécifique : blockchain">
                                <InfoBox>
                                    Le Responsable peut agir sur les données off-chain qu'il contrôle (hébergement Web2, base interne), mais <strong>ne peut pas supprimer/modifier</strong> une transaction ou un identifiant déjà inscrit sur une blockchain publique. Il pourra toutefois supprimer les données associées off-chain et rompre les liens d'association sous son contrôle.
                                </InfoBox>
                            </Subsection>
                        </Section>

                        {/* Article 13 */}
                        <Section id="article-13" title="Article 13 – Réclamation (CNIL)">
                            <p>L'Utilisateur peut introduire une réclamation auprès de la CNIL s'il estime que ses droits ne sont pas respectés.</p>
                            <div className="mt-6 rounded-2xl border border-border-subtle bg-surface-1 p-6">
                                <p className="text-sm text-eternam-muted">
                                    <strong className="text-eternam-light">Commission Nationale de l'Informatique et des Libertés</strong>
                                    <br />
                                    <span className="text-eternam-muted/60">Site web : www.cnil.fr</span>
                                </p>
                            </div>
                        </Section>

                        {/* Article 14 */}
                        <Section id="article-14" title="Article 14 – Cookies / Traceurs (si applicable)">
                            <p>La plateforme peut utiliser des cookies/traceurs. Lorsque requis, le consentement est recueilli via un bandeau de gestion des cookies.</p>
                            <div className="mt-6 rounded-xl border border-eternam-purple/20 bg-eternam-purple/10 p-4">
                                <p className="text-sm text-eternam-purple/80">
                                    <strong>Politique cookies :</strong> La politique cookies est accessible à l'adresse : [lien]
                                </p>
                            </div>
                        </Section>

                        {/* Article 15 */}
                        <Section id="article-15" title="Article 15 – Mise à Jour">
                            <p>La présente Politique peut évoluer. La version applicable est celle publiée à la date de consultation, et/ou celle acceptée lors du mint si elle est intégrée aux CGV.</p>
                            <div className="mt-8 rounded-3xl border border-eternam-purple/20 bg-gradient-to-br from-eternam-purple/10 to-eternam-purple/5 p-8">
                                <p className="text-lg leading-relaxed text-eternam-light/80">
                                    En utilisant la Plateforme, l'Utilisateur reconnaît avoir pris connaissance de la présente Politique de confidentialité.
                                </p>
                            </div>
                        </Section>
                    </div>

                    {/* Footer CTA */}
                    <CTAFooter
                        title="Une question sur vos données ?"
                        subtitle="Contactez notre équipe RGPD"
                        buttonText="Nous contacter"
                        href="mailto:rgpd@eternamid.com"
                        accentColor="purple"
                    />
                </main>
            </div>
        </div>
    );
}