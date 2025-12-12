const Footer = () => {
    return (
        <footer className="px-6 py-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-white/40">All rights reserved &copy; Eternam ID {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-6 text-xs text-white/30">
                    <a href="#" className="hover:text-white/60 transition-colors">Mentions légales</a>
                    <a href="#" className="hover:text-white/60 transition-colors">RGPD</a>
                    <a href="#" className="hover:text-white/60 transition-colors">Conditions Générales de vente</a>
                </div>
            </div>
        </footer>
    )
}
export default Footer