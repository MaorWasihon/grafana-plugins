import React from 'react';
import { UavIcon } from './icons/UavIcon';

export interface IconDefinition {
  id: string;
  label: string;
  render: (color: string, size: number) => React.ReactNode;
}

export const ICON_REGISTRY: IconDefinition[] = [
  {
    id: 'uav-animated',
    label: 'UAV (animated)',
    render: (color, size) => <UavIcon color={color} size={size} animated={true} />,
  },
  {
    id: 'uav-static',
    label: 'UAV (static)',
    render: (color, size) => <UavIcon color={color} size={size} animated={false} />,
  },
];

export const ICON_OPTIONS = ICON_REGISTRY.map((icon) => ({
  value: icon.id,
  label: icon.label,
}));

export function renderIcon(iconId: string, color: string, size: number): React.ReactNode | null {
  const def = ICON_REGISTRY.find((i) => i.id === iconId);
  if (!def) { return null; }
  return def.render(color, size);
}