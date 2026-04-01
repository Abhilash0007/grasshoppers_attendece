'use client';

import React, { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { PunchRecord } from '@/types';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { FiClock, FiMapPin } from 'react-icons/fi';

interface PunchHistoryProps {
  limit?: number;
}

export const PunchHistory: React.FC<PunchHistoryProps> = ({ limit = 10 }) => {
  const { data: history, isLoading } = useApi<PunchRecord[]>(
    `/api/punch/history?limit=${limit}`
  );

  const formatDurationTime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="card">
      <h2 className="heading-3 mb-6">Punch History</h2>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !history || history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No punch records found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold">Date</th>
                <th className="text-left py-3 px-2 font-semibold">Punch In</th>
                <th className="text-left py-3 px-2 font-semibold">Punch Out</th>
                <th className="text-left py-3 px-2 font-semibold">Duration</th>
                <th className="text-center py-3 px-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record: PunchRecord) => (
                <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-blue-500" />
                      {format(new Date(record.punchInTime), 'HH:mm')}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    {record.punchOutTime ? (
                      format(new Date(record.punchOutTime), 'HH:mm')
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2">{formatDurationTime(record.workDuration || 0)}</td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`badge ${
                        record.status === 'completed' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {record.status === 'completed' ? 'Completed' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
