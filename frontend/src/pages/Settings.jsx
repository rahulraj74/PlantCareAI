import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Database,
  CloudSun,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Button from '../components/common/Button';

export const Settings = () => {
  const [threshold, setThreshold] = useState(0.60);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('plantcare_threshold', threshold.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-brand-600" />
          Application & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Tune inference thresholds, view database status, and review external service integrations.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Machine Learning Model Settings */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Inference Calibration & Reliability</h3>
              <p className="text-xs text-slate-500">Set the default confidence threshold for classifying ambiguous plant leaves.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Decision Cutoff Threshold</span>
                <span className="font-mono text-brand-700">{Math.round(threshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.40"
                max="0.85"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Any leaf prediction scoring below {Math.round(threshold * 100)}% triggers an uncertainty warning.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Preferences
              </Button>
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved successfully
                </span>
              )}
            </div>
          </form>
        </div>

        {/* System Services Status */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-600" />
            Backend Services & Storage Diagnostics
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Database Engine:</strong>
                <p className="text-slate-500">SQLite with SQLAlchemy 2.0 ORM & Alembic migrations</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                Active / Ready
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">AI Model Weights:</strong>
                <p className="text-slate-500">MobileNetV2 (10 Tomato classes, 224x224 RGB input)</p>
              </div>
              <span className="px-2.5 py-1 bg-brand-100 text-brand-800 font-bold rounded-full">
                Configured
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Weather API Integration:</strong>
                <p className="text-slate-500">OpenWeatherMap (Configured via backend .env OPENWEATHER_API_KEY)</p>
              </div>
              <span className="px-2.5 py-1 bg-slate-200 text-slate-700 font-medium rounded-full">
                Cached / Graceful Fallback
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">PDF Generation Engine:</strong>
                <p className="text-slate-500">ReportLab Document Template Generator</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                Available
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
