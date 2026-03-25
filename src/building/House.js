import WallFrame from './WallFrame';
import GableRoof from './GableRoof';
import { PALETTE } from './buildingConstants';

export default function House({ hoveredId, onHover, onBeamClick }) {
  return (
    <group>
      <WallFrame hoveredId={hoveredId} onHover={onHover} onBeamClick={onBeamClick} />
      <GableRoof hoveredId={hoveredId} onHover={onHover} onBeamClick={onBeamClick} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={PALETTE.ground} />
      </mesh>
    </group>
  );
}
