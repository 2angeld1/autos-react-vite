import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonIcon
} from '@ionic/react';
import { build, alertCircle, scanOutline, refreshOutline, sparkles } from 'ionicons/icons';
import { Clock, ShieldCheck, Zap, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import Car3DPrototyping from '../components/maintenance/Car3DPrototyping';
import ScannerOverlay from '../components/maintenance/ScannerOverlay';

const Maintenance: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [showPrototyping, setShowPrototyping] = useState(false);
    const [activeAlerts] = useState(['engine', 'tires']);

    const handleStartScan = () => {
        setIsScanning(true);
    };

    const handleScanComplete = () => {
        setIsScanning(false);
        setShowPrototyping(true);
    };

  const services = [
    { id: 1, date: '15 Nov, 2025', type: 'Cambio de Aceite', vehicle: 'Toyota Highlander', km: '45,000 km', cost: '$85.00', status: 'Completado' },
    { id: 2, date: '02 Oct, 2025', type: 'Revisión Frenos', vehicle: 'Ford Mustang', km: '32,000 km', cost: '$120.00', status: 'Completado' },
  ];

  return (
      <IonPage className="bg-white">
          {isScanning && <ScannerOverlay onScanComplete={handleScanComplete} />}

          {/* Header matching Showcase style */}
          <IonHeader className="ion-no-border bg-white shadow-none">
              <div className="px-6 pb-2 bg-white flex justify-between items-end">
                  <div>
                      <h1 className="text-3xl font-extrabold text-slate-900">Mantenimiento</h1>
                      <p className="text-slate-500 font-medium">Cuida tu vehículo</p>
                  </div>

                  <button
                      onClick={() => setShowPrototyping(!showPrototyping)}
                      className="w-10 h-10 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-700 transition-colors mb-1"
                  >
                      <Wrench size={20} strokeWidth={2.5} />
                  </button>
        </div>
      </IonHeader>

          <IonContent fullscreen className="bg-white">
        <div className="p-6 pb-24">
           
                  {/* 3D Interactive View */}
                  {showPrototyping && (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-8 space-y-4"
                      >
                          <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                  <Zap size={20} className="text-indigo-500" />
                                  Vista 3D Interactiva
                              </h3>
                              <button
                                  onClick={() => setShowPrototyping(false)}
                                  className="!text-xs !font-bold !text-slate-500 flex items-center gap-1 !bg-slate-100 !px-3 !py-1.5 !rounded-full active:!scale-95 !transition-transform"
                              >
                                  <IonIcon icon={refreshOutline} />
                                  Reset
                              </button>
                          </div>

                          {/* Tip de instrucciones */}
                          <div className="!bg-gradient-to-r !from-indigo-500 !to-purple-600 !rounded-2xl !p-3 !shadow-lg !mb-3">
                              <p className="!text-xs !text-white !font-bold !text-center">
                                  💡 Toca los marcadores flotantes para ver detalles • Click en expandir para vista completa
                              </p>
                          </div>

                          <Car3DPrototyping />

                          {/* Status Cards */}
                          <div className="grid grid-cols-2 gap-3">
                              <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="!bg-gradient-to-br !from-green-50 !to-emerald-50 !p-4 !rounded-3xl !border !border-green-100"
                              >
                                  <ShieldCheck size={18} className="text-green-600 mb-2" />
                                  <p className="!text-[10px] !text-green-600 !font-bold !uppercase !tracking-wider">Estado General</p>
                                  <p className="!text-sm !font-bold !text-green-900">Buen Estado</p>
                              </motion.div>
                              <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="!bg-gradient-to-br !from-red-50 !to-rose-50 !p-4 !rounded-3xl !border !border-red-100"
                              >
                                  <div className="!w-4 !h-4 !bg-red-500 !rounded-full animate-pulse mb-2" />
                                  <p className="!text-[10px] !text-red-600 !font-bold !uppercase !tracking-wider">Alertas</p>
                                  <p className="!text-sm !font-bold !text-red-900">2 Necesitan Acción</p>
                              </motion.div>
                          </div>
                      </motion.div>
                  )}

                  {/* Next Service Card - Beautiful Blue Gradient */}
                  {!showPrototyping && (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="!bg-gradient-to-br !from-blue-500 !via-blue-600 !to-indigo-600 !rounded-[2rem] !p-6 !shadow-2xl !shadow-blue-900/30 !text-white !mb-8 !relative !overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 !w-40 !h-40 !bg-white/10 !rounded-full !blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                       <div>
                                      <span className="!text-blue-100 !text-xs !font-bold !uppercase !tracking-wider">Próximo Servicio</span>
                                      <h2 className="!text-2xl !font-bold !mt-1">Revisión 50k</h2>
                       </div>
                                  <div className="!bg-white/20 !backdrop-blur-md !px-3 !py-1 !rounded-full !text-xs !font-bold flex items-center">
                                      <Clock size={12} className="mr-1" /> En 15 días
                       </div>
                   </div>

                   <div className="space-y-4 mb-6">
                       {/* Progress Bar */}
                       <div>
                                      <div className="flex justify-between !text-xs !font-bold !mb-2">
                                          <span className="!text-blue-100">Vida del Aceite</span>
                               <span>85%</span>
                           </div>
                                      <div className="!h-2 !bg-black/20 !rounded-full overflow-hidden">
                                          <div className="!h-full !bg-white !rounded-full !w-[85%] !shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                           </div>
                       </div>

                       <div className="flex gap-4">
                                      <div className="flex-1 !bg-black/20 !rounded-xl !p-3">
                                          <p className="!text-[10px] !text-blue-100 !uppercase">Vehículo</p>
                                          <p className="!font-bold !text-sm truncate">Toyota Highlander</p>
                           </div>
                                      <div className="flex-1 !bg-black/20 !rounded-xl !p-3">
                                          <p className="!text-[10px] !text-blue-100 !uppercase">Estimado</p>
                                          <p className="!font-bold !text-sm">$150.00</p>
                           </div>
                       </div>
                   </div>

                              <button className="!w-full !bg-white !text-blue-700 !font-bold !py-3.5 !rounded-xl !shadow-lg active:!scale-[0.98] !transition-transform">
                       Agendar Ahora
                   </button>
               </div>
                      </motion.div>
                  )}

                  {/* Quick Actions Grid - Premium Design */}
                  <h3 className="!text-lg !font-bold !text-slate-900 !mb-4 flex items-center gap-2">
                      <Wrench size={20} className="text-slate-700" />
                      Acciones Rápidas
                  </h3>
           <div className="grid grid-cols-2 gap-4 mb-8">
                      {/* AR Scan - Beautiful Gradient */}
                      <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleStartScan}
                          className="!bg-gradient-to-br !from-indigo-500 !to-purple-600 !p-5 !rounded-[2rem] !shadow-xl !shadow-indigo-900/30 !text-left !relative !overflow-hidden !border !border-indigo-400/20"
                      >
                          <div className="absolute top-0 right-0 !w-24 !h-24 !bg-white/10 !rounded-full !blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                          <div className="relative z-10">
                              <div className="!w-12 !h-12 !bg-white/20 !backdrop-blur-md !rounded-2xl flex items-center justify-center !text-white !mb-3 !shadow-lg">
                                  <IonIcon icon={scanOutline} className="!text-2xl" />
                              </div>
                              <h4 className="!font-bold !text-white !text-sm !mb-1">Escaneo AR</h4>
                              <p className="!text-indigo-100 !text-[10px] !font-medium">Identificar fallas</p>
                              <div className="!mt-3 flex items-center gap-1">
                                  <IonIcon icon={sparkles} className="!text-yellow-300 !text-xs" />
                                  <span className="!text-[9px] !text-yellow-200 !font-bold !uppercase">Experimental</span>
                              </div>
                          </div>
                      </motion.button>

                      {/* Alerts - Beautiful Gradient */}
                      <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="!bg-gradient-to-br !from-orange-500 !to-red-600 !p-5 !rounded-[2rem] !shadow-xl !shadow-orange-900/30 !text-left !relative !overflow-hidden !border !border-orange-400/20"
                      >
                          <div className="absolute top-0 right-0 !w-24 !h-24 !bg-white/10 !rounded-full !blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                          <div className="relative z-10">
                              <div className="!w-12 !h-12 !bg-white/20 !backdrop-blur-md !rounded-2xl flex items-center justify-center !text-white !mb-3 !shadow-lg">
                                  <IonIcon icon={alertCircle} className="!text-2xl" />
                              </div>
                              <h4 className="!font-bold !text-white !text-sm !mb-1">Alertas</h4>
                              <p className="!text-orange-100 !text-[10px] !font-medium">{activeAlerts.length} Activas</p>
                              <div className="!mt-3 flex items-center gap-1">
                                  <div className="!w-2 !h-2 !bg-white !rounded-full animate-pulse"></div>
                                  <span className="!text-[9px] !text-white !font-bold !uppercase">Requiere Atención</span>
                              </div>
                          </div>
                      </motion.div>
           </div>

           {/* History List */}
           <div className="flex justify-between items-end mb-4">
                      <h3 className="!text-lg !font-bold !text-slate-900">Historial</h3>
                      <span className="!text-blue-600 !text-xs !font-bold">Ver Todo</span>
           </div>
           
           <div className="space-y-3">
                      {services.map((service, index) => (
                          <motion.div
                              key={service.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="!bg-slate-50 !p-4 !rounded-2xl !border !border-slate-100 flex justify-between items-center active:!bg-slate-100 !transition-colors"
                          >
                       <div className="flex items-center gap-3">
                                  <div className="!w-10 !h-10 !rounded-full !bg-blue-100 flex items-center justify-center !text-blue-600">
                               <IonIcon icon={build} />
                           </div>
                           <div>
                                      <h4 className="!font-bold !text-slate-900 !text-sm">{service.type}</h4>
                                      <p className="!text-[10px] !text-slate-500">{service.date} • {service.km}</p>
                           </div>
                       </div>
                       <div className="text-right">
                                  <p className="!font-bold !text-slate-900 !text-sm">{service.cost}</p>
                                  <span className="!text-[10px] !text-green-600 !font-bold !bg-green-100 !px-2 !py-0.5 !rounded-md">{service.status}</span>
                       </div>
                          </motion.div>
               ))}
           </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Maintenance;

