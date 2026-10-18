import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local development demo admin session key
const DEMO_ADMIN_KEY = 'demo_admin_authenticated';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  // Helper to verify if the user ID exists in the admin_users allowlist
  const checkAdminPrivileges = async (userId: string): Promise<boolean> => {
    if (!isConfigured) {
      // In offline/demo mode, check localStorage
      return localStorage.getItem(DEMO_ADMIN_KEY) === 'true';
    }

    try {
      // 1. Try calling the is_admin RPC function
      const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin');
      if (!rpcError && typeof rpcData === 'boolean') {
        return rpcData;
      }

      // 2. Fallback: Direct query to admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Admin check warning:', error.message);
        return false;
      }

      return Boolean(data);
    } catch (err) {
      console.error('Failed to verify admin status:', err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    if (!isConfigured) {
      // Demo / offline mode initialization
      const demoAuth = localStorage.getItem(DEMO_ADMIN_KEY) === 'true';
      if (demoAuth) {
        const dummyUser = {
          id: 'demo-admin-id',
          email: 'admin@urvieragola.design',
          app_metadata: {},
          user_metadata: { name: 'Urvi G Eragola' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;
        setUser(dummyUser);
        setIsAdmin(true);
      }
      setLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        const hasAdminRole = await checkAdminPrivileges(initialSession.user.id);
        if (mounted) setIsAdmin(hasAdminRole);
      } else {
        setIsAdmin(false);
      }
      if (mounted) setLoading(false);
    });

    // 2. Listen for auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const hasAdminRole = await checkAdminPrivileges(currentSession.user.id);
        if (mounted) setIsAdmin(hasAdminRole);
      } else {
        if (mounted) setIsAdmin(false);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      // Demo authentication mode for development before user sets credentials
      if (email && password) {
        localStorage.setItem(DEMO_ADMIN_KEY, 'true');
        const dummyUser = {
          id: 'demo-admin-id',
          email,
          app_metadata: {},
          user_metadata: { name: 'Urvi G Eragola' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;
        setUser(dummyUser);
        setIsAdmin(true);
        return { error: null };
      }
      return { error: new Error('Please provide email and password') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const hasAdminRole = await checkAdminPrivileges(data.user.id);
        setIsAdmin(hasAdminRole);
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      localStorage.removeItem(DEMO_ADMIN_KEY);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const refreshAdminStatus = async (): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    const hasAdminRole = await checkAdminPrivileges(user.id);
    setIsAdmin(hasAdminRole);
    return hasAdminRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        isConfigured,
        signIn,
        signOut,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
