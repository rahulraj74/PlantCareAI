import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-500/10',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/60 ring-amber-500/10',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-500/10',
    info: 'bg-sky-50 text-sky-700 border-sky-200/60 ring-sky-500/10',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10',
    brand: 'bg-brand-50 text-brand-800 border-brand-200 ring-brand-500/10',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
