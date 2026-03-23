import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraControllerProps {
  target: [number, number, number] | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export default function CameraController({ target, controlsRef }: CameraControllerProps) {
  useFrame(() => {
    if (controlsRef.current && target) {
      const t = controlsRef.current.target;
      t.lerp(new THREE.Vector3(...target), 0.05);
      controlsRef.current.update();
    }
  });
  return null;
}
