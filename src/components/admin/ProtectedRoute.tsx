import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UnauthorizedNotice } from './UnauthorizedNotice';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs uppercase tracking-super-wide text-stone-600">
          Verifying security privileges...
        </span>
      </div>
    );
  }

  // Not signed in at all
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Signed in, but not in admin_users allowlist
  if (!isAdmin) {
    return <UnauthorizedNotice />;
  }

  return children ? <>{children}</> : <Outlet />;
};
