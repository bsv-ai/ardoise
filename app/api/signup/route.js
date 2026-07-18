import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  const body = await request.json();
  const { nom, telephone, email, password } = body || {};

  if (!nom || !telephone || !email || !password) {
    return NextResponse.json({ error: 'Merci de remplir tous les champs.' }, { status: 400 });
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    const message =
      error.message && error.message.toLowerCase().includes('already')
        ? 'Un compte existe déjà avec ce numéro.'
        : 'Impossible de créer le compte. Réessaie.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ id: data.user.id, nom: String(nom).trim(), telephone: String(telephone).trim() });

  if (profileError) {
    return NextResponse.json(
      { error: "Compte créé, mais le profil n'a pas pu être enregistré." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
