'use client';
import SeatComponent from './Seat';

interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: 1 | 2 | 3;
  status: 'available' | 'reserved' | 'sold' | 'held';
}

interface Row {
  index: number;
  seats: Seat[];
}

interface Section {
  id: string;
  label: string;
  transform: { x: number; y: number; scale: number };
  rows: Row[];
}

interface Venue {
  venueId: string;
  name: string;
  map: { width: number; height: number };
  sections: Section[];
}

const SectionCard = ({
  section,
  selectedSeats,
  onSelect,
  heatMap,
  isMobile,
}: {
  section: Section;
  selectedSeats: Seat[];
  onSelect: (seat: Seat) => void;
  heatMap: boolean;
  isMobile: boolean;
}) => {
  return (
    <div className="mb-4 w-full rounded-lg bg-white p-4 shadow-lg">
      <h3 className="mb-3 text-lg font-bold text-gray-900">{section.label}</h3>
      <svg
        className="w-full"
        viewBox="0 0 450 250"
        style={{ height: 'auto', maxHeight: '300px' }}>
        <g transform="translate(20, 20)">
          {section.rows.map(row => (
            <g key={row.index}>
              {row.seats.map(seat => (
                <SeatComponent
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeats.some(s => s.id === seat.id)}
                  onSelect={onSelect}
                  heatMap={heatMap}
                  isMobile={isMobile}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SectionCard;
