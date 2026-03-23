import React from 'react';

interface OverlayPanelProps {
  top?: number;
  left?: number;
  right?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function OverlayPanel({ top = 52, left, right, children, style }: OverlayPanelProps) {
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
