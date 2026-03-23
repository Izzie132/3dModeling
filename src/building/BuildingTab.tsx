import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { slugify } from './beamData';
import { WIND_FACES } from './buildingConstants';
import type { WindFace } from './buildingConstants';
import House from './House';
import WindArrow from './WindArrow';
import BeamLegend from './BeamLegend';
import WindDirectionSelector from './WindDirectionSelector';

interface BuildingSceneProps {
  hoveredId: number | null;
  onHover: (id: number | null, label: string | null) => void;
  onBeamClick: (label: string) => void;
  windFace: WindFace | null;
}

function BuildingScene({ hoveredId, onHover, onBeamClick, windFace }: BuildingSceneProps) {
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
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [windDirection, setWindDirection] = useState<string | null>(null);

  const handleHover = (id: number | null, label: string | null) => {
    setHoveredId(id);
    setHoveredLabel(label);
  };

  const handleBeamClick = (label: string) => {
    navigate(`/beam/${slugify(label)}`);
  };

  const windFace = WIND_FACES.find((f) => f.id === windDirection) || null;

  return (
    <>
      <BeamLegend hoveredLabel={hoveredLabel} onBeamClick={handleBeamClick} />
      <WindDirectionSelector selected={windDirection} onSelect={setWindDirection} />
      <Canvas camera={{ position: [8, 6, 8] }}>
        <BuildingScene hoveredId={hoveredId} onHover={handleHover} onBeamClick={handleBeamClick} windFace={windFace} />
      </Canvas>
    </>
  );
}
