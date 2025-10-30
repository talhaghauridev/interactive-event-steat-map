export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: 1 | 2 | 3;
  status: 'available' | 'reserved' | 'sold' | 'held';
}

export interface Row {
  index: number;
  seats: Seat[];
}

export interface Section {
  id: string;
  label: string;
  transform: { x: number; y: number; scale: number };
  rows: Row[];
}

export interface Venue {
  venueId: string;
  name: string;
  map: { width: number; height: number };
  sections: Section[];
}
