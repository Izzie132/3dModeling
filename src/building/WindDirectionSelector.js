import OverlayPanel from '../components/OverlayPanel';
import { WIND_FACES, WIND_COLOR } from './buildingConstants';

function FaceButton({ label, active, onClick }) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        border: active ? `2px solid ${WIND_COLOR}` : '1px solid rgba(255,255,255,0.2)',
        borderRadius: 6,
        background: active ? 'rgba(230,57,70,0.25)' : 'rgba(255,255,255,0.05)',
        color: active ? WIND_COLOR : 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        padding: 0,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

const GRID_LAYOUT = [
  [null, 'f1', null],
  ['f3', 'center', 'f4'],
  [null, 'f2', null],
];

export default function WindDirectionSelector({ selected, onSelect }) {
  const toggle = (id) => onSelect(selected === id ? null : id);
  const faceById = Object.fromEntries(WIND_FACES.map((f) => [f.id, f]));

  return (
    <OverlayPanel top={52} right={16} style={{ gap: 8 }}>
      <span style={{
        color: WIND_COLOR,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}>
        Wind Direction
      </span>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        gap: 4,
        width: 108,
      }}>
        {GRID_LAYOUT.flat().map((cell, i) => {
          if (cell === 'center') {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: selected ? WIND_COLOR : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.2s',
                }} />
              </div>
            );
          }
          if (!cell) return <div key={i} />;
          const face = faceById[cell];
          return (
            <FaceButton
              key={i}
              label={face.label}
              active={selected === cell}
              onClick={() => toggle(cell)}
            />
          );
        })}
      </div>
    </OverlayPanel>
  );
}
