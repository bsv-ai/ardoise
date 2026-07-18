'use client';
import { useState } from 'react';
import { ModalShell, Field, TextInput, PrimaryButton, SecondaryButton } from './ui';
import { todayISO } from '@/lib/phone';

export default function NewDebtModal({ onCancel, onSave }) {
  const [montant, setMontant] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);
  const canSave = Number(montant) > 0;

  async function handleSave() {
    setSaving(true);
    await onSave(montant, description, date);
    setSaving(false);
  }

  return (
    <ModalShell title="Nouvelle dette" onCancel={onCancel}>
      <Field label="Montant (FCFA)">
        <TextInput
          autoFocus
          value={montant}
          onChange={(e) => setMontant(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="15000"
          inputMode="numeric"
        />
      </Field>
      <Field label="Description">
        <TextInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex : 2 sacs de riz" />
      </Field>
      <Field label="Date">
        <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <div className="flex gap-2.5 mt-5">
        <SecondaryButton onClick={onCancel}>Annuler</SecondaryButton>
        <PrimaryButton disabled={!canSave || saving} onClick={handleSave}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </PrimaryButton>
      </div>
    </ModalShell>
  );
}
