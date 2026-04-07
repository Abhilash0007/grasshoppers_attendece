'use client';

import React from 'react';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useAuth } from '@/context/auth';
import { useApi } from '@/hooks/useApi';
import { FiUsers, FiUser } from 'react-icons/fi';

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
}

export default function TeamsPage() {
  const { user } = useAuth();
  const { data: teams } = useApi<Team[]>('/api/teams');

  // Filter teams where current user is a member
  const userTeams = teams?.filter(team =>
    team.members.some(member => member._id === user?._id)
  ) || [];

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-6">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Teams 👥</h1>
          <p className="text-sm text-gray-500">Teams you're part of</p>
        </div>

        {/* TEAMS LIST */}
        <div className="max-w-4xl mx-auto space-y-4">
          {!userTeams?.length ? (
            <div className="text-center py-20 text-gray-400">
              <FiUsers size={48} className="mx-auto mb-4 opacity-50" />
              <p>You're not part of any teams yet</p>
            </div>
          ) : (
            userTeams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-2xl p-5 shadow-lg border"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <FiUsers className="text-indigo-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {team.members.length} members • Created by {team.createdBy.name}
                    </p>
                  </div>
                </div>

                {/* TEAM MEMBERS */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {team.members.map((member) => (
                      <div
                        key={member._id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          member._id === user?._id
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <FiUser size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            member._id === user?._id ? 'text-indigo-700' : 'text-gray-900'
                          }`}>
                            {member.name}
                            {member._id === user?._id && ' (You)'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          {member.department && (
                            <p className="text-xs text-gray-400">{member.department}</p>
                          )}
                        </div>
                      </div>
                    ))}
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