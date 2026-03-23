export const featureFlags: Record<string, boolean> = {
  shapes: process.env.REACT_APP_SHAPES === 'true',
  building: process.env.REACT_APP_BUILDING === 'true',
};
