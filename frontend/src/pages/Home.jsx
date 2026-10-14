import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  ShieldCheck,
  Cpu,
  BarChart3,
  CloudSun,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sprout,
  BookOpen,
  Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';

export const Home = () => {
  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:py-24 bg-gradient-to-b from-brand-50/70 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>AI-Powered Precision Agriculture Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Protect Your Harvest with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-500">Intelligent Plant Diagnostics</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empowering farmers, researchers, and agriculture students to identify leaf pathologies instantly. Get neural-network disease classifications, environmental risk assessments, and university-vetted treatment protocols.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/detect">
                  <Button size="lg" icon={Scan} className="w-full sm:w-auto text-base">
                    Scan Leaf Image Now
                  </Button>
                </Link>
                <Link to="/library">
                  <Button variant="outline" size="lg" icon={BookOpen} className="w-full sm:w-auto text-base">
                    Browse Disease Library
                  </Button>
                </Link>
              </div>

              {/* Supported crops and metrics */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-slate-900">10+</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Tomato Pathologies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-700">MobileNetV2</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Neural Architecture</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">100% Vetted</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Extension Guidance</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-4">
                
                {/* Visual Demo Card */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center border border-slate-200">
                  <svg className="w-full h-full object-cover" viewBox="0 0 300 240" fill="none">
                    <rect width="100%" height="100%" fill="#1a3318"/>
                    <path d="M150,20 C230,60 250,150 150,220 C50,150 70,60 150,20 Z" fill="#3b7a2d" stroke="#173e12" strokeWidth="3"/>
                    <line x1="150" y1="25" x2="150" y2="215" stroke="#173e12" strokeWidth="2.5"/>
                    {/* Concentric rings */}
                    <circle cx="115" cy="95" r="18" fill="#543314" stroke="#2b1a08" strokeWidth="2"/>
                    <circle cx="115" cy="95" r="10" fill="#7d4b1a"/>
                    <circle cx="180" cy="140" r="14" fill="#543314"/>
                  </svg>
                  
                  {/* Bounding box animation */}
                  <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none animate-pulse" />
                  <div className="absolute top-4 left-4 bg-emerald-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    Target Spot Detected
                  </div>
                  <div className="absolute bottom-4 right-4 bg-slate-950/80 text-white text-[11px] font-mono px-2.5 py-1 rounded-full backdrop-blur-xs">
                    Confidence: 94.8%
                  </div>
                </div>

                {/* Live Diagnostics Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Tomato Early Blight</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Reliable Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Identified concentric rings characteristic of Alternaria solani. Prompt pruning of lower affected leaves is recommended.
                  </p>
                </div>

                <Link to="/detect" className="block">
                  <Button variant="primary" className="w-full text-xs font-semibold py-2.5">
                    Try With Your Own Leaf Photo
                  </Button>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Workflow Overview
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            How PlantCare AI Diagnoses Leaf Health
          </h2>
          <p className="text-sm text-slate-600">
            A three-step streamlined process engineered for field practitioners and academic research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Capture or Upload</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Take a clear closeup photo of the symptomatic leaf against a neutral background. The system validates file format, image integrity, and resolution.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Neural Network Inference</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              MobileNetV2 processes the image through deep transfer learning, comparing visual patterns against tens of thousands of PlantVillage leaf specimens.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Prescriptive Action & PDF</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Receive verified agronomic guidance, cultural management advice, uncertainty notifications, and export a printable PDF diagnostic report.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Integrated Agronomic Diagnostic Suite
            </h2>
            <p className="text-sm text-slate-600">
              Complete full-stack toolchain built for academic rigor and real-world farm utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">MobileNetV2 AI Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lightweight, high-accuracy convolutional neural network architecture optimized for rapid leaf disease classification without heavy cloud infrastructure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Uncertainty & Out-of-Distribution Warning</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rejects ambiguous imagery and warns users when model confidence falls below configured decision thresholds instead of hallucinating false positive diagnoses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Weather-Aware Risk Correlation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monitors temperature, humidity, and rainfall conditions to calculate pathogen development risk factors for vulnerable crops.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Database History & Analytics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every scan persists in SQLite with SQLAlchemy ORM. Track disease incidence over time, compare health ratios, and manage historical records.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Downloadable PDF Reports</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate professional, formatted field diagnostics reports via ReportLab ready for print, farmer records, or extension consultation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Authentication & Privacy</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Robust user authentication using bcrypt hashing and JWT tokens, ensuring farmers only access, filter, and delete their own private scan records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations & Academic Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <h3 className="text-lg font-bold text-amber-900">
              System Capabilities & Explicit Academic Limitations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-800 leading-relaxed">
            <p>
              • <strong>Supported Crop Scope:</strong> Currently trained on tomato foliar pathologies from the PlantVillage dataset (10 classes). Non-leaf parts (roots, stems) and unlisted crops cannot be diagnosed reliably.
            </p>
            <p>
              • <strong>Decision Support, Not Diagnostic Finality:</strong> Visual symptoms of different plant stresses (nutrient deficiencies, water stress, fungal blights) can overlap. The tool is designed to assist, not replace certified extension pathologists.
            </p>
            <p>
              • <strong>Safe Management First:</strong> PlantCare AI prioritizes cultural sanitation, resistant varieties, and biological controls over synthetic chemical prescriptions.
            </p>
            <p>
              • <strong>Image Quality Dependency:</strong> Accurate inference requires close-up, in-focus photos with adequate natural lighting.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl shadow-brand-900/10">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-xs">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto">
            Ready to Analyze Your Crop Health?
          </h2>
          <p className="text-brand-100 text-sm max-w-lg mx-auto">
            Upload a leaf image or test with our pre-loaded samples right in your browser.
          </p>
          <div>
            <Link to="/detect">
              <Button size="lg" className="bg-white text-brand-800 hover:bg-slate-100 font-bold shadow-lg">
                Start Disease Detection
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
