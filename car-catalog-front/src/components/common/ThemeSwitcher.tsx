import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, ThemeColor, themes } from '@/context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const ThemeSwitcher: React.FC = () => {
    const { currentTheme, setTheme, availableThemes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    // Mapeo de nombres a español para mejor presentación
    const themeNames: Record<string, string> = {
        red: 'Rojo Sport',
        blue: 'Azul Tech',
        green: 'Verde Eco',
        purple: 'Púrpura Royal',
        orange: 'Naranja Sunset',
        gold: 'Dorado Luxury',
        teal: 'Turquesa Ocean'
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 bg-gray-900 rounded-2xl p-4 shadow-2xl border border-gray-700 flex flex-col gap-2 w-64 backdrop-blur-md bg-opacity-95"
                    >
                        <div className="flex justify-between items-center mb-2 px-1">
                            <p className="text-white text-sm font-bold uppercase tracking-wider">Personalizar</p>
                            <span className="text-xs text-gray-400">Elige tu estilo</span>
                        </div>
                        
                        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {(Object.keys(availableThemes) as ThemeColor[]).map((themeKey) => (
                                <motion.button
                                    key={themeKey}
                                    onClick={() => setTheme(themeKey)}
                                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center p-2 rounded-xl transition-all ${currentTheme === themeKey ? 'bg-gray-800 border border-gray-600' : 'border border-transparent hover:border-gray-700'}`}
                                >
                                    <div 
                                        className="w-8 h-8 rounded-full shadow-lg mr-3 border-2 border-gray-600 flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: themes[themeKey].accent }}
                                    >
                                        {currentTheme === themeKey && (
                                            <FontAwesomeIcon icon={faCheck} className="text-white text-xs drop-shadow-md" />
                                        )}
                                    </div>
                                    <span className={`text-sm font-medium ${currentTheme === themeKey ? 'text-white' : 'text-gray-400'}`}>
                                        {themeNames[themeKey] || themeKey}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleOpen}
                className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-colors relative"
                style={{ 
                    backgroundColor: 'var(--accent-color)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faPalette} size="lg" />
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
                )}
            </motion.button>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default ThemeSwitcher;
