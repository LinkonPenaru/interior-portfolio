import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Authentication failed. Please check your credentials.');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-block group focus:outline-none">
          <span className="font-serif text-3xl tracking-tight text-stone-900 font-semibold block">
            URVI G ERAGOLA
          </span>
          <span className="text-[11px] font-mono uppercase tracking-super-wide text-stone-500 block">
            Spatial Architecture Portfolio
          </span>
        </Link>
        <h2 className="text-sm uppercase tracking-extra-wide text-stone-700 font-medium pt-3">
          Administrator Portal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-stone-200 shadow-sm space-y-6">
          {!isConfigured && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold font-mono uppercase tracking-wider text-amber-800">
                <Info className="w-4 h-4" />
                <span>Supabase Offline / Demo Mode</span>
              </div>
              <p className="font-light leading-relaxed">
                Supabase credentials have not yet been placed in <code className="bg-white/80 px-1 py-0.5 font-mono">.env</code>. You can log in with any sample email and password to explore and test the dashboard locally.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <div className="font-light leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@urvieragola.design"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 text-cream-50 text-xs uppercase tracking-super-wide hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button (only when unconfigured) */}
          {!isConfigured && (
            <button
              type="button"
              onClick={() => {
                setEmail('admin@urvieragola.design');
                setPassword('DemoAdmin2026!');
              }}
              className="w-full py-2 border border-dashed border-stone-300 text-[11px] font-mono text-stone-600 hover:text-stone-950 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-500" />
              <span>Auto-Fill Demo Credentials</span>
            </button>
          )}

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <Link to="/" className="hover:text-stone-900 transition-colors">
              ← Public Portfolio
            </Link>
            <span className="flex items-center gap-1 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RLS Protected</span>
            </span>
          </div>
        </div>

        {/* Security documentation note */}
        <div className="mt-6 text-center text-xs text-stone-500 max-w-sm mx-auto font-light leading-relaxed">
          Access is strictly restricted to accounts enrolled in the Supabase <code className="font-mono text-stone-700">admin_users</code> table. Public sign-up is disabled.
        </div>
      </div>
    </div>
  );
};
