'use client';

import React from 'react';
import { useClock } from '@/hooks';
import { format } from 'date-fns';

export const Clock: React.FC = () => {
  const time = useClock();

  return (
    <div className="text-center">
      <div className="text-6xl md:text-7xl font-bold text-blue-600 font-mono">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="text-xl text-gray-600 mt-2">
        {format(time, 'EEEE, MMMM d, yyyy')}
      </div>
    </div>
  );
};
