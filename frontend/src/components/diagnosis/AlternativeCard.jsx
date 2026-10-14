import React from 'react';
import { Layers } from 'lucide-react';

export const AlternativeCard = ({ alternatives = [] }) => {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-slate-500" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Differential Diagnoses (Alternative Candidates)
        </h4>
      </div>

      <div className="space-y-2.5">
        {alternatives.map((alt, idx) => {
          const pct = Math.round(alt.confidence * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">{alt.disease_name || alt.class_id}</span>
                <span className="text-slate-500 font-mono">{pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-slate-400 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400">
        Alternative classifications evaluated by the neural network during inference.
      </p>
    </div>
  );
};

export default AlternativeCard;
