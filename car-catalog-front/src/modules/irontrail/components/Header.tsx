import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    variant?: 'default' | 'solid';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        setSearchOpen(false);
    };

    // Styles based on variant
    const isSolid = variant === 'solid';
    const navClasses = isSolid
        ? 'fixed top-0 w-full z-50 bg-black py-4'
        : `fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`;

    return (
        <>
            <nav className={navClasses}>
                <div className={`container mx-auto px-6 ${isSolid ? 'lg:px-12' : ''}`}>
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/irontrail" className={`font-black text-white italic tracking-tighter cursor-pointer flex items-center gap-2 ${isSolid ? 'text-xl min-w-[160px]' : 'text-2xl'}`}>
                            <span className={`text-[#FFD700] not-italic ${isSolid ? 'text-3xl' : 'text-4xl'}`}>///</span> IRON<span className="text-gray-400">TRAIL</span>
                        </Link>

                        {/* Navigation */}
                        <div className={`hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider ${isSolid ? 'justify-center flex-1' : ''}`}>
                            <Link to="/irontrail/suspensiones" className="text-white hover:text-[#FFD700] transition-colors duration-300">Suspensiones</Link>
                            <Link to="/irontrail/accesorios" className="text-white hover:text-[#FFD700] transition-colors duration-300">4x4 Accesorios</Link>
                            <Link to="/irontrail/catalogo" className="text-white hover:text-[#FFD700] transition-colors duration-300">Catálogo</Link>
                            <Link to="/irontrail/distribuidores" className="text-white hover:text-[#FFD700] transition-colors duration-300">Ubícanos</Link>
                        </div>

                        {/* Right side */}
                        <div className={`flex items-center gap-4 text-white ${isSolid ? 'justify-end min-w-[160px]' : ''}`}>
                            <Search
                                className="w-5 h-5 cursor-pointer hover:text-[#FFD700] transition-colors"
                                onClick={() => setSearchOpen(true)}
                            />
                            <Menu className="w-6 h-6 md:hidden cursor-pointer" onClick={() => setMenuOpen(true)} />
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "tween" }}
                            className="fixed inset-0 z-[60] bg-black text-white flex flex-col p-6"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div className="text-2xl font-black italic tracking-tighter text-[#FFD700]">/// IRONTRAIL</div>
                                <X className="w-8 h-8 cursor-pointer" onClick={() => setMenuOpen(false)} />
                            </div>
                            <nav className="flex flex-col gap-6 text-2xl font-black uppercase italic tracking-wider">
                                <Link to="/irontrail/suspensiones" className="hover:text-[#FFD700]" onClick={() => setMenuOpen(false)}>Suspensiones</Link>
                                <Link to="/irontrail/accesorios" className="hover:text-[#FFD700]" onClick={() => setMenuOpen(false)}>Accesorios</Link>
                                <Link to="/irontrail/catalogo" className="hover:text-[#FFD700]" onClick={() => setMenuOpen(false)}>Catálogo</Link>
                                <Link to="/irontrail/distribuidores" className="hover:text-[#FFD700]" onClick={() => setMenuOpen(false)}>Ubícanos</Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* SEARCH OVERLAY */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <button 
                            onClick={() => setSearchOpen(false)}
                            className="absolute top-10 right-10 text-white hover:text-[#FFD700] transition-colors"
                        >
                            <X className="w-10 h-10" />
                        </button>

                        <motion.form 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSearch}
                            className="w-full max-w-4xl"
                        >
                            <div className="relative border-b-4 border-[#FFD700] pb-4">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-[#FFD700]" />
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="BUSCAR PRODUCTOS, VEHÍCULOS O REPUESTOS..." 
                                    className="w-full bg-transparent border-none outline-none text-white text-3xl md:text-5xl font-black uppercase italic placeholder:text-gray-700 pl-14"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <p className="mt-6 text-gray-500 font-bold uppercase tracking-widest text-sm">
                                Presiona <span className="text-white">Enter</span> para buscar o <span className="text-white">Esc</span> para cerrar
                            </p>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
