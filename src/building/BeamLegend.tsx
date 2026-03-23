import OverlayPanel from '../components/OverlayPanel';
import { LEGEND_ITEMS } from './buildingConstants';

interface BeamLegendProps {
  hoveredLabel: string | null;
  onBeamClick: (label: string) => void;
}

export default function BeamLegend({ hoveredLabel, onBeamClick }: BeamLegendProps) {
  return (
    <OverlayPanel top={52} left={16}>
      {LEGEND_ITEMS.map((item) => (
        <div
          key={item.label}
          onClick={() => onBeamClick(item.label)}
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
    </OverlayPanel>
  );
}
