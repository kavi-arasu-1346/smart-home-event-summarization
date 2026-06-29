import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Zap } from 'lucide-react';

// 3D coordinates for camera positions and targets per zone
// Zoom targets are calibrated so that Zone 2 (Bedroom) focuses on Y = 2.0 (representing the top floor)
const CAMERA_SETTINGS = {
    Room1: { position: new THREE.Vector3(-3.5, 3.5, -3.5), target: new THREE.Vector3(-1.0, 0.8, -1.0) },
    Room2: { position: new THREE.Vector3(3.5, 5.5, -3.5), target: new THREE.Vector3(1.0, 2.6, -1.0) }, // Raised higher for upper top floor focus
    Room3: { position: new THREE.Vector3(-3.5, 3.5, 3.5), target: new THREE.Vector3(-1.0, 0.8, 1.0) },
    Kitchen: { position: new THREE.Vector3(3.5, 3.5, 3.5), target: new THREE.Vector3(1.0, 0.8, 1.0) },
    default: { position: new THREE.Vector3(0, 7, 9), target: new THREE.Vector3(0, 0.5, 0) }
};

// 3D positions for the overlay panels inside the rooms
// The Bedroom (Room2) marker position Y is raised to 2.4 to place it on the top floor
const ROOM_MARKERS = [
    { id: 'Room1', name: 'Zone 1 (Living Room)', position: [-1.2, 1.2, -1.2] },
    { id: 'Room2', name: 'Zone 2 (Bedroom)', position: [1.2, 3.2, -1.2] }, // Raised to 3.2 to place it higher up on the top floor
    { id: 'Room3', name: 'Zone 3 (Office)', position: [-1.2, 1.2, 1.2] },
    { id: 'Kitchen', name: 'Zone 4 (Kitchen)', position: [1.2, 1.2, 1.2] }
];

// Handles camera zoom/pan animations smoothly
// Automatically stops active lerping once the camera arrives at the target zone,
// freeing up the camera for easy 360 rotation without stiffness.
function CameraAnimator({ currentZone, controlsRef }) {
    const lastZoneRef = useRef(currentZone);
    const isAnimatingRef = useRef(true);

    // Whenever currentZone changes, trigger smooth lerping transition
    if (lastZoneRef.current !== currentZone) {
        lastZoneRef.current = currentZone;
        isAnimatingRef.current = true;
    }

    useFrame((state) => {
        if (!isAnimatingRef.current) return;

        const setting = CAMERA_SETTINGS[currentZone] || CAMERA_SETTINGS.default;
        
        // Smoothly lerp camera position
        state.camera.position.lerp(setting.position, 0.05);
        
        // Smoothly lerp controls target
        if (controlsRef.current) {
            controlsRef.current.target.lerp(setting.target, 0.05);
            controlsRef.current.update();
        }

        // Deactivate transition lock once camera and controls are near target positions,
        // giving full, lag-free rotational control back to OrbitControls.
        const distCam = state.camera.position.distanceTo(setting.position);
        const distTarget = controlsRef.current 
            ? controlsRef.current.target.distanceTo(setting.target)
            : 0;

        if (distCam < 0.03 && distTarget < 0.03) {
            isAnimatingRef.current = false;
        }
    });

    return null;
}

// Loads the house GLB model
function HouseModel() {
    const { scene } = useGLTF('/house.glb');
    
    // Enable shadows and tweak materials for a premium look
    scene.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
                node.material.roughness = 0.4;
                node.material.metalness = 0.2;
            }
        }
    });

    return <primitive object={scene} scale={[0.8, 0.8, 0.8]} position={[0, 0, 0]} />;
}

// Fallback loader component
function Loader3D() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-slate-900/90 border border-slate-700/80 px-5 py-3 rounded-2xl backdrop-blur-md shadow-2xl">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-slate-400 mt-3 tracking-widest uppercase animate-pulse">Loading 3D Intel...</span>
            </div>
        </Html>
    );
}

export default function HouseViewer({ currentZone, onZoneChange, deviceStatuses, energyMetrics }) {
    const controlsRef = useRef();

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Holographic Sidebar Tag */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold tracking-wide text-xs uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    3D Spatial Intelligence
                </div>
            </div>

            {/* Canvas Viewport */}
            <Canvas
                shadows
                camera={{ position: [0, 7, 9], fov: 45 }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
            >
                {/* Cinematic Lighting System */}
                <ambientLight intensity={0.5} />
                <hemisphereLight intensity={0.4} groundColor={new THREE.Color('#0a0f1d')} />
                
                <directionalLight
                    position={[8, 12, 8]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-bias={-0.0001}
                />
                
                <pointLight position={[-6, 6, -6]} intensity={0.6} color="#3b82f6" />
                <pointLight position={[6, 4, 6]} intensity={0.4} color="#10b981" />

                {/* 3D GLB Model of the House */}
                <Suspense fallback={<Loader3D />}>
                    <HouseModel />
                </Suspense>

                {/* Holographic 3D Status Panels inside the rooms */}
                {ROOM_MARKERS.map((marker) => {
                    const status = deviceStatuses?.[marker.id] || 'off';
                    const isActive = currentZone === marker.id;
                    const energy = energyMetrics?.[marker.id] || '0.00';

                    return (
                        <Html
                            key={marker.id}
                            position={marker.position}
                            center
                            distanceFactor={6}
                            className="pointer-events-auto"
                        >
                            <div
                                onClick={() => onZoneChange(marker.id)}
                                className={`
                                    flex flex-col gap-1.5 p-3 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 cursor-pointer min-w-[130px] group
                                    ${isActive 
                                        ? 'bg-[#0f172a]/95 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-110' 
                                        : 'bg-[#0b0f19]/90 border-slate-700/80 hover:border-slate-500 shadow-lg hover:scale-105'}
                                `}
                            >
                                <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                                    {marker.id === 'Room1' ? 'Living Room' : marker.id === 'Room2' ? 'Bedroom (Top)' : marker.id === 'Room3' ? 'Office' : 'Kitchen'}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${status === 'on' ? 'bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]' : 'bg-slate-600'}`}></span>
                                    <span className="text-xs font-semibold text-slate-200">
                                        Bulb: <span className={status === 'on' ? 'text-yellow-400 font-bold' : 'text-slate-400'}>{status.toUpperCase()}</span>
                                    </span>
                                </div>

                                {/* Hover-reveal Energy Tooltip */}
                                <div className="overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-500 ease-in-out">
                                    <div className="pt-1.5 mt-1.5 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                                        <Zap size={11} className="animate-pulse" />
                                        Power: {energy} kWh
                                    </div>
                                </div>
                            </div>
                        </Html>
                    );
                })}

                {/* Interactive Orbit Controls with wide free zoom range */}
                <OrbitControls
                    ref={controlsRef}
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={0.1}
                    maxDistance={45}
                    maxPolarAngle={Math.PI / 2.1} // Prevent going below ground level
                />

                {/* Smooth Camera Zoom/Pan Animator */}
                <CameraAnimator currentZone={currentZone} controlsRef={controlsRef} />
            </Canvas>

            {/* Bottom floating helper badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-slate-900/80 border border-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-lg text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                Drag to rotate • Scroll to zoom • Hover marker for energy • Click to focus
            </div>
        </div>
    );
}
