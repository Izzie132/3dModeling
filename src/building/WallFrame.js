import InteractiveBeam from './InteractiveBeam';
import { BEAM_COLORS, BEAM_THICKNESS, STRUCTURAL_COLOR } from './buildingConstants';

const HALF_WIDTH = 2;
const HALF_DEPTH = 3.5;
const WALL_HEIGHT = 3;
const RAIL_Y_POSITIONS = [WALL_HEIGHT * 0.25, WALL_HEIGHT * 0.5, WALL_HEIGHT * 0.75];
const CORNERS = [
  [-HALF_WIDTH, 0, -HALF_DEPTH],
  [HALF_WIDTH, 0, -HALF_DEPTH],
  [HALF_WIDTH, 0, HALF_DEPTH],
  [-HALF_WIDTH, 0, HALF_DEPTH],
];

export default function WallFrame({ hoveredId, onHover, onBeamClick }) {
  const beamProps = { hoveredId, onHover, onClick: onBeamClick };
  const B = BEAM_THICKNESS;

  return (
    <group>
      {CORNERS.map(([x, , z], i) => (
        <mesh key={`post-${i}`} position={[x, WALL_HEIGHT / 2, z]}>
          <boxGeometry args={[B, WALL_HEIGHT, B]} />
          <meshStandardMaterial color={STRUCTURAL_COLOR} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
        </mesh>
      ))}

      {[-HALF_DEPTH, HALF_DEPTH].map((z) =>
        RAIL_Y_POSITIONS.map((y) => (
          <InteractiveBeam
            key={`rail-end-${z}-${y}`}
            position={[0, y, z]}
            args={[HALF_WIDTH * 2, B, B]}
            color={BEAM_COLORS.rails}
            label="Rail"
            {...beamProps}
          />
        ))
      )}

      {[-HALF_WIDTH, HALF_WIDTH].map((x) =>
        RAIL_Y_POSITIONS.map((y) => (
          <InteractiveBeam
            key={`rail-${x}-${y}`}
            position={[x, y, 0]}
            args={[B, B, HALF_DEPTH * 2]}
            color={BEAM_COLORS.rails}
            label="Rail"
            {...beamProps}
          />
        ))
      )}
    </group>
  );
}
