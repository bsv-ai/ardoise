export function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('225')) return digits;
  if (digits.startsWith('0')) return '225' + digits.slice(1);
  return '225' + digits;
}

// Supabase Auth needs an email; commerçants only ever see their phone number.
// We derive a stable, unique pseudo-email from the phone so there's no SMS
// provider to configure (and no cost) for something that's really a username.
export function phoneToEmail(phone) {
  return `${normalizePhone(phone)}@ardoise.app`;
}

export function formatFCFA(n) {
  const num = Number(n) || 0;
  return new Intl.NumberFormat('fr-FR').format(num) + ' FCFA';
}

export function whatsappLink(phone, text) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

export function formatDateShort(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  } catch (e) {
    return '';
  }
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
