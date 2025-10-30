'use client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PRICE_MAP } from '@/lib/constants';
import React, { useCallback, useState } from 'react';

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

const SeatComponent = React.memo(
  ({
    seat,
    isSelected,
    onSelect,
    heatMap,
    isMobile,
  }: {
    seat: Seat;
    isSelected: boolean;
    onSelect: (seat: Seat) => void;
    heatMap: boolean;
    isMobile: boolean;
  }) => {
    const [open, setOpen] = useState(false);

    const handleClick = useCallback(() => {
      if (seat.status === 'available') {
        if (isSelected) {
          setOpen(true);
        } else {
          onSelect(seat);
        }
      }
    }, [seat, onSelect, isSelected]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (seat.status === 'available') {
            if (isSelected) {
              setOpen(true);
            } else {
              onSelect(seat);
            }
          }
        }
      },
      [seat, onSelect, isSelected]
    );

    let fillColor = '#3b82f6';
    let strokeColor = '#2563eb';

    if (heatMap) {
      const heatColors = { 1: '#86efac', 2: '#fde047', 3: '#fca5a5' };
      fillColor = heatColors[seat.priceTier] || '#d1d5db';
      strokeColor = '#9ca3af';
    } else if (isSelected) {
      fillColor = '#10b981';
      strokeColor = '#059669';
    } else if (seat.status === 'available') {
      fillColor = '#3b82f6';
      strokeColor = '#2563eb';
    } else {
      fillColor = '#ef4444';
      strokeColor = '#dc2626';
    }

    return (
      <foreignObject
        x={seat.x - 12}
        y={seat.y - 12}
        width={24}
        height={24}
        style={{ overflow: 'visible' }}>
        <Popover
          open={open}
          onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              style={{
                width: '24px',
                height: '24px',
                minWidth: '44px',
                minHeight: '44px',
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: seat.status === 'available' ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'manipulation',
              }}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              aria-label={`Seat ${seat.id}, ${seat.status}, price $${PRICE_MAP[seat.priceTier]}`}
              aria-pressed={isSelected}
              disabled={seat.status !== 'available'}
              tabIndex={seat.status === 'available' ? 0 : -1}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill={fillColor}
                  stroke={open ? '#3b82f6' : strokeColor}
                  strokeWidth={open ? 3 : 1}
                  style={{
                    transition: 'all 0.2s ease',
                    opacity: seat.status === 'available' ? 1 : 0.5,
                  }}
                />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 p-3 sm:w-64 sm:p-4"
            side={isMobile ? 'top' : 'right'}
            align="center"
            sideOffset={5}>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-900 sm:text-base">Seat Info</h4>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                    seat.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : seat.status === 'reserved'
                        ? 'bg-yellow-100 text-yellow-800'
                        : seat.status === 'sold'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                  }`}>
                  {seat.status}
                </span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Section:</span>
                  <span className="font-medium text-gray-900">{seat.id.split('-')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Row:</span>
                  <span className="font-medium text-gray-900">{seat.id.split('-')[1]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-medium text-gray-900">{seat.id.split('-')[2]}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-base font-bold text-blue-600 sm:text-lg">
                    ${PRICE_MAP[seat.priceTier]}
                  </span>
                </div>
              </div>
              {seat.status === 'available' && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onSelect(seat);
                    setOpen(false);
                  }}
                  className={`mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                    isSelected
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}>
                  {isSelected ? 'Remove' : 'Add'}
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </foreignObject>
    );
  }
);

export default SeatComponent;
