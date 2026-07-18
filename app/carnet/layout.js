'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function CarnetLayout({ children }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        router.replace('/login');
      } else {
        setSession(data.session);
        setChecking(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!newSession) {
        router.replace('/login');
      } else {
        setSession(newSession);
      }
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div style={{ backgroundColor: colors.paper, minHeight: '100vh' }} className="flex items-center justify-center">
        <p style={{ color: colors.inkSoft }}>Chargement…</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={session}>
      <div style={{ backgroundColor: colors.paper, minHeight: '100vh', color: colors.ink }} className="w-full flex justify-center">
        <div className="w-full max-w-md relative" style={{ backgroundColor: colors.paper }}>
          {children}
        </div>
      </div>
    </AuthContext.Provider>
  );
}
