import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Client, WeightEntry } from '../types';
import { toast } from 'sonner';

interface CSVImportProps {
  onImport: (clients: Client[]) => void;
  onClose: () => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ onImport, onClose }) => {
  const [csvData, setCsvData] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<Client[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const parseCSVData = (csvText: string): Client[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    const clients: Client[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length < 2 || !row[0].trim()) continue;
      
      const clientName = row[0].trim();
      const notes = row[1].trim();
      const lastFollowUp = row[2].trim();
      const dietEnd = row[3].trim();
      const startDateAndWeight = row[4].trim();
      
      // Parse start date and weight from format like "82.8(27-05)" or "2025-06-18"
      let startDate = '';
      let startWeight = 0;
      
      if (startDateAndWeight.includes('(')) {
        const weightMatch = startDateAndWeight.match(/^([\d.]+)\((\d{2}-\d{2})\)$/);
        if (weightMatch) {
          startWeight = parseFloat(weightMatch[1]);
          const datePart = weightMatch[2];
          startDate = `2025-${datePart.split('-')[1]}-${datePart.split('-')[0]}`;
        }
      } else if (startDateAndWeight.includes('2025-')) {
        startDate = startDateAndWeight;
        // Look for weight in the next column
        if (row[5] && !isNaN(parseFloat(row[5]))) {
          startWeight = parseFloat(row[5]);
        }
      }
      
      // Parse daily weights (columns 5-35 represent days 1-30 of June 2025)
      const weightEntries: WeightEntry[] = [];
      
      // Add start weight entry
      if (startDate && startWeight > 0) {
        weightEntries.push({
          date: startDate,
          weight: startWeight
        });
      }
      
      // Parse daily weights for June 2025
      for (let day = 1; day <= 30; day++) {
        const columnIndex = 4 + day; // Columns 5-34 represent days 1-30
        if (columnIndex < row.length) {
          const weightValue = row[columnIndex].trim();
          if (weightValue && weightValue !== '-' && weightValue !== '--' && !isNaN(parseFloat(weightValue))) {
            const weight = parseFloat(weightValue);
            const date = `2025-06-${day.toString().padStart(2, '0')}`;
            weightEntries.push({
              date,
              weight
            });
          }
        }
      }
      
      // Determine current weight (last recorded weight)
      const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : startWeight;
      
      // Parse health issues from notes
      const healthIssues: string[] = [];
      if (notes.toLowerCase().includes('diabetes')) healthIssues.push('Diabetes');
      if (notes.toLowerCase().includes('hypertension') || notes.toLowerCase().includes('blood pressure')) healthIssues.push('High Blood Pressure');
      if (notes.toLowerCase().includes('constipation')) healthIssues.push('Constipation');
      if (notes.toLowerCase().includes('bloated')) healthIssues.push('Bloating');
      if (notes.toLowerCase().includes('pain')) healthIssues.push('Pain Issues');
      if (healthIssues.length === 0) healthIssues.push('None');
      
      // Determine status
      let status: 'active' | 'inactive' | 'yet-to-start' | 'completed' = 'active';
      if (notes.toLowerCase().includes('paused') || notes.toLowerCase().includes('break')) {
        status = 'inactive';
      } else if (notes.toLowerCase().includes('ending') || notes.toLowerCase().includes('ended')) {
        status = 'completed';
      } else if (weightEntries.length <= 1) {
        status = 'yet-to-start';
      }
      
      // Parse diet end date - ensure null instead of empty string
      let dietEndDate: string | null = null;
      if (dietEnd && dietEnd.trim() !== '') {
        if (dietEnd.includes('July')) {
          const dayMatch = dietEnd.match(/(\d+)/);
          if (dayMatch) {
            dietEndDate = `2025-07-${dayMatch[1].padStart(2, '0')}`;
          }
        } else if (dietEnd.includes('June')) {
          const dayMatch = dietEnd.match(/(\d+)/);
          if (dayMatch) {
            dietEndDate = `2025-06-${dayMatch[1].padStart(2, '0')}`;
          }
        } else if (!isNaN(parseInt(dietEnd))) {
          dietEndDate = `2025-06-${dietEnd.padStart(2, '0')}`;
        }
      }
      
      const client: Client = {
        id: `imported-${Date.now()}-${i}`,
        name: clientName,
        email: `${clientName.toLowerCase().replace(/\s+/g, '.')}@imported.com`,
        startDate: startDate || '2025-06-01',
        startWeight,
        currentWeight,
        goalWeight: startWeight > 0 ? Math.max(startWeight - 10, startWeight * 0.9) : 0, // Estimate goal weight
        status,
        notes: notes || '',
        healthIssues,
        dietEndDate, // This will now be null instead of empty string
        routine: 'Imported from CSV - routine to be updated',
        healthSummary: 'Imported client - health summary to be updated',
        weightEntries,
        comments: lastFollowUp ? [{
          id: `comment-${Date.now()}-${i}`,
          text: `Last follow-up: ${lastFollowUp}`,
          timestamp: new Date().toISOString(),
          author: 'System Import'
        }] : []
      };
      
      clients.push(client);
    }
    
    return clients;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvData(text);
    };
    reader.readAsText(file);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvData(event.target.value);
  };

  const processCSV = () => {
    if (!csvData.trim()) {
      toast.error('Please provide CSV data');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const parsedClients = parseCSVData(csvData);
      setPreviewData(parsedClients);
      setShowPreview(true);
      toast.success(`Successfully parsed ${parsedClients.length} clients`);
    } catch (error) {
      toast.error('Error parsing CSV data. Please check the format.');
      console.error('CSV parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = () => {
    onImport(previewData);
    toast.success(`Successfully imported ${previewData.length} clients for June 2025`);
    onClose();
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
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Import Client Data - June 2025</h2>
                <p className="text-gray-600">Upload your CSV file or paste the data below</p>
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

        <div className="p-6">
          {!showPreview ? (
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Click to upload CSV file
                  </label>
                  <p className="text-gray-500 text-sm mt-2">or paste your CSV data below</p>
                </div>
              </div>

              {/* Text Area for CSV Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV Data
                </label>
                <textarea
                  value={csvData}
                  onChange={handleTextareaChange}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Paste your CSV data here..."
                />
              </div>

              {/* Process Button */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processCSV}
                  disabled={isProcessing || !csvData.trim()}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <span>{isProcessing ? 'Processing...' : 'Process CSV'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Header */}
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Preview: {previewData.length} clients ready to import</span>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Weight</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Weight</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight Entries</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health Issues</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((client, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{client.startWeight} lbs</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{client.currentWeight} lbs</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{client.weightEntries.length} entries</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              client.status === 'active' ? 'bg-green-100 text-green-800' :
                              client.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                              client.status === 'yet-to-start' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {client.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  onClick={confirmImport}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Import {previewData.length} Clients</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CSVImport;