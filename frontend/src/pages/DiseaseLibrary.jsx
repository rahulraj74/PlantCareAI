import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Wrench,
  HelpCircle,
  X
} from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import api from '../services/api';

// Fallback direct knowledge items matching data/disease_knowledge.json
const DEFAULT_DISEASES = [
  {
    id: "Tomato___Bacterial_spot",
    display_name: "Tomato Bacterial Spot",
    scientific_name: "Xanthomonas perforans / Xanthomonas vesicatoria",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Small, dark brown to black circular lesions on leaves (often water-soaked initially).",
      "Yellow halos frequently develop around leaf spots as they expand.",
      "Severe infection leads to widespread blighting, yellowing, and defoliation."
    ],
    causes: [
      "Bacterium Xanthomonas species.",
      "Spread by wind-driven rain, splashing irrigation, contaminated seed, and handling wet plants.",
      "Favored by warm temperatures (24°C–30°C) and persistent leaf wetness."
    ],
    prevention: [
      "Use certified pathogen-free seeds and transplants.",
      "Employ drip irrigation rather than overhead sprinklers.",
      "Practice crop rotation of at least 2–3 years with non-solanaceous crops."
    ],
    management: [
      "Promptly rogue and destroy severely infected individual plants.",
      "Avoid working in or harvesting fields when tomato foliage is wet.",
      "Consult extension agents for approved copper bactericides."
    ],
    sources: ["University of Florida IFAS Extension", "Penn State Extension"]
  },
  {
    id: "Tomato___Early_blight",
    display_name: "Tomato Early Blight",
    scientific_name: "Alternaria solani",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Distinct concentric circular rings ('target board' appearance) on older lower foliage.",
      "Yellow chlorotic tissue surrounding expanding brown lesions.",
      "Premature defoliation starting from the base of the canopy upwards."
    ],
    causes: [
      "Fungal pathogen Alternaria solani.",
      "Overwinters in infected crop debris and solanaceous weeds.",
      "Accelerated by warm temperatures (24°C–29°C) with heavy dew or rain."
    ],
    prevention: [
      "Maintain wide plant spacing and staking for canopy aeration.",
      "Prune bottom suckers and lower foliage up to 12 inches off soil.",
      "Rotate fields away from solanaceous crops for 3 seasons."
    ],
    management: [
      "Strip and dispose of infected lower leaves at first sight; do not compost.",
      "Water strictly at soil level using drip systems early in the morning.",
      "Apply preventative copper or Bacillus subtilis bio-fungicides."
    ],
    sources: ["Cornell University Vegetable MD Online", "UW Madison Extension"]
  },
  {
    id: "Tomato___Late_blight",
    display_name: "Tomato Late Blight",
    scientific_name: "Phytophthora infestans",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Large, irregular pale water-soaked lesions rapidly turning dark brown to purplish-black.",
      "White, velvety fungal-like downy growth visible on leaf undersides in high humidity.",
      "Dark greasy-brown lesions on stems leading to rapid canopy collapse."
    ],
    causes: [
      "Oomycete pathogen Phytophthora infestans.",
      "Highly infectious airborne sporangia travel miles on wind currents.",
      "Favored by cool, humid, wet weather (15°C–21°C) and persistent rain."
    ],
    prevention: [
      "Plant resistant cultivars (Mountain Magic, Defiant, Legend).",
      "Destroy volunteer tomato and potato cull piles.",
      "Monitor university late-blight forecast tracking networks."
    ],
    management: [
      "Community-level threat: immediately destroy infected vines in sealed bags.",
      "Do not leave infected vines in the field or uncovered compost."
    ],
    sources: ["USAblight Consortium", "Cornell University CALS"]
  },
  {
    id: "Tomato___Leaf_Mold",
    display_name: "Tomato Leaf Mold",
    scientific_name: "Passalora fulva (syn. Cladosporium fulvum)",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Pale greenish-yellow chlorotic spots with indistinct margins on upper leaf surfaces.",
      "Olive-green to velvety brown mold growth directly underneath spots on leaf undersurface.",
      "Infected leaves curl, wither, turn brown, and drop prematurely."
    ],
    causes: [
      "Fungus Passalora fulva.",
      "Common in high tunnels and poorly ventilated greenhouses with >85% relative humidity."
    ],
    prevention: [
      "Maximize greenhouse ventilation with exhaust fans and circulating airflow.",
      "Select leaf mold-resistant varieties featuring Cf-resistance genes.",
      "Increase plant spacing to decrease humidity."
    ],
    management: [
      "Lower greenhouse humidity below 80% through night heating and morning venting.",
      "Prune lower older leaves to enhance canopy aeration."
    ],
    sources: ["UMass Amherst Extension", "Purdue University Extension"]
  },
  {
    id: "Tomato___Septoria_leaf_spot",
    display_name: "Tomato Septoria Leaf Spot",
    scientific_name: "Septoria lycopersici",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Numerous small circular lesions with dark brown borders and pale tan/gray centers.",
      "Tiny black fruiting bodies (pycnidia) visible in lesion centers with a hand lens.",
      "Severe leaf yellowing and shedding starting with the lowest foliage."
    ],
    causes: [
      "Fungus Septoria lycopersici.",
      "Overwinters in solanaceous residue; spread by splashing rain and tools."
    ],
    prevention: [
      "Mulch heavily under plants immediately after transplanting to stop soil spores splashing.",
      "Practice a minimum 2-year rotation with non-host crops."
    ],
    management: [
      "Remove lower leaves showing early symptoms.",
      "Avoid handling tomato plants when moisture is on the leaves."
    ],
    sources: ["Missouri Botanical Garden", "Rutgers NJAES"]
  },
  {
    id: "Tomato___Spider_mites Two-spotted_spider_mite",
    display_name: "Two-Spotted Spider Mite Damage",
    scientific_name: "Tetranychus urticae",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Fine yellow or white stippling (pinpoint flecking) on upper leaf surfaces.",
      "Silken webbing on leaf undersides, growing tips, and between stems.",
      "Leaves turn bronze, dry out, become brittle, and drop."
    ],
    causes: [
      "Arachnid pest: Tetranychus urticae.",
      "Accelerates in hot, dry, dusty conditions (temperatures exceeding 29°C)."
    ],
    prevention: [
      "Keep garden paths watered or vegetated to suppress dust.",
      "Encourage native beneficial insects (ladybugs, predatory mites Phytoseiulus persimilis)."
    ],
    management: [
      "Wash foliage with a strong stream of water to dislodge mites and destroy webbing.",
      "Apply insecticidal soaps or horticultural oils ensuring full coverage of leaf undersides."
    ],
    sources: ["UC IPM Pest Management", "Colorado State Extension"]
  },
  {
    id: "Tomato___Target_Spot",
    display_name: "Tomato Target Spot",
    scientific_name: "Corynespora cassiicola",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Pinpoint brown spots expanding into circular lesions with light brown centers.",
      "Zonate concentric rings inside lesions resembling early blight.",
      "Upper canopy leaves develop extensive chlorosis and drop."
    ],
    causes: [
      "Fungal pathogen Corynespora cassiicola.",
      "Favored by warm temperatures (21°C–29°C) and prolonged humidity or dew."
    ],
    prevention: [
      "Promote canopy aeration with trellising and sucker pruning.",
      "Avoid overhead irrigation, especially in late afternoon."
    ],
    management: [
      "Prune and safely destroy infected lower leaves.",
      "Maintain balanced potassium and nitrogen nutrition."
    ],
    sources: ["University of Florida IFAS Extension", "NC State Extension"]
  },
  {
    id: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    display_name: "Tomato Yellow Leaf Curl Virus (TYLCV)",
    scientific_name: "Begomovirus (family Geminiviridae)",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Marked upward curling and cupping of leaflets ('spooning').",
      "Severe marginal and interveinal yellowing (chlorosis) of younger leaves.",
      "Severe plant stunting and erect bushy appearance."
    ],
    causes: [
      "Tomato yellow leaf curl virus transmitted by sweetpotato whiteflies (Bemisia tabaci).",
      "Prevalent in warm tropical and temperate zones."
    ],
    prevention: [
      "Plant certified TYLCV-resistant hybrids (Tycoon, Camaro).",
      "Install fine 50-mesh insect netting to exclude whitefly vectors.",
      "Use yellow sticky cards to monitor whitefly presence."
    ],
    management: [
      "Rogue and bag infected symptomatic plants immediately to prevent vector spread.",
      "Control alternate weed hosts surrounding the field."
    ],
    sources: ["UC IPM Guidelines", "University of Hawaii Extension"]
  },
  {
    id: "Tomato___Tomato_mosaic_virus",
    display_name: "Tomato Mosaic Virus (ToMV)",
    scientific_name: "Tobamovirus (Tomato mosaic virus)",
    crop: "Tomato",
    is_healthy: false,
    symptoms: [
      "Mottled light and dark green mosaic patterns on leaves.",
      "Distorted, curled, or fern-like ('shoestring') leaf shapes.",
      "Stunted vegetative growth and reduced plant vigor."
    ],
    causes: [
      "Tomato mosaic virus.",
      "Extremely persistent; easily transmitted mechanically by touch, shears, and workers."
    ],
    prevention: [
      "Plant certified virus-free seeds and resistant varieties.",
      "Wash hands thoroughly with soap or milk solution before handling plants.",
      "Strictly prohibit smoking or handling tobacco before working with tomatoes."
    ],
    management: [
      "No chemical cure exists; immediately remove and destroy infected plants.",
      "Do not compost infected foliage."
    ],
    sources: ["University of Minnesota Extension", "Penn State Extension"]
  },
  {
    id: "Tomato___healthy",
    display_name: "Healthy Tomato Foliage",
    scientific_name: "Solanum lycopersicum",
    crop: "Tomato",
    is_healthy: true,
    symptoms: [
      "Foliage is vibrant, uniform green with normal leaf texture.",
      "No chlorotic spots, wilting, mosaic mottling, necrotic lesions, or webbing detected.",
      "Stems are sturdy and erect with consistent vegetative growth."
    ],
    causes: [
      "Optimal cultural care, balanced soil nutrition, and absence of significant pathogen pressure."
    ],
    prevention: [
      "Continue consistent watering at soil level (approx. 1–2 inches per week).",
      "Maintain proper soil pH (6.2–6.8) and supply balanced N-P-K with micronutrients.",
      "Keep mulch layer intact to regulate soil temperature and moisture."
    ],
    management: [
      "Support growing vines with stakes, cages, or trellis systems.",
      "Prune indeterminate varieties for adequate light penetration."
    ],
    sources: ["UC ANR", "Penn State Commercial Tomato Guide"]
  }
];

export const DiseaseLibrary = () => {
  const [diseases, setDiseases] = useState(DEFAULT_DISEASES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const res = await api.getDiseases('Tomato');
        if (res && res.length > 0) {
          setDiseases(res);
        }
      } catch {
        // Fallback already pre-loaded
      }
    };
    fetchDiseases();
  }, []);

  const filtered = diseases.filter((d) => {
    const matchesSearch =
      d.display_name.toLowerCase().includes(search.toLowerCase()) ||
      d.scientific_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.symptoms.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'healthy'
        ? d.is_healthy
        : !d.is_healthy;

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vetted Agronomy Reference Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Plant Pathology & Disease Knowledge Base
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Comprehensive, research-backed reference profiles for all 10 supported tomato leaf conditions. Sourced strictly from university cooperative extension services.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symptoms, pathogens, or diseases..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Conditions ({diseases.length})
          </button>
          <button
            onClick={() => setFilterType('diseased')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'diseased'
                ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pathologies (9)
          </button>
          <button
            onClick={() => setFilterType('healthy')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'healthy'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Healthy (1)
          </button>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedDisease(item)}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  item.is_healthy
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {item.is_healthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  <span>{item.is_healthy ? 'Normal Tissue' : 'Pathology'}</span>
                </span>
                <span className="text-xs font-semibold text-slate-500">{item.crop}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                  {item.display_name}
                </h3>
                {item.scientific_name && (
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    {item.scientific_name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Primary Symptoms:
                </span>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.symptoms[0]}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-700 group-hover:text-brand-800">
              <span>View Full Factsheet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${
                  selectedDisease.is_healthy
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {selectedDisease.is_healthy ? 'Healthy' : 'Pathology'}
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedDisease.display_name}
                </h2>
                {selectedDisease.scientific_name && (
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    Pathogen: {selectedDisease.scientific_name}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedDisease(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sections */}
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Visual Symptoms
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc marker:text-amber-500">
                  {selectedDisease.symptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  Biological Etiology & Favorable Conditions
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc marker:text-sky-500">
                  {selectedDisease.causes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Cultural Prevention Practices
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc marker:text-emerald-500">
                  {selectedDisease.prevention.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-brand-600" />
                  Management & Remediation
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc marker:text-brand-600">
                  {selectedDisease.management.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {selectedDisease.sources && (
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-600">Extension Sources:</span>
                  <span>{selectedDisease.sources.join(' • ')}</span>
                </div>
              )}

            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedDisease(null)}>
                Close Factsheet
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DiseaseLibrary;
