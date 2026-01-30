import { ChevronDown } from 'lucide-react';
import { ButtonPrimary } from './HeroBanner';

const VehicleSelector = () => (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-sm shadow-2xl border-t-4 border-[#FFD700] w-full max-w-4xl mx-auto -mt-16 relative z-20 grid grid-cols-1 md:grid-cols-4 gap-4">
        {['MARCA', 'MODELO', 'AÑO', 'MOTOR'].map((label) => (
            <div key={label} className="relative group">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">{label}</label>
                <div className="flex items-center justify-between border-b-2 border-gray-200 py-2 group-hover:border-[#FFD700] transition-colors cursor-pointer">
                    <span className="text-gray-800 font-bold text-sm">Seleccionar</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#FFD700]" />
                </div>
            </div>
        ))}
        <div className="md:col-span-4 flex justify-end mt-2">
             <ButtonPrimary className="w-full md:w-auto">BUSCAR PIEZAS</ButtonPrimary>
        </div>
    </div>
);

export default VehicleSelector;
