import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonIcon
} from '@ionic/react';
import { arrowBack, build, alertCircle, time, helpCircle, scanOutline, refreshOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Clock, ShieldCheck, Zap } from 'lucide-react';
import Car3DPrototyping from '../components/maintenance/Car3DPrototyping';
import ScannerOverlay from '../components/maintenance/ScannerOverlay';

const Maintenance: React.FC = () => {
  const history = useHistory();
    const [isScanning, setIsScanning] = useState(false);
    const [showPrototyping, setShowPrototyping] = useState(false);
    const [activeAlerts] = useState(['engine', 'brakes']);

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
    <IonPage>
          {isScanning && <ScannerOverlay onScanComplete={handleScanComplete} />}

      <IonHeader className="ion-no-border shadow-none bg-slate-900 border-b border-slate-800">
        <div className="px-5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <button onClick={() => history.goBack()} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                <IonIcon icon={arrowBack} />
             </button>
             <h1 className="text-lg font-bold text-white">Mantenimiento</h1>
           </div>
           
           <div className="flex gap-2">
             <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <IonIcon icon={time} className="text-xl" />
             </button>
             <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <IonIcon icon={helpCircle} className="text-xl" />
             </button>
           </div>
        </div>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-900">
        <div className="p-6 pb-24">
           
                  {/* Scan / 3D Feature Reveal */}
                  {showPrototyping && (
                      <div className="mb-10 space-y-4">
                          <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                  <Zap size={20} className="text-indigo-400" />
                                  Vista 3D Interactiva
                              </h3>
                              <button
                                  onClick={() => setShowPrototyping(false)}
                                  className="text-xs font-bold text-slate-500 flex items-center gap-1"
                              >
                                  <IonIcon icon={refreshOutline} />
                                  Reset
                              </button>
                          </div>
                          <Car3DPrototyping alerts={activeAlerts} />
                          <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-800/50 p-4 rounded-3xl border border-white/5">
                                  <ShieldCheck size={18} className="text-green-500 mb-2" />
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">Estado General</p>
                                  <p className="text-sm font-bold text-white">Buen Estado</p>
                              </div>
                              <div className="bg-slate-800/50 p-4 rounded-3xl border border-white/5">
                                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mb-2" />
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">Alertas</p>
                                  <p className="text-sm font-bold text-white">2 Necesitan Acción</p>
                              </div>
                          </div>
                      </div>
                  )}

           {/* Next Service Card */}
                  {!showPrototyping && (
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 shadow-xl shadow-indigo-900/40 text-white mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                       <div>
                           <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Próximo Servicio</span>
                           <h2 className="text-2xl font-bold mt-1">Revisión 50k</h2>
                       </div>
                       <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                      <Clock size={12} className="mr-1" /> En {showPrototyping ? '12' : '15'} días
                       </div>
                   </div>

                   <div className="space-y-4 mb-6">
                       {/* Progress Bar */}
                       <div>
                           <div className="flex justify-between text-xs font-bold mb-2">
                               <span className="text-indigo-200">Vida del Aceite</span>
                               <span>85%</span>
                           </div>
                           <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                               <div className="h-full bg-white rounded-full w-[85%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                           </div>
                       </div>

                       <div className="flex gap-4">
                           <div className="flex-1 bg-black/20 rounded-xl p-3">
                               <p className="text-[10px] text-indigo-200 uppercase">Vehículo</p>
                               <p className="font-bold text-sm truncate">Toyota Highlander</p>
                           </div>
                           <div className="flex-1 bg-black/20 rounded-xl p-3">
                               <p className="text-[10px] text-indigo-200 uppercase">Estimado</p>
                               <p className="font-bold text-sm">$150.00</p>
                           </div>
                       </div>
                   </div>

                   <button className="w-full bg-white text-indigo-700 font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-transform">
                       Agendar Ahora
                   </button>
               </div>
           </div>
                  )}

           {/* Quick Actions Grid */}
           <h3 className="text-lg font-bold text-white mb-4">Acciones Rápidas</h3>
           <div className="grid grid-cols-2 gap-4 mb-8">
                      <button
                          onClick={handleStartScan}
                          className="bg-slate-800 p-4 rounded-2xl border border-slate-700 active:bg-slate-700 transition-colors text-left"
                      >
                          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-3">
                              <IonIcon icon={scanOutline} size="large" />
                   </div>
                          <h4 className="font-bold text-white text-sm">Escaneo AR</h4>
                          <p className="text-slate-400 text-[10px]">Identificar fallas</p>
                      </button>
                      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 active:bg-slate-700 transition-colors text-left">
                   <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-3">
                       <IonIcon icon={alertCircle} size="large" />
                   </div>
                   <h4 className="font-bold text-white text-sm">Alertas</h4>
                          <p className="text-slate-400 text-[10px]">{activeAlerts.length} Activas</p>
               </div>
           </div>

           {/* History List */}
           <div className="flex justify-between items-end mb-4">
               <h3 className="text-lg font-bold text-white">Historial</h3>
               <span className="text-indigo-400 text-xs font-bold">Ver Todo</span>
           </div>
           
           <div className="space-y-3">
               {services.map(service => (
                   <div key={service.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                               <IonIcon icon={build} />
                           </div>
                           <div>
                               <h4 className="font-bold text-white text-sm">{service.type}</h4>
                               <p className="text-[10px] text-slate-400">{service.date} • {service.km}</p>
                           </div>
                       </div>
                       <div className="text-right">
                           <p className="font-bold text-white text-sm">{service.cost}</p>
                           <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-md">{service.status}</span>
                       </div>
                   </div>
               ))}
           </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Maintenance;
