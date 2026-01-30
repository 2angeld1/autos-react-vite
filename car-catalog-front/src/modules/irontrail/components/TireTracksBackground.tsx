import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface TireTracksBackgroundProps {
    className?: string;
    opacity?: number;
}

const TireTracksBackground = ({ className = '', opacity = 0.6 }: TireTracksBackgroundProps) => {
    // Patrón de huella de llanta off-road
    const tirePattern = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="80" viewBox="0 0 40 80">
            <rect x="17" y="0" width="6" height="80" fill="%23FFD700" opacity="0.5"/>
            <rect x="0" y="8" width="18" height="10" rx="2" fill="%23FFD700" transform="rotate(-30 9 13)"/>
            <rect x="0" y="48" width="18" height="10" rx="2" fill="%23FFD700" transform="rotate(-30 9 53)"/>
            <rect x="22" y="28" width="18" height="10" rx="2" fill="%23FFD700" transform="rotate(30 31 33)"/>
            <rect x="22" y="68" width="18" height="10" rx="2" fill="%23FFD700" transform="rotate(30 31 73)"/>
        </svg>
    `;

    const encodedPattern = `data:image/svg+xml,${tirePattern}`;

    // Vehículos pasando verticalmente
    const speeders = useMemo(() => [
        { id: 1, x: '15%', delay: 0, duration: 1.8 },
        { id: 2, x: '50%', delay: 1.2, duration: 2.0 },
        { id: 3, x: '80%', delay: 2.5, duration: 1.5 },
    ], []);

    return (
        <div className={`absolute inset-0 overflow-hidden ${className} bg-black`}>
            {/* Fondo con textura */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

            {/* CURVAS DE HUELLAS - Mix de direcciones */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1920 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="tireLinePattern" patternUnits="userSpaceOnUse" width="40" height="80">
                        <rect x="17" y="0" width="6" height="80" fill="#FFD700" opacity="0.6"/>
                        <rect x="0" y="8" width="18" height="10" rx="2" fill="#FFD700" transform="rotate(-30 9 13)"/>
                        <rect x="0" y="48" width="18" height="10" rx="2" fill="#FFD700" transform="rotate(-30 9 53)"/>
                        <rect x="22" y="28" width="18" height="10" rx="2" fill="#FFD700" transform="rotate(30 31 33)"/>
                        <rect x="22" y="68" width="18" height="10" rx="2" fill="#FFD700" transform="rotate(30 31 73)"/>
                    </pattern>
                </defs>
                
                {/* 1 HUELLA HORIZONTAL - cruza de izq a der */}
                <motion.path
                    d="M-100,300 C400,280 800,320 1200,290 S1600,310 2100,300"
                    stroke="url(#tireLinePattern)"
                    strokeWidth="45"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 2.5 }}
                />
                
                {/* HUELLA DIAGONAL - esquina sup-izq a inf-der */}
                <motion.path
                    d="M-50,-50 C300,150 500,350 800,500 S1200,700 1500,900"
                    stroke="url(#tireLinePattern)"
                    strokeWidth="45"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.25 }}
                    transition={{ duration: 2.5, delay: 0.3 }}
                />
                
                {/* HUELLA DIAGONAL INVERSA - esquina sup-der a inf-izq */}
                <motion.path
                    d="M2000,-50 C1600,200 1300,400 900,550 S400,750 -100,900"
                    stroke="url(#tireLinePattern)"
                    strokeWidth="45"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.25 }}
                    transition={{ duration: 2.5, delay: 0.6 }}
                />

                {/* HUELLA CURVA PRONUNCIADA */}
                <motion.path
                    d="M-100,500 C200,100 600,600 1000,200 S1400,500 1800,100"
                    stroke="url(#tireLinePattern)"
                    strokeWidth="40"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 2.5, delay: 0.9 }}
                />
            </svg>

            {/* VEHÍCULOS PASANDO VERTICALMENTE */}
            {speeders.map((s) => (
                <motion.div
                    key={s.id}
                    className="absolute top-0 w-28 h-[300%] flex justify-between pointer-events-none"
                    initial={{ y: "100%", x: s.x }}
                    animate={{ y: ["100%", "-100%"] }}
                    transition={{ 
                        duration: s.duration,
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: s.delay,
                        ease: "linear"
                    }}
                    style={{ opacity: opacity }}
                >
                    <div 
                        className="w-10 h-full"
                        style={{ 
                            backgroundImage: `url("${encodedPattern}")`,
                            backgroundRepeat: 'repeat-y',
                            backgroundSize: '100% 80px',
                        }}
                    />
                    <div 
                        className="w-10 h-full"
                        style={{ 
                            backgroundImage: `url("${encodedPattern}")`,
                            backgroundRepeat: 'repeat-y',
                            backgroundSize: '100% 80px',
                        }}
                    />
                </motion.div>
            ))}

            {/* Viñeta suave */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        </div>
    );
};

export default TireTracksBackground;
