import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Database,
  CloudOff,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, signOut, isConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-stone-900 text-cream-50 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Title */}
            <div className="flex items-center space-x-6">
              <Link to="/admin" className="flex items-baseline space-x-2">
                <span className="font-serif text-xl sm:text-2xl tracking-wide font-light text-cream-100">
                  URVI G ERAGOLA
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                  Admin
                </span>
              </Link>

              {/* Status Badge */}
              <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded bg-stone-800/80 border border-stone-700/60">
                {isConfigured ? (
                  <>
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Supabase Connected</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300">Demo Mode</span>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6" aria-label="Admin Navigation">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors ${
                    isActive ? 'text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/projects/new"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors ${
                    isActive ? 'text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                  }`
                }
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Project</span>
              </NavLink>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs uppercase tracking-wider text-stone-400 hover:text-stone-200 transition-colors"
                title="Open public portfolio in a new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Site</span>
              </a>

              {/* User Email & Sign Out */}
              <div className="pl-4 border-l border-stone-800 flex items-center space-x-4">
                <span className="text-xs text-stone-400 font-mono truncate max-w-[180px] flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span>{user?.email}</span>
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-700 text-xs uppercase tracking-wider text-stone-300 hover:text-white hover:border-stone-500 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-950 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
            <div className="py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono">{user?.email}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800">
                {isConfigured ? 'Supabase Connected' : 'Demo Mode'}
              </span>
            </div>

            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/admin"
                end
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-xs uppercase tracking-wider text-stone-300 hover:text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Projects Overview</span>
              </NavLink>

              <NavLink
                to="/admin/projects/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-xs uppercase tracking-wider text-stone-300 hover:text-white"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Project</span>
              </NavLink>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 text-xs uppercase tracking-wider text-stone-300 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Public Portfolio</span>
              </a>

              <div className="pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-800 text-xs uppercase tracking-wider text-stone-200 hover:bg-stone-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content View */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>

      {/* Minimal Admin Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500 font-mono">
        Urvi G Eragola Portfolio • Admin Management Console • Row Level Security Enforced
      </footer>
    </div>
  );
};
