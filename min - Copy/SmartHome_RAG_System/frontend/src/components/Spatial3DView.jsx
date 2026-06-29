
import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Bounds, useBounds, useGLTF, ContactShadows, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- Error Boundary for 3D Errors ---
class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("3D RENDER CRASHED:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900/50 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Spatial 3D Failure</p>
          <p className="text-[8px] text-slate-400">The 3D model could not be loaded. Please ensure 'house.glb' exists in 'public/models/'.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Logic to center camera on targeted assets
function SelectToZoom({ children, currentZone, currentDevice }) {
  const bounds = useBounds();
  const [hasFit, setHasFit] = useState(false);
  
  const { scene } = useThree();

  useEffect(() => {
    let targetName = "";
    if (currentDevice) targetName = currentDevice.id.toLowerCase();
    else if (currentZone) targetName = currentZone.toLowerCase();

    if (targetName) {
        // Find the specific mesh in the scene
        let targetObj = null;
        scene.traverse((node) => {
            if (node.name.toLowerCase() === targetName) {
                targetObj = node;
            }
        });

        if (targetObj) {
            bounds.refresh(targetObj).clip().fit();
        } else {
            bounds.refresh().clip().fit();
        }
    } else {
        bounds.refresh().clip().fit();
    }
  }, [currentZone, currentDevice, bounds, scene]);

  return <group>{children}</group>;
}

// Safe Model Loader (Handles missing files gracefully)
function HouseModel({ url, currentZone, currentDevice }) {
    // If the file is missing, Suspense handles it but if it fails to fetch, useGLTF might stay suspended
    let gltf;
    try {
        gltf = useGLTF(url);
    } catch (err) {
        console.error("Model loading error", err);
        throw err;
    }

    const { scene } = gltf;

    useEffect(() => {
        scene.traverse((node) => {
            if (node.isMesh) {
                const nodeName = node.name.toLowerCase();
                const isActive = (currentZone && nodeName === currentZone.toLowerCase()) || 
                                 (currentDevice && nodeName === currentDevice.id.toLowerCase());
                
                if (isActive) {
                    node.material.emissive = new THREE.Color(nodeName.includes('light') ? "#fbbf24" : "#3b82f6");
                    node.material.emissiveIntensity = 2;
                } else {
                    node.material.emissiveIntensity = 0.1;
                }
            }
        });
    }, [scene, currentZone, currentDevice]);

    return <primitive object={scene} />;
}

const Spatial3DView = ({ currentZone, onZoneSelect, currentDevice, stats }) => {
  const modelUrl = '/models/house.glb';
  const [isAssetReady, setIsAssetReady] = useState(true);

  if (!isAssetReady) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0c0e16] border border-white/5 rounded-2xl relative">
            <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Digital Twin Offline
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 animate-pulse">Waiting for house.glb...</p>
            <p className="text-[8px] text-slate-600 px-8 text-center uppercase tracking-tighter">Please place your 3D model in public/models/ to activate the digital twin</p>
        </div>
    );
  }

  return (
    <ThreeErrorBoundary>
        <div className="w-full h-full min-h-[300px] bg-[#0c0e16] rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl group">
        <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={40} />
            <Suspense fallback={<Html center><p className="text-[8px] font-black text-blue-500 uppercase animate-pulse">Streaming Assets...</p></Html>}>
                <Bounds fit clip observe margin={1.2}>
                    <SelectToZoom currentZone={currentZone} currentDevice={currentDevice}>
                        <HouseModel url={modelUrl} currentZone={currentZone} currentDevice={currentDevice} />
                    </SelectToZoom>
                </Bounds>
                <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={20} blur={24} far={4} />
            </Suspense>

            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
        </Canvas>
        </div>
    </ThreeErrorBoundary>
  );
};

export default Spatial3DView;
