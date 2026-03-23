import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraController({ target, controlsRef }) {
  useFrame(() => {
    if (controlsRef.current && target) {
      const t = controlsRef.current.target;
      t.lerp(new THREE.Vector3(...target), 0.05);
      controlsRef.current.update();
    }
  });
  return null;
}
