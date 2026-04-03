'use client';

import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi } from '@/hooks/useApi';
import { format } from 'date-fns';
import { FiArrowLeft, FiDownload, FiFilter, FiX } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminPunchHistory() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const query = new URLSearchParams({
    employeeId: selectedEmployee || '',
    startDate,
    endDate,
  }).toString();

  const { data: employees } = useApi<any[]>('/api/admin/employees');
  const { data: punchData } = useApi<any>(`/api/admin/punch-history?${query}`);

  const records = punchData?.data || [];
  const stats = punchData?.statistics || {};

  const formatTime = (date: string) => format(new Date(date), 'hh:mm a');
  const formatDate = (date: string) => format(new Date(date), 'dd MMM');

  return (
    <PrivateRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

        {/* PREMIUM HEADER */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 bg-gray-100 rounded-full">
              <FiArrowLeft />
            </Link>
            <div>
              <h1 className="font-bold text-lg">Punch History</h1>
              <p className="text-xs text-gray-500">All employees</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="p-2 bg-white rounded-full shadow"
            >
              <FiFilter />
            </button>
            <button
              className="p-2 bg-green-500 text-white rounded-full shadow"
            >
              <FiDownload />
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow">
            <p className="text-xs text-gray-500">Records</p>
            <p className="text-xl font-bold">{stats.totalRecords || 0}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow">
            <p className="text-xs text-gray-500">Avg Hours</p>
            <p className="text-xl font-bold">
              {stats?.avgWorkHours || 0}h
            </p>
          </div>
        </div>

        {/* FILTER MODAL */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-5 animate-slide-up">

              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <FiX />
                </button>
              </div>

              <select
                className="w-full p-3 border rounded-xl mb-3"
                value={selectedEmployee || ''}
                onChange={(e) => setSelectedEmployee(e.target.value || null)}
              >
                <option value="">All Employees</option>
                {employees?.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="w-full p-3 border rounded-xl mb-3"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <input
                type="date"
                className="w-full p-3 border rounded-xl mb-4"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setStartDate('');
                  setEndDate('');
                }}
                className="w-full py-3 bg-gray-200 rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* RECORDS LIST (MOBILE PREMIUM) */}
        <div className="p-4 space-y-3 pb-20">
          {records.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No records found
            </div>
          ) : (
            records.map((r: any) => (
              <div
                key={r._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow hover:scale-[1.02] transition-all"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{r.userId.name}</p>
                    <p className="text-xs text-gray-500">
                      {r.userId.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(r.date)}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-3">
                  <div>
                    <p className="text-gray-500 text-xs">In</p>
                    <p className="font-medium">
                      {formatTime(r.punchInTime)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Out</p>
                    <p className="font-medium">
                      {r.punchOutTime
                        ? formatTime(r.punchOutTime)
                        : '--'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Duration</p>
                    <p className="font-medium">
                      {r.workDuration
                        ? `${r.workDuration}m`
                        : '--'}
                    </p>
                  </div>
                </div>

                {/* STATUS BADGE */}
                <div className="mt-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      r.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}