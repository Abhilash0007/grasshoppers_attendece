import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/auth';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';
import Link from 'next/link';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  adminName: string;
}

export default function AdminAnnouncements() {
  const { token } = useAuth();
  const { data: announcements, mutate } = useApi<Announcement[]>('/api/announcements');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // ✅ FIXED
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content) {
      toast.error('Fill all fields');
      return;
    }

    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/announcements/${editingId}`
        : '/api/announcements';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed');

      toast.success(editingId ? 'Updated ✨' : 'Created ✨');

      setFormData({
        title: '',
        description: '',
        content: '',
        priority: 'medium',
      });

      setEditingId(null);
      setShowForm(false);
      mutate();

      return; // ✅ important

    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
      return; // ✅ important

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Delete this announcement?')) return;

    try {
      await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Deleted');
      mutate();

      return; // ✅

    } catch {
      toast.error('Failed');
      return; // ✅
    }
  };

  const handleEdit = (a: Announcement): void => {
    setFormData({
      title: a.title,
      description: a.description,
      content: a.content,
      priority: a.priority,
    });

    setEditingId(a._id);
    setShowForm(true);
  };

  const priorityStyle = (p: string): string => {
    if (p === 'high') return 'bg-red-500/20 text-red-400';
    if (p === 'medium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <PrivateRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-6">

        {/* HEADER */}
        <div className="max-w-3xl mx-auto mb-6 flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-200 transition">
            <FiArrowLeft />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements 📢</h1>
            <p className="text-sm text-gray-500">Manage updates for employees</p>
          </div>
        </div>

        {/* ACTION */}
        <div className="max-w-3xl mx-auto mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            <FiPlus /> New Announcement
          </button>
        </div>

        {/* MODAL FORM */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm">

            <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl">

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  {editingId ? 'Edit Announcement' : 'New Announcement'}
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl"
                />

                <textarea
                  placeholder="Short description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl"
                />

                <textarea
                  placeholder="Full content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl h-32"
                />

                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as any,
                    })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded-xl"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>

              </form>
            </div>
          </div>
        )}

        {/* LIST */}
        <div className="max-w-3xl mx-auto space-y-4">

          {!announcements?.length ? (
            <div className="text-center py-20 text-gray-400">
              No announcements yet
            </div>
          ) : (
            announcements.map((a) => (
              <div
                key={a._id}
                className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-5 shadow-lg"
              >
                <div className="flex justify-between items-start gap-3">

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{a.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityStyle(a.priority)}`}>
                        {a.priority}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-2">
                      {a.description}
                    </p>

                    <p className="text-xs text-gray-400">
                      {a.adminName} • {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(a)} className="p-2 hover:bg-white/10 rounded-lg">
                      <FiEdit2 />
                    </button>

                    <button onClick={() => handleDelete(a._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg">
                      <FiTrash2 />
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </PrivateRoute>
  );
}