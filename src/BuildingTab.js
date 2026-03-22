import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Html } from '@react-three/drei';
import * as THREE from 'three';
import { slugify } from './beamData';

const COLORS = {
  eaves: '#457B9D',
  rails: '#2A9D8F',
  purlins: '#F4A261',
};

const BEAM = 0.1;
const MUTED = '#2a2a2a';

let beamIdCounter = 0;

function Beam({ position, args, rotation = [0, 0, 0], color, label, hoveredId, onHover, onBeamClick }) {
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
      onClick={(e) => {
        e.stopPropagation();
        onBeamClick(label);
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

function GableRoof({ hoveredId, onHover, onBeamClick }) {
  const ridgeY = 4.5;
  const eavesY = 3;
  const eavesX = 2.7;
  const roofHalfZ = 4.4;

  const rafterLength = Math.sqrt(eavesX ** 2 + (ridgeY - eavesY) ** 2);
  const rafterAngle = Math.atan2(ridgeY - eavesY, eavesX);
  const rafterZPositions = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const purlinFracs = [0.33, 0.66];

  const bp = { hoveredId, onHover, onBeamClick };

  return (
    <group>
      {/* Muted placeholder rafters */}
      {rafterZPositions.map((z) => (
        <group key={`rafter-${z}`}>
          <mesh position={[-eavesX / 2, eavesY + (ridgeY - eavesY) / 2, z]} rotation={[0, 0, rafterAngle]}>
            <boxGeometry args={[rafterLength, BEAM, BEAM]} />
            <meshStandardMaterial color={MUTED} />
          </mesh>
          <mesh position={[eavesX / 2, eavesY + (ridgeY - eavesY) / 2, z]} rotation={[0, 0, -rafterAngle]}>
            <boxGeometry args={[rafterLength, BEAM, BEAM]} />
            <meshStandardMaterial color={MUTED} />
          </mesh>
        </group>
      ))}

      {/* Muted placeholder tie beams */}
      {rafterZPositions.map((z) => (
        <mesh key={`tie-${z}`} position={[0, eavesY, z]}>
          <boxGeometry args={[eavesX * 2, BEAM, BEAM]} />
          <meshStandardMaterial color={MUTED} />
        </mesh>
      ))}

      {/* Muted placeholder ridge beam */}
      <mesh position={[0, ridgeY, 0]}>
        <boxGeometry args={[BEAM, BEAM, roofHalfZ * 2]} />
        <meshStandardMaterial color={MUTED} />
      </mesh>

      <Beam position={[-eavesX, eavesY, 0]} args={[BEAM, BEAM, roofHalfZ * 2]} color={COLORS.eaves} label="Eaves Beam" {...bp} />
      <Beam position={[eavesX, eavesY, 0]} args={[BEAM, BEAM, roofHalfZ * 2]} color={COLORS.eaves} label="Eaves Beam" {...bp} />

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

    </group>
  );
}

const KEY_ITEMS = [
  { label: 'Eaves Beam', color: COLORS.eaves },
  { label: 'Rail', color: COLORS.rails },
  { label: 'Purlin', color: COLORS.purlins },
];

const WALL = MUTED;
const WALL_BEAM = 0.1;

function WallFrame({ hoveredId, onHover, onBeamClick }) {
  const hw = 2;
  const hd = 3.5;
  const h = 3;
  const railYPositions = [h * 0.25, h * 0.5, h * 0.75];

  const corners = [
    [-hw, 0, -hd], [hw, 0, -hd], [hw, 0, hd], [-hw, 0, hd],
  ];

  const bp = { hoveredId, onHover, onBeamClick };

  return (
    <group>
      {corners.map(([x, , z], i) => (
        <mesh key={`post-${i}`} position={[x, h / 2, z]}>
          <boxGeometry args={[WALL_BEAM, h, WALL_BEAM]} />
          <meshStandardMaterial color={WALL} />
        </mesh>
      ))}

      {/* Rails on gable ends */}
      {[-hd, hd].map((z) =>
        railYPositions.map((y) => (
          <Beam
            key={`rail-end-${z}-${y}`}
            position={[0, y, z]}
            args={[hw * 2, WALL_BEAM, WALL_BEAM]}
            color={COLORS.rails}
            label="Rail"
            {...bp}
          />
        ))
      )}

      {/* Rails on each long side */}
      {[-hw, hw].map((x) =>
        railYPositions.map((y) => (
          <Beam
            key={`rail-${x}-${y}`}
            position={[x, y, 0]}
            args={[WALL_BEAM, WALL_BEAM, hd * 2]}
            color={COLORS.rails}
            label="Rail"
            {...bp}
          />
        ))
      )}
    </group>
  );
}

function House({ hoveredId, onHover, onBeamClick }) {
  return (
    <group>
      <WallFrame hoveredId={hoveredId} onHover={onHover} onBeamClick={onBeamClick} />

      <GableRoof hoveredId={hoveredId} onHover={onHover} onBeamClick={onBeamClick} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a7c3f" />
      </mesh>
    </group>
  );
}

const WIND_FACES = [
  { id: 'f1', label: 'F1', direction: [0, 0, -1], arrowPos: [0, 2, -6.5],  rotation: 0 },
  { id: 'f2', label: 'F2', direction: [0, 0, 1],  arrowPos: [0, 2, 6.5],   rotation: Math.PI },
  { id: 'f3', label: 'F3', direction: [-1, 0, 0], arrowPos: [-5, 2, 0],    rotation: Math.PI / 2 },
  { id: 'f4', label: 'F4', direction: [1, 0, 0],  arrowPos: [5, 2, 0],     rotation: -Math.PI / 2 },
];

function WindArrow({ face }) {
  const groupRef = useRef();
  const bobOffset = useRef(Math.random() * Math.PI * 2);

  const arrowShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Arrow pointing in +Z direction (toward building)
    shape.moveTo(0, 0.6);        // tip
    shape.lineTo(-0.35, -0.1);   // left barb
    shape.lineTo(-0.12, -0.1);   // left neck
    shape.lineTo(-0.12, -0.6);   // left tail bottom
    shape.lineTo(0.12, -0.6);    // right tail bottom
    shape.lineTo(0.12, -0.1);    // right neck
    shape.lineTo(0.35, -0.1);    // right barb
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + bobOffset.current;
    groupRef.current.position.y = face.arrowPos[1] + Math.sin(t * 1.5) * 0.15;
  });

  return (
    <group
      ref={groupRef}
      position={face.arrowPos}
      rotation={[0, face.rotation, 0]}
    >
      {/* Arrow rotated to lay flat pointing toward building */}
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <mesh>
          <extrudeGeometry args={[arrowShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#E63946"
            emissive="#E63946"
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </group>
      <Html distanceFactor={15} center position={[0, 1, 0]}>
        <div style={{
          color: '#E63946',
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

function BuildingScene({ hoveredId, onHover, onBeamClick, windFace }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />

      <House hoveredId={hoveredId} onHover={onHover} onBeamClick={onBeamClick} />

      {windFace && <WindArrow face={windFace} />}

      <Sky sunPosition={[100, 50, 100]} />
      <OrbitControls enableDamping dampingFactor={0.1} />
    </>
  );
}

export default function BuildingTab() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [windDirection, setWindDirection] = useState(null);

  const handleHover = (id, label) => {
    setHoveredId(id);
    setHoveredLabel(label);
  };

  const handleBeamClick = (label) => {
    navigate(`/beam/${slugify(label)}`);
  };

  const windFace = WIND_FACES.find((f) => f.id === windDirection) || null;

  return (
    <>
      {/* Legend */}
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
            onClick={() => handleBeamClick(item.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '2px 4px',
              borderRadius: 4,
              cursor: 'pointer',
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

      {/* Wind Direction Selector */}
      <div style={{
        position: 'absolute',
        top: 52,
        right: 16,
        zIndex: 1,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        borderRadius: 8,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <span style={{
          color: '#E63946',
          fontSize: 12,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          Wind Direction
        </span>

        {/* Compass-style grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 4,
          width: 108,
        }}>
          {/* Row 1: _, F1, _ */}
          <div />
          <WindButton
            label="F1"
            symbol={"\u2193"}
            active={windDirection === 'f1'}
            onClick={() => setWindDirection(windDirection === 'f1' ? null : 'f1')}
          />
          <div />

          {/* Row 2: F3, indicator, F4 */}
          <WindButton
            label="F3"
            symbol={"\u2192"}
            active={windDirection === 'f3'}
            onClick={() => setWindDirection(windDirection === 'f3' ? null : 'f3')}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: windDirection ? '#E63946' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.2s',
            }} />
          </div>
          <WindButton
            label="F4"
            symbol={"\u2190"}
            active={windDirection === 'f4'}
            onClick={() => setWindDirection(windDirection === 'f4' ? null : 'f4')}
          />

          {/* Row 3: _, F2, _ */}
          <div />
          <WindButton
            label="F2"
            symbol={"\u2191"}
            active={windDirection === 'f2'}
            onClick={() => setWindDirection(windDirection === 'f2' ? null : 'f2')}
          />
          <div />
        </div>
      </div>

      <Canvas camera={{ position: [8, 6, 8] }}>
        <BuildingScene hoveredId={hoveredId} onHover={handleHover} onBeamClick={handleBeamClick} windFace={windFace} />
      </Canvas>
    </>
  );
}

function WindButton({ label, symbol, active, onClick }) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        border: active ? '2px solid #E63946' : '1px solid rgba(255,255,255,0.2)',
        borderRadius: 6,
        background: active ? 'rgba(230,57,70,0.25)' : 'rgba(255,255,255,0.05)',
        color: active ? '#E63946' : 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        padding: 0,
        lineHeight: 1,
        gap: 1,
        fontFamily: 'inherit',
      }}
    >
      <span style={{ fontSize: 10 }}>{label}</span>
    </button>
  );
}
