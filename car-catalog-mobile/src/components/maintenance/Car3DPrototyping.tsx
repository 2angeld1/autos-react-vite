import React, { useState, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Stage, ContactShadows, Line, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { IonIcon, IonModal } from '@ionic/react';
import { alertCircle, checkmarkCircle, warningOutline, closeOutline, expandOutline } from 'ionicons/icons';
import * as THREE from 'three';

// Detectar si es un dispositivo móvil para desactivar post-procesamiento pesado
const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window && window.innerWidth < 1024);
};

interface MaintenanceAlert {
  id: string;
  part: string;
  severity: 'critical' | 'warning' | 'ok';
  message: string;
  location: string;
  action: string;
}

const maintenanceData: MaintenanceAlert[] = [
  {
    id: 'engine',
    part: 'Motor',
    severity: 'critical',
    message: 'Cambio de aceite requerido',
    location: 'Parte delantera (Capó)',
    action: 'Programar servicio en 500 km'
  },
  {
    id: 'tires',
    part: 'Neumáticos',
    severity: 'warning',
    message: 'Desgaste detectado',
    location: 'Ruedas delanteras',
    action: 'Revisar en próximo servicio'
  },
  {
    id: 'bumper',
    part: 'Defensa Trasera',
    severity: 'ok',
    message: 'En buen estado',
    location: 'Parte trasera del vehículo',
    action: 'Ninguna acción requerida'
  }
];

interface MaintenanceTooltipProps {
  alert: MaintenanceAlert;
  onClose: () => void;
}

function MaintenanceTooltip({ alert, onClose }: MaintenanceTooltipProps) {
  const getIcon = () => {
    switch (alert.severity) {
      case 'critical': return alertCircle;
      case 'warning': return warningOutline;
      case 'ok': return checkmarkCircle;
    }
  };

  const getColor = () => {
    switch (alert.severity) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      case 'ok': return 'text-green-500';
    }
  };

  const getBgColor = () => {
    switch (alert.severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/30';
      case 'warning': return 'bg-amber-500/10 border-amber-500/30';
      case 'ok': return 'bg-green-500/10 border-green-500/30';
    }
  };

  return (
    <div
      className={`!bg-slate-900/95 !backdrop-blur-xl !border-2 ${getBgColor()} !rounded-2xl !p-4 !shadow-2xl w-full max-w-[300px] md:max-w-xs`}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${getBgColor()} flex items-center justify-center ${getColor()}`}>
          <IonIcon icon={getIcon()} className="text-xl" />
        </div>
        <div className="flex-1">
          <h4 className="!text-white !font-bold !text-sm !mb-1">{alert.part}</h4>
          <p className="!text-slate-400 !text-[10px] !uppercase !font-bold">{alert.location}</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="!bg-slate-800/50 !rounded-xl !p-3">
          <p className="!text-[10px] !text-slate-500 !uppercase !font-bold !mb-1">Diagnóstico</p>
          <p className="!text-white !text-xs !font-medium">{alert.message}</p>
        </div>

        <div className="!bg-slate-800/50 !rounded-xl !p-3">
          <p className="!text-[10px] !text-slate-500 !uppercase !font-bold !mb-1">Acción Recomendada</p>
          <p className="!text-white !text-xs !font-medium">{alert.action}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="!w-full !bg-slate-800 hover:!bg-slate-700 !text-white !font-bold !py-2.5 !px-4 !rounded-xl !text-xs !transition-colors"
      >
        Cerrar
      </button>
    </div>
  );
}

// Marcador con línea conectora
interface MarkerWithLineProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  color: string;
  label: string;
  onClick: () => void;
}

function MarkerWithLine({ startPosition, endPosition, color, label, onClick }: MarkerWithLineProps) {
  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Línea conectora */}
      <Line
        points={[startPosition, endPosition]}
        color={color}
        lineWidth={2}
        dashed={false}
      />

      {/* Punto en el extremo */}
      <mesh position={endPosition}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Label flotante */}
      <Html position={endPosition} center>
        <div
          className="!bg-slate-900/95 !backdrop-blur-md !px-3 !py-1.5 !rounded-lg !border-2 !pointer-events-none !shadow-xl !whitespace-nowrap cursor-pointer hover:!scale-105 active:!scale-95 transition-transform"
          style={{ borderColor: color }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <p className="!text-white !text-[11px] !font-bold">{label}</p>
        </div>
      </Html>
    </group>
  );
}

// Controlador de cámara inteligente
function CameraController({ selectedPart }: { selectedPart: string | null }) {
  const { controls } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const targetPosRef = useRef(new THREE.Vector3());
  const cameraPosRef = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!controls) return;

    // Iniciar animación
    setIsAnimating(true);

    if (selectedPart === 'engine') {
      // Motor (Capó - Delante)
      targetPosRef.current.set(0, 0.5, 1.0);
      cameraPosRef.current.set(0, 1.5, 2.5);
    } else if (selectedPart === 'tires') {
      // Neumáticos (Frente Derecho)
      targetPosRef.current.set(0.7, 0.35, 1.0);
      cameraPosRef.current.set(2.0, 0.8, 1.8);
    } else if (selectedPart === 'bumper') {
      // Defensa Trasera (Verde)
      targetPosRef.current.set(0, 0.6, -1.8);
      cameraPosRef.current.set(0, 1.2, -3.5);
    } else {
      // Reset
      targetPosRef.current.set(0, 0, 0);
      cameraPosRef.current.set(5, 3, 5);
    }
  }, [selectedPart, controls]);

  useFrame((state, delta) => {
    if (!isAnimating || !controls) return;
    const orbitControls = controls as any;

    const step = 4 * delta;
    state.camera.position.lerp(cameraPosRef.current, step);
    orbitControls.target.lerp(targetPosRef.current, step);
    orbitControls.update();

    if (state.camera.position.distanceTo(cameraPosRef.current) < 0.05) {
      setIsAnimating(false);
    }
  });

  return null;
}

interface InteractiveFerrariProps {
  onPartClick?: (partId: string) => void;
}

function InteractiveFerrari({ onPartClick }: InteractiveFerrariProps) {
  const modelUrl = 'https://threejs.org/examples/models/gltf/ferrari.glb';
  const { scene } = useGLTF(modelUrl);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name.toLowerCase();

        // Base negra
        if (meshName.includes('body')) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 1.5
          });
        }

        // Ruedas amarillas
        if (meshName.includes('wheel') || meshName.includes('rim')) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.6,
            roughness: 0.2
          });
          child.userData.alertId = 'tires';
          child.userData.clickable = true;
        }

        // Cristales
        if (meshName.includes('glass')) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            metalness: 0.9,
            roughness: 0
          });
        }
      }
    });

    return clone;
  }, [scene]);

  // Zona de resaltado NEÓN (con toneMapped=false para Bloom)
  const HighlightZone = ({ position, scale, color, alertId }: any) => (
    <group position={position}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onPartClick?.(alertId); }}
        scale={scale}
      >
        <boxGeometry />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={scale}>
        <boxGeometry />
        <meshBasicMaterial color={color} wireframe transparent opacity={1} toneMapped={false} />
      </mesh>
    </group>
  );

  const markers: { id: string; startPosition: [number, number, number]; endPosition: [number, number, number]; color: string; label: string }[] = [
    {
      id: 'engine',
      startPosition: [0, 0.6, 1.4], // Capó
      endPosition: [-0.8, 1.2, 1.8],
      color: '#ef4444',
      label: '🔴 Motor (Capó)'
    },
    {
      id: 'tires',
      startPosition: [0.75, 0.35, 1.0], // Rueda
      endPosition: [1.4, 0.8, 1.2],
      color: '#f59e0b',
      label: '🟡 Neumáticos'
    },
    {
      id: 'bumper',
      startPosition: [0, 0.8, -1.8], // Defensa Trasera
      endPosition: [0.8, 1.4, -2.2],
      color: '#22c55e',
      label: '🟢 Defensa Trasera'
    }
  ];

  return (
    <group>
      <primitive object={clonedScene} />

      {/* CAPÓ ROJO NEÓN */}
      <HighlightZone
        position={[0, 0.55, 1.3]}
        scale={[1.4, 0.08, 1.2]}
        color="#ef4444"
        alertId="engine"
      />

      {/* DEFENSA TRASERA VERDE NEÓN */}
      <HighlightZone
        position={[0, 0.7, -1.9]}
        scale={[1.6, 0.2, 0.5]}
        color="#22c55e"
        alertId="bumper"
      />

      {markers.map(marker => (
        <MarkerWithLine
          key={marker.id}
          startPosition={marker.startPosition}
          endPosition={marker.endPosition}
          color={marker.color}
          label={marker.label}
          onClick={() => onPartClick?.(marker.id)}
        />
      ))}
    </group>
  );
}

const Car3DPrototyping: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePartClick = (partId: string) => {
    setSelectedPart(selectedPart === partId ? null : partId);
  };

  const getAlertForPart = (partId: string) => {
    return maintenanceData.find(alert => alert.id === partId);
  };

  useEffect(() => {
    if (!isFullscreen) return;

    const lockOrientation = async () => {
      try {
        if (screen.orientation && 'lock' in screen.orientation) {
          await (screen.orientation as any).lock('landscape');
        }
      } catch (error) { console.log('Lock not supported'); }
    };

    const unlockOrientation = () => {
      try {
        if (screen.orientation && 'unlock' in screen.orientation) {
          (screen.orientation as any).unlock();
        }
      } catch (error) { console.log('Unlock not supported'); }
    };

    lockOrientation();
    return () => unlockOrientation();
  }, [isFullscreen]);

  const isMobile = useMemo(() => isMobileDevice(), []);

  const CanvasContent = () => (
    <>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault fov={50} />

        <Stage environment="city" intensity={0.6}>
          <InteractiveFerrari onPartClick={handlePartClick} />
        </Stage>

        {/* SOMBRA DE CONTACTO: Ajustada para "plantar" el auto */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.7}
          scale={10}
          blur={2.0}
          far={1}
          resolution={isMobile ? 256 : 512}
        />
      </Suspense>

      {/* BLOOM POST-PROCESSING - Solo en desktop (causa pantalla blanca en móviles) */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            mipMapBlur
            intensity={1.5}
            radius={0.6}
          />
        </EffectComposer>
      )}

      <CameraController selectedPart={selectedPart} />

      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!selectedPart}
        autoRotateSpeed={0.5}
      />
    </>
  );

  const TooltipOverlay = () => {
    const alert = selectedPart ? getAlertForPart(selectedPart) : null;
    if (!alert) return null;

    return (
      <div className="absolute top-0 bottom-0 left-0 right-0 z-40 pointer-events-none flex items-end justify-center pb-6 px-4 md:items-center md:pb-0">
        <div className="pointer-events-auto animate-[slideInUp_0.3s_ease-out]">
          <MaintenanceTooltip alert={alert} onClose={() => setSelectedPart(null)} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Vista Normal */}
      {!isFullscreen && (
        <div className="w-full aspect-video relative !bg-gradient-to-br !from-slate-900 !via-slate-800 !to-slate-900 !rounded-3xl !overflow-hidden !shadow-lg border border-slate-700/50">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2, 3], fov: 45 }}>
            <CanvasContent />
          </Canvas>

          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-3 right-3 z-50 !w-12 !h-12 !bg-white/10 !backdrop-blur-md !rounded-full flex items-center justify-center !text-white active:!scale-95 !transition-transform !shadow-xl !border !border-white/20 hover:!bg-white/20"
          >
            <IonIcon icon={expandOutline} className="!text-xl" />
          </button>
        </div>
      )}

      {/* Info Panel - Vista Normal (Debajo del Canvas) */}
      {!isFullscreen && selectedPart && (
        <div className="animate-fadeIn w-full flex justify-center">
          <MaintenanceTooltip
            alert={getAlertForPart(selectedPart)!}
            onClose={() => setSelectedPart(null)}
          />
        </div>
      )}

      {/* Indicadores Normal */}
      {!isFullscreen && !selectedPart && (
        <div className="!bg-white !rounded-2xl !p-4 !shadow-lg transition-opacity duration-300">
          <p className="!text-[10px] !text-slate-600 !font-bold !uppercase !mb-3 !tracking-wider">Estado de Partes</p>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="!w-3 !h-3 !bg-red-500 !rounded-full !animate-pulse !shadow-lg !shadow-red-500/50" />
              <span className="!text-xs !text-slate-700 !font-semibold">Motor - Crítico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="!w-3 !h-3 !bg-amber-500 !rounded-full !shadow-lg !shadow-amber-500/50" />
              <span className="!text-xs !text-slate-700 !font-semibold">Neumáticos - Advertencia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="!w-3 !h-3 !bg-green-500 !rounded-full !shadow-lg !shadow-green-500/50" />
              <span className="!text-xs !text-slate-700 !font-semibold">Defensa - OK</span>
            </div>
          </div>
        </div>
      )}

      {/* Vista Fullscreen */}
      <IonModal
        isOpen={isFullscreen}
        onDidDismiss={() => {
          setIsFullscreen(false);
          setSelectedPart(null);
        }}
        className="fullscreen-3d-modal"
      >
        {/* FONDO OSCURO EN FULLSCREEN */}
        <div className="h-full w-full bg-slate-950 relative flex flex-col">
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-end items-start z-50 pointer-events-none">
            <button
              onClick={() => setIsFullscreen(false)}
              className="pointer-events-auto !w-12 !h-12 !bg-white/10 !backdrop-blur-md !rounded-full flex items-center justify-center !text-white active:!scale-90 !transition-transform !shadow-lg border border-white/20"
            >
              <IonIcon icon={closeOutline} className="!text-2xl" />
            </button>
          </div>

          <div className="w-full h-full absolute inset-0">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2, 3], fov: 45 }}>
              <CanvasContent />
            </Canvas>
          </div>

          <TooltipOverlay />

          {!selectedPart && (
            <div className="absolute bottom-6 left-6 right-6 !bg-slate-900/80 !backdrop-blur-md !rounded-2xl !p-4 !border !border-slate-700/50 z-40 transition-opacity duration-300 pointer-events-none shadow-xl">
              <p className="!text-[10px] !text-slate-400 !font-bold !uppercase !mb-2">Indicadores</p>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="!w-3 !h-3 !bg-red-500 !rounded-full !animate-pulse" />
                  <span className="!text-xs !text-white !font-medium">Motor - Crítico</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="!w-3 !h-3 !bg-amber-500 !rounded-full" />
                  <span className="!text-xs !text-white !font-medium">Neumáticos - Advertencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="!w-3 !h-3 !bg-green-500 !rounded-full" />
                  <span className="!text-xs !text-white !font-medium">Defensa - OK</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </IonModal>
    </div>
  );
};

export default Car3DPrototyping;
