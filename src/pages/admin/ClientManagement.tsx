import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, TrendingUp, Calendar, Edit, Trash2, FileText, Grid, Table, X, Save, User, Mail, Target, Calendar as CalendarIcon, Activity, AlertCircle, MessageSquare, Send, TrendingDown, Weight, Clock, Upload } from 'lucide-react';
import { Client, Comment } from '../../types';
import { toast } from 'sonner';
import CSVImport from '../../components/CSVImport';

interface ClientFormData {
  name: string;
  email: string;
  startDate: string;
  startWeight: number;
  goalWeight: number;
  healthIssues: string[];
  dietEndDate: string;
  status: 'active' | 'inactive' | 'yet-to-start' | 'completed';
  notes: string;
  routine: string;
  healthSummary: string;
}

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      startDate: '2024-01-15',
      startWeight: 180,
      currentWeight: 165,
      goalWeight: 160,
      status: 'active',
      notes: 'Making excellent progress with consistency in workouts and nutrition.',
      healthIssues: ['Mild Hypertension', 'Lower Back Pain'],
      dietEndDate: '2024-06-15',
      routine: 'Morning cardio 30 mins, Evening strength training 45 mins, 3x per week',
      healthSummary: 'Blood pressure improving, back pain reduced significantly',
      comments: [
        {
          id: '1',
          text: 'Great progress this week! Keep up the good work.',
          timestamp: '2024-02-20T10:30:00Z',
          author: 'Coach'
        },
        {
          id: '2',
          text: 'Client mentioned feeling more energetic.',
          timestamp: '2024-02-18T14:15:00Z',
          author: 'Coach'
        }
      ],
      weightEntries: [
        { date: '2024-01-15', weight: 180 },
        { date: '2024-01-22', weight: 178 },
        { date: '2024-01-29', weight: 175 },
        { date: '2024-02-05', weight: 172 },
        { date: '2024-02-12', weight: 170 },
        { date: '2024-02-19', weight: 168 },
        { date: '2024-02-26', weight: 165 }
      ]
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      startDate: '2024-02-01',
      startWeight: 140,
      currentWeight: 135,
      goalWeight: 130,
      status: 'active',
      notes: 'Focused on strength training and muscle building.',
      healthIssues: ['None'],
      dietEndDate: '2024-07-01',
      routine: 'Strength training 4x per week, Yoga 2x per week',
      healthSummary: 'Excellent overall health, building lean muscle mass',
      comments: [
        {
          id: '3',
          text: 'Strength gains are impressive this month.',
          timestamp: '2024-02-22T09:00:00Z',
          author: 'Coach'
        }
      ],
      weightEntries: [
        { date: '2024-02-01', weight: 140 },
        { date: '2024-02-08', weight: 139 },
        { date: '2024-02-15', weight: 137 },
        { date: '2024-02-22', weight: 135 }
      ]
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      startDate: '2024-03-01',
      startWeight: 200,
      currentWeight: 200,
      goalWeight: 180,
      status: 'yet-to-start',
      notes: 'Scheduled to begin program next week.',
      healthIssues: ['Diabetes Type 2', 'High Cholesterol'],
      dietEndDate: '2024-08-01',
      routine: 'Low-impact cardio, resistance training with modifications',
      healthSummary: 'Managing diabetes well, cholesterol levels monitored',
      comments: [],
      weightEntries: [
        { date: '2024-03-01', weight: 200 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'calendar'>('table');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCSVImport, setShowCSVImport] = useState(false);

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    startDate: '',
    startWeight: 0,
    goalWeight: 0,
    healthIssues: [],
    dietEndDate: '',
    status: 'yet-to-start',
    notes: '',
    routine: '',
    healthSummary: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'yet-to-start', label: 'Yet to Start' },
    { value: 'completed', label: 'Completed' }
  ];

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'yet-to-start': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateWeightLoss = (client: Client) => {
    if (!client.currentWeight) return 0;
    return client.startWeight - client.currentWeight;
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== clientId));
      toast.success('Client deleted successfully');
    }
  };

  const handleClientNameClick = (client: Client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedClient) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      author: 'Coach'
    };

    setClients(clients.map(client => 
      client.id === selectedClient.id 
        ? { ...client, comments: [comment, ...client.comments] }
        : client
    ));

    setSelectedClient({
      ...selectedClient,
      comments: [comment, ...selectedClient.comments]
    });

    setNewComment('');
    toast.success('Comment added successfully');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getHealthIssueColor = (issue: string) => {
    if (issue.toLowerCase() === 'none') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const handleCSVImport = (importedClients: Client[]) => {
    setClients([...clients, ...importedClients]);
    setShowCSVImport(false);
  };

  const renderWeightChart = (client: Client) => {
    const maxWeight = Math.max(...client.weightEntries.map(entry => entry.weight));
    const minWeight = Math.min(...client.weightEntries.map(entry => entry.weight));
    const range = maxWeight - minWeight || 1;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Weight Progress Chart</h4>
        <div className="relative h-40">
          <svg className="w-full h-full" viewBox="0 0 400 160">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="40"
                y1={20 + i * 30}
                x2="380"
                y2={20 + i * 30}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Weight line */}
            <polyline
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              points={client.weightEntries.map((entry, index) => {
                const x = 40 + (index * (340 / (client.weightEntries.length - 1 || 1)));
                const y = 140 - ((entry.weight - minWeight) / range) * 100;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {client.weightEntries.map((entry, index) => {
              const x = 40 + (index * (340 / (client.weightEntries.length - 1 || 1)));
              const y = 140 - ((entry.weight - minWeight) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  className="hover:r-6 transition-all"
                />
              );
            })}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
            <span>{maxWeight.toFixed(0)}</span>
            <span>{((maxWeight + minWeight) / 2).toFixed(0)}</span>
            <span>{minWeight.toFixed(0)}</span>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-10">
          <span>Start</span>
          <span>Current</span>
        </div>
      </div>
    );
  };

  const renderTableView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight Progress</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Issues</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diet End Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleClientNameClick(client)}
                    className="text-left hover:text-blue-600 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {client.name}
                    </div>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <span className="font-medium">{client.startWeight} lbs</span>
                    {client.currentWeight && (
                      <>
                        <span className="text-gray-500"> → </span>
                        <span className="font-medium">{client.currentWeight} lbs</span>
                        <div className="text-xs text-green-600">
                          -{calculateWeightLoss(client).toFixed(1)} lbs
                        </div>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {client.healthIssues?.map((issue, index) => (
                      <span
                        key={index}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getHealthIssueColor(issue)}`}
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.dietEndDate ? new Date(client.dietEndDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                    {client.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{client.comments?.length || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredClients.map((client) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleClientNameClick(client)}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {client.name}
            </button>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
              {client.status.replace('-', ' ')}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Weight Progress:</span>
              <span className="font-medium">
                {client.startWeight} → {client.currentWeight} lbs
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Weight Lost:</span>
              <span className="font-medium text-green-600">
                -{calculateWeightLoss(client).toFixed(1)} lbs
              </span>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Health Issues:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {client.healthIssues?.slice(0, 2).map((issue, index) => (
                  <span
                    key={index}
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getHealthIssueColor(issue)}`}
                  >
                    {issue}
                  </span>
                ))}
                {(client.healthIssues?.length || 0) > 2 && (
                  <span className="text-xs text-gray-500">+{(client.healthIssues?.length || 0) - 2}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{client.comments?.length || 0} comments</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditClient(client)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCalendarView = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getClientsForDate = (day: number) => {
      const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return filteredClients.filter(client => 
        client.weightEntries.some(entry => entry.date === dateStr) ||
        client.startDate === dateStr ||
        client.dietEndDate === dateStr
      );
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[selectedMonth]} {selectedYear}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2 h-20"></div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const clientsForDay = getClientsForDate(day);
            
            return (
              <div
                key={day}
                className="p-2 h-20 border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                <div className="space-y-1">
                  {clientsForDay.slice(0, 2).map(client => (
                    <div
                      key={client.id}
                      className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                      title={client.name}
                    >
                      {client.name}
                    </div>
                  ))}
                  {clientsForDay.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{clientsForDay.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { 
              ...client, 
              ...formData,
              currentWeight: formData.startWeight,
              weightEntries: [{ date: formData.startDate, weight: formData.startWeight }],
              comments: client.comments || []
            }
          : client
      ));
      toast.success('Client updated successfully');
      setEditingClient(null);
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        currentWeight: formData.startWeight,
        weightEntries: [{ date: formData.startDate, weight: formData.startWeight }],
        comments: []
      };
      setClients([...clients, newClient]);
      toast.success('Client added successfully');
    }
    
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      startDate: '',
      startWeight: 0,
      goalWeight: 0,
      healthIssues: [],
      dietEndDate: '',
      status: 'yet-to-start',
      notes: '',
      routine: '',
      healthSummary: ''
    });
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      startDate: client.startDate,
      startWeight: client.startWeight,
      goalWeight: client.goalWeight || 0,
      healthIssues: client.healthIssues || [],
      dietEndDate: client.dietEndDate || '',
      status: client.status,
      notes: client.notes,
      routine: client.routine || '',
      healthSummary: client.healthSummary || ''
    });
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[95%] mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management Dashboard</h1>
            <p className="text-gray-600">Manage your fitness coaching clients and track their daily progress</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowCSVImport(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
            >
              <Upload className="h-4 w-4" />
              <span>Import CSV</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
            >
              <Plus className="h-4 w-4" />
              <span>Add Client</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Clients', value: clients.length, icon: Users, color: 'from-blue-500 to-blue-600' },
            { title: 'Active Clients', value: clients.filter(c => c.status === 'active').length, icon: TrendingUp, color: 'from-green-500 to-green-600' },
            { title: 'New This Month', value: clients.filter(c => c.startDate.includes('2025-06')).length, icon: Calendar, color: 'from-purple-500 to-purple-600' },
            { title: 'Completed Programs', value: clients.filter(c => c.status === 'completed').length, icon: FileText, color: 'from-orange-500 to-orange-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Table className="h-4 w-4" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </button>
            </div>
            
            {/* Status Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    statusFilter === status.value
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {viewMode === 'table' && renderTableView()}
          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'calendar' && renderCalendarView()}
        </motion.div>

        {/* No Results */}
        {filteredClients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or add your first client.
            </p>
          </motion.div>
        )}

        {/* CSV Import Modal */}
        <AnimatePresence>
          {showCSVImport && (
            <CSVImport
              onImport={handleCSVImport}
              onClose={() => setShowCSVImport(false)}
            />
          )}
        </AnimatePresence>

        {/* Client Profile Modal */}
        <AnimatePresence>
          {showClientModal && selectedClient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-3 rounded-full">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                        <p className="text-gray-600">{selectedClient.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowClientModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* Left Column - Stats and Chart */}
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Weight className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Weight Lost</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {calculateWeightLoss(selectedClient).toFixed(1)} lbs
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Goal Weight</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {selectedClient.goalWeight} lbs
                        </p>
                      </div>
                    </div>

                    {/* Weight Chart */}
                    {renderWeightChart(selectedClient)}

                    {/* Health Issues */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Health Issues</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.healthIssues?.map((issue, index) => (
                          <span
                            key={index}
                            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getHealthIssueColor(issue)}`}
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Routine */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Routine</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedClient.routine || 'No routine specified'}
                      </p>
                    </div>

                    {/* Health Summary */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Health Summary</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedClient.healthSummary || 'No health summary available'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Comments */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Comments & Notes</h4>
                      
                      {/* Add Comment */}
                      <div className="mb-6">
                        <div className="flex space-x-3">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment or note..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={3}
                          />
                          <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {selectedClient.comments?.length > 0 ? (
                          selectedClient.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTimestamp(comment.timestamp)}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No comments yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Client Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingClient ? 'Edit Client' : 'Add New Client'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingClient(null);
                        setFormData({
                          name: '',
                          email: '',
                          startDate: '',
                          startWeight: 0,
                          goalWeight: 0,
                          healthIssues: [],
                          dietEndDate: '',
                          status: 'yet-to-start',
                          notes: '',
                          routine: '',
                          healthSummary: ''
                        });
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter client's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        Diet End Date
                      </label>
                      <input
                        type="date"
                        value={formData.dietEndDate}
                        onChange={(e) => setFormData({ ...formData, dietEndDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Activity className="h-4 w-4 inline mr-1" />
                        Starting Weight (lbs)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.1"
                        value={formData.startWeight || ''}
                        onChange={(e) => setFormData({ ...formData, startWeight: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter starting weight"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Target className="h-4 w-4 inline mr-1" />
                        Goal Weight (lbs)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.goalWeight || ''}
                        onChange={(e) => setFormData({ ...formData, goalWeight: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter goal weight"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        Health Issues (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.healthIssues.join(', ')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          healthIssues: e.target.value.split(',').map(issue => issue.trim()).filter(issue => issue)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Diabetes, High Blood Pressure"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="yet-to-start">Yet to Start</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routine
                    </label>
                    <textarea
                      rows={3}
                      value={formData.routine}
                      onChange={(e) => setFormData({ ...formData, routine: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the client's workout routine..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Summary
                    </label>
                    <textarea
                      rows={3}
                      value={formData.healthSummary}
                      onChange={(e) => setFormData({ ...formData, healthSummary: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Overall health status and notes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Additional notes about the client..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingClient(null);
                        setFormData({
                          name: '',
                          email: '',
                          startDate: '',
                          startWeight: 0,
                          goalWeight: 0,
                          healthIssues: [],
                          dietEndDate: '',
                          status: 'yet-to-start',
                          notes: '',
                          routine: '',
                          healthSummary: ''
                        });
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingClient ? 'Update Client' : 'Add Client'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientManagement;