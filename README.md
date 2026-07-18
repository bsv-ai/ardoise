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
Dans le dashboard Supabase, la confirmation d'email doit être désactivée
(Authentication > Providers > Email > "Confirm email" = off), sinon les
comptes restent bloqués en attente d'un email qui n'existe pas réellement.

## Base de données
Le schéma (`supabase/schema.sql`) crée `profiles`, `clients`, `dettes` avec
RLS activée partout : chaque commerçant ne voit que ses propres données.

## Variables d'environnement
Copier `.env.local.example` en `.env.local` et renseigner l'URL et la clé
anonyme du projet Supabase (Project Settings > API).
