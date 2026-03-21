import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Sky, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import './App.css';

extend({ Water });

function Ocean() {
  const ref = useRef();
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
      format: gl.encoding,
    }),
    [waterNormals, gl.encoding]
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
    }
  });

  return (
    <water
      ref={ref}
      args={[new THREE.PlaneGeometry(10000, 10000), config]}
      rotation-x={-Math.PI / 2}
      position={[0, -1, 0]}
    />
  );
}

function InfoButton({ color, label, info, position: btnPosition, activeLabel, onOpen }) {
  const isOpen = activeLabel === label;

  return (
    <Html distanceFactor={15} position={btnPosition} center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isOpen && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: 10,
              maxWidth: 220,
              fontSize: 13,
              lineHeight: 1.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              borderLeft: `4px solid ${color}`,
              marginBottom: 8,
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
              {label}
            </div>
            <div>{info}</div>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(isOpen ? null : label);
          }}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px solid white',
            background: color,
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            lineHeight: 1,
          }}
        >
          {isOpen ? '\u00d7' : 'i'}
        </button>
      </div>
    </Html>
  );
}

function FloatingObject({ position, color, name, info, touchpoints, isSelected, onClick, children }) {
  const ref = useRef();
  const [activeLabel, setActiveLabel] = useState(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8 + offset) * 0.15;
      if (!isSelected) ref.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh onClick={onClick}>
        {children}
        <meshStandardMaterial color={color} />
      </mesh>
      {isSelected && touchpoints && touchpoints.map((tp) => (
        <InfoButton
          key={tp.label}
          color={color}
          label={tp.label}
          info={tp.info}
          position={tp.offset}
          activeLabel={activeLabel}
          onOpen={setActiveLabel}
        />
      ))}
      {isSelected && !touchpoints && info && (
        <InfoButton
          color={color}
          label={name}
          info={info}
          position={[0, 2.2, 0]}
          activeLabel={activeLabel}
          onOpen={setActiveLabel}
        />
      )}
    </group>
  );
}

function CameraController({ target, controlsRef }) {
  useFrame(() => {
    if (controlsRef.current && target) {
      const t = controlsRef.current.target;
      t.lerp(new THREE.Vector3(...target), 0.05);
      controlsRef.current.update();
    }
  });
  return null;
}

const objects = [
  {
    name: 'Cube',
    position: [0, 0, 0],
    color: 'royalblue',
    geometry: 'box',
    info: 'The cube has 6 faces, 12 edges, and 8 vertices. It is one of the five Platonic solids and is also known as a regular hexahedron.',
  },
  {
    name: 'Sphere',
    position: [8, 0, -4],
    color: 'coral',
    geometry: 'sphere',
    info: 'A sphere is perfectly symmetrical in all directions. Every point on its surface is the same distance from the center. It has the smallest surface area for a given volume.',
  },
  {
    name: 'Cone',
    position: [-6, 0, 5],
    color: 'mediumseagreen',
    geometry: 'cone',
    info: 'A cone has a circular base that tapers smoothly to a point called the apex. Volcanoes, ice cream cones, and party hats are all cone-shaped.',
  },
  {
    name: 'Torus',
    position: [5, 0, 8],
    color: 'gold',
    geometry: 'torus',
    info: 'A torus is a doughnut-shaped surface of revolution. It can be formed by rotating a circle around an axis that does not intersect the circle.',
  },
  {
    name: 'Cylinder',
    position: [-8, 0, -6],
    color: 'mediumpurple',
    geometry: 'cylinder',
    info: 'A cylinder has two parallel circular bases connected by a curved surface. Cans, pipes, and pillars are common examples of cylindrical shapes.',
  },
  {
    name: 'Dodecahedron',
    position: [-3, 0, -10],
    color: 'tomato',
    geometry: 'dodecahedron',
    touchpoints: [
      { label: 'Faces', offset: [0, 2.2, 0], info: 'The dodecahedron has 12 regular pentagonal faces. Each face is a perfect pentagon with equal sides and angles.' },
      { label: 'Edges', offset: [2, 0.5, 0], info: 'It has 30 edges. Three edges meet at every vertex, forming a sturdy and symmetrical structure.' },
      { label: 'History', offset: [-2, 0.5, 0], info: 'Plato associated the dodecahedron with the cosmos. The ancient Greeks believed it represented the shape of the universe.' },
      { label: 'Maths', offset: [0, -0.5, 2], info: 'The ratio of the diagonal to the edge of a pentagon is the golden ratio (1.618...). The dodecahedron is deeply connected to this number.' },
    ],
  },
];

function Scene({ onFocus, focusTarget, focusedName }) {
  const controlsRef = useRef();

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      {objects.map((obj) => (
        <FloatingObject
          key={obj.name}
          position={obj.position}
          color={obj.color}
          name={obj.name}
          info={obj.info}
          touchpoints={obj.touchpoints}
          isSelected={focusedName === obj.name}
          onClick={() => onFocus(obj)}
        >
          {obj.geometry === 'box' && <boxGeometry args={[2, 2, 2]} />}
          {obj.geometry === 'sphere' && <sphereGeometry args={[1.2, 32, 32]} />}
          {obj.geometry === 'cone' && <coneGeometry args={[1.2, 2.5, 32]} />}
          {obj.geometry === 'torus' && <torusGeometry args={[1.2, 0.5, 16, 32]} />}
          {obj.geometry === 'cylinder' && <cylinderGeometry args={[0.8, 0.8, 2.5, 32]} />}
          {obj.geometry === 'dodecahedron' && <dodecahedronGeometry args={[1.3]} />}
        </FloatingObject>
      ))}

      <Ocean />
      <Sky sunPosition={[100, 20, 100]} />
      <CameraController target={focusTarget} controlsRef={controlsRef} />
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.1} />
    </>
  );
}

function App() {
  const [focusTarget, setFocusTarget] = useState(null);
  const [focusedName, setFocusedName] = useState(null);

  const handleFocus = useCallback((obj) => {
    setFocusTarget(obj.position);
    setFocusedName(obj.name);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1,
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        {objects.map((obj) => (
          <button
            key={obj.name}
            onClick={() => handleFocus(obj)}
            style={{
              padding: '8px 14px',
              border: focusedName === obj.name ? '2px solid white' : '2px solid transparent',
              borderRadius: 6,
              background: obj.color,
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: 13,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {obj.name}
          </button>
        ))}
      </div>
      <Canvas camera={{ position: [10, 6, 10] }}>
        <Scene onFocus={handleFocus} focusTarget={focusTarget} focusedName={focusedName} />
      </Canvas>
    </div>
  );
}

export default App;
