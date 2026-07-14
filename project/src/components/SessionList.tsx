import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, Calendar, Clock, Users } from 'lucide-react';
import { Session } from '../types';
import { formatDate, formatTime, calculateAttendanceRate } from '../utils/helpers';

interface SessionListProps {
  sessions: Session[];
  onEdit: (session: Session) => void;
  onDelete: (sessionId: string) => void;
  onAddNew: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.description && session.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedSessions = filteredSessions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sessions</h2>
          <p className="text-gray-600">Manage workshop sessions and schedules</p>
        </div>
        
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-md hover:from-fuchsia-700 hover:to-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Session
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sessions..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            />
          </div>
        </div>

        {sortedSessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No sessions found matching your search.' : 'No sessions scheduled yet.'}
            </p>
            {!searchTerm && (
              <button
                onClick={onAddNew}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-md hover:from-fuchsia-700 hover:to-purple-700 transition-colors"
              >
                Schedule Your First Session
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map(session => {
              const isUpcoming = new Date(session.date) > new Date();
              const attendanceRate = calculateAttendanceRate(session.presentCount, session.totalParticipants);
              
              return (
                <div
                  key={session.id}
                  className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                    isUpcoming ? 'border-cyan-200 bg-cyan-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{session.title}</h3>
                        {isUpcoming && (
                          <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full font-medium">
                            Upcoming
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(session.time)} ({session.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{session.totalParticipants} participants</span>
                        </div>
                      </div>

                      {session.description && (
                        <p className="text-gray-600 text-sm mb-4">{session.description}</p>
                      )}

                      {session.totalParticipants > 0 && (
                        <div className="bg-white rounded-lg p-3 border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Attendance</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {session.presentCount}/{session.totalParticipants} ({attendanceRate}%)
                            </span>
                          </div>
                          <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all"
                              style={{ width: `${attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => onEdit(session)}
                        className="text-fuchsia-600 hover:text-fuchsia-800 transition-colors p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(session.id)}
                        className="text-rose-600 hover:text-rose-800 transition-colors p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};