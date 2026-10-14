import React from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle, Info } from 'lucide-react';

export const ConfidenceMeter = ({
  confidence = 0,
  threshold = 0.60,
  isReliable = true,
  uncertaintyNote = null,
}) => {
  const percentage = Math.round(confidence * 100);

  // Status colors based on confidence
  let color = 'brand';
  let badgeText = 'Reliable Classification';
  let badgeIcon = ShieldCheck;
  let barColor = 'bg-brand-500';

  if (!isReliable || confidence < threshold) {
    color = 'rose';
    badgeText = 'Low Confidence / Uncertain';
    badgeIcon = AlertTriangle;
    barColor = 'bg-rose-500';
  } else if (confidence < 0.75) {
    color = 'amber';
    badgeText = 'Moderate Confidence';
    badgeIcon = Info;
    barColor = 'bg-amber-500';
  }

  const BadgeIcon = badgeIcon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Diagnostic Confidence
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">{percentage}%</span>
            <span className="text-xs text-slate-400">
              (Configured Threshold: {Math.round(threshold * 100)}%)
            </span>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            color === 'brand'
              ? 'bg-brand-50 text-brand-700 border border-brand-200/80'
              : color === 'amber'
              ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
              : 'bg-rose-50 text-rose-700 border border-rose-200/80'
          }`}
        >
          <BadgeIcon className="w-4 h-4 shrink-0" />
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Progress Bar with Threshold Marker */}
      <div className="relative pt-1">
        <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-100">
          <div
            style={{ width: `${percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${barColor}`}
          />
        </div>
        {/* Threshold indicator line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
          style={{ left: `${threshold * 100}%` }}
          title={`Decision threshold: ${Math.round(threshold * 100)}%`}
        />
      </div>

      {/* Uncertainty Notice / Advisory */}
      {(!isReliable || confidence < threshold) ? (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Uncertain Diagnostic Classification</p>
            <p className="text-amber-700 leading-relaxed">
              {uncertaintyNote ||
                'The model confidence is below the reliable decision threshold. This can happen if the image is blurry, poorly lit, contains complex background clutter, or features an unsupported plant species. We advise capturing a clearer closeup of a single leaf or consulting your local agricultural extension agent.'}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Classification score reflects model softmax probability, not absolute epidemiological certainty.
        </p>
      )}
    </div>
  );
};

export default ConfidenceMeter;
