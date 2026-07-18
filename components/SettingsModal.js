'use client';
import { ModalShell } from './ui';
import { colors } from '@/lib/theme';

export default function SettingsModal({ onCancel, onLogout }) {
  return (
    <ModalShell title="Réglages" onCancel={onCancel}>
      <button
        onClick={onLogout}
        className="focus-ring w-full py-2.5 rounded-xl text-sm font-medium"
        style={{ backgroundColor: colors.paper, color: colors.ink, border: `1px solid ${colors.rule}` }}
      >
        Se déconnecter
      </button>
    </ModalShell>
  );
}
