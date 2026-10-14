import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldAlert, BookOpen, ExternalLink, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                PlantCare <span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              An advanced AI-powered crop health diagnostics platform designed for farmers, agronomists, and university students. Detect tomato leaf pathologies rapidly and access vetted management guidance.
            </p>
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3 text-xs text-amber-300/90 leading-relaxed max-w-lg">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Academic & Advisory Notice:</strong> PlantCare AI is an assistive decision-support tool. It does not replace on-site agronomic inspection or laboratory microbiological testing. Always consult local agricultural extension services before applying chemical controls.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/detect" className="hover:text-brand-400 transition-colors">Detect Disease</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Farm Dashboard</Link></li>
              <li><Link to="/library" className="hover:text-brand-400 transition-colors">Disease Knowledge Library</Link></li>
              <li><Link to="/weather" className="hover:text-brand-400 transition-colors">Weather & Risk Alerts</Link></li>
              <li><Link to="/reports" className="hover:text-brand-400 transition-colors">Diagnostic Reports</Link></li>
              <li><Link to="/crop-care" className="hover:text-brand-400 transition-colors">Crop Care Guidelines</Link></li>
            </ul>
          </div>

          {/* Sources & Standards */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Extension Sources
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://extension.psu.edu" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Penn State Extension</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="http://vegetablemdonline.ppath.cornell.edu" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Cornell Vegetable MD Online</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://ipm.ucanr.edu" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>UC Statewide IPM Program</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://edis.ifas.ufl.edu" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>UF/IFAS Extension</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://github.com/spMohanty/PlantVillage-Dataset" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>PlantVillage Dataset (CrowdsAI)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PlantCare AI Project. Built with MobileNetV2, FastAPI, and React.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered for sustainable agriculture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
