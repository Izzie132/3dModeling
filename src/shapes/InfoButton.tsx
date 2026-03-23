import { Html } from '@react-three/drei';

interface InfoButtonProps {
  color: string;
  label: string;
  info: string;
  position: [number, number, number];
  activeLabel: string | null;
  onOpen: (label: string | null) => void;
}

export default function InfoButton({ color, label, info, position: btnPosition, activeLabel, onOpen }: InfoButtonProps) {
  const isOpen = activeLabel === label;

  return (
    <Html distanceFactor={15} position={btnPosition} center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isOpen && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: 10,
              maxWidth: 220,
              fontSize: 13,
              lineHeight: 1.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              borderLeft: `4px solid ${color}`,
              marginBottom: 8,
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 6 }}>
              {label}
            </div>
            <div>{info}</div>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(isOpen ? null : label);
          }}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px solid white',
            background: color,
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            lineHeight: 1,
          }}
        >
          {isOpen ? '\u00d7' : 'i'}
        </button>
      </div>
    </Html>
  );
}
