import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Weight, Target, MessageSquare, Plus, TrendingDown, TrendingUp, Activity, User, Heart, FileText, Ruler, Filter } from 'lucide-react';
import { Client } from '../types';
import { Line } from 'react-chartjs-2';
import { useAddComment, useAddWeightEntry } from '../hooks/useClients';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ClientModalProps {
  client: Client;
  onClose: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ client, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartTimeFilter, setChartTimeFilter] = useState('30'); // days
  
  const { user } = useAuth();
  const addCommentMutation = useAddComment();
  const addWeightMutation = useAddWeightEntry();

  const handleAddComment = () => {
    if (newComment.trim() && user) {
      addCommentMutation.mutate({
        clientId: client.id,
        text: newComment.trim(),
        author: user.name
      });
      setNewComment('');
    }
  };

  const handleAddWeight = () => {
    if (newWeight && newWeightDate) {
      addWeightMutation.mutate({
        clientId: client.id,
        date: newWeightDate,
        weight: parseFloat(newWeight)
      });
      setNewWeight('');
      setNewWeightDate(new Date().toISOString().split('T')[0]);
    }
  };

  const calculateProgress = () => {
    if (!client.currentWeight || !client.goalWeight) return 0;
    const totalLoss = client.startWeight - client.goalWeight;
    const currentLoss = client.startWeight - client.currentWeight;
    return Math.round((currentLoss / totalLoss) * 100);
  };

  const getWeightTrend = () => {
    if (client.weightEntries.length < 2) return 'stable';
    const recent = client.weightEntries.slice(-2);
    const diff = recent[1].weight - recent[0].weight;
    return diff < -0.2 ? 'decreasing' : diff > 0.2 ? 'increasing' : 'stable';
  };

  const calculateBMI = () => {
    if (!client.currentWeight || !client.height) return null;
    const heightInMeters = client.height / 100;
    return (client.currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Filter weight entries based on selected time period
  const getFilteredWeightEntries = () => {
    if (chartTimeFilter === 'all') {
      return client.weightEntries;
    }
    
    const days = parseInt(chartTimeFilter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return client.weightEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
  };

  const filteredWeightEntries = getFilteredWeightEntries();

  // Chart time filter options
  const timeFilterOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '14', label: 'Last 14 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '60', label: 'Last 2 months' },
    { value: '90', label: 'Last 3 months' },
    { value: '180', label: 'Last 6 months' },
    { value: 'all', label: 'All time' }
  ];

  // Prepare chart data with start weight to goal weight Y-axis range
  const chartData = {
    labels: filteredWeightEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: 'Weight (kg)',
        data: filteredWeightEntries.map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Goal Weight',
        data: Array(filteredWeightEntries.length).fill(client.goalWeight),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
      },
      {
        label: 'Start Weight',
        data: Array(filteredWeightEntries.length).fill(client.startWeight),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'transparent',
        borderDash: [10, 5],
        pointRadius: 0,
      }
    ],
  };

  // Calculate Y-axis range from start weight to goal weight with some padding
  const weightRange = Math.abs(client.startWeight - (client.goalWeight || client.startWeight));
  const padding = Math.max(5, weightRange * 0.1); // 10% padding or minimum 5kg
  const yAxisMin = Math.min(client.startWeight, client.goalWeight || client.startWeight) - padding;
  const yAxisMax = Math.max(client.startWeight, client.goalWeight || client.startWeight) + padding;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Weight Progress Over Time (${timeFilterOptions.find(opt => opt.value === chartTimeFilter)?.label})`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: yAxisMin,
        max: yAxisMax,
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-[80%] h-[80%] flex flex-col rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
              <p className="text-gray-600">Complete Client Profile & Progress</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Overview Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Overview
            </h3>
            
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Current Weight</p>
                    <p className="text-2xl font-bold text-blue-900">{client.currentWeight} kg</p>
                  </div>
                  <Weight className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Goal Weight</p>
                    <p className="text-2xl font-bold text-green-900">{client.goalWeight} kg</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Progress</p>
                    <p className="text-2xl font-bold text-purple-900">{calculateProgress()}%</p>
                  </div>
                  <div className="flex items-center">
                    {getWeightTrend() === 'decreasing' ? (
                      <TrendingDown className="h-8 w-8 text-green-600" />
                    ) : getWeightTrend() === 'increasing' ? (
                      <TrendingUp className="h-8 w-8 text-red-600" />
                    ) : (
                      <Activity className="h-8 w-8 text-purple-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">BMI</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {calculateBMI() || 'N/A'}
                    </p>
                  </div>
                  <Ruler className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{client.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Start Date:</span>
                    <p className="text-gray-900">{new Date(client.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Height:</span>
                    <p className="text-gray-900">{client.height ? `${client.height} cm` : 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' :
                      client.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      client.status === 'yet-to-start' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {client.status.replace('-', ' ')}
                    </span>
                  </div>
                  {client.dietEndDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Diet End Date:</span>
                      <p className="text-gray-900">{new Date(client.dietEndDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Health Issues</h4>
                <div className="flex flex-wrap gap-2">
                  {client.healthIssues?.map((issue, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        issue.toLowerCase() === 'none' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes and Routine */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Notes</h4>
                <p className="text-gray-700">{client.notes || 'No notes available'}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Routine</h4>
                <p className="text-gray-700">{client.routine || 'No routine specified'}</p>
              </div>
            </div>

            {/* Health Summary */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h4>
              <p className="text-gray-700">{client.healthSummary || 'No health summary available'}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Progress
            </h3>
            
            {/* Weight Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Weight Progress Chart</h4>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={chartTimeFilter}
                    onChange={(e) => setChartTimeFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timeFilterOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {filteredWeightEntries.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No weight data available for the selected time period
                </div>
              )}
            </div>

            {/* Add Weight Entry */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Weight Entry</h4>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={newWeightDate}
                  onChange={(e) => setNewWeightDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Weight (kg)"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAddWeight}
                  disabled={!newWeight || !newWeightDate || addWeightMutation.isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Weight History */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Weight History</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {client.weightEntries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{new Date(entry.date).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{entry.weight} kg</span>
                      {index < client.weightEntries.length - 1 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          entry.weight < client.weightEntries[client.weightEntries.length - 1 - index - 1]?.weight
                            ? 'bg-green-100 text-green-800'
                            : entry.weight > client.weightEntries[client.weightEntries.length - 1 - index - 1]?.weight
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.weight < client.weightEntries[client.weightEntries.length - 1 - index - 1]?.weight
                            ? '↓'
                            : entry.weight > client.weightEntries[client.weightEntries.length - 1 - index - 1]?.weight
                            ? '↑'
                            : '→'
                          }
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Comments
            </h3>
            
            {/* Add Comment */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Comment</h4>
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment about this client..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || addCommentMutation.isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Comment</span>
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Comments History</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {client.comments.length > 0 ? (
                  client.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No comments yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClientModal;