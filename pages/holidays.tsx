import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi, useApiCall } from '@/hooks/useApi';
import { useAuth } from '@/context/auth';
import { Holiday } from '@/types';
import { format } from 'date-fns';
import { FiPlus, FiTrash2, FiCalendar, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function HolidaysPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [showForm, setShowForm] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: holidays, mutate } = useApi<Holiday[]>(
    `/api/holidays?year=${year}`
  );

  const { post, delete: deleteRequest } = useApiCall();

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'national' as 'national' | 'company' | 'other',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // ✅ FIXED FUNCTION
  const handleAddHoliday = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error('Only admins allowed');
      return;
    }

    if (!formData.name || !formData.date) {
      toast.error('Fill required fields');
      return;
    }

    setIsLoading(true);

    try {
      const res = await post<{ success: boolean }>('/api/holidays', {
        ...formData,
        isRecurring: false,
      });

      if (res?.success) {
        toast.success('Holiday added ✨');
        setShowForm(false);
        setFormData({
          name: '',
          date: '',
          type: 'national',
          description: '',
        });
        mutate();
      } else {
        toast.error('Failed to add holiday');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error adding holiday');
    } finally {
      setIsLoading(false);
    }

    return; // ✅ IMPORTANT FIX
  };

  const handleDeleteHoliday = async (id: string): Promise<void> => {
    if (!confirm('Delete this holiday?')) return;

    try {
      await deleteRequest(`/api/holidays?id=${id}`);
      toast.success('Deleted');
      mutate();
    } catch {
      toast.error('Failed');
    }

    return; // ✅ safe
  };

  const grouped =
    holidays?.reduce((acc: Record<string, Holiday[]>, h) => {
      const m = format(new Date(h.date), 'MMMM');
      if (!acc[m]) acc[m] = [];
      acc[m].push(h);
      return acc;
    }, {}) || {};

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-6">

        {/* HEADER */}
        <div className="max-w-3xl mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Holidays 📅</h1>
          <p className="text-sm text-gray-500">Company calendar & special days</p>
        </div>

        {/* YEAR + ACTION */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-6">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-105 transition"
            >
              <FiPlus /> Add
            </button>
          )}
        </div>

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm">

            <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl">

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">New Holiday</h3>
                <button onClick={() => setShowForm(false)}>
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleAddHoliday} className="space-y-4">

                <input
                  placeholder="Holiday name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl"
                  required
                />

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl"
                  required
                />

                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl"
                >
                  <option value="national">National</option>
                  <option value="company">Company</option>
                  <option value="other">Other</option>
                </select>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
                >
                  {isLoading ? 'Adding...' : 'Add Holiday'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* LIST */}
        <div className="max-w-3xl mx-auto space-y-6">

          {!holidays?.length ? (
            <div className="text-center py-20 text-gray-400">
              <FiCalendar size={40} className="mx-auto mb-3 opacity-40" />
              No holidays found
            </div>
          ) : (
            Object.entries(grouped).map(([month, list]) => (
              <div key={month}>
                <h3 className="text-sm text-gray-500 mb-3">{month}</h3>

                <div className="space-y-3">
                  {(list as Holiday[]).map((h) => (
                    <div
                      key={h._id}
                      className="flex items-center justify-between bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-4 shadow-lg"
                    >
                      <div>
                        <p className="font-semibold">{h.name}</p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(h.date), 'EEE, MMM d')}
                        </p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteHoliday(h._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}