'use client';

import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/auth';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface Team {
  _id: string;
  name: string;
  description?: string;
  members: Array<{
    _id: string;
    name: string;
    email: string;
    department?: string;
    position?: string;
  }>;
  createdBy: {
    name: string;
  };
  createdAt: string;
}

export default function AdminTeams() {
  const { token } = useAuth();
  const { data: teams, mutate } = useApi<Team[]>('/api/teams');
  const { data: employees } = useApi<any[]>('/api/admin/employees');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedMembers: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.name || !formData.selectedMembers.length) {
      toast.error('Team name and members are required');
      return;
    }

    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/teams/${editingId}`
        : '/api/teams';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          members: formData.selectedMembers,
        }),
      });

      if (!res.ok) throw new Error('Failed');

      toast.success(editingId ? 'Team updated ✨' : 'Team created ✨');

      setFormData({
        name: '',
        description: '',
        selectedMembers: [],
      });

      setEditingId(null);
      setShowForm(false);
      mutate();

      return;
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Delete this team?')) return;

    try {
      await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Team deleted');
      mutate();

      return;
    } catch {
      toast.error('Failed to delete');
      return;
    }
  };

  const handleEdit = (team: Team): void => {
    setFormData({
      name: team.name,
      description: team.description || '',
      selectedMembers: team.members.map(m => m._id),
    });

    setEditingId(team._id);
    setShowForm(true);
  };

  return (
    <PrivateRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-6">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-200 transition">
            <FiArrowLeft />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teams 👥</h1>
            <p className="text-sm text-gray-500">Manage employee teams</p>
          </div>
        </div>

        {/* ACTION */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            <FiPlus /> Create Team
          </button>
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  {editingId ? 'Edit Team' : 'Create Team'}
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <FiTrash2 />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  placeholder="Team Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl"
                />

                <textarea
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl h-20"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Members:</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2">
                    {employees?.map((emp) => (
                      <label key={emp._id} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={formData.selectedMembers.includes(emp._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                selectedMembers: [...formData.selectedMembers, emp._id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selectedMembers: formData.selectedMembers.filter(id => id !== emp._id),
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{emp.name} ({emp.email})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
                >
                  {loading ? 'Saving...' : 'Save Team'}
                </button>

              </form>
            </div>
          </div>
        )}

        {/* TEAMS LIST */}
        <div className="max-w-4xl mx-auto space-y-4">
          {!teams?.length ? (
            <div className="text-center py-20 text-gray-400">
              No teams created yet
            </div>
          ) : (
            teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-2xl p-5 shadow-lg border"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUsers className="text-indigo-500" />
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                    </div>

                    {team.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {team.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-400">
                      {team.members.length} members • Created by {team.createdBy.name}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(team)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <FiEdit2 />
                    </button>

                    <button onClick={() => handleDelete(team._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* MEMBERS */}
                <div className="flex flex-wrap gap-2">
                  {team.members.slice(0, 5).map((member) => (
                    <span
                      key={member._id}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {member.name}
                    </span>
                  ))}
                  {team.members.length > 5 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      +{team.members.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}