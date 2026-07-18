'use client';
import { X } from 'lucide-react';
import { colors } from '@/lib/theme';

export function ModalShell({ title, onCancel, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(38,49,74,0.45)' }} onClick={onCancel} />
      <div
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5 pb-6 max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: colors.paper }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">{title}</h3>
          <button onClick={onCancel} className="focus-ring p-1 rounded-full" style={{ color: colors.inkSoft }} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs mb-1.5" style={{ color: colors.inkSoft }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldStyle = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.rule}`,
  color: colors.ink,
};

export function TextInput(props) {
  const { className, ...rest } = props;
  return <input {...rest} className={`focus-ring w-full px-3 py-2.5 rounded-xl text-sm ${className || ''}`} style={fieldStyle} />;
}

export function TextArea(props) {
  const { className, ...rest } = props;
  return <textarea {...rest} className={`focus-ring w-full px-3 py-2.5 rounded-xl text-sm ${className || ''}`} style={fieldStyle} />;
}

export function PrimaryButton({ children, disabled, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className="focus-ring flex-1 py-2.5 rounded-xl text-sm font-medium"
      style={{ backgroundColor: disabled ? colors.rule : colors.ink, color: colors.card, opacity: disabled ? 0.7 : 1 }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="focus-ring flex-1 py-2.5 rounded-xl text-sm font-medium"
      style={{ backgroundColor: 'transparent', color: colors.inkSoft, border: `1px solid ${colors.rule}` }}
    >
      {children}
    </button>
  );
}
