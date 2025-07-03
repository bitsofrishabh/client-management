import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Weight, Target, MessageSquare, Plus, TrendingDown, TrendingUp, Activity } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'comments'>('overview');
  
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
    return diff < -0.5 ? 'decreasing' : diff > 0.5 ? 'increasing' : 'stable';
  };

  // Prepare chart data
  const chartData = {
    labels: client.weightEntries.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: client.weightEntries.map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Goal Weight',
        data: Array(client.weightEntries.length).fill(client.goalWeight),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weight Progress Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.min(...client.weightEntries.map(e => e.weight), client.goalWeight || 0) - 5,
        max: Math.max(...client.weightEntries.map(e => e.weight), client.startWeight) + 5,
      },
    },
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
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
              <p className="text-gray-600">Client Details & Progress</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'comments', label: 'Comments', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Current Weight</p>
                      <p className="text-2xl font-bold text-blue-900">{client.currentWeight} lbs</p>
                    </div>
                    <Weight className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Goal Weight</p>
                      <p className="text-2xl font-bold text-green-900">{client.goalWeight} lbs</p>
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
              </div>

              {/* Client Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Issues</h3>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-gray-700">{client.notes || 'No notes available'}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Routine</h3>
                  <p className="text-gray-700">{client.routine || 'No routine specified'}</p>
                </div>
              </div>

              {/* Health Summary */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
                <p className="text-gray-700">{client.healthSummary || 'No health summary available'}</p>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Weight Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress Chart</h3>
                {client.weightEntries.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No weight data available
                  </div>
                )}
              </div>

              {/* Add Weight Entry */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Weight Entry</h3>
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
                    placeholder="Weight (lbs)"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {client.weightEntries.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="font-medium text-gray-900">{entry.weight} lbs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Add Comment */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments History</h3>
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
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClientModal;