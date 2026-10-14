import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

// Embedded test leaf SVG data URLs so testing works out of the box
const SAMPLE_LEAVES = [
  {
    name: 'Tomato Early Blight (Sample)',
    classId: 'Tomato___Early_blight',
    type: 'diseased',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#2d5a27"/>
      <path d="M150,30 C230,80 260,180 150,270 C40,180 70,80 150,30 Z" fill="#4a7c36" stroke="#1f4415" stroke-width="4"/>
      <line x1="150" y1="35" x2="150" y2="265" stroke="#1f4415" stroke-width="3"/>
      <!-- Concentric target rings (Early Blight) -->
      <circle cx="115" cy="110" r="22" fill="#5c3818" stroke="#361f0a" stroke-width="3"/>
      <circle cx="115" cy="110" r="14" fill="#8c5828" stroke="#361f0a" stroke-width="2"/>
      <circle cx="115" cy="110" r="6" fill="#361f0a"/>
      <circle cx="185" cy="170" r="18" fill="#5c3818" stroke="#361f0a" stroke-width="3"/>
      <circle cx="185" cy="170" r="10" fill="#8c5828" stroke="#361f0a" stroke-width="2"/>
      <circle cx="120" cy="200" r="12" fill="#5c3818" stroke="#361f0a" stroke-width="2"/>
    </svg>`
  },
  {
    name: 'Healthy Tomato Leaf (Sample)',
    classId: 'Tomato___healthy',
    type: 'healthy',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#234e1c"/>
      <path d="M150,30 C230,80 260,180 150,270 C40,180 70,80 150,30 Z" fill="#3e8e2b" stroke="#1a4710" stroke-width="4"/>
      <line x1="150" y1="35" x2="150" y2="265" stroke="#1a4710" stroke-width="3"/>
      <line x1="150" y1="80" x2="100" y2="65" stroke="#1a4710" stroke-width="2"/>
      <line x1="150" y1="80" x2="200" y2="65" stroke="#1a4710" stroke-width="2"/>
      <line x1="150" y1="130" x2="90" y2="115" stroke="#1a4710" stroke-width="2"/>
      <line x1="150" y1="130" x2="210" y2="115" stroke="#1a4710" stroke-width="2"/>
      <line x1="150" y1="180" x2="100" y2="165" stroke="#1a4710" stroke-width="2"/>
      <line x1="150" y1="180" x2="200" y2="165" stroke="#1a4710" stroke-width="2"/>
    </svg>`
  },
  {
    name: 'Tomato Late Blight (Sample)',
    classId: 'Tomato___Late_blight',
    type: 'diseased',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#1d381c"/>
      <path d="M150,30 C230,80 260,180 150,270 C40,180 70,80 150,30 Z" fill="#325b29" stroke="#122b10" stroke-width="4"/>
      <!-- Large dark water-soaked greasy lesions -->
      <path d="M120,60 Q170,50 190,90 Q170,140 110,110 Z" fill="#2b1e15" stroke="#140d09" stroke-width="2"/>
      <path d="M130,160 Q190,150 200,210 Q150,240 120,200 Z" fill="#2b1e15" stroke="#140d09" stroke-width="2"/>
      <!-- White mold margins -->
      <circle cx="160" cy="135" r="4" fill="#e0e8dd" opacity="0.8"/>
      <circle cx="170" cy="145" r="3" fill="#e0e8dd" opacity="0.8"/>
    </svg>`
  }
];

export const ImageUploader = ({ onImageSelect, selectedImage, isAnalyzing, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const validateAndProcessFile = (file) => {
    setError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a supported image format (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image size exceeds ${MAX_SIZE_MB}MB limit. Please upload a smaller file.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onImageSelect(file, reader.result);
    };
    reader.onerror = () => {
      setError('Failed to read the selected file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    // Convert SVG to Blob/File for realistic testing
    const blob = new Blob([sample.svg], { type: 'image/svg+xml' });
    const file = new File([blob], `${sample.classId}.png`, { type: 'image/png' });
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(sample.svg)}`;
    onImageSelect(file, dataUrl, sample.classId);
    setError(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone or Preview */}
      {!selectedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-brand-400 bg-white hover:bg-slate-50/70 shadow-sm'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Upload Plant Leaf Image
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Drag and drop your leaf photo here, or <span className="text-brand-600 font-semibold underline">browse files</span>
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span>JPEG, PNG, WebP</span>
            <span>•</span>
            <span>Up to 10 MB</span>
            <span>•</span>
            <span>Direct leaf closeup recommended</span>
          </div>
        </div>
      ) : (
        <div className="relative bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            {/* Image Thumbnail */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-inner">
              <img
                src={selectedImage.previewUrl}
                alt="Selected plant leaf"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
            </div>

            {/* File Info & Action */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Image Ready for Analysis</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base break-all">
                {selectedImage.file?.name || 'Leaf Image'}
              </h4>
              <p className="text-xs text-slate-500">
                Size: {selectedImage.file?.size ? (selectedImage.file.size / 1024).toFixed(1) + ' KB' : 'Test Sample'} • Format: {selectedImage.file?.type || 'Image'}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                >
                  Replace Photo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  disabled={isAnalyzing}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  icon={X}
                >
                  Remove
                </Button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-sm text-rose-700">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Upload Validation Notice</p>
            <p className="text-xs mt-0.5 text-rose-600">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Test Leaf Samples */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Test Samples (No photo needed)
          </span>
          <span className="text-[11px] text-slate-400">Click to test instantly</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_LEAVES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              disabled={isAnalyzing}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 text-left transition-all text-xs font-medium text-slate-700 shadow-2xs hover:shadow-xs group"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(sample.svg)}`}
                  alt={sample.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="truncate group-hover:text-brand-700">{sample.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
