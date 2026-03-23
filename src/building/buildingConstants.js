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
