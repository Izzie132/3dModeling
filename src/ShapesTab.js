import { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import FloatingObject from './components/FloatingObject';
import Ocean from './components/Ocean';
import CameraController from './components/CameraController';

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

export default function ShapesTab() {
  const [focusTarget, setFocusTarget] = useState(null);
  const [focusedName, setFocusedName] = useState(null);

  const handleFocus = useCallback((obj) => {
    setFocusTarget(obj.position);
    setFocusedName(obj.name);
  }, []);

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 52,
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
    </>
  );
}
