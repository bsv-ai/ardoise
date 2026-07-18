'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MessageCircle, X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatFCFA, formatDateShort, whatsappLink } from '@/lib/phone';
import { colors } from '@/lib/theme';
import { useAuth } from '../layout';
import NewDebtModal from '@/components/NewDebtModal';
import ReminderModal from '@/components/ReminderModal';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const session = useAuth();
  const [client, setClient] = useState(null);
  const [dettes, setDettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [reminderText, setReminderText] = useState('');
  const [stampedId, setStampedId] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .single();
    const { data: dettesData, error: dettesError } = await supabase
      .from('dettes')
      .select('*')
      .eq('client_id', params.id)
      .order('date', { ascending: false });
    if (clientError || dettesError) {
      setError('Impossible de charger ce client.');
    } else {
      setClient(clientData);
      setDettes(dettesData || []);
      setError('');
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session && params.id) load();
  }, [session, params.id]);

  const totalDu = useMemo(() => dettes.filter((d) => !d.paye).reduce((s, d) => s + Number(d.montant), 0), [dettes]);

  async function addDebt(montant, description, date) {
    const { data, error: insertError } = await supabase
      .from('dettes')
      .insert({
        client_id: params.id,
        commercant_id: session.user.id,
        montant: Number(montant),
        description: description.trim(),
        date,
        paye: false,
      })
      .select()
      .single();
    if (!insertError && data) {
      setDettes([data, ...dettes]);
      setModal(null);
    } else {
      setError("Impossible d'ajouter cette dette.");
    }
  }

  async function markPaid(detteId) {
    const { error: updateError } = await supabase
      .from('dettes')
      .update({ paye: true, date_paiement: new Date().toISOString() })
      .eq('id', detteId);
    if (!updateError) {
      setDettes(dettes.map((d) => (d.id === detteId ? { ...d, paye: true } : d)));
      setStampedId(detteId);
      setTimeout(() => setStampedId(null), 900);
    }
  }

  async function deleteDebt(detteId) {
    const { error: deleteError } = await supabase.from('dettes').delete().eq('id', detteId);
    if (!deleteError) setDettes(dettes.filter((d) => d.id !== detteId));
  }

  async function deleteClient() {
    if (!window.confirm(`Supprimer ${client.nom} et tout son historique ?`)) return;
    const { error: deleteError } = await supabase.from('clients').delete().eq('id', params.id);
    if (!deleteError) router.replace('/carnet');
  }

  function openReminder() {
    setReminderText(
      `Bonjour ${client.nom}, ceci est un petit rappel concernant votre solde de ${formatFCFA(
        totalDu
      )} chez nous. Merci de bien vouloir régulariser quand vous pourrez. Bonne journée !`
    );
    setModal('reminder');
  }

  function sendReminder() {
    window.open(whatsappLink(client.telephone, reminderText), '_blank');
    setModal(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p style={{ color: colors.inkSoft }}>Chargement…</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="px-5 pt-6">
        <button
          onClick={() => router.push('/carnet')}
          className="focus-ring flex items-center gap-1.5 text-sm mb-4"
          style={{ color: colors.inkSoft }}
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <p className="text-sm" style={{ color: colors.red }}>
          {error || 'Client introuvable.'}
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-28">
      <button
        onClick={() => router.push('/carnet')}
        className="focus-ring flex items-center gap-1.5 text-sm mb-4 -ml-1 px-1 py-1"
        style={{ color: colors.inkSoft }}
      >
        <ArrowLeft size={16} /> Retour
      </button>

      <h2 className="font-display text-2xl">{client.nom}</h2>
      <p className="text-sm mt-0.5" style={{ color: colors.inkSoft }}>
        {client.telephone}
      </p>

      <div className="rounded-2xl p-4 mt-4 mb-3" style={{ backgroundColor: colors.card, border: `1px solid ${colors.rule}` }}>
        <p className="text-xs uppercase tracking-wide" style={{ color: colors.inkSoft }}>
          Solde dû
        </p>
        <p className="font-fig text-3xl mt-1" style={{ color: totalDu > 0 ? colors.red : colors.brass }}>
          {formatFCFA(totalDu)}
        </p>
      </div>

      {totalDu > 0 && (
        <button
          onClick={openReminder}
          className="focus-ring w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium mb-5"
          style={{ backgroundColor: colors.brass, color: colors.card }}
        >
          <MessageCircle size={17} /> Envoyer un rappel WhatsApp
        </button>
      )}

      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: colors.inkSoft }}>
        Historique
      </p>

      {dettes.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: colors.inkSoft }}>
          {"Aucune dette enregistrée pour l'instant."}
        </p>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.card, border: `1px solid ${colors.rule}` }}>
          {dettes.map((d, i) => (
            <div key={d.id} className="px-4 py-3" style={{ borderBottom: i < dettes.length - 1 ? `1px solid ${colors.rule}` : 'none' }}>
              <div className="flex items-center justify-between">
                <p className="text-sm truncate pr-2">{d.description || 'Achat'}</p>
                <p
                  className="font-fig text-sm shrink-0"
                  style={{ color: d.paye ? colors.inkSoft : colors.red, textDecoration: d.paye ? 'line-through' : 'none' }}
                >
                  {formatFCFA(d.montant)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs" style={{ color: colors.inkSoft }}>
                  {formatDateShort(d.date)}
                </p>
                <div className="flex items-center gap-2.5">
                  {d.paye ? (
                    <span
                      className={stampedId === d.id ? 'stamp-pop' : ''}
                      style={{
                        display: 'inline-block',
                        border: `1.5px solid ${colors.brass}`,
                        color: colors.brass,
                        borderRadius: 9999,
                        padding: '2px 8px',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        transform: 'rotate(-9deg)',
                      }}
                    >
                      PAYÉ
                    </span>
                  ) : (
                    <button
                      onClick={() => markPaid(d.id)}
                      className="focus-ring text-xs px-2.5 py-1.5 rounded-lg"
                      style={{ backgroundColor: colors.paper, color: colors.ink, border: `1px solid ${colors.rule}` }}
                    >
                      Marquer payé
                    </button>
                  )}
                  <button
                    onClick={() => deleteDebt(d.id)}
                    className="focus-ring"
                    style={{ color: colors.inkSoft }}
                    aria-label="Supprimer cette dette"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={deleteClient} className="focus-ring text-xs mt-6 mx-auto block" style={{ color: colors.inkSoft }}>
        Supprimer ce client
      </button>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-40">
        <div className="w-full max-w-md flex justify-end px-6 pb-6">
          <button
            onClick={() => setModal('newDebt')}
            className="focus-ring pointer-events-auto rounded-full shadow-lg flex items-center justify-center"
            style={{ backgroundColor: colors.ink, color: colors.card, width: 56, height: 56 }}
            aria-label="Nouvelle dette"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {modal === 'newDebt' && <NewDebtModal onCancel={() => setModal(null)} onSave={addDebt} />}
      {modal === 'reminder' && (
        <ReminderModal text={reminderText} setText={setReminderText} onCancel={() => setModal(null)} onSend={sendReminder} />
      )}
    </div>
  );
}
