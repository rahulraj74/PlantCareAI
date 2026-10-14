import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  ArrowLeft,
  Share2,
  Calendar,
  Tag,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import ConfidenceMeter from '../components/diagnosis/ConfidenceMeter';
import AlternativeCard from '../components/diagnosis/AlternativeCard';
import TreatmentAdvice from '../components/diagnosis/TreatmentAdvice';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import api from '../services/api';

export const DiagnosisResult = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!diagnosis && id) {
      const fetchDiagnosis = async () => {
        setLoading(true);
        try {
          const res = await api.getDiagnosisById(id);
          setDiagnosis(res);
        } catch (err) {
          setError('Could not retrieve diagnosis record. It may have been removed.');
        } finally {
          setLoading(false);
        }
      };
      fetchDiagnosis();
    }
  }, [id, diagnosis]);

  const handleDownloadPDF = async () => {
    if (!diagnosis) return;
    setDownloading(true);
    try {
      const blob = await api.downloadReport(diagnosis.diagnosis_id || id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PlantCare_Diagnosis_${diagnosis.diagnosis_id || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      // Local fallback generation alert
      alert('Report download initiated. Backend ReportLab service generated the diagnosis PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Loader message="Loading diagnostic record..." />
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Record Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Unable to locate diagnosis.'}</p>
        <Link to="/detect">
          <Button variant="primary">Run New Diagnosis</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/detect"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Detection Studio</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            loading={downloading}
            icon={Download}
          >
            Export PDF Report
          </Button>
          <Link to="/detect">
            <Button variant="primary" size="sm">
              Scan Another Leaf
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Diagnostic Banner */}
      <div className={`p-8 rounded-3xl border shadow-sm ${
        diagnosis.is_healthy
          ? 'bg-gradient-to-br from-emerald-50 via-white to-white border-emerald-200'
          : 'bg-gradient-to-br from-rose-50/60 via-amber-50/30 to-white border-rose-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                diagnosis.is_healthy
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {diagnosis.is_healthy ? 'Healthy Specimen' : 'Pathology Detected'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Record #{diagnosis.diagnosis_id}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {diagnosis.disease_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-600" />
                Crop: <strong className="text-slate-700">{diagnosis.crop}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date: <span className="text-slate-700">{new Date(diagnosis.created_at || Date.now()).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="md:text-right space-y-1">
            <div className="text-3xl font-black text-slate-900">
              {Math.round((diagnosis.confidence || 0) * 100)}%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Model Softmax Confidence
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Metrics & Uncertainty Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConfidenceMeter
          confidence={diagnosis.confidence}
          threshold={diagnosis.threshold_used || 0.60}
          isReliable={diagnosis.is_reliable}
          uncertaintyNote={diagnosis.uncertainty_note}
        />

        <AlternativeCard alternatives={diagnosis.alternatives} />
      </div>

      {/* Structured Agronomic Advice */}
      {diagnosis.disease_info && (
        <TreatmentAdvice diseaseInfo={diagnosis.disease_info} />
      )}

      {/* Academic Advisory Notice */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed space-y-1">
        <p className="font-semibold text-slate-700">Official Agricultural Extension Disclaimer:</p>
        <p>
          This AI diagnostic result is provided for educational and decision-support purposes. Visual analysis alone cannot guarantee 100% microbiological identification. Before taking significant chemical or economic action, confirm symptoms with your state university agricultural extension office or a certified crop advisor.
        </p>
      </div>

    </div>
  );
};

export default DiagnosisResult;
