export interface BeamType {
  label: string;
  color: string;
  description: string;
  details: string[];
}

export const BEAM_TYPES: Record<string, BeamType> = {
  'eaves-beam': {
    label: 'Eaves Beam',
    color: '#457B9D',
    description: 'Eaves beams (also called wall plates) run horizontally along the top of the walls at the base of the roof. They form the lower edge of the roof slope and often extend beyond the wall to create an overhang.',
    details: [
      'Provide the bearing surface for the foot of each rafter.',
      'Transfer roof loads down into the walls below.',
      'The overhang beyond the wall protects the facade from rain.',
      'Typically fixed to the top of the wall with straps or bolts.',
    ],
  },
  'rail': {
    label: 'Rail',
    color: '#2A9D8F',
    description: 'Rails run horizontally along the long sides of the building, fixed between the corner posts. They provide lateral bracing and a fixing surface for cladding or infill panels.',
    details: [
      'Run the full length of each side wall between corner posts.',
      'Evenly spaced vertically to divide the wall into bays.',
      'Provide attachment points for cladding, sheeting, or infill.',
      'Help resist racking forces and stiffen the wall frame.',
    ],
  },
  'purlin': {
    label: 'Purlin',
    color: '#F4A261',
    description: 'Purlins are horizontal beams that run along the length of the roof, parallel to the ridge and eaves. They sit across the rafters at intermediate points on the slope.',
    details: [
      'Reduce the unsupported span of each rafter, allowing lighter timbers.',
      'Provide a fixing surface for roof battens or sheeting.',
      'Typically positioned at one-third and two-thirds of the rafter length.',
      'Essential in larger roofs where rafters alone cannot span the full distance.',
    ],
  },
};

export function slugify(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}
