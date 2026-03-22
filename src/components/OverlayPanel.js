export default function OverlayPanel({ top = 52, left, right, children, style }) {
  return (
    <div style={{
      position: 'absolute',
      top,
      left,
      right,
      zIndex: 1,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      borderRadius: 8,
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style,
    }}>
      {children}
    </div>
  );
}
