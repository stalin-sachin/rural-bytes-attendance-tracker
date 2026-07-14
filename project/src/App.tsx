import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckSquare, BarChart3, Download, Upload, Brain } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ParticipantList } from './components/ParticipantList';
import { SessionList } from './components/SessionList';
import { AttendanceTracker } from './components/AttendanceTracker';
import { ParticipantForm } from './components/ParticipantForm';
import { SessionForm } from './components/SessionForm';
import { Participant, Session, AttendanceRecord } from './types';
import { storage } from './utils/storage';
import { generateId, getAttendanceStats, updateParticipantStats, updateSessionStats } from './utils/helpers';

type TabType = 'dashboard' | 'participants' | 'sessions' | 'attendance';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  
  // Form states
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadedParticipants = storage.getParticipants();
    const loadedSessions = storage.getSessions();
    const loadedAttendance = storage.getAttendance();
    
    setParticipants(updateParticipantStats(loadedParticipants, loadedSessions, loadedAttendance));
    setSessions(updateSessionStats(loadedSessions, loadedAttendance));
    setAttendance(loadedAttendance);
  }, []);

  // Save data whenever state changes
  useEffect(() => {
    storage.saveParticipants(participants);
  }, [participants]);

  useEffect(() => {
    storage.saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    storage.saveAttendance(attendance);
  }, [attendance]);

  // Participant management
  const handleAddParticipant = (participant: Participant) => {
    const updatedParticipants = [...participants, participant];
    setParticipants(updateParticipantStats(updatedParticipants, sessions, attendance));
  };

  const handleEditParticipant = (updatedParticipant: Participant) => {
    const updatedParticipants = participants.map(p => 
      p.id === updatedParticipant.id ? updatedParticipant : p
    );
    setParticipants(updateParticipantStats(updatedParticipants, sessions, attendance));
    setEditingParticipant(null);
  };

  const handleDeleteParticipant = (participantId: string) => {
    if (window.confirm('Are you sure you want to delete this participant? This will also remove their attendance records.')) {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      setAttendance(prev => prev.filter(a => a.participantId !== participantId));
    }
  };

  // Session management
  const handleAddSession = (session: Session) => {
    const updatedSessions = [...sessions, session];
    setSessions(updateSessionStats(updatedSessions, attendance));
  };

  const handleEditSession = (updatedSession: Session) => {
    const updatedSessions = sessions.map(s => 
      s.id === updatedSession.id ? updatedSession : s
    );
    setSessions(updateSessionStats(updatedSessions, attendance));
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session? This will also remove attendance records for this session.')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setAttendance(prev => prev.filter(a => a.sessionId !== sessionId));
    }
  };

  // Attendance management
  const handleMarkAttendance = (participantId: string, sessionId: string, status: 'present' | 'absent') => {
    const existingRecord = attendance.find(
      r => r.participantId === participantId && r.sessionId === sessionId
    );

    if (existingRecord) {
      const updatedAttendance = attendance.map(record =>
        record.id === existingRecord.id
          ? { ...record, status, timestamp: new Date().toISOString() }
          : record
      );
      setAttendance(updatedAttendance);
      setParticipants(updateParticipantStats(participants, sessions, updatedAttendance));
      setSessions(updateSessionStats(sessions, updatedAttendance));
    } else {
      const newRecord: AttendanceRecord = {
        id: generateId(),
        participantId,
        sessionId,
        status,
        timestamp: new Date().toISOString(),
      };
      const updatedAttendance = [...attendance, newRecord];
      setAttendance(updatedAttendance);
      setParticipants(updateParticipantStats(participants, sessions, updatedAttendance));
      setSessions(updateSessionStats(sessions, updatedAttendance));
    }
  };

  // Data export/import
  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-workshop-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          storage.importData(data);
          
          // Reload data
          const loadedParticipants = storage.getParticipants();
          const loadedSessions = storage.getSessions();
          const loadedAttendance = storage.getAttendance();
          
          setParticipants(updateParticipantStats(loadedParticipants, loadedSessions, loadedAttendance));
          setSessions(updateSessionStats(loadedSessions, loadedAttendance));
          setAttendance(loadedAttendance);
          
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const stats = getAttendanceStats(participants, sessions, attendance);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Workshop</h1>
                <p className="text-sm text-gray-500">Attendance Tracker</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-2 text-gray-600 hover:text-fuchsia-600 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>

              <label className="px-3 py-2 text-gray-600 hover:text-fuchsia-600 transition-colors flex items-center gap-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-fuchsia-500 text-fuchsia-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard stats={stats} />}
        
        {activeTab === 'participants' && (
          <ParticipantList
            participants={participants}
            onEdit={(participant) => {
              setEditingParticipant(participant);
              setShowParticipantForm(true);
            }}
            onDelete={handleDeleteParticipant}
            onAddNew={() => setShowParticipantForm(true)}
          />
        )}
        
        {activeTab === 'sessions' && (
          <SessionList
            sessions={sessions}
            onEdit={(session) => {
              setEditingSession(session);
              setShowSessionForm(true);
            }}
            onDelete={handleDeleteSession}
            onAddNew={() => setShowSessionForm(true)}
          />
        )}
        
        {activeTab === 'attendance' && (
          <AttendanceTracker
            participants={participants}
            sessions={sessions}
            attendance={attendance}
            onMarkAttendance={handleMarkAttendance}
          />
        )}
      </main>

      {/* Forms */}
      <ParticipantForm
        isOpen={showParticipantForm}
        onClose={() => {
          setShowParticipantForm(false);
          setEditingParticipant(null);
        }}
        onAdd={handleAddParticipant}
        editingParticipant={editingParticipant}
        onEdit={handleEditParticipant}
      />

      <SessionForm
        isOpen={showSessionForm}
        onClose={() => {
          setShowSessionForm(false);
          setEditingSession(null);
        }}
        onAdd={handleAddSession}
        editingSession={editingSession}
        onEdit={handleEditSession}
      />
    </div>
  );
}

export default App;