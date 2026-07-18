'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { phoneToEmail } from '@/lib/phone';
import { colors } from '@/lib/theme';

export default function SignupPage() {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    const email = phoneToEmail(telephone);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setLoading(false);
      setError(
        signUpError.message && signUpError.message.toLowerCase().includes('already')
          ? 'Un compte existe déjà avec ce numéro.'
          : 'Impossible de créer le compte. Réessaie.'
      );
      return;
    }
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, nom: nom.trim(), telephone: telephone.trim() });
      if (profileError) {
        setLoading(false);
        setError("Compte créé, mais le profil n'a pas pu être enregistré.");
        return;
      }
    }
    setLoading(false);
    router.replace('/carnet');
  }

  return (
    <div style={{ backgroundColor: colors.paper, minHeight: '100vh', color: colors.ink }} className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl mb-1 text-center">Ardoise</h1>
        <p className="text-sm text-center mb-8" style={{ color: colors.inkSoft }}>
          Créer votre compte commerçant
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-5"
          style={{ backgroundColor: colors.card, border: `1px solid ${colors.rule}` }}
        >
          <label className="block text-xs mb-1.5" style={{ color: colors.inkSoft }}>
            Nom de la boutique ou votre nom
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="focus-ring w-full px-3 py-2.5 rounded-xl text-sm mb-3.5"
            style={{ backgroundColor: colors.paper, border: `1px solid ${colors.rule}`, color: colors.ink }}
          />
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
            minLength={6}
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
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: colors.inkSoft }}>
          Déjà un compte ?{' '}
          <a href="/login" className="focus-ring underline" style={{ color: colors.ink }}>
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
