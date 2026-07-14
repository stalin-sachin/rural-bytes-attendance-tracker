import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, Mail, Phone } from 'lucide-react';
import { Participant } from '../types';
import { formatDate, calculateAttendanceRate } from '../utils/helpers';

interface ParticipantListProps {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (participantId: string) => void;
  onAddNew: () => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Participants</h2>
          <p className="text-gray-600">Manage workshop participants and their information</p>
        </div>
        
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-md hover:from-fuchsia-700 hover:to-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Participant
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
              placeholder="Search participants..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            />
          </div>
        </div>

        {filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No participants found matching your search.' : 'No participants registered yet.'}
            </p>
            {!searchTerm && (
              <button
                onClick={onAddNew}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-md hover:from-fuchsia-700 hover:to-purple-700 transition-colors"
              >
                Add Your First Participant
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParticipants.map(participant => (
              <div key={participant.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-fuchsia-200 transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{participant.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{participant.email}</span>
                    </div>
                    {participant.phone && (
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{participant.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(participant)}
                      className="text-fuchsia-600 hover:text-fuchsia-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(participant.id)}
                      className="text-rose-600 hover:text-rose-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Attendance Rate</p>
                      <p className="font-semibold text-gray-900">
                        {calculateAttendanceRate(participant.attendedSessions, participant.totalSessions)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sessions</p>
                      <p className="font-semibold text-gray-900">
                        {participant.attendedSessions}/{participant.totalSessions}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-500 text-xs">Registered</p>
                    <p className="text-gray-900 text-sm">{formatDate(participant.registrationDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};