'use client';

import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi } from '@/hooks/useApi';
import { format } from 'date-fns';
import { FiChevronDown } from 'react-icons/fi';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  adminName: string;
}

export default function AnnouncementsPage() {
  const { data: announcements } = useApi<Announcement[]>('/api/announcements');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getPriority = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-600';
      case 'medium':
        return 'bg-yellow-50 text-yellow-600';
      case 'low':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <PrivateRoute requiredRole="employee">
      <div className="min-h-screen bg-[#f7f7f7]">

        {/* HEADER */}
        <div className="sticky top-0 z-40 bg-[#f7f7f7]/80 backdrop-blur-md px-4 pt-6 pb-4">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Updates
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Company announcements
          </p>
        </div>

        {/* LIST */}
        <div className="px-4 pb-6 space-y-3">

          {!announcements || announcements.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <p className="text-gray-500">No announcements yet</p>
            </div>
          ) : (
            announcements.map((item) => {
              const isOpen = expandedId === item._id;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-300"
                >
                  {/* CLICKABLE HEADER */}
                  <button
                    onClick={() =>
                      setExpandedId(isOpen ? null : item._id)
                    }
                    className="w-full text-left px-4 py-4 active:scale-[0.98] transition"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex-1">

                        {/* TITLE */}
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                            {item.title}
                          </h3>

                          <span className={`text-[10px] px-2 py-[2px] rounded-full ${getPriority(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>

                        {/* DESC */}
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>

                        {/* META */}
                        <p className="text-[11px] text-gray-400 mt-2">
                          {item.adminName} •{' '}
                          {format(new Date(item.createdAt), 'dd MMM, hh:mm a')}
                        </p>
                      </div>

                      {/* ICON */}
                      <FiChevronDown
                        className={`text-gray-400 mt-1 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* EXPAND CONTENT */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="px-4 pb-4 pt-2 text-sm text-gray-700 border-t border-gray-100 whitespace-pre-wrap">
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}