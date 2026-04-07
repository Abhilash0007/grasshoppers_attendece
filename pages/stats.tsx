'use client';

import React, { useState } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useAuth } from '@/context/auth';
import { useApi } from '@/hooks/useApi';
import { FiBarChart2, FiUsers, FiClock, FiTrendingUp, FiCalendar } from 'react-icons/fi';

interface Team {
  _id: string;
  name: string;
  description?: string;
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

interface TeamStats {
  team: {
    _id: string;
    name: string;
    description?: string;
    memberCount: number;
  };
  memberStats: Array<{
    member: {
      _id: string;
      name: string;
      email: string;
    };
    totalRecords: number;
    completedRecords: number;
    totalWorkMinutes: number;
    avgWorkMinutes: number;
    avgWorkHours: string;
  }>;
  teamStats: {
    totalMembers: number;
    totalRecords: number;
    totalCompleted: number;
    completionRate: string;
    totalWorkMinutes: number;
    avgWorkMinutesPerMember: number;
    avgWorkHoursPerMember: string;
  };
}

export default function StatsPage() {
  const { user } = useAuth();
  const { data: teams } = useApi<Team[]>('/api/teams');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter teams where current user is a member
  const userTeams = teams?.filter(team =>
    team.members.some(member => member._id === user?._id)
  ) || [];

  const query = new URLSearchParams({
    teamId: selectedTeam,
    startDate,
    endDate,
  }).toString();

  const { data: stats } = useApi<TeamStats>(selectedTeam ? `/api/teams/stats?${query}` : null);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-6">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Team Statistics 📊</h1>
          <p className="text-sm text-gray-500">View your team's performance</p>
        </div>

        {/* TEAM SELECTOR */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-2xl p-4 shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-xl"
            >
              <option value="">Choose a team...</option>
              {userTeams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STATS DISPLAY */}
        {stats ? (
          <div className="max-w-4xl mx-auto space-y-6">

            {/* TEAM OVERVIEW */}
            <div className="bg-white rounded-2xl p-5 shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <FiUsers className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{stats.team.name}</h3>
                  <p className="text-sm text-gray-500">{stats.team.memberCount} members</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.teamStats.totalRecords}</div>
                  <div className="text-xs text-gray-500">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.teamStats.completionRate}%</div>
                  <div className="text-xs text-gray-500">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.teamStats.avgWorkHoursPerMember}h</div>
                  <div className="text-xs text-gray-500">Avg Hours/Member</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.teamStats.totalMembers}</div>
                  <div className="text-xs text-gray-500">Active Members</div>
                </div>
              </div>
            </div>

            {/* MEMBER STATS */}
            <div className="bg-white rounded-2xl p-5 shadow">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FiBarChart2 />
                Member Performance
              </h3>

              <div className="space-y-4">
                {stats.memberStats.map((memberStat) => (
                  <div
                    key={memberStat.member._id}
                    className={`p-4 rounded-xl border ${
                      memberStat.member._id === user?._id
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className={`font-medium ${
                          memberStat.member._id === user?._id ? 'text-indigo-700' : 'text-gray-900'
                        }`}>
                          {memberStat.member.name}
                          {memberStat.member._id === user?._id && ' (You)'}
                        </h4>
                        <p className="text-sm text-gray-500">{memberStat.member.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">
                          {memberStat.avgWorkHours}h
                        </div>
                        <div className="text-xs text-gray-500">avg/day</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm font-semibold">{memberStat.totalRecords}</div>
                        <div className="text-xs text-gray-500">Records</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{memberStat.completedRecords}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{Math.round(memberStat.totalWorkMinutes / 60)}h</div>
                        <div className="text-xs text-gray-500">Total Hours</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedTeam ? (
          <div className="max-w-4xl mx-auto text-center py-20 text-gray-400">
            <FiBarChart2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>Loading team statistics...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center py-20 text-gray-400">
            <FiBarChart2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a team to view statistics</p>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}