import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { WIND_COLOR } from './buildingConstants';

const EXTRUDE_SETTINGS = {
  depth: 0.08,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.02,
  bevelSegments: 2,
};

function createArrowShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.6);
  shape.lineTo(-0.35, -0.1);
  shape.lineTo(-0.12, -0.1);
  shape.lineTo(-0.12, -0.6);
  shape.lineTo(0.12, -0.6);
  shape.lineTo(0.12, -0.1);
  shape.lineTo(0.35, -0.1);
  shape.closePath();
  return shape;
}

export default function WindArrow({ face }) {
  const groupRef = useRef();
  const bobOffset = useRef(Math.random() * Math.PI * 2);
  const arrowShape = useMemo(createArrowShape, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + bobOffset.current;
    groupRef.current.position.y = face.arrowPos[1] + Math.sin(t * 1.5) * 0.15;
  });

  return (
    <group ref={groupRef} position={face.arrowPos} rotation={[0, face.rotation, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <extrudeGeometry args={[arrowShape, EXTRUDE_SETTINGS]} />
          <meshStandardMaterial
            color={WIND_COLOR}
            emissive={WIND_COLOR}
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </group>
      <Html distanceFactor={15} center position={[0, 1, 0]}>
        <div style={{
          color: WIND_COLOR,
          fontSize: 12,
          fontWeight: 'bold',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {face.label}
        </div>
      </Html>
    </group>
  );
}
