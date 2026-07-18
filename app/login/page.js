'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { phoneToEmail } from '@/lib/phone';
import { colors } from '@/lib/theme';

export default function LoginPage() {
  const router = useRouter();
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) router.replace('/carnet');
      else setChecking(false);
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(telephone),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError('Numéro ou mot de passe incorrect.');
      return;
    }
    router.replace('/carnet');
  }

  if (checking) {
    return (
      <div style={{ backgroundColor: colors.paper, minHeight: '100vh' }} className="flex items-center justify-center">
        <p style={{ color: colors.inkSoft }}>Chargement…</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.paper, minHeight: '100vh', color: colors.ink }} className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl mb-1 text-center">Ardoise</h1>
        <p className="text-sm text-center mb-8" style={{ color: colors.inkSoft }}>
          Le carnet de crédit de votre boutique
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-5"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.rule}` }}
        >
          <label className="block text-xs mb-1.5" style={{ color: colors.inkSoft }}>
            Téléphone
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="07 00 00 00 00"
            required
            className="focus-ring w-full px-3 py-2.5 rounded-xl text-sm mb-3.5"
            style={{ backgroundColor: colors.paper, border: `1px solid ${colors.rule}`, color: colors.ink }}
          />
          <label className="block text-xs mb-1.5" style={{ color: colors.inkSoft }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="focus-ring w-full px-3 py-2.5 rounded-xl text-sm"
            style={{ backgroundColor: colors.paper, border: `1px solid ${colors.rule}`, color: colors.ink }}
          />
          {error && (
            <p className="text-xs mt-3" style={{ color: colors.red }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full py-2.5 rounded-xl text-sm font-medium mt-5"
            style={{ backgroundColor: colors.ink, color: colors.card, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: colors.inkSoft }}>
          Pas encore de compte ?{' '}
          <a href="/signup" className="focus-ring underline" style={{ color: colors.ink }}>
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}
