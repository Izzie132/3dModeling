import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import InfoButton from './InfoButton';

export default function FloatingObject({ position, color, name, info, touchpoints, isSelected, onClick, children }) {
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
