import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Users, TrendingUp, Calendar, Edit, Trash2, FileText, Upload, Eye } from 'lucide-react';
import { Client } from '../../types';
import { toast } from 'sonner';
import CSVImport from '../../components/CSVImport';
import ClientModal from '../../components/ClientModal';
import ClientEditModal from '../../components/ClientEditModal';
import { useClients, useCreateClients, useDeleteClient } from '../../hooks/useClients';

const ClientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Use React Query hooks for data management
  const { data: clients = [], isLoading, error } = useClients();
  const createClientsMutation = useCreateClients();
  const deleteClientMutation = useDeleteClient();

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
      <div className="w-full px-4 sm:px-6 lg:px-8">
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

        {/* Clients Table - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight Progress (kg)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height (cm)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Issues</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments/Notes</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleClientClick(client)}
                      >
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.height ? `${client.height} cm` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                        {client.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="truncate">{client.notes || 'No notes'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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