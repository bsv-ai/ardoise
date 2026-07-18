'use client';
import { useState } from 'react';
import { ModalShell, Field, TextInput, PrimaryButton, SecondaryButton } from './ui';

export default function NewClientModal({ onCancel, onSave }) {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [saving, setSaving] = useState(false);
  const canSave = nom.trim().length > 0 && telephone.trim().replace(/\D/g, '').length >= 8;

  async function handleSave() {
    setSaving(true);
    await onSave(nom, telephone);
    setSaving(false);
  }

  return (
    <ModalShell title="Nouveau client" onCancel={onCancel}>
      <Field label="Nom du client">
        <TextInput autoFocus value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Mariam Koné" />
      </Field>
      <Field label="Téléphone WhatsApp">
        <TextInput value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="07 00 00 00 00" inputMode="tel" />
      </Field>
      <div className="flex gap-2.5 mt-5">
        <SecondaryButton onClick={onCancel}>Annuler</SecondaryButton>
        <PrimaryButton disabled={!canSave || saving} onClick={handleSave}>
          {saving ? 'Ajout…' : 'Ajouter'}
        </PrimaryButton>
      </div>
    </ModalShell>
  );
}
