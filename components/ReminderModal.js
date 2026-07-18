'use client';
import { ModalShell, Field, TextArea, PrimaryButton, SecondaryButton } from './ui';

export default function ReminderModal({ text, setText, onCancel, onSend }) {
  return (
    <ModalShell title="Rappel WhatsApp" onCancel={onCancel}>
      <Field label="Message (modifiable)">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} rows={5} />
      </Field>
      <div className="flex gap-2.5 mt-5">
        <SecondaryButton onClick={onCancel}>Annuler</SecondaryButton>
        <PrimaryButton onClick={onSend}>Envoyer sur WhatsApp</PrimaryButton>
      </div>
    </ModalShell>
  );
}
