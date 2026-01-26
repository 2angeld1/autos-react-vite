import React, { useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonIcon
} from '@ionic/react';
import { location, call, time, mail, logoFacebook, logoInstagram, logoTwitter } from 'ionicons/icons';
import { Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../animations';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet clean icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Internal component to fix Leaflet rendering issues in Tabs/Ionic
const MapRefresher = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map]);
    return null;
};

const Location: React.FC = () => {
    // Panama City Locations
    const locations = [
        { id: 1, name: "VeloDrive Costa del Este", coords: [9.0069, -79.4759] as [number, number], address: "Av. Centenario, Edificio Financial Park" },
        { id: 2, name: "VeloDrive Multiplaza", coords: [8.9818, -79.5167] as [number, number], address: "Mall Multiplaza Pacific" },
        { id: 3, name: "VeloDrive Albrook", coords: [8.9739, -79.5539] as [number, number], address: "Albrook Mall, Acceso Delfín" }
    ];

    const centerPosition: [number, number] = [8.9900, -79.5000]; // Central Panama City

    return (
        <IonPage>
            <IonHeader className="ion-no-border bg-white shadow-none">
                <div className="px-6 pt-6 pb-2 bg-white">
                    <h1 className="text-3xl font-extrabold text-slate-900">Nuestras Sedes</h1>
                    <p className="text-slate-500 font-medium">Encuentra tu VeloDrive más cercano</p>
                </div>
            </IonHeader>

            <IonContent fullscreen className="bg-slate-50">
                <motion.div 
                    className="p-6 pb-24 space-y-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >

                    {/* Map Card */}
                    <motion.div 
                        variants={fadeInUp}
                        className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 overflow-hidden relative"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                <IonIcon icon={location} className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 leading-tight">Ciudad de Panamá</h3>
                                <p className="text-xs text-slate-400 font-medium">{locations.length} Sucursales Disponibles</p>
                            </div>
                        </div>

                        {/* Leaflet Map */}
                        <div className="w-full aspect-square bg-slate-100 rounded-[2rem] overflow-hidden relative mb-4 shadow-inner z-0 border border-slate-200">
                            <MapContainer 
                                center={centerPosition} 
                                zoom={12} 
                                scrollWheelZoom={false} 
                                style={{ height: '100%', width: '100%' }}
                                className="z-0"
                            >
                                <MapRefresher />
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />
                                {locations.map(loc => (
                                    <Marker key={loc.id} position={loc.coords}>
                                        <Popup>
                                            <div className="font-bold text-slate-900">{loc.name}</div>
                                            <div className="text-xs text-slate-500 w-32">{loc.address}</div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                            
                            <a 
                                href="https://www.google.com/maps/search/VeloDrive+Panama" 
                                target="_blank"
                                rel="noreferrer"
                                className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform z-[400]"
                                style={{ zIndex: 400 }}
                            >
                                <Navigation size={16} />
                                Ver Rutas
                            </a>
                        </div>

                        <div className="space-y-3 mt-6">
                             {locations.map(loc => (
                                 <div 
                                    key={loc.id} 
                                    className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-slate-100 transition-all cursor-pointer active:scale-[0.98]"
                                    onClick={() => window.open(`https://maps.google.com/?q=${loc.coords[0]},${loc.coords[1]}`, '_blank')}
                                 >
                                     <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                         </div>
                                         <div>
                                             <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{loc.name}</h4>
                                             <p className="text-xs text-slate-400 font-medium">{loc.address}</p>
                                         </div>
                                     </div>
                                     
                                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-indigo-500 shadow-sm transition-colors">
                                        <Navigation size={14} className="ml-0.5" />
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                        <a href="tel:+50712345678" className="bg-green-50 p-4 rounded-[2rem] flex flex-col items-center justify-center gap-2 border border-green-100 active:scale-95 transition-transform">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600 mb-1">
                                <IonIcon icon={call} className="text-2xl" />
                            </div>
                            <span className="font-bold text-slate-900 text-sm">Llamar</span>
                        </a>
                        <a href="mailto:ventas@velodrive.com.pa" className="bg-blue-50 p-4 rounded-[2rem] flex flex-col items-center justify-center gap-2 border border-blue-100 active:scale-95 transition-transform">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 mb-1">
                                <IonIcon icon={mail} className="text-2xl" />
                            </div>
                            <span className="font-bold text-slate-900 text-sm">Email</span>
                        </a>
                    </motion.div>

                    {/* Hours */}
                    <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <IonIcon icon={time} className="text-indigo-500 text-xl" />
                            <h3 className="font-bold text-slate-900">Horario de Atención</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-500">Lun - Vie</span>
                                <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">9:00 AM - 7:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-500">Sábado</span>
                                <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">10:00 AM - 5:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-500">Domingo</span>
                                <span className="font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg">Solo Citas</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Media */}
                    <motion.div variants={fadeInUp} className="flex justify-center gap-6 pt-4">
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#E1306C] hover:bg-pink-50 transition-all shadow-sm border border-slate-100">
                            <IonIcon icon={logoInstagram} className="text-2xl" />
                        </button>
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:bg-blue-50 transition-all shadow-sm border border-slate-100">
                            <IonIcon icon={logoFacebook} className="text-2xl" />
                        </button>
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-[#1DA1F2] hover:bg-sky-50 transition-all shadow-sm border border-slate-100">
                            <IonIcon icon={logoTwitter} className="text-2xl" />
                        </button>
                    </motion.div>

                </motion.div>
            </IonContent>
        </IonPage>
    );
};

export default Location;
