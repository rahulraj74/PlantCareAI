import React from 'react';
import { User, Mail, Shield, Calendar, Sprout, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../services/auth';
import Button from '../components/common/Button';

export const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Account credentials, role authentication, and agricultural data ownership.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-black text-2xl border border-brand-200">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{user?.full_name || user?.username || 'Agronomy User'}</h2>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {user?.email || 'user@plantcare.ai'}
            </p>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Diagnostic Account</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-slate-400 font-semibold uppercase">Username</span>
            <p className="text-slate-800 font-bold text-sm mt-0.5">{user?.username || 'demo_user'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-slate-400 font-semibold uppercase">Account Role</span>
            <p className="text-slate-800 font-bold text-sm mt-0.5">{user?.role || 'Field Practitioner / Student'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-slate-400 font-semibold uppercase">Security Method</span>
            <p className="text-slate-800 font-bold text-sm mt-0.5">JWT Bearer + Bcrypt Salted</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <span className="text-slate-400 font-semibold uppercase">Data Sovereignty</span>
            <p className="text-slate-800 font-bold text-sm mt-0.5">Isolated Private Database Records</p>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            icon={LogOut}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            Sign Out
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Profile;
