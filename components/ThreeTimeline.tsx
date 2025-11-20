import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Stars, useCursor, ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { HistoryEvent, Category } from '../types';
import { HISTORY_EVENTS, calculatePathPosition } from '../constants';

interface TimelineProps {
  onSelectEvent: (event: HistoryEvent) => void;
  activeEventId: string | null;
}

const EventNode: React.FC<{ event: HistoryEvent; isActive: boolean; onClick: () => void }> = ({ event, isActive, onClick }) => {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  const color = event.category === Category.WW2 ? '#ef4444' : '#3b82f6'; // Red for War, Blue for Rights

  return (
    <group position={event.position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <sphereGeometry args={[hovered || isActive ? 0.8 : 0.5, 32, 32]} />
          <meshStandardMaterial
            color={isActive ? '#fbbf24' : color}
            emissive={isActive ? '#fbbf24' : color}
            emissiveIntensity={isActive ? 2 : 0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Text Label */}
        <group position={[1.2, 0, 0]}>
            <Text
                color="white"
                fontSize={hovered || isActive ? 0.6 : 0.4}
                anchorX="left"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000"
            >
                {event.year}
            </Text>
            <Text
                position={[0, -0.5, 0]}
                color="#cbd5e1"
                fontSize={0.3}
                anchorX="left"
                anchorY="middle"
                maxWidth={4}
            >
                {event.title}
            </Text>
        </group>
      </Float>
      
      {/* Connection Line aesthetic */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 10, 8]} />
        <meshBasicMaterial color="rgba(255,255,255,0.1)" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const PathLine = ({ events }: { events: HistoryEvent[] }) => {
  // Generate more granular points for smoother curve rendering than just the event points
  const points = useMemo(() => {
    const curvePoints = [];
    // Generate points slightly before start and after end
    for (let i = -1; i < events.length + 2; i += 0.5) {
        const [x, y, z] = calculatePathPosition(i);
        curvePoints.push(new THREE.Vector3(x, y, z));
    }
    return curvePoints;
  }, [events]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 256, 0.1, 8, false]} />
      <meshStandardMaterial color="#475569" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
};

const TimelineRig = ({ activeEvent }: { activeEvent: HistoryEvent | null }) => {
  const { camera } = useThree();
  const scroll = useScroll();
  
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const smoothedLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (activeEvent) {
      // Active Event Mode: Zoom in and focus
      const [x, y, z] = activeEvent.position;
      // Position camera to the side and slightly front/up
      targetPos.current.set(x + 3, y + 2, z + 6); 
      targetLookAt.current.set(x, y, z);
    } else {
      // Scroll Mode: Calculate position along the path
      const totalLength = HISTORY_EVENTS.length;
      // Map scroll (0 to 1) to timeline index range (roughly -1 to length)
      const currentScrollIndex = scroll.offset * (totalLength + 1);
      
      const camPos = calculatePathPosition(currentScrollIndex);
      const lookPos = calculatePathPosition(currentScrollIndex + 3); // Look ahead on the path

      // Add some camera offset so we aren't inside the line
      targetPos.current.set(camPos[0], camPos[1] + 2, camPos[2] + 10);
      targetLookAt.current.set(lookPos[0], lookPos[1], lookPos[2]);
    }

    // Smoothly interpolate camera position
    state.camera.position.lerp(targetPos.current, 4 * delta);
    
    // Smoothly interpolate lookAt target
    smoothedLookAt.current.lerp(targetLookAt.current, 4 * delta);
    state.camera.lookAt(smoothedLookAt.current);
  });

  return null;
};

export const ThreeTimeline: React.FC<TimelineProps> = ({ onSelectEvent, activeEventId }) => {
  const activeEvent = useMemo(() => HISTORY_EVENTS.find(e => e.id === activeEventId) || null, [activeEventId]);

  return (
    <div className="w-full h-full absolute inset-0 bg-slate-900">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        {/* Fog adds depth perception */}
        <fog attach="fog" args={['#020617', 10, 60]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 20, 10]} intensity={1.5} color="#fbbf24" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
        
        <ScrollControls pages={8} damping={0.3}>
            <TimelineRig activeEvent={activeEvent} />
            
            <group position={[0, 0, 0]}>
                <PathLine events={HISTORY_EVENTS} />
                {HISTORY_EVENTS.map((event) => (
                <EventNode
                    key={event.id}
                    event={event}
                    isActive={activeEventId === event.id}
                    onClick={() => onSelectEvent(event)}
                />
                ))}
            </group>
        </ScrollControls>

      </Canvas>
      
      {/* Instructions Overlay */}
      {!activeEventId && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm pointer-events-none border border-white/10">
            <span className="animate-pulse">▼</span> Scroll to travel through time <span className="mx-2">•</span> Click events to explore
        </div>
      )}
    </div>
  );
};