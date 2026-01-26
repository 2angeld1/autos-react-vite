import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IonIcon } from '@ionic/react';
import { scanOutline, checkmarkCircle } from 'ionicons/icons';

interface ScannerOverlayProps {
  onScanComplete: () => void;
}

const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ onScanComplete }) => {
  const [phase, setPhase] = useState<'searching' | 'analyzing' | 'completed'>('searching');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const phase1 = setTimeout(() => setPhase('analyzing'), 1500);
    const phase2 = setTimeout(() => setPhase('completed'), 3500);
    const phase3 = setTimeout(() => onScanComplete(), 4500);

    return () => {
      clearInterval(timer);
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, [onScanComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6">
      {/* Target Frame */}
      <div className="relative w-full aspect-[3/4] max-w-sm rounded-[3rem] border-2 border-white/20 overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)]">
        {/* Scanning Line */}
        <motion.div 
          initial={{ top: '-5%' }}
          animate={{ top: '105%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_#6366f1] z-20"
        />
        
        {/* Mock Camera Feed Background */}
        <div className="absolute inset-0 bg-slate-900 opacity-50 flex items-center justify-center">
            <IonIcon icon={scanOutline} className="text-8xl text-white/10 animate-pulse" />
        </div>

        {/* HUD Elements */}
        <div className="absolute top-6 left-6 flex gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            <span className="text-[10px] text-white font-bold tracking-widest uppercase">REC</span>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end mb-2">
                <div className="text-white">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">
                        {phase === 'searching' && "Buscando Placa..."}
                        {phase === 'analyzing' && "Analizando Diagnóstico..."}
                        {phase === 'completed' && "Vehículo Identificado"}
                    </p>
                    <p className="text-lg font-black tracking-tight">
                        {phase === 'searching' && "SCANNING..."}
                        {phase === 'analyzing' && "COMPUTING DATA"}
                        {phase === 'completed' && "TOYOTA H-450"}
                    </p>
                </div>
                <div className="text-white font-mono text-xl font-bold">{progress}%</div>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                />
            </div>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
            {phase === 'completed' && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-indigo-600/90 backdrop-blur-md flex flex-col items-center justify-center text-white z-30"
                >
                    <IonIcon icon={checkmarkCircle} className="text-7xl mb-4" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">System Ready</h3>
                    <p className="text-sm font-medium opacity-80 mt-2 text-center px-10">Cargando visualización 3D del diagnóstico...</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-center text-white/40 max-w-xs">
          <p className="text-xs font-bold leading-relaxed uppercase tracking-widest">
              Apunta la cámara al frente o a la placa del vehículo para iniciar la detección.
          </p>
      </div>
    </div>
  );
};

export default ScannerOverlay;
