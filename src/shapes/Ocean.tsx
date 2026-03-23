import { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}

export default function Ocean() {
  const ref = useRef<Water>(null);
  const { gl } = useThree();

  const waterNormals = useMemo(() => {
    return new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/waternormals.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    );
  }, []);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(100, 20, 100).normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      format: (gl as unknown as { encoding: number }).encoding,
    }),
    [waterNormals, gl]
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
    }
  });

  return (
    <water
      ref={ref as React.Ref<unknown>}
      args={[new THREE.PlaneGeometry(10000, 10000), config]}
      rotation-x={-Math.PI / 2}
      position={[0, -1, 0]}
    />
  );
}
