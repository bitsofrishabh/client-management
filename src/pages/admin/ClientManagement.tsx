import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Users, TrendingUp, Calendar, Edit, Trash2, FileText, Upload, Eye, Table, CalendarDays, Save, X } from 'lucide-react';
import { Client } from '../../types';
import { toast } from 'sonner';
import CSVImport from '../../components/CSVImport';
import ClientModal from '../../components/ClientModal';
import ClientEditModal from '../../components/ClientEditModal';
import { useClients, useCreateClients, useDeleteClient, useAddWeightEntry } from '../../hooks/useClients';

type ViewType = 'table' | 'calendar';

interface EditingCell {
  clientId: string;
  day: number;
  value: string;
}

const ClientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  // Use React Query hooks for data management
  const { data: clients = [], isLoading, error } = useClients();
  const createClientsMutation = useCreateClients();
  const deleteClientMutation = useDeleteClient();
  const addWeightMutation = useAddWeightEntry();

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'yet-to-start', label: 'Yet to Start' },
    { value: 'completed', label: 'Completed' }
  ];

  const viewOptions = [
    { value: 'table' as ViewType, label: 'Table View', icon: Table },
    { value: 'calendar' as ViewType, label: 'Calendar View', icon: CalendarDays }
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

  const calculateProgress = (client: Client) => {
    if (!client.currentWeight || !client.goalWeight) return 0;
    const totalLoss = client.startWeight - client.goalWeight;
    const currentLoss = client.startWeight - client.currentWeight;
    return Math.round((currentLoss / totalLoss) * 100);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClientMutation.mutate(clientId);
    }
  };

  const handleCSVImport = (importedClients: Client[]) => {
    createClientsMutation.mutate(importedClients);
    setShowCSVImport(false);
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
  };

  const handleCellDoubleClick = (clientId: string, day: number, currentWeight: number | null) => {
    setEditingCell({
      clientId,
      day,
      value: currentWeight ? currentWeight.toString() : ''
    });
  };

  const handleCellSave = async () => {
    if (!editingCell) return;

    const weight = parseFloat(editingCell.value);
    if (isNaN(weight) || weight <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${editingCell.day.toString().padStart(2, '0')}`;

    try {
      await addWeightMutation.mutateAsync({
        clientId: editingCell.clientId,
        date: dateString,
        weight: weight
      });
      setEditingCell(null);
    } catch (error) {
      console.error('Error saving weight:', error);
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
  };

  const handleCellKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };

  // Render Table View
  const renderTableView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      style={{ display: 'block', width: '100%' }}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed" style={{ minWidth: '1200px' }}>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-48 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="w-40 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight Progress (kg)</th>
              <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height (cm)</th>
              <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="w-48 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Issues</th>
              <th className="flex-1 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments/Notes</th>
              <th className="w-32 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div 
                    className="cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleClientClick(client)}
                  >
                    <div className="text-sm font-medium text-gray-900 truncate">{client.name}</div>
                    <div className="text-sm text-gray-500 truncate">{client.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>
                    <span className="font-medium">{client.startWeight} kg</span>
                    {client.currentWeight && (
                      <>
                        <span className="text-gray-500"> → </span>
                        <span className="font-medium">{client.currentWeight} kg</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {client.height ? `${client.height} cm` : 'Not specified'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                    {client.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {client.healthIssues?.slice(0, 2).map((issue, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          issue.toLowerCase() === 'none' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {issue}
                      </span>
                    ))}
                    {(client.healthIssues?.length || 0) > 2 && (
                      <span className="text-xs text-gray-500">+{(client.healthIssues?.length || 0) - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="truncate max-w-xs" title={client.notes || 'No notes'}>
                    {client.notes || 'No notes'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleClientClick(client)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingClient(client)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit Client"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Client"
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
    </motion.div>
  );

  // Render Calendar View (Excel-like table)
  const renderCalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create array of days for the month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Helper function to get weight for a specific client on a specific date
    const getWeightForDate = (client: Client, day: number) => {
      const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const weightEntry = client.weightEntries.find(entry => entry.date === dateString);
      return weightEntry ? weightEntry.weight : null;
    };
    
    // Helper function to check if date is today
    const isToday = (day: number) => {
      return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {monthNames[currentMonth]} {currentYear} - Weight Tracking
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Weight Recorded</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Today</span>
            </div>
            <div className="text-xs text-gray-500">
              Double-click cells to edit weights
            </div>
          </div>
        </div>

        {/* Weight Tracking Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-900 sticky left-0 bg-gray-50 border-r border-gray-200 min-w-[200px] z-10">
                  Client Name
                </th>
                {daysArray.map(day => (
                  <th 
                    key={day} 
                    className={`text-center p-2 font-medium text-xs min-w-[70px] border-r border-gray-100 ${
                      isToday(day) ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-gray-600'
                    }`}
                  >
                    <div className="font-bold">{day}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(currentYear, currentMonth, day).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, clientIndex) => (
                <tr 
                  key={client.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    clientIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="p-3 sticky left-0 bg-inherit border-r border-gray-200 z-10">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleClientClick(client)}
                      >
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">
                          Goal: {client.goalWeight} kg | Current: {client.currentWeight} kg
                        </div>
                      </div>
                    </div>
                  </td>
                  {daysArray.map(day => {
                    const weight = getWeightForDate(client, day);
                    const isEditingThisCell = editingCell?.clientId === client.id && editingCell?.day === day;
                    
                    return (
                      <td 
                        key={day} 
                        className={`text-center p-1 text-xs border-r border-gray-100 ${
                          isToday(day) ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onDoubleClick={() => handleCellDoubleClick(client.id, day, weight)}
                      >
                        {isEditingThisCell ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              step="0.1"
                              value={editingCell.value}
                              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                              onKeyDown={handleCellKeyPress}
                              className="w-16 px-1 py-1 text-xs border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={handleCellSave}
                              className="text-green-600 hover:text-green-800"
                              title="Save"
                            >
                              <Save className="h-3 w-3" />
                            </button>
                            <button
                              onClick={handleCellCancel}
                              className="text-red-600 hover:text-red-800"
                              title="Cancel"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : weight ? (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium cursor-pointer hover:bg-green-200 transition-colors">
                            {weight} kg
                          </div>
                        ) : (
                          <div className="text-gray-300 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-600">Total Clients</div>
            <div className="text-2xl font-bold text-blue-900">{filteredClients.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-600">Weight Entries This Month</div>
            <div className="text-2xl font-bold text-green-900">
              {filteredClients.reduce((total, client) => {
                return total + client.weightEntries.filter(entry => {
                  const entryDate = new Date(entry.date);
                  return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
                }).length;
              }, 0)}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-orange-600">Active Clients</div>
            <div className="text-2xl font-bold text-orange-900">
              {filteredClients.filter(client => client.status === 'active').length}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Clients</h2>
          <p className="text-gray-600">Please check your database connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
            <p className="text-gray-600">Manage your fitness coaching clients and track their progress</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowCSVImport(true)}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
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
            { title: 'New This Month', value: clients.filter(c => new Date(c.startDate).getMonth() === new Date().getMonth()).length, icon: Calendar, color: 'from-purple-500 to-purple-600' },
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

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white min-w-[150px]"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* View Switching Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {viewOptions.map((view) => (
              <button
                key={view.value}
                onClick={() => setCurrentView(view.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentView === view.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <view.icon className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} in {currentView} view
          </p>
        </motion.div>

        {/* Dynamic View Rendering */}
        {currentView === 'table' && renderTableView()}
        {currentView === 'calendar' && renderCalendarView()}

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
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCSVImport && (
          <CSVImport
            onImport={handleCSVImport}
            onClose={() => setShowCSVImport(false)}
          />
        )}
        
        {selectedClient && (
          <ClientModal
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}

        {editingClient && (
          <ClientEditModal
            client={editingClient}
            onClose={() => setEditingClient(null)}
          />
        )}

        {showAddForm && (
          <ClientEditModal
            client={null}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientManagement;