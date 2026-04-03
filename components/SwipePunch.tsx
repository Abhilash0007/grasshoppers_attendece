import React, { useRef, useState } from 'react';

export const SwipePunch = ({
  onPunch,
  status,
}: {
  onPunch: () => void;
  status: string;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const handleStart = (clientX: number) => {
    setDragging(true);
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!dragging || !sliderRef.current) return;

    const diff = clientX - startX.current;
    const max = sliderRef.current.offsetWidth - 60;

    if (diff > 0 && diff < max) {
      setPosition(diff);
    }
  };

  const handleEnd = () => {
    if (!sliderRef.current) return;

    const max = sliderRef.current.offsetWidth - 60;

    if (position > max * 0.8) {
      setPosition(max);

      // ❌ prevent swipe if already completed
      if (status !== 'Completed') {
        onPunch();
      }
    } else {
      setPosition(0);
    }

    setDragging(false);
  };

  // ✅ Dynamic text
  const getText = () => {
    if (status === 'Working') return 'Swipe to Punch Out';
    if (status === 'Completed') return 'Completed ✓';
    return 'Swipe to Punch In';
  };

  return (
    <div
      ref={sliderRef}
      className="w-full h-14 bg-gray-700/40 rounded-full relative overflow-hidden select-none"
    >
      {/* TEXT */}
      <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-300">
        {getText()}
      </div>

      {/* SLIDER */}
      <div
        className={`absolute top-1 left-1 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          status === 'Completed' ? 'bg-gray-500' : 'bg-green-500'
        }`}
        style={{ transform: `translateX(${position}px)` }}

        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}

        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        ➤
      </div>
    </div>
  );
};