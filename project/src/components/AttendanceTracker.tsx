import React, { useState } from 'react';
import { Check, X, Search, Calendar } from 'lucide-react';
import { Participant, Session, AttendanceRecord } from '../types';
import { formatDate, formatTime } from '../utils/helpers';

interface AttendanceTrackerProps {
  participants: Participant[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (participantId: string, sessionId: string, status: 'present' | 'absent') => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  participants,
  sessions,
  attendance,
  onMarkAttendance,
}) => {
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStatus = (participantId: string, sessionId: string) => {
    const record = attendance.find(
      r => r.participantId === participantId && r.sessionId === sessionId
    );
    return record?.status || null;
  };

  const selectedSessionData = sessions.find(s => s.id === selectedSession);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-fuchsia-500" />
          Mark Attendance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-2">
              Select Session *
            </label>
            <select
              id="session"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            >
              <option value="">Choose a session...</option>
              {sessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.title} - {formatDate(session.date)} at {formatTime(session.time)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Participants
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              />
            </div>
          </div>
        </div>

        {selectedSessionData && (
          <div className="bg-cyan-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-cyan-900">{selectedSessionData.title}</h3>
            <p className="text-cyan-700">
              {formatDate(selectedSessionData.date)} at {formatTime(selectedSessionData.time)}
              ({selectedSessionData.duration} minutes)
            </p>
            {selectedSessionData.description && (
              <p className="text-cyan-600 mt-1">{selectedSessionData.description}</p>
            )}
          </div>
        )}
      </div>

      {selectedSession && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Participants ({filteredParticipants.length})
          </h3>

          {filteredParticipants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'No participants found matching your search.' : 'No participants registered yet.'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredParticipants.map(participant => {
                const status = getAttendanceStatus(participant.id, selectedSession);
                
                return (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{participant.name}</h4>
                      <p className="text-sm text-gray-500">{participant.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onMarkAttendance(participant.id, selectedSession, 'present')}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                          status === 'present'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        Present
                      </button>

                      <button
                        onClick={() => onMarkAttendance(participant.id, selectedSession, 'absent')}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                          status === 'absent'
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        <X className="h-4 w-4" />
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};