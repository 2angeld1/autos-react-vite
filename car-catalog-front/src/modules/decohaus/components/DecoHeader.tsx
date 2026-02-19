import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Leaf, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { to: '/decohaus/catalogo', label: 'Colección' },
    { to: '/decohaus/catalogo?cat=living', label: 'Sala' },
    { to: '/decohaus/catalogo?cat=bedroom', label: 'Dormitorio' },
    { to: '/decohaus/catalogo?cat=office', label: 'Oficina' },
];

const DecoHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/decohaus' || location.pathname === '/decohaus/';

    useEffect(() => {
        const handle = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handle);
        return () => window.removeEventListener('scroll', handle);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const isActive = (path: string) => location.pathname + location.search === path;

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || !isHome
                    ? 'bg-[#F5F0EB] shadow-md py-2 border-b border-[#8B6F47]/10'
                    : 'bg-transparent py-5'
                    }`}
            >
                {/* Top accent line */}
                {/* Removed top accent gradient line */}

                <div className="container mx-auto px-6 lg:px-10">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/decohaus" className="group flex items-center gap-3 cursor-pointer">
                            {/* Icon Container */}
                            <motion.div
                                whileHover={{ rotate: 12 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`flex items-center justify-center rounded-xl transition-all duration-300 ${scrolled || !isHome
                                        ? (scrolled ? 'w-9 h-9 bg-[#8B6F47]/10' : 'w-10 h-10 bg-[#8B6F47]/15')
                                        : 'w-10 h-10 bg-white/20'
                                    }`}
                            >
                                <Leaf className={`transition-all duration-300 ${scrolled || !isHome ? 'text-[#8B6F47]' : 'text-white'
                                    } ${scrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
                            </motion.div>
                            {/* Text */}
                            <div className="flex flex-col leading-none">
                                <span className={`font-black tracking-tight transition-all duration-300 ${scrolled || !isHome ? 'text-[#1a1a1a]' : 'text-white'
                                    } ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                                    Deco<span className={`font-light tracking-widest transition-colors ${scrolled || !isHome ? 'text-[#8B6F47]' : 'text-white/80'
                                        }`}>haus</span>
                                </span>
                                <span className={`text-[9px] tracking-[0.35em] uppercase font-medium transition-all duration-300 ${scrolled || !isHome
                                        ? 'opacity-0 h-0'
                                        : 'opacity-100 mt-0.5 text-white/60'
                                    }`}>
                                    Diseño & Mobiliario
                                </span>
                            </div>
                        </Link>

                        {/* Center Navigation Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="relative px-5 py-2 group"
                                >
                                    <span className={`text-[13px] font-medium tracking-wide transition-colors duration-300 ${isActive(link.to)
                                            ? (scrolled || !isHome ? 'text-[#8B6F47]' : 'text-white')
                                            : (scrolled || !isHome ? 'text-[#555] group-hover:text-[#1a1a1a]' : 'text-white/70 group-hover:text-white')
                                        }`}>
                                        {link.label}
                                    </span>
                                    {/* Animated underline */}
                                    <motion.span
                                        className={`absolute bottom-0 left-1/2 h-[2px] rounded-full ${scrolled || !isHome ? 'bg-[#8B6F47]' : 'bg-white'
                                            }`}
                                        initial={false}
                                        animate={{
                                            width: isActive(link.to) ? '50%' : '0%',
                                            x: isActive(link.to) ? '-50%' : '0%',
                                        }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    />
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search Toggle */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${searchOpen
                                        ? 'bg-[#8B6F47] text-white'
                                        : (scrolled || !isHome ? 'hover:bg-[#8B6F47]/10 text-[#555] hover:text-[#8B6F47]' : 'hover:bg-white/10 text-white')
                                    }`}
                            >
                                <Search className="w-[18px] h-[18px]" />
                            </motion.button>

                            {/* Cart */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${scrolled || !isHome ? 'hover:bg-[#8B6F47]/10 text-[#555] hover:text-[#8B6F47]' : 'hover:bg-white/10 text-white'
                                    }`}
                            >
                                <ShoppingBag className="w-[18px] h-[18px]" />
                                {/* Badge */}
                                <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center ${scrolled || !isHome ? 'bg-[#8B6F47]' : 'bg-white text-[#1a1a1a]'
                                    }`}>
                                    3
                                </span>
                            </motion.button>

                            {/* Separator */}
                            <div className={`hidden lg:block w-px h-6 mx-2 ${scrolled || !isHome ? 'bg-[#1a1a1a]/10' : 'bg-white/20'
                                }`} />

                            {/* CTA Button (desktop) */}
                            <Link
                                to="/decohaus/catalogo"
                                className={`hidden lg:flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 ${scrolled || !isHome
                                        ? 'bg-[#1a1a1a] text-white hover:bg-[#8B6F47]'
                                        : 'bg-white text-[#1a1a1a] hover:bg-[#F5F0EB]'
                                    }`}
                            >
                                Explorar
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            {/* Hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all ${scrolled || !isHome
                                        ? 'hover:bg-[#8B6F47]/10 text-[#1a1a1a]'
                                        : 'hover:bg-white/10 text-white'
                                    }`}
                                onClick={() => setMenuOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Search Bar - expandable */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="py-4 mt-2 border-t border-[#8B6F47]/10">
                                    <div className="relative max-w-lg mx-auto">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
                                        <input
                                            type="text"
                                            placeholder="Buscar muebles, estilos, ambientes..."
                                            autoFocus
                                            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-[#8B6F47]/15 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#8B6F47]/40 focus:ring-2 focus:ring-[#8B6F47]/10 transition-all"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Removed bottom accent gradient line */}
            </nav>

            {/* ======================== */}
            {/* MOBILE MENU - Full Screen */}
            {/* ======================== */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[60]"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#1a1a1a]/20 backdrop-blur-sm"
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#F5F0EB] flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-8 py-6 border-b border-[#8B6F47]/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#8B6F47]/15 flex items-center justify-center">
                                        <Leaf className="w-4 h-4 text-[#8B6F47]" />
                                    </div>
                                    <span className="text-lg font-black tracking-tight">
                                        Deco<span className="font-light text-[#8B6F47]">haus</span>
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setMenuOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-[#1a1a1a]/5 flex items-center justify-center text-gray-500 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Search in mobile */}
                            <div className="px-8 py-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]/50" />
                                    <input
                                        type="text"
                                        placeholder="¿Qué estás buscando?"
                                        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 transition-all border border-[#8B6F47]/10"
                                    />
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 px-8 py-4 space-y-1">
                                <p className="text-[10px] tracking-[0.3em] uppercase text-[#8B6F47]/60 font-medium mb-4 ml-1">
                                    Navegar
                                </p>
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03, duration: 0.2 }}
                                    >
                                        <Link
                                            to={link.to}
                                            onClick={() => setMenuOpen(false)}
                                            className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${isActive(link.to)
                                                ? 'bg-[#8B6F47]/10 text-[#8B6F47]'
                                                : 'text-[#1a1a1a] hover:bg-[#8B6F47]/5 hover:text-[#8B6F47]'
                                                }`}
                                        >
                                            {link.label}
                                            <ArrowRight className={`w-4 h-4 transition-all duration-300 ${isActive(link.to) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                                }`} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Bottom CTA */}
                            <div className="px-8 py-6 border-t border-[#8B6F47]/10 space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <Link
                                        to="/decohaus/catalogo"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-sm font-semibold tracking-wider uppercase hover:bg-[#8B6F47] transition-colors duration-300"
                                    >
                                        Explorar Colección
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>

                                {/* Social proof */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center justify-center gap-3 text-xs text-gray-400"
                                >
                                    <span className="flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                                        Envío gratis
                                    </span>
                                    <span>•</span>
                                    <span>30 días garantía</span>
                                    <span>•</span>
                                    <span>Pago seguro</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DecoHeader;
