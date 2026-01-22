import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definición de los temas disponibles
export type ThemeColor = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'gold' | 'teal';

interface Theme {
    name: ThemeColor;
    accent: string;
    secondary: string; // Un tono un poco más oscuro o complementario
}

export const themes: Record<ThemeColor, Theme> = {
    red: { name: 'red', accent: '#ff3860', secondary: '#d41b40' }, // Default
    blue: { name: 'blue', accent: '#3b82f6', secondary: '#2563eb' },
    green: { name: 'green', accent: '#10b981', secondary: '#059669' },
    purple: { name: 'purple', accent: '#8b5cf6', secondary: '#7c3aed' },
    orange: { name: 'orange', accent: '#f97316', secondary: '#ea580c' },
    gold: { name: 'gold', accent: '#fbbf24', secondary: '#d97706' },
    teal: { name: 'teal', accent: '#14b8a6', secondary: '#0d9488' },
};

interface ThemeContextType {
    currentTheme: ThemeColor;
    setTheme: (theme: ThemeColor) => void;
    availableThemes: typeof themes;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper para convertir hex a rgb
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 56, 96';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Intentar leer del localStorage o usar default 'red'
    const [currentTheme, setCurrentTheme] = useState<ThemeColor>(() => {
        const saved = localStorage.getItem('velo-theme');
        return (saved as ThemeColor) || 'red';
    });

    useEffect(() => {
        const theme = themes[currentTheme];
        const root = document.documentElement;

        // Actualizar variables CSS globales
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--accent-rgb', hexToRgb(theme.accent)); // Nuevo: para transparencias
        root.style.setProperty('--primary-color', theme.accent); 
        root.style.setProperty('--danger-color', theme.accent); 
        
        // Colores secundarios o variantes si se usan
        root.style.setProperty('--secondary-accent', theme.secondary);

        // Guardar persistencia
        localStorage.setItem('velo-theme', currentTheme);
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, availableThemes: themes }}>
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};
