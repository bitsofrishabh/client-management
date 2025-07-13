import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, User } from 'lucide-react';
import { Client } from '../types';
import { useUpdateClient, useCreateClients } from '../hooks/useClients';
import { toast } from 'sonner';

interface ClientEditModalProps {
  client: Client | null; // null for creating new client
  onClose: () => void;
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({ client, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    startDate: '',
    startWeight: '',
    currentWeight: '',
    goalWeight: '',
    height: '',
    status: 'active' as const,
    notes: '',
    healthIssues: [] as string[],
    dietEndDate: '',
    routine: '',
    healthSummary: ''
  });

  const [healthIssueInput, setHealthIssueInput] = useState('');
  
  const updateClientMutation = useUpdateClient();
  const createClientsMutation = useCreateClients();

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        startDate: client.startDate,
        startWeight: client.startWeight.toString(),
        currentWeight: client.currentWeight?.toString() || '',
        goalWeight: client.goalWeight?.toString() || '',
        height: client.height?.toString() || '',
        status: client.status,
        notes: client.notes,
        healthIssues: client.healthIssues || [],
        dietEndDate: client.dietEndDate || '',
        routine: client.routine || '',
        healthSummary: client.healthSummary || ''
      });
    }
  }, [client]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddHealthIssue = () => {
    if (healthIssueInput.trim() && !formData.healthIssues.includes(healthIssueInput.trim())) {
      setFormData(prev => ({
        ...prev,
        healthIssues: [...prev.healthIssues, healthIssueInput.trim()]
      }));
      setHealthIssueInput('');
    }
  };

  const handleRemoveHealthIssue = (issue: string) => {
    setFormData(prev => ({
      ...prev,
      healthIssues: prev.healthIssues.filter(h => h !== issue)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (client) {
        // Update existing client
        const updates: Partial<Client> = {
          name: formData.name,
          email: formData.email,
          startDate: formData.startDate,
          startWeight: parseFloat(formData.startWeight) || 0,
          currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : undefined,
          goalWeight: formData.goalWeight ? parseFloat(formData.goalWeight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          status: formData.status,
          notes: formData.notes,
          healthIssues: formData.healthIssues,
          dietEndDate: formData.dietEndDate || null,
          routine: formData.routine,
          healthSummary: formData.healthSummary
        };

        await updateClientMutation.mutateAsync({ id: client.id, updates });
      } else {
        // Create new client
        const newClient: Client = {
          id: `new-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          startDate: formData.startDate,
          startWeight: parseFloat(formData.startWeight) || 0,
          currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : undefined,
          goalWeight: formData.goalWeight ? parseFloat(formData.goalWeight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          status: formData.status,
          notes: formData.notes,
          healthIssues: formData.healthIssues,
          dietEndDate: formData.dietEndDate || null,
          routine: formData.routine,
          healthSummary: formData.healthSummary,
          weightEntries: formData.currentWeight ? [{
            date: formData.startDate,
            weight: parseFloat(formData.currentWeight)
          }] : [],
          comments: []
        };

        await createClientsMutation.mutateAsync([newClient]);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  return (
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
        className="bg-white rounded-2xl shadow-xl w-[90%] h-[90%] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {client ? 'Edit Client' : 'Add New Client'}
                </h2>
                <p className="text-gray-600">
                  {client ? 'Update client information' : 'Create a new client profile'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Physical Information */}
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="startWeight"
                value={formData.startWeight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="goalWeight"
                value={formData.goalWeight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="yet-to-start">Yet to Start</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diet End Date
              </label>
              <input
                type="date"
                name="dietEndDate"
                value={formData.dietEndDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Health Issues */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Issues
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={healthIssueInput}
                onChange={(e) => setHealthIssueInput(e.target.value)}
                placeholder="Add health issue"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHealthIssue())}
              />
              <button
                type="button"
                onClick={handleAddHealthIssue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.healthIssues.map((issue, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800"
                >
                  {issue}
                  <button
                    type="button"
                    onClick={() => handleRemoveHealthIssue(issue)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routine
              </label>
              <textarea
                name="routine"
                value={formData.routine}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Summary
            </label>
            <textarea
              name="healthSummary"
              value={formData.healthSummary}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateClientMutation.isLoading || createClientsMutation.isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(updateClientMutation.isLoading || createClientsMutation.isLoading) ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{client ? 'Update Client' : 'Create Client'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ClientEditModal;