import React from 'react';
import { Users, Calendar, TrendingUp, Award } from 'lucide-react';
import { AttendanceStats } from '../types';
import { calculateAttendanceRate } from '../utils/helpers';

interface DashboardProps {
  stats: AttendanceStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const { totalParticipants, totalSessions, averageAttendance, topAttendees } = stats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-fuchsia-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
            <Users className="h-8 w-8 text-fuchsia-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
            </div>
            <Calendar className="h-8 w-8 text-cyan-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-violet-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-3xl font-bold text-gray-900">{averageAttendance}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-violet-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalSessions > 0 ? Math.round(averageAttendance * 0.8) : 0}
              </p>
            </div>
            <Award className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Top Attendees
        </h3>
        <div className="space-y-3">
          {topAttendees.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No attendance data yet</p>
          ) : (
            topAttendees.map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{participant.name}</p>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {calculateAttendanceRate(participant.attendedSessions, participant.totalSessions)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {participant.attendedSessions}/{participant.totalSessions} sessions
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};