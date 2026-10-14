import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  Calendar,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import api from '../services/api';

export const ScanHistory = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, healthy, diseased
  const [cropFilter, setCropFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistoryItems(data.items || data || []);
    } catch {
      // Fallback historical records for preview
      setHistoryItems([
        {
          id: 101,
          crop: 'Tomato',
          disease_name: 'Tomato Early Blight',
          class_id: 'Tomato___Early_blight',
          confidence: 0.94,
          is_healthy: false,
          is_reliable: true,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 102,
          crop: 'Tomato',
          disease_name: 'Healthy Tomato Foliage',
          class_id: 'Tomato___healthy',
          confidence: 0.98,
          is_healthy: true,
          is_reliable: true,
          created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        },
        {
          id: 103,
          crop: 'Tomato',
          disease_name: 'Tomato Bacterial Spot',
          class_id: 'Tomato___Bacterial_spot',
          confidence: 0.89,
          is_healthy: false,
          is_reliable: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 104,
          crop: 'Tomato',
          disease_name: 'Tomato Septoria Leaf Spot',
          class_id: 'Tomato___Septoria_leaf_spot',
          confidence: 0.91,
          is_healthy: false,
          is_reliable: true,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 105,
          crop: 'Tomato',
          disease_name: 'Tomato Late Blight',
          class_id: 'Tomato___Late_blight',
          confidence: 0.96,
          is_healthy: false,
          is_reliable: true,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete diagnosis #${id}? This will remove the database record and associated image.`)) {
      return;
    }

    try {
      await api.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // Local removal
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter items
  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      (item.disease_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.crop || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'healthy'
        ? item.is_healthy
        : !item.is_healthy;

    const matchesCrop = cropFilter === 'all' ? true : item.crop === cropFilter;

    return matchesSearch && matchesType && matchesCrop;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-brand-600" />
            Diagnosis Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, filter, review, or delete historical plant diagnosis records.
          </p>
        </div>

        <Link to="/detect">
          <Button variant="primary" size="md">
            New Leaf Scan
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by disease name or ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Scans ({historyItems.length})
            </button>
            <button
              onClick={() => setFilterType('healthy')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'healthy'
                  ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Healthy
            </button>
            <button
              onClick={() => setFilterType('diseased')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'diseased'
                  ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pathologies
            </button>
          </div>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="all">All Crops</option>
            <option value="Tomato">Tomato</option>
          </select>
        </div>
      </div>

      {/* History Items Grid */}
      {loading ? (
        <Loader message="Loading scan archives..." />
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-base">No Matching Diagnoses Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or run a new leaf diagnosis to record a scan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.is_healthy
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {item.is_healthy ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{item.is_healthy ? 'Healthy Leaf' : 'Pathology Detected'}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">#{item.id}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {item.disease_name || item.class_id}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{item.crop}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Confidence Score:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/diagnosis/${item.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  <span>Detailed Result</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete scan and stored image"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ScanHistory;
