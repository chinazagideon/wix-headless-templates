import {
  TruckIcon,
  HomeIcon,
  BoxIcon,
  SofaIcon,
  House,
  Building,
  Building2,
  HandHelping,
  PianoIcon,
  TableIcon,
  TvIcon,
  BrushIcon,
  DumbbellIcon,
  HouseIcon,
  BuildingIcon,
} from 'lucide-react';

export type IconType = typeof HomeIcon;

/**
 * iconComponents
 */
export const iconComponents = {
  TruckIcon,
  HomeIcon,
  BuildingIcon,
  BoxIcon,
  SofaIcon,
  House,
  Building,
  Building2,
  HandHelping,
  PianoIcon,
  TableIcon,
  TvIcon,
  BrushIcon,
  DumbbellIcon,
  HouseIcon,
} as const;

/**
 * iconAlias
 */
export const iconAlias: Record<string, keyof typeof iconComponents> = {
  // normalized keys -> component names
  truck: 'TruckIcon',
  home: 'HomeIcon',
  office: 'BuildingIcon',
  buildingoffice: 'BuildingIcon',
  box: 'BoxIcon',
  sofa: 'SofaIcon',
  house: 'House',
  building: 'Building',
  building2: 'Building2',
  moving: 'HandHelping',
  residential: 'HomeIcon',
  commercial: 'BuildingIcon',
  packing: 'BoxIcon',
  unpacking: 'BoxIcon',
  piano: 'PianoIcon',
  pooltable: 'TableIcon',
  majorappliances: 'TvIcon',
  artwork: 'BrushIcon',
  workoutequipments: 'DumbbellIcon',
  numberofboxes: 'BoxIcon',
  hottubs: 'HouseIcon',
};

/**
 * getIconFromKey
 * @param key - The key
 * @returns {IconType} - The icon type
 */
export function getIconFromKey(key?: string): IconType {
  if (!key) return TruckIcon;
  const trimmed = key.trim();

  // Exact match by exported component name
  const exact = (iconComponents as Record<string, IconType>)[trimmed];
  if (exact) return exact;

  // Normalized alias match (case-insensitive, strip spaces and trailing "Icon")
  const normalized = trimmed
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/icon$/, '');
  const aliasKey = iconAlias[normalized];
  if (aliasKey) return iconComponents[aliasKey];

  // 3) Fallback
  return TruckIcon;
}

/**
 * getIconForService
 * @param serviceName - The service name
 * @returns {IconType} - The icon type
 */
export const getIconForService = (serviceName?: string): IconType => {
  if (!serviceName) return TruckIcon;
  const firstWord = serviceName.trim().split(/\s+/)[0].toLowerCase();
  return iconComponents[iconAlias[firstWord]] ?? TruckIcon;
};
