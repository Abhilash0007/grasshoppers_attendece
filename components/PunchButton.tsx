'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useGeolocation } from '@/hooks';
import { useApiCall } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import { PunchRecord } from '@/types';

interface PunchButtonProps {
  onSuccess?: (data: PunchRecord) => void;
}

export const PunchButton: React.FC<PunchButtonProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const { location, getLocation } = useGeolocation();
  const { post, get } = useApiCall();
  const [todayPunch, setTodayPunch] = React.useState<PunchRecord[] | null>(null);

React.useEffect(() => {
  get('/api/punch/history?limit=1').then((res: any) => {
    setTodayPunch(res?.data || []);
  }).catch(() => setTodayPunch([]));
}, [get]);
  React.useEffect(() => {
    if (todayPunch?.[0]?.status === 'active') {
      setIsPunchedIn(true);
    }
  }, [todayPunch]);

  const handlePunch = async (type: 'in' | 'out') => {
    try {
      setIsLoading(true);
      
      // Get location and wait for it
      let geoLocation = location;
      if (!geoLocation) {
        geoLocation = await getLocation();
      }

      const endpoint = type === 'in' ? '/api/punch/in' : '/api/punch/out';
      const data = await post<{ success: boolean; data: PunchRecord; error?: string }>(endpoint, {
        latitude: geoLocation?.latitude || 0,
        longitude: geoLocation?.longitude || 0,
      });

      if (data.success) {
        if (type === 'in') {
          toast.success('Punched in successfully!');
          setIsPunchedIn(true);
        } else {
          toast.success('Punched out successfully!');
          setIsPunchedIn(false);
        }
        onSuccess?.(data.data);
      } else {
        toast.error(data.error || 'Error punching');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error punching');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
      <button
        onClick={() => handlePunch('in')}
        disabled={isPunchedIn || isLoading}
        className="btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Punch In'}
      </button>
      <button
        onClick={() => handlePunch('out')}
        disabled={!isPunchedIn || isLoading}
        className="btn-danger btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Punch Out'}
      </button>
    </div>
  );
};
