'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, ChevronRight, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatFCFA } from '@/lib/phone';
import { colors } from '@/lib/theme';
import { useAuth } from './layout';
import NewClientModal from '@/components/NewClientModal';
import SettingsModal from '@/components/SettingsModal';

export default function CarnetPage() {
  const router = useRouter();
  const session = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  async function loadClients() {
    const { data, error: loadError } = await supabase
      .from('clients')
      .select('*, dettes(*)')
      .order('created_at', { ascending: false });
    if (loadError) {
      setError('Impossible de charger tes clients.');
    } else {
      setClients(data || []);
      setError('');
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session) loadClients();
  }, [session]);

  async function addClient(nom, telephone) {
    const { data, error: insertError } = await supabase
      .from('clients')
      .insert({ nom: nom.trim(), telephone: telephone.trim(), commercant_id: session.user.id })
      .select()
      .single();
    if (!insertError && data) {
      setClients([{ ...data, dettes: [] }, ...clients]);
      setModal(null);
      router.push(`/carnet/${data.id}`);
    } else {
      setError("Impossible d'ajouter ce client.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  const withTotals = useMemo(
    () =>
      clients.map((c) => ({
        ...c,
        totalDu: (c.dettes || []).filter((d) => !d.paye).reduce((s, d) => s + Number(d.montant), 0),
      })),
    [clients]
  );

  const totalGeneral = useMemo(() => withTotals.reduce((s, c) => s + c.totalDu, 0), [withTotals]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return withTotals;
    return withTotals.filter((c) => c.nom.toLowerCase().includes(q));
  }, [withTotals, search]);

  return (
    <div className="px-5 pb-28">
      <div className="pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl">Carnet de Crédit</h1>
          <p className="text-xs mt-1" style={{ color: colors.inkSoft }}>
            {clients.length === 0 ? 'Vos comptes clients, toujours à jour' : `${clients.length} client${clients.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setModal('settings')} className="focus-ring p-2 rounded-full" style={{ color: colors.inkSoft }} aria-label="Réglages">
          <Settings size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: colors.redTint, color: colors.red }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <p style={{ color: colors.inkSoft }}>Chargement…</p>
        </div>
      ) : (
        <>
          {clients.length > 0 && (
            <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: colors.card, border: `1px solid ${colors.rule}` }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: colors.inkSoft }}>
                Total à recevoir
              </p>
              <p className="font-fig text-3xl mt-1" style={{ color: totalGeneral > 0 ? colors.red : colors.brass }}>
                {formatFCFA(totalGeneral)}
              </p>
            </div>
          )}

          {clients.length > 0 && (
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.inkSoft }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un client"
                className="focus-ring w-full pl-9 pr-3 py-2.5 rounded-xl text-sm"
                style={{ backgroundColor: colors.card, border: `1px solid ${colors.rule}`, color: colors.ink }}
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="font-display text-lg mb-2">{clients.length === 0 ? 'Ton carnet est vide' : 'Aucun résultat'}</p>
              {clients.length === 0 && (
                <>
                  <p className="text-sm mb-5" style={{ color: colors.inkSoft }}>
                    Ajoute ton premier client pour commencer à suivre ses achats à crédit.
                  </p>
                  <button
                    onClick={() => setModal('newClient')}
                    className="focus-ring px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: colors.ink, color: colors.card }}
                  >
                    Ajouter un client
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.card, border: `1px solid ${colors.rule}` }}>
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => router.push(`/carnet/${c.id}`)}
                  className="focus-ring w-full flex items-center justify-between px-4 py-3.5 text-left"
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${colors.rule}` : 'none' }}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-display text-base truncate">{c.nom}</p>
                    <p className="text-xs mt-0.5" style={{ color: colors.inkSoft }}>
                      {c.telephone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="font-fig text-sm" style={{ color: c.totalDu > 0 ? colors.red : colors.brass }}>
                      {c.totalDu > 0 ? formatFCFA(c.totalDu) : 'Soldé'}
                    </p>
                    <ChevronRight size={16} style={{ color: colors.inkSoft }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-40">
          <div className="w-full max-w-md flex justify-end px-6 pb-6">
            <button
              onClick={() => setModal('newClient')}
              className="focus-ring pointer-events-auto rounded-full shadow-lg flex items-center justify-center"
              style={{ backgroundColor: colors.ink, color: colors.card, width: 56, height: 56 }}
              aria-label="Nouveau client"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      )}

      {modal === 'newClient' && <NewClientModal onCancel={() => setModal(null)} onSave={addClient} />}
      {modal === 'settings' && <SettingsModal onCancel={() => setModal(null)} onLogout={handleLogout} />}
    </div>
  );
}
