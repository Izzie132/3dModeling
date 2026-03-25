import InteractiveBeam from './InteractiveBeam';
import { BEAM_COLORS, BEAM_THICKNESS, STRUCTURAL_COLOR } from './buildingConstants';

const RIDGE_Y = 4.5;
const EAVES_Y = 3;
const EAVES_X = 2.7;
const ROOF_HALF_Z = 4.4;
const RAFTER_LENGTH = Math.sqrt(EAVES_X ** 2 + (RIDGE_Y - EAVES_Y) ** 2);
const RAFTER_ANGLE = Math.atan2(RIDGE_Y - EAVES_Y, EAVES_X);
const RAFTER_Z_POSITIONS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const PURLIN_FRACTIONS = [0.33, 0.66];

function StructuralMember({ position, args, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={STRUCTURAL_COLOR} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
    </mesh>
  );
}

export default function GableRoof({ hoveredId, onHover, onBeamClick }) {
  const beamProps = { hoveredId, onHover, onClick: onBeamClick };
  const B = BEAM_THICKNESS;

  return (
    <group>
      {RAFTER_Z_POSITIONS.map((z) => (
        <group key={`rafter-${z}`}>
          <StructuralMember
            position={[-EAVES_X / 2, EAVES_Y + (RIDGE_Y - EAVES_Y) / 2, z]}
            rotation={[0, 0, RAFTER_ANGLE]}
            args={[RAFTER_LENGTH, B, B]}
          />
          <StructuralMember
            position={[EAVES_X / 2, EAVES_Y + (RIDGE_Y - EAVES_Y) / 2, z]}
            rotation={[0, 0, -RAFTER_ANGLE]}
            args={[RAFTER_LENGTH, B, B]}
          />
        </group>
      ))}

      {RAFTER_Z_POSITIONS.map((z) => (
        <StructuralMember key={`tie-${z}`} position={[0, EAVES_Y, z]} args={[EAVES_X * 2, B, B]} />
      ))}

      <StructuralMember position={[0, RIDGE_Y, 0]} args={[B, B, ROOF_HALF_Z * 2]} />

      <InteractiveBeam position={[-EAVES_X, EAVES_Y, 0]} args={[B, B, ROOF_HALF_Z * 2]} color={BEAM_COLORS.eaves} label="Eaves Beam" {...beamProps} />
      <InteractiveBeam position={[EAVES_X, EAVES_Y, 0]} args={[B, B, ROOF_HALF_Z * 2]} color={BEAM_COLORS.eaves} label="Eaves Beam" {...beamProps} />

      {PURLIN_FRACTIONS.map((f) => {
        const x = EAVES_X * (1 - f);
        const y = EAVES_Y + (RIDGE_Y - EAVES_Y) * f;
        return (
          <group key={f}>
            <InteractiveBeam position={[-x, y, 0]} args={[B, B, ROOF_HALF_Z * 2]} color={BEAM_COLORS.purlins} label="Purlin" {...beamProps} />
            <InteractiveBeam position={[x, y, 0]} args={[B, B, ROOF_HALF_Z * 2]} color={BEAM_COLORS.purlins} label="Purlin" {...beamProps} />
          </group>
        );
      })}
    </group>
  );
}
