import React, { useState } from 'react';
import {
  AlertCircle,
  ShieldCheck,
  Wrench,
  BookOpen,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const TreatmentAdvice = ({ diseaseInfo }) => {
  const [activeTab, setActiveTab] = useState('management');

  if (!diseaseInfo) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 text-sm">
        No specific knowledge base profile available for this class.
      </div>
    );
  }

  const tabs = [
    { id: 'management', label: 'Action & Management', icon: Wrench },
    { id: 'symptoms', label: 'Typical Symptoms', icon: AlertCircle },
    { id: 'causes', label: 'Pathogen & Causes', icon: HelpCircle },
    { id: 'prevention', label: 'Prevention Practices', icon: ShieldCheck },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-50 to-emerald-50/40 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60">
              Agronomy Knowledge Base
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              {diseaseInfo.display_name || diseaseInfo.id}
            </h3>
            {diseaseInfo.scientific_name && (
              <p className="text-xs text-slate-500 italic mt-0.5">
                Pathogen: {diseaseInfo.scientific_name}
              </p>
            )}
          </div>
          {diseaseInfo.last_reviewed && (
            <span className="text-[11px] text-slate-400 self-start sm:self-auto">
              Reviewed: {diseaseInfo.last_reviewed}
            </span>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 mt-6 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'management' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-600" />
              Immediate & Long-Term Management Guidance
            </h4>
            <ul className="space-y-3">
              {diseaseInfo.management?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'symptoms' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Identified Field Symptoms
            </h4>
            <ul className="space-y-2.5">
              {diseaseInfo.symptoms?.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <ChevronRight className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'causes' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Disease Etiology & Contributing Conditions
            </h4>
            <ul className="space-y-2.5">
              {diseaseInfo.causes?.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <ChevronRight className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'prevention' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Agronomic Cultural Prevention Practices
            </h4>
            <ul className="space-y-2.5">
              {diseaseInfo.prevention?.map((prev, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Source References Footer */}
        {diseaseInfo.sources && diseaseInfo.sources.length > 0 && (
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-600">Extension References:</span>
              <span className="italic">{diseaseInfo.sources.join(' • ')}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Compliant with Integrated Pest Management (IPM) protocols.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentAdvice;
