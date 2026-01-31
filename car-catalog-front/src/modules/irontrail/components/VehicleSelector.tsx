import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Datos de vehículos compatibles con IronTrail
const VEHICLE_DATA = {
    marcas: ['Toyota', 'Nissan', 'Jeep', 'Ford', 'Chevrolet', 'Mitsubishi', 'Suzuki'],
    modelos: {
        'Toyota': ['Hilux', '4Runner', 'Land Cruiser', 'Tacoma', 'FJ Cruiser', 'Prado'],
        'Nissan': ['Patrol', 'Frontier', 'Pathfinder', 'Xterra', 'Navara'],
        'Jeep': ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Gladiator', 'Compass'],
        'Ford': ['Ranger', 'F-150', 'Bronco', 'Explorer', 'Expedition'],
        'Chevrolet': ['Colorado', 'Silverado', 'Tahoe', 'Blazer', 'TrailBlazer'],
        'Mitsubishi': ['Montero', 'L200', 'Pajero', 'Outlander'],
        'Suzuki': ['Jimny', 'Grand Vitara', 'Samurai'],
    } as Record<string, string[]>,
    años: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2010-2014', '2005-2009', '2000-2004'],
    motores: ['Gasolina 4 cil', 'Gasolina 6 cil', 'Gasolina V8', 'Diesel 4 cil', 'Diesel 6 cil', 'Híbrido']
};

interface DropdownProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

const Dropdown = ({ label, value, options, onChange, disabled, placeholder = 'Seleccionar' }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <label className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.15em] mb-2 block">
                {label}
            </label>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between 
                    bg-white/10 backdrop-blur-sm border-2 
                    px-4 py-3 transition-all duration-200
                    ${disabled
                        ? 'border-gray-700 cursor-not-allowed opacity-40'
                        : 'border-gray-600 hover:border-[#FFD700] cursor-pointer'
                    }
                    ${isOpen ? 'border-[#FFD700] bg-white/20' : ''}
                    ${value ? 'border-[#FFD700]/50' : ''}
                `}
            >
                <span className={`font-bold text-sm uppercase tracking-wide ${value ? 'text-white' : 'text-gray-400'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 transition-all duration-200 ${isOpen ? 'rotate-180 text-[#FFD700]' : 'text-gray-500'
                    } ${value ? 'text-[#FFD700]' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border-2 border-[#FFD700] shadow-2xl shadow-black/50 z-50 max-h-52 overflow-y-auto"
                >
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full px-4 py-3 text-left text-sm font-bold uppercase tracking-wide
                                transition-all duration-150 border-b border-gray-800 last:border-b-0
                                ${value === option
                                    ? 'bg-[#FFD700] text-black'
                                    : 'text-gray-300 hover:bg-[#FFD700]/20 hover:text-[#FFD700]'
                                }
                            `}
                        >
                            {option}
                        </button>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

const VehicleSelector = () => {
    const navigate = useNavigate();
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [año, setAño] = useState('');
    const [motor, setMotor] = useState('');

    const handleMarcaChange = (value: string) => {
        setMarca(value);
        setModelo('');
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (marca) params.append('marca', marca);
        if (modelo) params.append('modelo', modelo);
        if (año) params.append('año', año);
        if (motor) params.append('motor', motor);

        const queryString = params.toString();
        navigate(`/irontrail/catalogo${queryString ? `?${queryString}` : ''}`);
    };

    const clearFilters = () => {
        setMarca('');
        setModelo('');
        setAño('');
        setMotor('');
    };

    const hasFilters = marca || modelo || año || motor;
    const modelosDisponibles = marca ? VEHICLE_DATA.modelos[marca] || [] : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full max-w-5xl mx-auto -mt-20 z-20"
        >
            {/* Gold accent line top */}
            <div className="absolute -top-1 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

            {/* Main Container with diagonal cut */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 shadow-2xl overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#FFD700]"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #FFD700 10px, #FFD700 11px)' }} />

                {/* Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-1 h-8 bg-[#FFD700]" />
                    <div>
                        <h3 className="text-white font-black text-lg uppercase italic tracking-tight">
                            Busca para tu <span className="text-[#FFD700]">Vehículo</span>
                        </h3>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                            Encuentra piezas compatibles
                        </p>
                    </div>
                </div>

                {/* Dropdowns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                    <Dropdown
                        label="Marca"
                        value={marca}
                        options={VEHICLE_DATA.marcas}
                        onChange={handleMarcaChange}
                    />
                    <Dropdown
                        label="Modelo"
                        value={modelo}
                        options={modelosDisponibles}
                        onChange={setModelo}
                        disabled={!marca}
                        placeholder={marca ? 'Seleccionar' : 'Elige marca'}
                    />
                    <Dropdown
                        label="Año"
                        value={año}
                        options={VEHICLE_DATA.años}
                        onChange={setAño}
                    />
                    <Dropdown
                        label="Motor"
                        value={motor}
                        options={VEHICLE_DATA.motores}
                        onChange={setMotor}
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-700/50 relative z-10">
                    {hasFilters ? (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors uppercase tracking-wider font-bold"
                        >
                            <X className="w-4 h-4" />
                            Limpiar
                        </button>
                    ) : (
                        <div className="hidden sm:block text-gray-600 text-xs uppercase tracking-widest pl-2">
                /// SELECCIONA TU VEHÍCULO
                        </div>
                    )}

                    <button
                        onClick={handleSearch}
                        className="relative group flex items-center justify-center gap-3 bg-[#FFD700] text-black font-black uppercase tracking-wider px-12 py-4 hover:bg-[#E6C200] transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] w-full sm:w-auto -skew-x-[20deg] sm:mr-12"
                    >
                        <div className="flex items-center gap-3 skew-x-[20deg]">
                            <Search className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[3]" />
                            BUSCAR PIEZAS
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom shadow accent */}
            <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/40 blur-md -z-10" />
        </motion.div>
    );
};

export default VehicleSelector;
