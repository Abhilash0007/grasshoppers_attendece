import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { Clock } from '@/components/Clock';
import { PunchButton } from '@/components/PunchButton';
import { PunchHistory } from '@/components/PunchHistory';
import { useAuth } from '@/context/auth';
import { useApi } from '@/hooks/useApi';
import { PunchRecord } from '@/types';
import { format } from 'date-fns';
import { FiClock, FiLogOut, FiInfo, FiMapPin } from 'react-icons/fi';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: todayPunch, mutate: mutatePunch } = useApi<PunchRecord[]>(
    '/api/punch/history?limit=1'
  );

  const handlePunchSuccess = () => {
    mutatePunch();
  };

  const today = todayPunch?.[0];

  return (
    <PrivateRoute>
      <div className="min-h-screen py-6 md:py-8">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="animate-slide-in-down">
            <h1 className="heading-1 mb-3">Welcome back! 👋</h1>
            <p className="text-lg text-gray-600">{user?.name ?? 'Employee'} • {format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 space-y-6">
          {/* Real-time Clock */}
          <div className="gradient-box from-blue-600 via-indigo-600 to-purple-600 text-white animate-slide-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold opacity-90">Current Time</h2>
              <FiClock className="w-6 h-6 opacity-75" />
            </div>
            <Clock />
          </div>

          {/* Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in-up">
            {/* Punch In Status */}
            <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl text-white">
                  <FiClock className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-green-700">Status</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Punched In</p>
              {today?.punchInTime ? (
                <p className="text-3xl font-bold text-green-600">
                  {format(new Date(today.punchInTime), 'HH:mm')}
                </p>
              ) : (
                <p className="text-3xl font-bold text-gray-400">—</p>
              )}
            </div>

            {/* Punch Out Status */}
            <div className="stat-card bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl text-white">
                  <FiLogOut className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-red-700">Status</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Punched Out</p>
              {today?.punchOutTime ? (
                <p className="text-3xl font-bold text-red-600">
                  {format(new Date(today.punchOutTime), 'HH:mm')}
                </p>
              ) : (
                <p className="text-3xl font-bold text-gray-400">—</p>
              )}
            </div>
          </div>

          {/* Work Duration Card */}
          {today?.workDuration && (
            <div className="stat-card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200/50 animate-slide-in-up">
              <p className="text-sm text-gray-600 mb-2">Total Work Duration</p>
              <p className="text-4xl font-bold text-purple-600">
                {Math.floor(today.workDuration / 60)}h {today.workDuration % 60}m
              </p>
              <p className="text-xs text-gray-500 mt-2">Today's work time</p>
            </div>
          )}

          {/* Punch Buttons Section */}
          <div className="card animate-slide-in-up">
            <h2 className="heading-3 mb-6 text-center">Punch In / Out</h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <PunchButton onSuccess={handlePunchSuccess} />
            </div>
          </div>

          {/* Punch History */}
          <div className="animate-slide-in-up">
            <PunchHistory limit={10} />
          </div>

          {/* Info Banner */}
          <div className="card bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-200/50 flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
              <FiInfo className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Location Tracking Active</p>
              <p className="text-sm text-gray-600">Your location will be recorded when you punch in/out for accurate attendance tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
