import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LEFT_LINKS = [
    { label: 'Colecciones', to: '/luxjewel/catalogo' },
    { label: 'La Maison', to: '/luxjewel/la-maison' },
];

const RIGHT_LINKS = [
    { label: 'Atelier', to: '/luxjewel/atelier' },
    { label: 'E-Boutique', to: '/luxjewel/contacto' },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

const JewelHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [menuOpen]);

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled
                    ? 'bg-[#0a090c]/98 backdrop-blur-2xl py-4 border-b border-[#C9A84C]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-transparent py-10'
                }`}>
                {/* Decorative gold line at the very top */}
                <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-3 items-center">

                        {/* LEFT: Navigation Links */}
                        <div className="flex items-center gap-10">
                            {/* Mobile Toggle */}
                            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white hover:text-[#C9A84C] transition-colors relative z-10">
                                <Menu className="w-6 h-6" />
                            </button>

                            <nav className="hidden lg:flex items-center gap-10">
                                {LEFT_LINKS.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`text-[10px] tracking-[0.4em] uppercase font-sans relative pb-1 group overflow-hidden transition-colors ${isActive(link.to) ? 'text-white' : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span className="relative z-10">{link.label}</span>
                                        <div className={`absolute bottom-0 left-0 h-[1px] bg-[#C9A84C] transition-all duration-500 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                                            }`} />
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* CENTER: Logo */}
                        <div className="flex justify-center">
                            <Link to="/luxjewel" className="group">
                                <div className="flex flex-col items-center text-center">
                                    {!scrolled && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mb-2"
                                        >
                                            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                                        </motion.div>
                                    )}
                                    <span className={`text-[9px] tracking-[0.7em] uppercase font-sans text-[#C9A84C] transition-all duration-500 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mb-1.5'}`}>
                                        Maison d'Excellence
                                    </span>
                                    <span className={`font-bold italic text-white transition-all duration-500 tracking-[0.25em] ${scrolled ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'}`}>
                                        LuxJewel
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* RIGHT: Navigation & Actions */}
                        <div className="flex items-center justify-end gap-10">
                            {/* Right Desktop Nav */}
                            <nav className="hidden lg:flex items-center gap-10">
                                {RIGHT_LINKS.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`text-[10px] tracking-[0.4em] uppercase font-sans relative pb-1 group overflow-hidden transition-colors ${isActive(link.to) ? 'text-white' : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span className="relative z-10">{link.label}</span>
                                        <div className={`absolute bottom-0 left-0 h-[1px] bg-[#C9A84C] transition-all duration-500 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                                            }`} />
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center gap-4">
                                <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#C9A84C] hover:bg-white/5 transition-all">
                                    <Heart className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-gray-400 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all relative">
                                    <ShoppingBag className="w-4 h-4" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] text-black text-[8px] font-bold flex items-center justify-center rounded-full">
                                        2
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#0a090c]"
                    >
                        {/* Background Decor */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C9A84C] rounded-full blur-[150px]" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C9A84C] rounded-full blur-[150px]" />
                        </div>

                        <div className="relative h-full flex flex-col p-8 lg:p-16">
                            <div className="flex justify-between items-center mb-20">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                                    <span className="text-xl font-bold italic text-white tracking-widest uppercase">Maison LuxJewel</span>
                                </div>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#C9A84C] transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-8 flex-1">
                                {ALL_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                    >
                                        <Link
                                            to={link.to}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-4xl md:text-6xl font-bold italic text-white hover:text-[#C9A84C] transition-colors flex items-center gap-6 group"
                                        >
                                            <span className="text-[#C9A84C] text-sm not-italic opacity-30 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                            {link.label}
                                            <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="mt-auto border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between gap-8 text-[10px] tracking-[0.4em] uppercase text-gray-500 font-sans">
                                <div className="flex gap-8">
                                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                                    <a href="#" className="hover:text-white transition-colors">Atelier Boutique</a>
                                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                                </div>
                                <p>© 2026 LUXJEWEL MAISON. PARIS • MADRID • NYC</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default JewelHeader;
