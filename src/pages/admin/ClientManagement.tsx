import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Users, TrendingUp, Calendar, Edit, Trash2, FileText, Upload, Eye, Table, CalendarDays, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  // Calendar state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // Helper function to get weight for a specific client on a specific date
  const getWeightForDate = (client: Client, day: number) => {
    const dateString = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const weightEntry = client.weightEntries.find(entry => entry.date === dateString);
    return weightEntry ? weightEntry.weight : null;
  };

  // Helper function to get weight trend color based on the algorithm
  const getWeightTrendColor = (client: Client, day: number) => {
    const currentDate = new Date(selectedYear, selectedMonth, day);
    const currentWeight = getWeightForDate(client, day);
    
    if (!currentWeight) return '';

    // Get weights for the last 7 days including current day
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - i);
      
      if (checkDate.getMonth() === selectedMonth && checkDate.getFullYear() === selectedYear) {
        const weight = getWeightForDate(client, checkDate.getDate());
        if (weight) {
          last7Days.push({ date: checkDate.getDate(), weight });
        }
      }
    }

    if (last7Days.length < 2) return '';

    // Get weights for the last 4 days including current day
    const last4Days = last7Days.slice(-4);
    
    // Check if weight is same or increased for last 4 days
    if (last4Days.length >= 4) {
      const isStagnantOrIncreasing = last4Days.every((entry, index) => {
        if (index === 0) return true;
        return entry.weight >= last4Days[index - 1].weight;
      });
      
      if (isStagnantOrIncreasing) {
        return 'bg-yellow-200 text-yellow-800 border-yellow-300';
      }
    }

    // Check if weight difference in last 7 days is 0
    const minWeight = Math.min(...last7Days.map(d => d.weight));
    const maxWeight = Math.max(...last7Days.map(d => d.weight));
    const weightDifference = maxWeight - minWeight;
    
    if (weightDifference === 0) {
      return 'bg-red-200 text-red-800 border-red-300';
    }

    // Check if weight is same and didn't come down in last 7 days
    if (last7Days.length >= 7) {
      const firstWeight = last7Days[0].weight;
      const lastWeight = last7Days[last7Days.length - 1].weight;
      
      if (lastWeight >= firstWeight) {
        return 'bg-red-200 text-red-800 border-red-300';
      }
    }

    // Check if weight is going down with little bit of up and down (overall downward trend)
    if (last7Days.length >= 3) {
      const firstWeight = last7Days[0].weight;
      const lastWeight = last7Days[last7Days.length - 1].weight;
      
      if (lastWeight < firstWeight) {
        // Check for overall downward trend despite some fluctuations
        let downwardTrend = 0;
        let upwardTrend = 0;
        
        for (let i = 1; i < last7Days.length; i++) {
          if (last7Days[i].weight < last7Days[i - 1].weight) {
            downwardTrend++;
          } else if (last7Days[i].weight > last7Days[i - 1].weight) {
            upwardTrend++;
          }
        }
        
        if (downwardTrend >= upwardTrend) {
          return 'bg-green-200 text-green-800 border-green-300';
        }
      }
    }

    return '';
  };

  // Calculate weight lost from start date to current date
  const calculateWeightLoss = (client: Client) => {
    if (!client.currentWeight) return 0;
    return client.startWeight - client.currentWeight;
  };

  // Get current weight for the selected month (latest weight entry in that month)
  const getCurrentWeightForMonth = (client: Client) => {
    const monthEntries = client.weightEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
    });
    
    if (monthEntries.length === 0) return client.currentWeight;
    
    // Sort by date and get the latest entry
    monthEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return monthEntries[0].weight;
  };

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

    const dateString = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${editingCell.day.toString().padStart(2, '0')}`;

    try {
      await addWeightMutation.mutateAsync({
        clientId: editingCell.clientId,
        date: dateString,
        weight: weight
      });
      setEditingCell(null);
      toast.success('Weight entry saved successfully!');
    } catch (error) {
      console.error('Error saving weight:', error);
      toast.error('Failed to save weight entry');
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

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
  };

  // Check if client should start tracking from this date
  const shouldShowWeight = (client: Client, day: number) => {
    const startDate = new Date(client.startDate);
    const currentDate = new Date(selectedYear, selectedMonth, day);
    return currentDate >= startDate;
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
                    <span className="font-medium">{client.startWeight} </span>
                    {client.currentWeight && (
                      <>
                        <span className="text-gray-500"> → </span>
                        <span className="font-medium">{client.currentWeight} </span>
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
    // Get first day of month and number of days
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Create array of days for the month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        {/* Calendar Header with Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900">
              {monthNames[selectedMonth]} {selectedYear} - Weight Tracking
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
              <span>Losing Weight</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
              <span>Stagnant (4 days)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
              <span>No Progress (7 days)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
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
                <th className="text-center p-3 font-semibold text-gray-900 border-r border-gray-200 min-w-[100px] bg-blue-50">
                  Weight Lost (kg)
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
                      {new Date(selectedYear, selectedMonth, day).toLocaleDateString('en', { weekday: 'short' })}
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
                          Start: {client.startWeight} kg | Goal: {client.goalWeight} kg
                        </div>
                        <div className="text-xs text-gray-400">
                          Started: {new Date(client.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center border-r border-gray-200 bg-blue-50">
                    <div className="font-bold text-lg text-blue-900">
                      {calculateWeightLoss(client).toFixed(1)}
                    </div>
                    <div className="text-xs text-blue-600">
                      {calculateWeightLoss(client) > 0 ? 'Lost' : calculateWeightLoss(client) < 0 ? 'Gained' : 'Same'}
                    </div>
                  </td>
                  {daysArray.map(day => {
                    const weight = getWeightForDate(client, day);
                    const isEditingThisCell = editingCell?.clientId === client.id && editingCell?.day === day;
                    const trendColor = getWeightTrendColor(client, day);
                    const showWeight = shouldShowWeight(client, day);
                    
                    return (
                      <td 
                        key={day} 
                        className={`text-center p-1 text-xs border-r border-gray-100 ${
                          isToday(day) ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onDoubleClick={() => showWeight && handleCellDoubleClick(client.id, day, weight)}
                      >
                        {!showWeight ? (
                          <div className="text-gray-300 px-2 py-1">
                            -
                          </div>
                        ) : isEditingThisCell ? (
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
                          <div className={`px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 transition-all border ${
                            trendColor || 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}>
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
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
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-600">Total Weight Lost</div>
            <div className="text-2xl font-bold text-purple-900">
              {filteredClients.reduce((total, client) => total + calculateWeightLoss(client), 0).toFixed(1)} kg
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Weight Tracking Algorithm:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
              <span>Green: Weight going down with fluctuations (overall downward trend)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
              <span>Yellow: Weight same or increased for last 4 days</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
              <span>Red: No weight change in 7 days OR weight didn't decrease in 7 days</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Gray: Normal weight entry</span>
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
            {currentView === 'calendar' && ` for ${monthNames[selectedMonth]} ${selectedYear}`}
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