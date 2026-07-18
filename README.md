# Ardoise

Carnet de crédit digital pour commerçants — chaque commerçant a son propre
compte (téléphone + mot de passe) et gère ses clients et leurs dettes en
toute confidentialité (isolation par Row Level Security côté Supabase).

## Stack
- Next.js 16 (App Router) + Tailwind v4
- Supabase (Auth + Postgres)
- Déploiement : Vercel

## Auth
L'inscription se fait par téléphone + mot de passe. Supabase Auth attend un
email, donc le téléphone est converti en pseudo-email stable
(`225XXXXXXXXXX@ardoise.app`, voir `lib/phone.js`) — pas de SMS/OTP à payer.

La création de compte passe par une route serveur (`app/api/signup/route.js`)
qui utilise la clé `service_role` pour créer l'utilisateur avec
`email_confirm: true`. Ça évite de dépendre du réglage "Confirm sign up" du
dashboard Supabase (son emplacement a changé plusieurs fois et n'est pas
fiable d'un projet à l'autre). Le client se connecte ensuite normalement
juste après. `lib/supabaseAdmin.js` ne doit jamais être importé depuis un
composant `'use client'`.

## Base de données
Le schéma (`supabase/schema.sql`) crée `profiles`, `clients`, `dettes` avec
RLS activée partout : chaque commerçant ne voit que ses propres données.

## Variables d'environnement
Copier `.env.local.example` en `.env.local` et renseigner :
- `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings > API)
- `SUPABASE_SERVICE_ROLE_KEY` (même page, clé secrète — ne jamais exposer côté client)
