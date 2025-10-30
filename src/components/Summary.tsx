'use client';

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

const Summary = ({
  selectedSeats,
  subtotal,
  onClear,
  isMobile,
}: {
  selectedSeats: Seat[];
  subtotal: number;
  onClear: () => void;
  isMobile: boolean;
}) => {
  if (selectedSeats.length === 0) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t-2 border-gray-200 bg-white shadow-2xl">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:text-base">
              {selectedSeats.length}/8 Seats
            </h3>
            {!isMobile && selectedSeats.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.slice(0, 4).map(seat => (
                  <span
                    key={seat.id}
                    className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800">
                    {seat.id}
                  </span>
                ))}
                {selectedSeats.length > 4 && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                    +{selectedSeats.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 sm:text-xl">${subtotal}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <button
              onClick={onClear}
              className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600 sm:px-3 sm:py-2 sm:text-sm"
              aria-label="Clear all">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
