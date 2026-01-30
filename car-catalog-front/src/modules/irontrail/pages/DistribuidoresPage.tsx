import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ChevronRight } from 'lucide-react';
import { IronLayout } from '../layout/IronLayout';
import { staggerContainer, slideUp } from '../animations/variants';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet en Vite/Webpack
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const dealers = [
    { name: 'IronTrail Panama City', city: 'Ciudad de Panamá', phone: '+507 123-4567', email: 'panama@irontrail.com', coords: [8.9824, -79.5199] },
    { name: 'IronTrail David', city: 'Chiriquí', phone: '+507 234-5678', email: 'david@irontrail.com', coords: [8.4272, -82.4309] },
    { name: 'IronTrail Santiago', city: 'Veraguas', phone: '+507 345-6789', email: 'santiago@irontrail.com', coords: [8.1009, -80.9667] },
    { name: 'IronTrail Colón', city: 'Colón', phone: '+507 456-7890', email: 'colon@irontrail.com', coords: [9.3591, -79.9011] },
    { name: 'IronTrail Penonomé', city: 'Coclé', phone: '+507 567-8901', email: 'penonome@irontrail.com', coords: [8.5193, -80.3573] },
    { name: 'IronTrail Chitré', city: 'Herrera', phone: '+507 678-9012', email: 'chitre@irontrail.com', coords: [7.9616, -80.4284] },
];

const DistribuidoresPage = () => {
    const [selectedDealer, setSelectedDealer] = useState<number | null>(null);

    const handleDealerClick = (index: number) => {
        setSelectedDealer(index === selectedDealer ? null : index);
    };

    return (
        <IronLayout>
            {/* HERO */}
            <section className="h-[50vh] bg-[#111] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 1000 1000">
                        <path d="M0,500 L1000,500 M500,0 L500,1000" stroke="white" strokeWidth="1" />
                        {[200, 400, 600, 800].map((x) => 
                            [200, 400, 600, 800].map((y) => (
                                <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#FFD700" />
                            ))
                        )}
                    </svg>
                </div>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center relative z-10"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter">UBÍCANOS</h1>
                    <p className="text-gray-400 mt-4 text-lg">Encuentra el punto de instalación más cercano</p>
                </motion.div>
            </section>

            {/* DEALERS LIST */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* MAPA REAL (LEAFLET) */}
                        <div className="h-[500px] border-4 border-black relative z-0 shadow-2xl">
                            <MapContainer 
                                center={[8.5380, -80.7821]} 
                                zoom={7} 
                                scrollWheelZoom={false} 
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                {dealers.map((dealer, i) => (
                                    <Marker key={i} position={dealer.coords as [number, number]}>
                                        <Popup>
                                            <div className="text-center">
                                                <strong className="block text-sm font-black uppercase">{dealer.name}</strong>
                                                <span className="text-xs">{dealer.city}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* DEALERS LIST */}
                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar"
                        >
                            {dealers.map((dealer, i) => (
                                <motion.div 
                                    key={i}
                                    variants={slideUp}
                                    onClick={() => handleDealerClick(i)}
                                    className={`p-6 border cursor-pointer transition-all ${
                                        selectedDealer === i 
                                            ? 'border-[#FFD700] bg-[#FFD700]/5' 
                                            : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-black uppercase italic">{dealer.name}</h3>
                                            <p className="text-gray-500 text-sm font-bold mt-1">{dealer.city}</p>
                                        </div>
                                        <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${selectedDealer === i ? 'rotate-90' : ''}`} />
                                    </div>
                                    
                                    {selectedDealer === i && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 pt-4 border-t border-gray-200 space-y-2"
                                        >
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-[#FFD700]" />
                                                {dealer.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-[#FFD700]" />
                                                {dealer.email}
                                            </div>
                                            <button className="mt-4 bg-[#FFD700] text-black font-black uppercase text-xs py-2 px-6 hover:bg-[#E6C200] transition-colors w-full">
                                                Obtener Direcciones
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* CONTACT FORM */}
                    <div className="mt-20 max-w-2xl mx-auto text-center">
                        <h3 className="text-3xl font-black uppercase italic mb-8">¿Quieres ser distribuidor?</h3>
                        <form className="space-y-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Nombre" className="w-full bg-gray-100 p-4 font-bold border-none focus:ring-2 focus:ring-[#FFD700] outline-none" />
                                <input type="email" placeholder="Email" className="w-full bg-gray-100 p-4 font-bold border-none focus:ring-2 focus:ring-[#FFD700] outline-none" />
                            </div>
                            <textarea rows={4} placeholder="Mensaje" className="w-full bg-gray-100 p-4 font-bold border-none focus:ring-2 focus:ring-[#FFD700] outline-none"></textarea>
                            <button className="w-full bg-black text-white hover:bg-[#FFD700] hover:text-black font-black uppercase py-4 transition-colors tracking-widest">
                                Enviar Solicitud
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </IronLayout>
    );
};

export default DistribuidoresPage;
