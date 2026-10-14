import React from 'react';

export const Loader = ({ message = 'Analyzing leaf imagery...', size = 'md' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        <span className="absolute text-xl select-none">🌱</span>
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
