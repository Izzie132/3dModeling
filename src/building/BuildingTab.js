import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { slugify } from './beamData';
import { WIND_FACES } from './buildingConstants';
import House from './House';
import WindArrow from './WindArrow';
import BeamLegend from './BeamLegend';
import WindDirectionSelector from './WindDirectionSelector';

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
      <BeamLegend hoveredLabel={hoveredLabel} onBeamClick={handleBeamClick} />
      <WindDirectionSelector selected={windDirection} onSelect={setWindDirection} />
      <Canvas camera={{ position: [8, 6, 8] }}>
        <BuildingScene hoveredId={hoveredId} onHover={handleHover} onBeamClick={handleBeamClick} windFace={windFace} />
      </Canvas>
    </>
  );
}
