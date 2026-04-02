import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useApi } from '@/hooks/useApi';
import { format } from 'date-fns';
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiTrendingUp, FiInfo } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Employee {
  _id: string;
  name: string;
  email: string;
  department?: string;
  position?: string;
  todayPunch?: {
    punchedIn: boolean;
    punchedOut: boolean;
    punchInTime?: string;
    punchOutTime?: string;
    status: string;
  };
}

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: stats } = useApi<any>('/api/admin/stats');
  const { data: employees } = useApi<Employee[]>('/api/admin/employees');

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
    trend,
  }: {
    icon: any;
    title: string;
    value: number | string;
    color: string;
    trend?: string;
  }) => (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && <p className="text-xs text-green-600 font-semibold">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl transition-all ${color} group-hover:scale-110 group-hover:shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <PrivateRoute requiredRole="admin">
      <div className="min-h-screen py-6 md:py-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 mb-10 animate-slide-in-down">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="heading-1 mb-3">Admin Dashboard 📊</h1>
              <p className="text-lg text-gray-600">Real-time attendance monitoring and employee management</p>
            </div>
            <div className="w-full md:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input w-full md:w-48"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-in-up">
            <StatCard
              icon={FiUsers}
              title="Total Employees"
              value={stats?.totalEmployees || 0}
              color="bg-blue-100/80 text-blue-600"
            />
            <StatCard
              icon={FiCheckCircle}
              title="Present"
              value={stats?.presentToday || 0}
              color="bg-green-100/80 text-green-600"
            />
            <StatCard
              icon={FiXCircle}
              title="Absent"
              value={stats?.absentToday || 0}
              color="bg-red-100/80 text-red-600"
            />
            <StatCard
              icon={FiClock}
              title="On Time"
              value={stats?.onTimeToday || 0}
              color="bg-purple-100/80 text-purple-600"
            />
            <StatCard
              icon={FiTrendingUp}
              title="Avg Hours"
              value={`${stats?.averageWorkHours || 0}h`}
              color="bg-yellow-100/80 text-yellow-600"
            />
          </div>

          {/* Employee Punch Records */}
          <div className="card animate-slide-in-up border-2 border-gray-100/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-3 mb-2">Employee Attendance</h2>
                <p className="text-gray-600">Today's punch records and attendance status</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-gray-900">{employees?.length ?? 0}</p>
                <p className="text-gray-600">Total Employees</p>
              </div>
            </div>

            {!employees || employees.length === 0 ? (
              <div className="text-center py-12">
                <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No employees found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50/50">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Employee Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Department</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Punch In</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Punch Out</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, idx) => (
                      <tr
                        key={emp._id}
                        className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="py-5 px-4">
                          <p className="font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-sm text-gray-500">{emp.position || 'Employee'}</p>
                        </td>
                        <td className="py-5 px-4 text-gray-600">{emp.email}</td>
                        <td className="py-5 px-4">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                            {emp.department || 'General'}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-center">
                          {emp.todayPunch?.punchInTime ? (
                            <div className="text-center">
                              <span className="inline-block px-3 py-1 bg-green-100/80 text-green-700 rounded-lg font-semibold text-sm border border-green-200">
                                {format(new Date(emp.todayPunch.punchInTime), 'HH:mm')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {emp.todayPunch?.punchOutTime ? (
                            <div className="text-center">
                              <span className="inline-block px-3 py-1 bg-red-100/80 text-red-700 rounded-lg font-semibold text-sm border border-red-200">
                                {format(new Date(emp.todayPunch.punchOutTime), 'HH:mm')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {emp.todayPunch ? (
                            <span
                              className={`badge ${
                                emp.todayPunch.status === 'completed'
                                  ? 'badge-success'
                                  : 'badge-warning'
                              }`}
                            >
                              {emp.todayPunch.punchedOut ? '✓ Completed' : '⏱ Active'}
                            </span>
                          ) : (
                            <span className="badge bg-gray-100 text-gray-600 border border-gray-200">✕ Absent</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="card bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-blue-200/50 flex items-start gap-4 animate-slide-in-up">
            <div className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
              <FiInfo className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Admin Features</p>
              <p className="text-sm text-gray-600">Monitor real-time attendance, view employee punch records, manage holidays, and export detailed attendance reports from the sidebar menu.</p>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
