import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi, useApiCall } from '@/hooks/useApi';
import { Holiday } from '@/types';
import { format } from 'date-fns';
import { FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function HolidaysPage() {
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

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await post<{ success: boolean; data: Holiday }>('/api/holidays', {
        ...formData,
        isRecurring: false,
      });

      if (result.success) {
        toast.success('Holiday added successfully');
        setFormData({ name: '', date: '', type: 'national', description: '' });
        setShowForm(false);
        mutate();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add holiday');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;

    try {
      const result = await deleteRequest<{ success: boolean }>(`/api/holidays?id=${id}`);
      if (result.success) {
        toast.success('Holiday deleted successfully');
        mutate();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete holiday');
    }
  };

  const groupedHolidays = holidays?.reduce(
    (acc: Record<string, Holiday[]>, holiday: Holiday) => {
      const month = format(new Date(holiday.date), 'MMMM');
      if (!acc[month]) acc[month] = [];
      acc[month].push(holiday);
      return acc;
    },
    {} as Record<string, Holiday[]>
  ) || {};

  return (
    <PrivateRoute requiredRole="admin">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-1 mb-2">Holidays Management 📅</h1>
            <p className="text-gray-600">Manage company holidays and special days</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Holiday
          </button>
        </div>

        {/* Year Filter */}
        <div className="mb-8 flex items-center gap-4">
          <label className="text-gray-700 font-semibold">Filter by Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="input w-32"
            min="2020"
            max="2050"
          />
        </div>

        {/* Add Holiday Form */}
        {showForm && (
          <form onSubmit={handleAddHoliday} className="card mb-8">
            <h3 className="heading-3 mb-6">Add New Holiday</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Holiday Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., New Year's Day"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="input"
                >
                  <option value="national">National Holiday</option>
                  <option value="company">Company Holiday</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  placeholder="Add a note..."
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Adding...' : 'Add Holiday'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Holidays List */}
        {!holidays || holidays.length === 0 ? (
          <div className="card text-center py-12">
            <FiCalendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No holidays found for {year}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedHolidays).map(([month, monthHolidays]: [string, Holiday[]]) => (
              <div key={month}>
                <h3 className="heading-3 mb-4 text-gray-700">{month}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monthHolidays.map((holiday) => (
                    <div key={holiday._id} className="card border-l-4 border-purple-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">{holiday.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {format(new Date(holiday.date), 'MMMM d, yyyy')} (
                            {format(new Date(holiday.date), 'EEEE')})
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className={`badge badge-${holiday.type === 'national' ? 'primary' : holiday.type === 'company' ? 'success' : 'warning'}`}>
                              {holiday.type}
                            </span>
                          </div>
                          {holiday.description && (
                            <p className="text-gray-700 text-sm mt-2">{holiday.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteHoliday(holiday._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete holiday"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
