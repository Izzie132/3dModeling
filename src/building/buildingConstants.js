// ── Brand & UI palette ──────────────────────────────────────────
export const BRAND_GREEN = '#2E7D32';

export const PALETTE = {
  ground:          '#787878',   // Light grey – building ground plane
  pageBg:          '#2e2e2e',   // Medium-dark charcoal – detail page background
  canvasBg:        '#ffffff',   // White – detail page 3D canvas
  ghost:           '#cccccc',   // Muted beams (semi-visible) in detail diagrams
  muted:           '#e0e0e0',   // Very faint structural beams in detail diagrams
  textPrimary:     '#e0e0e0',   // Main body text
  textSecondary:   '#aaaaaa',   // Secondary / list text
  border:          'rgba(255,255,255,0.12)', // Subtle borders
  accent:          '#2E7D32',   // Brand green – buttons, highlights
  accentHover:     '#43A047',   // Lighter green for hover states
};

// ── Beam colours (unchanged) ────────────────────────────────────
export const BEAM_COLORS = {
  eaves: '#457B9D',
  rails: '#2A9D8F',
  purlins: '#F4A261',
};

export const BEAM_THICKNESS = 0.1;
export const STRUCTURAL_COLOR = '#2a2a2a';

export const LEGEND_ITEMS = [
  { label: 'Eaves Beam', color: BEAM_COLORS.eaves },
  { label: 'Rail', color: BEAM_COLORS.rails },
  { label: 'Purlin', color: BEAM_COLORS.purlins },
];

export const WIND_FACES = [
  { id: 'f1', label: 'F1', arrowPos: [0, 2, -6.5],  rotation: 0 },
  { id: 'f2', label: 'F2', arrowPos: [0, 2, 6.5],   rotation: Math.PI },
  { id: 'f3', label: 'F3', arrowPos: [-5, 2, 0],    rotation: Math.PI / 2 },
  { id: 'f4', label: 'F4', arrowPos: [5, 2, 0],     rotation: -Math.PI / 2 },
];

export const WIND_COLOR = '#E63946';
