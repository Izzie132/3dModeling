import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Html } from '@react-three/drei';

const COLORS = {
  ridge: '#E63946',
  eaves: '#457B9D',
  rails: '#2A9D8F',
  rafters: '#E9C46A',
  purlins: '#F4A261',
  ties: '#9B5DE5',
};

const BEAM = 0.1;

let beamIdCounter = 0;

function Beam({ position, args, rotation = [0, 0, 0], color, label, hoveredId, hoveredLabel, onHover }) {
  const [id] = useState(() => ++beamIdCounter);
  const isHovered = hoveredId === id;

  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id, label);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null, null);
      }}
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

function GableRoof({ hoveredId, hoveredLabel, onHover }) {
  const ridgeY = 4.5;
  const eavesY = 3;
  const eavesX = 2.7;
  const roofHalfZ = 2.2;

  const rafterLength = Math.sqrt(eavesX ** 2 + (ridgeY - eavesY) ** 2);
  const rafterAngle = Math.atan2(ridgeY - eavesY, eavesX);
  const rafterZPositions = [-2, -1, 0, 1, 2];

  const purlinFracs = [0.33, 0.66];

  const bp = { hoveredId, hoveredLabel, onHover };

  return (
    <group>
      <Beam position={[0, ridgeY, 0]} args={[BEAM, BEAM, roofHalfZ * 2]} color={COLORS.ridge} label="Ridge Beam" {...bp} />

      <Beam position={[-eavesX, eavesY, 0]} args={[BEAM, BEAM, roofHalfZ * 2]} color={COLORS.eaves} label="Eaves Beam" {...bp} />
      <Beam position={[eavesX, eavesY, 0]} args={[BEAM, BEAM, roofHalfZ * 2]} color={COLORS.eaves} label="Eaves Beam" {...bp} />

      <Beam position={[0, eavesY, -roofHalfZ]} args={[eavesX * 2, BEAM, BEAM]} color={COLORS.rails} label="Rail" {...bp} />
      <Beam position={[0, eavesY, roofHalfZ]} args={[eavesX * 2, BEAM, BEAM]} color={COLORS.rails} label="Rail" {...bp} />

      {rafterZPositions.map((z) => (
        <group key={z}>
          <Beam
            position={[-eavesX / 2, eavesY + (ridgeY - eavesY) / 2, z]}
            args={[rafterLength, BEAM, BEAM]}
            rotation={[0, 0, rafterAngle]}
            color={COLORS.rafters}
            label="Rafter"
            {...bp}
          />
          <Beam
            position={[eavesX / 2, eavesY + (ridgeY - eavesY) / 2, z]}
            args={[rafterLength, BEAM, BEAM]}
            rotation={[0, 0, -rafterAngle]}
            color={COLORS.rafters}
            label="Rafter"
            {...bp}
          />
        </group>
      ))}

      {purlinFracs.map((f) => {
        const x = eavesX * (1 - f);
        const y = eavesY + (ridgeY - eavesY) * f;
        return (
          <group key={f}>
            <Beam position={[-x, y, 0]} args={[BEAM, BEAM, roofHalfZ * 2]} color={COLORS.purlins} label="Purlin" {...bp} />
            <Beam position={[x, y, 0]} args={[BEAM, BEAM, roofHalfZ * 2]} color={COLORS.purlins} label="Purlin" {...bp} />
          </group>
        );
      })}

      {rafterZPositions.map((z) => (
        <Beam
          key={`tie-${z}`}
          position={[0, eavesY, z]}
          args={[eavesX * 2, BEAM, BEAM]}
          color={COLORS.ties}
          label="Tie Beam"
          {...bp}
        />
      ))}
    </group>
  );
}

const KEY_ITEMS = [
  { label: 'Ridge Beam', color: COLORS.ridge },
  { label: 'Eaves Beam', color: COLORS.eaves },
  { label: 'Rail', color: COLORS.rails },
  { label: 'Rafter', color: COLORS.rafters },
  { label: 'Purlin', color: COLORS.purlins },
  { label: 'Tie Beam', color: COLORS.ties },
];

function House({ hoveredId, hoveredLabel, onHover }) {
  return (
    <group>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>

      <GableRoof hoveredId={hoveredId} hoveredLabel={hoveredLabel} onHover={onHover} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a7c3f" />
      </mesh>
    </group>
  );
}

function BuildingScene({ hoveredId, hoveredLabel, onHover }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />

      <House hoveredId={hoveredId} hoveredLabel={hoveredLabel} onHover={onHover} />

      <Sky sunPosition={[100, 50, 100]} />
      <OrbitControls enableDamping dampingFactor={0.1} />
    </>
  );
}

export default function BuildingTab() {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const handleHover = (id, label) => {
    setHoveredId(id);
    setHoveredLabel(label);
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 52,
        left: 16,
        zIndex: 1,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        borderRadius: 8,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {KEY_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '2px 4px',
              borderRadius: 4,
              background: hoveredLabel === item.label ? 'rgba(255,255,255,0.15)' : 'transparent',
            }}
          >
            <div style={{
              width: 16,
              height: 16,
              borderRadius: 3,
              background: item.color,
              flexShrink: 0,
            }} />
            <span style={{
              color: 'white',
              fontSize: 13,
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <Canvas camera={{ position: [8, 6, 8] }}>
        <BuildingScene hoveredId={hoveredId} hoveredLabel={hoveredLabel} onHover={handleHover} />
      </Canvas>
    </>
  );
}
