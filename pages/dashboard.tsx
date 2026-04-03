import React from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useAuth } from '@/context/auth';
import { useApi } from '@/hooks/useApi';
import { PunchRecord } from '@/types';
import { format } from 'date-fns';
import { FiHome, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { SwipePunch } from '@/components/SwipePunch';

export default function DashboardPage() {
  const { user } = useAuth();
  const [time, setTime] = React.useState(new Date());
  const [limit, setLimit] = React.useState(3);
  const [workTime, setWorkTime] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile vs desktop
  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Live clock
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: history, mutate } = useApi<PunchRecord[]>(
    `/api/punch/history?limit=${limit}`
  );

  const today = history?.[0];

  // Check if today punched
  const isToday =
    today?.punchInTime &&
    new Date(today.punchInTime).toDateString() === new Date().toDateString();

  // Live work timer
  React.useEffect(() => {
    if (isToday && today?.punchInTime && !today?.punchOutTime) {
      const interval = setInterval(() => {
        const start = new Date(today.punchInTime).getTime();
        const now = new Date().getTime();
        setWorkTime(Math.floor((now - start) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [today, isToday]);

  const formatWorkTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Status logic
  const status = !isToday
    ? 'Not Punched'
    : today?.punchOutTime
    ? 'Completed'
    : 'Working';

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
            <div className="relative rounded-3xl p-6 text-white shadow-2xl overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">

              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-2xl opacity-40" />

              <div className="relative z-10">
                <p className="text-xs opacity-70">Current Time</p>

                <p className="text-3xl font-bold tracking-widest mt-1 animate-pulse">
                  {format(time, 'HH:mm:ss')}
                </p>

                {/* STATUS */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm opacity-80">Status</span>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      status === 'Working'
                        ? 'bg-green-500/20 text-green-400'
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

                {/* ✅ DEVICE BASED BUTTON */}
                <div className="mt-6">
                  {isMobile ? (
<SwipePunch
  onPunch={() => mutate()}
  status={status}
/>                  ) : (
                    <button
                      onClick={() => mutate()}
                      className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition active:scale-95"
                    >
                      {status === 'Working'
                        ? 'Punch Out'
                        : status === 'Completed'
                        ? 'Completed'
                        : 'Punch In'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200 p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400">In Time</p>
                <h3 className="text-lg font-bold">
                  {today?.punchInTime
                    ? format(new Date(today.punchInTime), 'HH:mm')
                    : '--'}
                </h3>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-gray-200 p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400">Out Time</p>
                <h3 className="text-lg font-bold">
                  {today?.punchOutTime
                    ? format(new Date(today.punchOutTime), 'HH:mm')
                    : '--'}
                </h3>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500">
                Recent Activity
              </h2>

              {history?.map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-xl border border-gray-200 p-4 rounded-2xl shadow-sm"
                >
                  <div className="absolute left-[-6px] top-5 w-3 h-3 bg-green-500 rounded-full" />

                  <p className="text-xs text-gray-400">
                    {format(new Date(item.punchInTime), 'EEE, MMM d')}
                  </p>

                  <div className="flex justify-between mt-1 text-sm font-semibold">
                    <span>
                      {format(new Date(item.punchInTime), 'HH:mm')}
                    </span>
                    <span>
                      {item.punchOutTime
                        ? format(new Date(item.punchOutTime), 'HH:mm')
                        : '--'}
                    </span>
                  </div>
                </div>
              ))}

              {/* LOAD MORE */}
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
          <div className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-xl border-t flex justify-around py-3 text-xs shadow-lg">
            <div className="flex flex-col items-center text-black">
              <FiHome />
              Home
            </div>
            <div className="flex flex-col items-center text-gray-400">
              <FiUsers />
              Team
            </div>
            <div className="flex flex-col items-center text-gray-400">
              <FiBarChart2 />
              Stats
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}