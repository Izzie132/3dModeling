import { useState } from 'react';
import { Html } from '@react-three/drei';

let nextId = 0;

interface InteractiveBeamProps {
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  label: string;
  hoveredId: number | null;
  onHover: (id: number | null, label: string | null) => void;
  onClick: (label: string) => void;
}

export default function InteractiveBeam({ position, args, rotation = [0, 0, 0], color, label, hoveredId, onHover, onClick }: InteractiveBeamProps) {
  const [id] = useState(() => ++nextId);
  const isHovered = hoveredId === id;

  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id, label); }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null, null); }}
      onClick={(e) => { e.stopPropagation(); onClick(label); }}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
      {isHovered && (
        <Html distanceFactor={15} center position={[0, 0.6, 0]}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}
