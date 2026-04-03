'use client';

import React, { useState, useEffect } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi } from '@/hooks/useApi';
import { format } from 'date-fns';
import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: stats } = useApi<any>('/api/admin/stats');
  const { data: employees } = useApi<any[]>('/api/admin/employees');

  // 🔥 Count animation
  const useCountUp = (value: number) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 500;
      const step = Math.ceil(value / (duration / 16));

      const interval = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(interval);
    }, [value]);

    return count;
  };

  const StatCard = ({ title, value, icon: Icon, delay }: any) => {
    const animatedValue = useCountUp(value || 0);

    return (
      <div className={`animate-fadeUp ${delay} bg-white/70 backdrop-blur-xl border rounded-2xl p-4 shadow-sm`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{animatedValue}</p>
          </div>
          <div className="p-2 bg-black text-white rounded-xl">
            <Icon />
          </div>
        </div>
      </div>
    );
  };

  return (
    <PrivateRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center">

        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl min-h-screen">

          {/* HEADER */}
          <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl px-4 py-4 border-b animate-fadeUp">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <p className="text-xs text-gray-500">
              {format(new Date(), 'EEEE, MMM d')}
            </p>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-3 w-full border rounded-xl p-2 text-sm"
            />
          </div>

          {/* CONTENT */}
          <div className="px-4 py-4 space-y-5 pb-28">

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard title="Employees" value={stats?.totalEmployees} icon={FiUsers} delay="delay-1" />
              <StatCard title="Present" value={stats?.presentToday} icon={FiCheckCircle} delay="delay-2" />
              <StatCard title="Absent" value={stats?.absentToday} icon={FiXCircle} delay="delay-3" />
              <StatCard title="On Time" value={stats?.onTimeToday} icon={FiClock} delay="delay-4" />
            </div>

            {/* BIG CARD */}
            <div className="animate-fadeUp delay-2 bg-black text-white rounded-3xl p-6 shadow-xl">
              <p className="text-xs opacity-70">Average Work Hours</p>
              <h2 className="text-4xl font-bold mt-1">
                {stats?.averageWorkHours || 0}h
              </h2>
            </div>

            {/* EMPLOYEES */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-semibold px-1">
                Live Activity
              </p>

              {employees?.map((emp: any, i: number) => (
                <div
                  key={emp._id}
                  className={`animate-fadeUp bg-white border rounded-2xl p-4 shadow-sm`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {emp.department || 'General'}
                      </p>
                    </div>

                    {/* 🔥 LIVE DOT */}
                    {emp.todayPunch?.punchedIn && !emp.todayPunch?.punchedOut && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span>
                        Live
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">In</p>
                      <p className="font-semibold">
                        {emp.todayPunch?.punchInTime
                          ? format(new Date(emp.todayPunch.punchInTime), 'HH:mm')
                          : '--'}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Out</p>
                      <p className="font-semibold">
                        {emp.todayPunch?.punchOutTime
                          ? format(new Date(emp.todayPunch.punchOutTime), 'HH:mm')
                          : '--'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}