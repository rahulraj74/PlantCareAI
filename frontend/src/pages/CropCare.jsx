import React from 'react';
import {
  Sprout,
  Droplets,
  Sun,
  ShieldAlert,
  Scissors,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import Card from '../components/common/Card';

export const CropCare = () => {
  const careSections = [
    {
      title: "1. Precision Irrigation Management",
      icon: Droplets,
      color: "sky",
      description: "Moisture on foliage is the primary vector for fungal and bacterial spore germination.",
      points: [
        "Utilize drip lines or soaker hoses directly at the root zone rather than overhead sprinkler systems.",
        "Water early in the morning (5:00 AM - 9:00 AM) so any inadvertent splash dries rapidly in morning sunlight.",
        "Maintain deep, infrequent watering (1.5 - 2 inches per week) to foster extensive taproot development."
      ]
    },
    {
      title: "2. Canopy Aeration & Trellising",
      icon: Scissors,
      color: "brand",
      description: "Dense foliage traps microclimate humidity, accelerating blight and powdery mildew proliferation.",
      points: [
        "Prune bottom suckers and foliage up to 10–12 inches above the soil bed once plants reach 3 feet in height.",
        "Stake, cage, or weave indeterminate vines along sturdy trellises to keep leaves off damp soil.",
        "Maintain generous row spacing (at least 24–36 inches between plants) to permit continuous airflow."
      ]
    },
    {
      title: "3. Soil Sanitation & Heavy Mulching",
      icon: Layers,
      color: "amber",
      description: "Soil splash is the #1 mechanism for transmitting overwintering Early Blight and Septoria spores.",
      points: [
        "Apply a 2-to-3-inch protective layer of clean straw, wood shavings, or UV-stabilized plastic mulch immediately after transplanting.",
        "Practice strict 3-year crop rotation: never follow tomatoes with potatoes, eggplants, or peppers.",
        "Remove and bag fallen debris and yellowing lower leaflets every week; never incorporate diseased tissue into compost."
      ]
    },
    {
      title: "4. Integrated Pest Management (IPM)",
      icon: ShieldAlert,
      color: "rose",
      description: "Biological controls and cultural sanitation suppress vector insects without pesticide resistance.",
      points: [
        "Install yellow sticky traps early in the season to monitor sweetpotato whiteflies (vectors of TYLCV).",
        "Wash leaf undersides with strong water jets to disrupt early two-spotted spider mite webbing.",
        "Release or conserve native beneficial predatory insects such as lacewings and ladybugs."
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          <Sprout className="w-3.5 h-3.5" />
          <span>Agronomic Cultural Guidelines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Tomato Crop Care Protocol
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Evidence-based cultural practices designed to prevent pathogen transmission, optimize photosynthetic vigor, and minimize synthetic fungicide reliance.
        </p>
      </div>

      {/* Grid of Care Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careSections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{sec.description}</p>
                </div>
              </div>

              <ul className="space-y-2.5 pt-2">
                {sec.points.map((p, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Extension IPM Philosophy Callout */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-400" />
          The Core Integrated Pest Management (IPM) Hierarchy
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          1. <strong>Cultural Controls</strong> (resistant varieties, staking, drip irrigation) are the first line of defense.<br/>
          2. <strong>Physical & Mechanical Controls</strong> (hand-picking, sanitizing shears, row covers) stop spread before infestation.<br/>
          3. <strong>Biological Controls</strong> (predatory mites, Bacillus subtilis) provide natural ecological suppression.<br/>
          4. <strong>Chemical Controls</strong> (targeted copper protectants) should be used strictly as a last resort under qualified extension advisement.
        </p>
      </div>

    </div>
  );
};

export default CropCare;
