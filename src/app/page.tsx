'use client';
import SeatComponent from '@/components/Seat';
import SectionCard from '@/components/SectionCard';
import Summary from '@/components/Summary';
import { Button } from '@/components/ui/button';
import { PRICE_MAP } from '@/lib/constants';
import venueData from '@/lib/venue.json';
import { Seat, Venue } from '@/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function SeatingMap() {
  const venue = venueData as Venue;
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [heatMap, setHeatMap] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('selectedSeats');
    if (saved) {
      try {
        const parsed: Seat[] = JSON.parse(saved);
        setSelectedSeats(parsed.filter(seat => seat.status === 'available'));
      } catch (e) {
        console.error('Failed to parse saved seats');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  const handleSelect = useCallback((seat: Seat) => {
    if (seat.status !== 'available') return;
    setSelectedSeats(prev => {
      const isAlreadySelected = prev.some(s => s.id === seat.id);
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== seat.id);
      } else if (prev.length < 8) {
        return [...prev, seat];
      }
      return prev;
    });
  }, []);

  const handleClear = useCallback(() => setSelectedSeats([]), []);

  const subtotal = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + (PRICE_MAP[seat.priceTier] || 0), 0),
    [selectedSeats]
  );

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + 0.3, 3)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 0.3, 0.5)), []);
  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'svg' || target.tagName === 'g' || target.tagName === 'text') {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    },
    [pan]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <header className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-base font-bold sm:text-xl md:text-2xl">{venue.name}</h1>
            <Button
              onClick={() => setHeatMap(!heatMap)}
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              className="cursor-pointer text-gray-800"
              aria-pressed={heatMap}>
              {heatMap ? '🔥' : '💺'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-3 py-2 sm:px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          {!isMobile && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomIn}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-200"
                aria-label="Zoom in">
                🔍+
              </button>
              <button
                onClick={handleZoomOut}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-200"
                aria-label="Zoom out">
                🔍−
              </button>
              <button
                onClick={handleResetView}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-200"
                aria-label="Reset">
                Reset
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#f7a1a1]"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-auto bg-gray-100"
        style={{ paddingBottom: selectedSeats.length > 0 ? (isMobile ? '80px' : '100px') : '0' }}>
        {isMobile ? (
          <div className="space-y-4 p-4">
            {venue.sections.map(section => (
              <SectionCard
                key={section.id}
                section={section}
                selectedSeats={selectedSeats}
                onSelect={handleSelect}
                heatMap={heatMap}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div
            className="absolute inset-0 overflow-auto"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}>
            <div
              className="flex min-h-full min-w-full items-center justify-center p-4"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}>
              <svg
                ref={svgRef}
                className="rounded-lg bg-white shadow-lg"
                viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
                style={{
                  width: 'min(95vw, 1000px)',
                  height: 'auto',
                  maxWidth: '100%',
                }}
                role="application"
                aria-label="Seating map">
                {venue.sections.map(section => (
                  <g
                    key={section.id}
                    transform={`translate(${section.transform.x}, ${section.transform.y}) scale(${section.transform.scale})`}>
                    <text
                      x="0"
                      y="-20"
                      fontSize="18"
                      fontWeight="700"
                      fill="#1f2937"
                      style={{ userSelect: 'none', pointerEvents: 'none' }}>
                      {section.label}
                    </text>
                    {section.rows.map(row => (
                      <g key={row.index}>
                        {row.seats.map(seat => (
                          <SeatComponent
                            key={seat.id}
                            seat={seat}
                            isSelected={selectedSeats.some(s => s.id === seat.id)}
                            onSelect={handleSelect}
                            heatMap={heatMap}
                            isMobile={isMobile}
                          />
                        ))}
                      </g>
                    ))}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>

      <Summary
        selectedSeats={selectedSeats}
        subtotal={subtotal}
        onClear={handleClear}
        isMobile={isMobile}
      />
    </div>
  );
}
