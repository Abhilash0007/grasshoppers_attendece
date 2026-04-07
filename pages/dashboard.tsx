'use client';

import React from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useAuth } from '@/context/auth';
import { useApi } from '@/hooks/useApi';
import { useApiCall } from '@/hooks/useApi';
import { PunchRecord } from '@/types';
import { format } from 'date-fns';
import { FiHome, FiUsers, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const { post } = useApiCall();

  const [time, setTime] = React.useState(new Date());
  const [limit, setLimit] = React.useState(3);
  const [workTime, setWorkTime] = React.useState(0);

  // 🔥 Optimistic UI state
  const [localToday, setLocalToday] = React.useState<PunchRecord | null>(null);

  // Live clock
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: history, mutate } = useApi<PunchRecord[]>(
    `/api/punch/history?limit=${limit}`
  );

  // ✅ Use local state first
  const today = localToday || history?.[0];

  const isToday =
    today?.punchInTime &&
    new Date(today.punchInTime).toDateString() === new Date().toDateString();

  // ✅ Live work timer
  React.useEffect(() => {
    if (!(isToday && today?.punchInTime && !today?.punchOutTime)) return;

    const interval = setInterval(() => {
      const start = new Date(today.punchInTime).getTime();
      const now = Date.now();
      setWorkTime(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [today, isToday]);

  const formatWorkTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const status =
    !isToday ? 'Not Punched' : today?.punchOutTime ? 'Completed' : 'Working';

  // ✅ FIXED HANDLE PUNCH (NO TS ERROR + INSTANT UI)
  const handlePunch = async () => {
    try {
      const isPunchOut = status === 'Working';

      // ⚡ Optimistic update (use Date, not string)
      if (today) {
        if (isPunchOut) {
          setLocalToday({
            ...today,
            punchOutTime: new Date(),
          });
        } else {
          setLocalToday({
            ...today,
            punchInTime: new Date(),
            punchOutTime: undefined,
          });
        }
      } else {
        setLocalToday({
          _id: 'temp',
          punchInTime: new Date(),
        } as PunchRecord);
      }

      const endpoint = isPunchOut
        ? '/api/punch/out'
        : '/api/punch/in';

      await post(endpoint, {});

      toast.success(
        isPunchOut ? 'Punched Out ✅' : 'Punched In ✅'
      );

      // 🔄 Sync real data
      await mutate();
      setLocalToday(null);

    } catch (err: any) {
      setLocalToday(null);
      toast.error(err.message || 'Punch failed');
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex justify-center">
        <div className="w-full max-w-md min-h-screen flex flex-col">

          {/* HEADER */}
          <div className="p-5 pb-2">
            <p className="text-xs text-gray-400">
              {format(new Date(), 'EEEE, MMM d')}
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              Hi, {user?.name || 'Employee'} 👋
            </h1>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6">

            {/* PREMIUM PUNCH CARD */}
            <div className="rounded-3xl p-6 text-white shadow-2xl bg-gradient-to-br from-black via-gray-900 to-gray-800">

              <p className="text-xs opacity-70">Current Time</p>

              <p className="text-3xl font-bold tracking-widest mt-1">
                {format(time, 'HH:mm:ss')}
              </p>

              {/* STATUS */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm opacity-80">Status</span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    status === 'Working'
                      ? 'bg-green-500/20 text-green-400 animate-pulse'
                      : status === 'Completed'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* LIVE TIMER */}
              {status === 'Working' && (
                <div className="mt-3 text-xs text-green-300">
                  ⏱ {formatWorkTime(workTime)}
                </div>
              )}

              {/* BUTTON */}
              <div className="mt-6">
                <button
                  onClick={handlePunch}
                  disabled={status === 'Completed'}
                  className={`
                    w-full py-4 rounded-2xl font-semibold text-lg
                    transition-all duration-300 active:scale-95
                    ${
                      status === 'Working'
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/30'
                        : status === 'Completed'
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                    }
                  `}
                >
                  {status === 'Working'
                    ? 'Punch Out ⏳'
                    : status === 'Completed'
                    ? 'Completed ✅'
                    : 'Punch In 🚀'}
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400">In Time</p>
                <h3 className="text-lg font-bold">
                  {today?.punchInTime
                    ? format(new Date(today.punchInTime), 'HH:mm')
                    : '--'}
                </h3>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400">Out Time</p>
                <h3 className="text-lg font-bold">
                  {today?.punchOutTime
                    ? format(new Date(today.punchOutTime), 'HH:mm')
                    : '--'}
                </h3>
              </div>
            </div>

            {/* HISTORY */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500">
                Recent Activity
              </h2>

              {history?.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-400">
                    {format(new Date(item.punchInTime), 'EEE, MMM d')}
                  </p>

                  <div className="flex justify-between mt-1 text-sm font-semibold">
                    <span>{format(new Date(item.punchInTime), 'HH:mm')}</span>
                    <span>
                      {item.punchOutTime
                        ? format(new Date(item.punchOutTime), 'HH:mm')
                        : '--'}
                    </span>
                  </div>
                </div>
              ))}

              <div className="text-center">
                <button
                  onClick={() => setLimit((prev) => prev + 3)}
                  className="text-sm font-semibold text-gray-500 hover:text-black"
                >
                  Load More
                </button>
              </div>
            </div>

          </div>

          {/* BOTTOM NAV */}
          <div className="fixed bottom-0 w-full max-w-md bg-white border-t flex justify-around py-3 text-xs">
            <Link href="/dashboard" className="flex flex-col items-center text-black">
              <FiHome />
              Home
            </Link>
            <Link href="/teams" className="flex flex-col items-center text-gray-400 hover:text-black">
              <FiUsers />
              Team
            </Link>
            <Link href="/stats" className="flex flex-col items-center text-gray-400 hover:text-black">
              <FiBarChart2 />
              Stats
            </Link>
          </div>

        </div>
      </div>
    </PrivateRoute>
  );
}