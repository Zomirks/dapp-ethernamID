'use client';

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative flex min-h-screen flex-col bg-eternam-dark">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="bg-glow-cyan absolute -right-48 -top-48" />
                <div className="bg-glow-purple absolute -bottom-32 -left-32" />
                <div className="bg-glow-amber absolute right-1/4 top-1/3 opacity-50" />
            </div>

            <div className="noise-overlay" />

            <Header />
            <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;