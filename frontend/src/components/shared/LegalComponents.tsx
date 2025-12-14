'use client';

import React from "react";

// Icons
export const ArrowLeftIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ChevronRightIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ShieldIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const FileTextIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface SectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
}

export const Section = ({ id, title, children }: SectionProps) => (
    <section id={id} className="mb-16 scroll-mt-8">
        <h2 className="text-gradient mb-6 text-2xl font-bold md:text-3xl">{title}</h2>
        <div className="space-y-4 leading-relaxed text-eternam-muted">{children}</div>
    </section>
);

interface SubsectionProps {
    title: string;
    children: React.ReactNode;
}

export const Subsection = ({ title, children }: SubsectionProps) => (
    <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold text-eternam-light/90">{title}</h3>
        <div className="space-y-3 leading-relaxed text-eternam-muted/80">{children}</div>
    </div>
);

export const WarningBox = ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-2xl border border-eternam-amber/20 bg-eternam-amber/10 p-5">
        <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="text-sm leading-relaxed text-eternam-amber/80">{children}</div>
        </div>
    </div>
);

export const InfoBox = ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-2xl border border-eternam-cyan/20 bg-eternam-cyan/10 p-5">
        <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div className="text-sm leading-relaxed text-eternam-cyan/80">{children}</div>
        </div>
    </div>
);

export const PrivacyBox = ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-2xl border border-eternam-purple/20 bg-eternam-purple/10 p-5">
        <div className="flex items-start gap-3">
            <span className="text-xl">🔒</span>
            <div className="text-sm leading-relaxed text-eternam-purple/80">{children}</div>
        </div>
    </div>
);

export const DangerBox = ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-2xl border border-eternam-rose/20 bg-eternam-rose/10 p-5">
        <div className="flex items-start gap-3">
            <span className="text-xl">🚫</span>
            <div className="text-sm leading-relaxed text-eternam-rose/80">{children}</div>
        </div>
    </div>
);

export interface TocItem {
    id: string;
    title: string;
    subtitle: string;
}

interface TableOfContentsProps {
    items: TocItem[];
    activeSection: string;
    onSectionClick: (id: string) => void;
    accentColor?: 'cyan' | 'purple';
}

export const TableOfContents = ({ items, activeSection, onSectionClick, accentColor = 'cyan' }: TableOfContentsProps) => {
    const activeClasses = accentColor === 'cyan'
        ? 'border-l-eternam-cyan bg-eternam-cyan/10'
        : 'border-l-eternam-purple bg-eternam-purple/10';

    const activeTextClasses = accentColor === 'cyan'
        ? 'text-eternam-cyan'
        : 'text-eternam-purple';

    return (
        <nav className="space-y-1">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onSectionClick(item.id)}
                    className={`w-full rounded-lg border-l-2 px-3 py-2 text-left transition-all hover:bg-surface-2 ${activeSection === item.id
                            ? activeClasses
                            : 'border-l-transparent'
                        }`}
                >
                    <span className={`text-sm font-medium ${activeSection === item.id ? activeTextClasses : 'text-eternam-muted'
                        }`}>
                        {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-eternam-muted/50">{item.subtitle}</span>
                </button>
            ))}
        </nav>
    );
};

interface MobileTocProps {
    isOpen: boolean;
    onClose: () => void;
    items: TocItem[];
    activeSection: string;
    onSectionClick: (id: string) => void;
    accentColor?: 'cyan' | 'purple';
}

export const MobileToc = ({ isOpen, onClose, items, activeSection, onSectionClick, accentColor = 'cyan' }: MobileTocProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-eternam-dark/80 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute bottom-0 right-0 top-0 w-80 overflow-y-auto border-l border-border-subtle bg-eternam-dark p-6 pt-24">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-eternam-muted/50">Sommaire</h3>
                <TableOfContents
                    items={items}
                    activeSection={activeSection}
                    onSectionClick={(id) => {
                        onSectionClick(id);
                        onClose();
                    }}
                    accentColor={accentColor}
                />
            </div>
        </div>
    );
};

interface InfoTableRow {
    label: string;
    value: string;
}

export const InfoTable = ({ rows }: { rows: InfoTableRow[] }) => (
    <div className="my-6 rounded-2xl border border-border-subtle bg-surface-1 p-6">
        <div className="grid gap-3 text-sm">
            {rows.map((row, index) => (
                <div
                    key={index}
                    className={`flex justify-between ${index < rows.length - 1 ? 'border-b border-border-subtle pb-2' : ''
                        }`}
                >
                    <span className="text-eternam-muted/60">{row.label}</span>
                    <span className="font-medium text-eternam-light/80">{row.value}</span>
                </div>
            ))}
        </div>
    </div>
);

interface NumberedStepProps {
    number: number;
    children: React.ReactNode;
    accentColor?: 'cyan' | 'purple';
}

export const NumberedStep = ({ number, children, accentColor = 'cyan' }: NumberedStepProps) => {
    const bgClass = accentColor === 'cyan'
        ? 'bg-gradient-to-br from-eternam-cyan to-eternam-cyan-muted'
        : 'bg-gradient-to-br from-eternam-purple to-purple-600';

    return (
        <div className="flex items-start gap-3 rounded-xl bg-surface-1 p-4">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${bgClass}`}>
                {number}
            </span>
            <p className="pt-1 text-eternam-muted">{children}</p>
        </div>
    );
};

interface DefinitionCardProps {
    term: string;
    definition: string;
    accentColor?: 'cyan' | 'purple';
}

export const DefinitionCard = ({ term, definition, accentColor = 'cyan' }: DefinitionCardProps) => {
    const borderClass = accentColor === 'cyan'
        ? 'border-l-eternam-cyan/50'
        : 'border-l-eternam-purple/50';

    const termClass = accentColor === 'cyan'
        ? 'text-eternam-cyan'
        : 'text-eternam-purple';

    return (
        <div className={`rounded-xl border-l-2 bg-surface-1 p-4 ${borderClass}`}>
            <h4 className={`mb-1 font-semibold ${termClass}`}>{term}</h4>
            <p className="text-sm text-eternam-muted/80">{definition}</p>
        </div>
    );
};

interface ListItemProps {
    children: React.ReactNode;
    accentColor?: 'cyan' | 'purple' | 'rose' | 'muted';
}

export const ListItem = ({ children, accentColor = 'cyan' }: ListItemProps) => {
    const colorClasses = {
        cyan: 'text-eternam-cyan',
        purple: 'text-eternam-purple',
        rose: 'text-eternam-rose',
        muted: 'text-eternam-muted/50',
    };

    return (
        <li className="flex items-start gap-2">
            <ChevronRightIcon className={`mt-1 h-4 w-4 shrink-0 ${colorClasses[accentColor]}`} />
            <span>{children}</span>
        </li>
    );
};

interface CTAFooterProps {
    title: string;
    subtitle: string;
    buttonText: string;
    href: string;
    accentColor?: 'cyan' | 'purple';
}

export const CTAFooter = ({ title, subtitle, buttonText, href, accentColor = 'cyan' }: CTAFooterProps) => {
    const bgClass = accentColor === 'cyan'
        ? 'bg-gradient-to-r from-eternam-cyan to-eternam-cyan-muted'
        : 'bg-gradient-to-r from-eternam-purple to-purple-600';

    const buttonHoverClass = accentColor === 'cyan'
        ? 'text-eternam-cyan hover:bg-eternam-dark hover:text-white'
        : 'text-eternam-purple hover:bg-eternam-dark hover:text-white';

    return (
        <div className={`mt-20 rounded-3xl p-8 ${bgClass}`}>
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div>
                    <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
                    <p className="text-white/70">{subtitle}</p>
                </div>
                <a
                    href={href}
                    className={`rounded-full bg-white px-6 py-3 font-semibold transition-all ${buttonHoverClass}`}
                >
                    {buttonText}
                </a>
            </div>
        </div>
    );
};