-- Ardoise — schéma de base de données
-- À exécuter dans Supabase : SQL Editor > New query > coller > Run

-- Profils commerçants (lié à auth.users, un par compte)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nom text not null,
  telephone text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Voir son propre profil" on profiles
  for select using (auth.uid() = id);
create policy "Modifier son propre profil" on profiles
  for update using (auth.uid() = id);
create policy "Créer son propre profil" on profiles
  for insert with check (auth.uid() = id);

-- Clients de chaque commerçant
create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  commercant_id uuid references auth.users(id) on delete cascade not null,
  nom text not null,
  telephone text not null,
  created_at timestamptz default now()
);

alter table clients enable row level security;

create policy "Gérer ses propres clients" on clients
  for all using (auth.uid() = commercant_id)
  with check (auth.uid() = commercant_id);

-- Dettes rattachées à chaque client
create table if not exists dettes (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references clients(id) on delete cascade not null,
  commercant_id uuid references auth.users(id) on delete cascade not null,
  montant numeric not null check (montant > 0),
  description text,
  date date not null default current_date,
  paye boolean not null default false,
  date_paiement timestamptz,
  created_at timestamptz default now()
);

alter table dettes enable row level security;

create policy "Gérer ses propres dettes" on dettes
  for all using (auth.uid() = commercant_id)
  with check (auth.uid() = commercant_id);

create index if not exists dettes_client_id_idx on dettes(client_id);
create index if not exists clients_commercant_id_idx on clients(commercant_id);
