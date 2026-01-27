import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Stage, ContactShadows } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Componente principal del visor 3D
const Car3DViewer: React.FC = () => {
    // Usamos el modelo del Ferrari de los ejemplos de Three.js
    // Nota: En un caso real, descargarías tu propio .glb de Kia/Hyundai y lo pondrías en la carpeta public
    const modelUrl = 'https://threejs.org/examples/models/gltf/ferrari.glb';

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
        <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
            
            {/* Stage configura automáticamente la iluminación y el entorno para que se vea bien */}
            <Stage environment="city" intensity={0.6}>
                 <Model url={modelUrl} />
            </Stage>

            {/* Sombra de contacto suave en el piso */}
            <ContactShadows position={[0, -0.4, 0]} opacity={0.5} scale={10} blur={1.5} far={0.8} />
        </Suspense>
        
        {/* Controles de órbita restringidos para mejor UX */}
        <OrbitControls 
          enablePan={false}
          minDistance={2.5}
          maxDistance={5}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Loading Overlay (si es necesario manejar carga explícita) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <Suspense fallback={<div className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Cargando modelo 3D...</div>}>
            <></>
         </Suspense>
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm inline-block px-3 py-1.5 rounded-full border border-white/10">
          Ferrari 458 Italia Demo
        </p>
      </div>
    </div>
  );
};

export default Car3DViewer;
