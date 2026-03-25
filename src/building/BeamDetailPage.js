import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BEAM_TYPES } from './beamData';
import { PALETTE } from './buildingConstants';

const GHOST = PALETTE.ghost;
const B = 0.1;

function DiagramBeam({ position, args, rotation = [0, 0, 0], color }) {
  const isGhost = color === GHOST;
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        transparent={isGhost}
        opacity={isGhost ? 0.25 : 1}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}

function RoofDiagram({ highlight }) {
  const ridgeY = 1.5;
  const eavesY = 0;
  const eavesX = 2.7;
  const roofHalfZ = 2.2;

  const rafterLength = Math.sqrt(eavesX ** 2 + (ridgeY - eavesY) ** 2);
  const rafterAngle = Math.atan2(ridgeY - eavesY, eavesX);
  const rafterZPositions = [-2, -1, 0, 1, 2];
  const purlinFracs = [0.33, 0.66];
  const MUTED = PALETTE.muted;

  const c = (type) => type === highlight ? BEAM_TYPES[highlight]?.color || '#fff' : GHOST;

  return (
    <group>
      {/* Muted placeholder rafters */}
      {rafterZPositions.map((z) => (
        <group key={`rafter-${z}`}>
          <mesh position={[-eavesX / 2, eavesY + (ridgeY - eavesY) / 2, z]} rotation={[0, 0, rafterAngle]}>
            <boxGeometry args={[rafterLength, B, B]} />
            <meshStandardMaterial color={MUTED} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
          </mesh>
          <mesh position={[eavesX / 2, eavesY + (ridgeY - eavesY) / 2, z]} rotation={[0, 0, -rafterAngle]}>
            <boxGeometry args={[rafterLength, B, B]} />
            <meshStandardMaterial color={MUTED} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
          </mesh>
        </group>
      ))}

      {/* Muted placeholder tie beams */}
      {rafterZPositions.map((z) => (
        <mesh key={`tie-${z}`} position={[0, eavesY, z]}>
          <boxGeometry args={[eavesX * 2, B, B]} />
          <meshStandardMaterial color={MUTED} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
      ))}

      {/* Muted placeholder ridge beam */}
      <mesh position={[0, ridgeY, 0]}>
        <boxGeometry args={[B, B, roofHalfZ * 2]} />
        <meshStandardMaterial color={MUTED} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>

      <DiagramBeam position={[-eavesX, eavesY, 0]} args={[B, B, roofHalfZ * 2]} color={c('eaves-beam')} />
      <DiagramBeam position={[eavesX, eavesY, 0]} args={[B, B, roofHalfZ * 2]} color={c('eaves-beam')} />

      {/* Rails on long sides */}
      {[-eavesX, eavesX].map((x) =>
        [eavesY - 0.75, eavesY - 0.375, eavesY].map((y) => (
          <DiagramBeam key={`rail-${x}-${y}`} position={[x, y, 0]} args={[B, B, roofHalfZ * 2]} color={c('rail')} />
        ))
      )}

      {purlinFracs.map((f) => {
        const x = eavesX * (1 - f);
        const y = eavesY + (ridgeY - eavesY) * f;
        return (
          <group key={f}>
            <DiagramBeam position={[-x, y, 0]} args={[B, B, roofHalfZ * 2]} color={c('purlin')} />
            <DiagramBeam position={[x, y, 0]} args={[B, B, roofHalfZ * 2]} color={c('purlin')} />
          </group>
        );
      })}

    </group>
  );
}

export default function BeamDetailPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const beam = BEAM_TYPES[type];

  if (!beam) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: PALETTE.pageBg,
        color: PALETTE.textPrimary,
        flexDirection: 'column',
        gap: 16,
      }}>
        <h2>Beam type not found</h2>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: PALETTE.pageBg,
      color: PALETTE.textPrimary,
      overflow: 'auto',
    }}>
      <div style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: beam.color,
            flexShrink: 0,
          }} />
          <h1 style={{ margin: 0, fontSize: 28 }}>{beam.label}</h1>
        </div>

        <div style={{
          width: '100%',
          height: 300,
          marginTop: 24,
          borderRadius: 12,
          overflow: 'hidden',
          background: PALETTE.canvasBg,
          border: `1px solid ${PALETTE.border}`,
        }}>
          <Canvas camera={{ position: [5, 3, 5], fov: 40 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <RoofDiagram highlight={type} />
            <OrbitControls enableDamping dampingFactor={0.1} autoRotate autoRotateSpeed={1.5} />
          </Canvas>
        </div>

        <p style={{
          fontSize: 16,
          lineHeight: 1.7,
          marginTop: 24,
          color: PALETTE.textPrimary,
        }}>
          {beam.description}
        </p>

        <ul style={{
          marginTop: 24,
          paddingLeft: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {beam.details.map((detail, i) => (
            <li key={i} style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: PALETTE.textSecondary,
            }}>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const backButtonStyle = {
  padding: '8px 16px',
  border: `1px solid ${PALETTE.accent}`,
  borderRadius: 6,
  background: 'transparent',
  color: PALETTE.accent,
  cursor: 'pointer',
  fontSize: 14,
};
