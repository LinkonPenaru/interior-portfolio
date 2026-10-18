import React from 'react';
import { ShieldAlert, LogOut, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const UnauthorizedNotice: React.FC = () => {
  const { user, signOut, refreshAdminStatus } = useAuth();
  const [checking, setChecking] = React.useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    await refreshAdminStatus();
    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-stone-300 p-8 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold block">
            Access Restricted • RLS Protected
          </span>
          <h1 className="font-serif text-2xl text-stone-900 font-normal">
            Administrator Authorization Required
          </h1>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            You are signed in as <strong className="font-mono text-stone-800">{user?.email}</strong>, but this account has not been added to the Supabase <code className="bg-stone-100 px-1 py-0.5 font-mono text-[11px]">admin_users</code> table.
          </p>
        </div>

        {/* Database allowlist instructions */}
        <div className="p-4 bg-sand-50 border border-stone-200 text-left text-xs text-stone-700 space-y-2">
          <p className="font-semibold text-stone-900 text-[11px] uppercase tracking-wider font-mono">
            How to grant admin access in Supabase:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-stone-600 font-light text-[11px]">
            <li>Open the Supabase Dashboard SQL Editor.</li>
            <li>Run this SQL command:</li>
          </ol>
          <pre className="p-2 bg-stone-900 text-cream-100 text-[10px] font-mono overflow-x-auto rounded">
{`INSERT INTO public.admin_users (id, email)
VALUES ('${user?.id || 'USER_UUID'}', '${user?.email || 'admin@email.com'}');`}
          </pre>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={checking}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Check Privileges Again</span>
          </button>
          
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
