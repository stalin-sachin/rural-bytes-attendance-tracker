import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Participant } from '../types';
import { generateId } from '../utils/helpers';

interface ParticipantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (participant: Participant) => void;
  editingParticipant?: Participant | null;
  onEdit?: (participant: Participant) => void;
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({
  isOpen,
  onClose,
  onAdd,
  editingParticipant,
  onEdit,
}) => {
  const [formData, setFormData] = useState({
    name: editingParticipant?.name || '',
    email: editingParticipant?.email || '',
    phone: editingParticipant?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingParticipant && onEdit) {
      onEdit({
        ...editingParticipant,
        ...formData,
      });
    } else {
      const newParticipant: Participant = {
        id: generateId(),
        ...formData,
        registrationDate: new Date().toISOString(),
        totalSessions: 0,
        attendedSessions: 0,
      };
      onAdd(newParticipant);
    }
    
    setFormData({ name: '', email: '', phone: '' });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingParticipant ? 'Edit Participant' : 'Add New Participant'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              placeholder="Enter participant's full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              placeholder="Enter phone number (optional)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-md hover:from-fuchsia-700 hover:to-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {editingParticipant ? 'Update' : 'Add'} Participant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};