import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// 3D Car Primitive Prototyping
const CarModel = ({ alerts }: { alerts: string[] }) => {
  const group = useRef<THREE.Group>(null);
  
  // Basic animation
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Chassis - Just a box for prototyping */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.6, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Cabin */}
      <mesh castShadow position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.5, 0.6, 2]} />
        <meshStandardMaterial color="#0f172a" roughness={0} metalness={1} transparent opacity={0.6} />
      </mesh>

      {/* Wheels */}
      {[[0.8, 0.2, 1.2], [-0.8, 0.2, 1.2], [0.8, 0.2, -1.2], [-0.8, 0.2, -1.2]].map((pos, i) => (
        <mesh key={i} position={pos as any} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}

      {/* HOTSPOTS - This is the "Brilliant" part */}
      
      {/* Engine Hotspot */}
      <Hotspot 
        position={[0, 0.8, 1.2]} 
        color="#ef4444" 
        label="Motor: Aceite Bajo" 
        active={alerts.includes('engine')}
        shops={[
          { name: 'AutoZone Premium', price: '$45.00', dist: '1.2 km' },
          { name: 'Lubricantes Express', price: '$38.50', dist: '2.5 km' }
        ]}
      />
      
      {/* Brakes Hotspot */}
      <Hotspot 
        position={[0.9, 0.4, -1.2]} 
        color="#f59e0b" 
        label="Frenos: Desgaste 80%" 
        active={alerts.includes('brakes')}
        shops={[
          { name: 'Brembo Master Center', price: '$120.00', dist: '0.8 km' },
          { name: 'Frenos Seguros S.A.', price: '$95.00', dist: '4.1 km' }
        ]}
      />

      {/* Battery Hotspot */}
      <Hotspot 
        position={[-0.5, 0.8, 1.0]} 
        color="#3b82f6" 
        label="Batería: OK" 
        active={alerts.includes('battery')}
        shops={[
          { name: 'Battery Plus', price: '$110.00', dist: '3.0 km' }
        ]}
      />
    </group>
  );
};

const Hotspot = ({ position, color, label, active, shops = [] }: any) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const s = (selected ? 1.4 : 1) + Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
      if (active) meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setSelected(!selected);
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={active ? color : "#94a3b8"} 
          emissive={active ? color : "#000"}
          emissiveIntensity={selected ? 5 : 2}
        />
      </mesh>
      
      {(hovered || active || selected) && (
        <Html distanceFactor={10} position={[0, 0.4, 0]} center>
          <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${selected ? 'scale-110' : 'scale-100'}`}>
            <div className={`px-3 py-1.5 rounded-full whitespace-nowrap text-[10px] font-bold border backdrop-blur-md shadow-lg ${
              active 
                ? 'bg-red-500/90 text-white border-red-400' 
                : 'bg-slate-900/80 text-white border-slate-700'
            }`}>
              {label} {selected && "• Select"}
            </div>

            {selected && (
              <div className="bg-slate-900/95 border border-white/10 backdrop-blur-xl rounded-2xl p-3 shadow-2xl w-48 animate-in fade-in zoom-in duration-300">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nearby Options</p>
                <div className="space-y-2">
                  {shops.map((shop: any, idx: number) => (
                    <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-white">{shop.name}</span>
                        <span className="text-[10px] font-bold text-green-400">{shop.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-500">{shop.dist}</span>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] px-2 py-1 rounded-md font-bold transition-colors pointer-events-auto">
                          ORDER
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

const Car3DPrototyping: React.FC<{ alerts?: string[] }> = ({ alerts = ['engine', 'brakes'] }) => {
  return (
    <div className="w-full h-[400px] bg-slate-950 rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/5">
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Diagnóstico Activo</span>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={35} />
        <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.1} 
            autoRotate={true}
            autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <CarModel alerts={alerts} />
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between items-end pointer-events-none">
          <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Modelo Detectado</p>
              <p className="text-sm font-bold text-white">GENERIC SEDAN V1</p>
          </div>
          
          <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Precisión Scan</p>
              <p className="text-sm font-bold text-green-400">98.4%</p>
          </div>
      </div>
    </div>
  );
};

export default Car3DPrototyping;
