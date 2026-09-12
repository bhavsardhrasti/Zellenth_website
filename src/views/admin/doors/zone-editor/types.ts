export interface ZonePoint {
  x: number;
  y: number;
}

export interface DoorZone {
  zoneId: string;
  label?: string;
  points: ZonePoint[];
}

export interface DoorImage {
  url: { full: string; mid: string };
  isPrimary: boolean;
}

export interface DoorRecord {
  name: string;
  images: DoorImage[];
  zones: DoorZone[];
}

export interface LaminateOption {
  _id: string;
  name: string;
  images: { url: { mid: string }; isPrimary: boolean }[];
}
