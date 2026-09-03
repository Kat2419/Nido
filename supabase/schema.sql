-- Nido: esquema de base de datos + seguridad a nivel de fila (RLS)
-- Ejecutar una sola vez en el SQL Editor de tu proyecto de Supabase.

-- 1. Tablas -------------------------------------------------------------

create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  couple_id uuid references couples (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists market_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples (id) on delete cascade,
  store text not null check (store in ('D1', 'Mercar', 'Otro')),
  store_other text,
  product_name text not null,
  price numeric(12, 2) not null default 0,
  quantity numeric(10, 2) not null default 1,
  purchased_at date not null default current_date,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists important_dates (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples (id) on delete cascade,
  title text not null,
  date date not null,
  is_recurring boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples (id) on delete cascade,
  title text not null,
  event_date date,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists event_categories (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  couple_id uuid not null references couples (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists event_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references event_categories (id) on delete cascade,
  couple_id uuid not null references couples (id) on delete cascade,
  name text not null,
  estimated_cost numeric(12, 2),
  actual_cost numeric(12, 2),
  status text not null default 'pendiente' check (status in ('pendiente', 'confirmado', 'pagado')),
  notes text,
  family text,
  table_number text,
  ingredients text,
  photo_path text,
  created_at timestamptz not null default now()
);

create index if not exists market_items_couple_idx on market_items (couple_id);
create index if not exists important_dates_couple_idx on important_dates (couple_id);
create index if not exists events_couple_idx on events (couple_id);
create index if not exists event_categories_event_idx on event_categories (event_id);
create index if not exists event_items_category_idx on event_items (category_id);

-- 2. Helper: id de la pareja del usuario actual (bypassa RLS para evitar recursion) --

create or replace function my_couple_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select couple_id from profiles where id = auth.uid();
$$;

-- 3. Perfil automático al registrarse ------------------------------------

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 4. Crear pareja / unirse con código -------------------------------------

create or replace function create_couple()
returns table (id uuid, invite_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_code text;
  new_couple_id uuid;
begin
  new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
  insert into couples (invite_code) values (new_code) returning couples.id into new_couple_id;
  update profiles set couple_id = new_couple_id where profiles.id = auth.uid();
  return query select new_couple_id, new_code;
end;
$$;

create or replace function join_couple(code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_couple_id uuid;
begin
  select couples.id into target_couple_id from couples where invite_code = upper(code);
  if target_couple_id is null then
    return false;
  end if;
  update profiles set couple_id = target_couple_id where profiles.id = auth.uid();
  return true;
end;
$$;

grant execute on function create_couple() to authenticated;
grant execute on function join_couple(text) to authenticated;

-- 5. Row Level Security ----------------------------------------------------

alter table couples enable row level security;
alter table profiles enable row level security;
alter table market_items enable row level security;
alter table important_dates enable row level security;
alter table events enable row level security;
alter table event_categories enable row level security;
alter table event_items enable row level security;

create policy "couples: ver la propia" on couples
  for select using (id = my_couple_id());

create policy "profiles: propio o de mi pareja" on profiles
  for select using (id = auth.uid() or couple_id = my_couple_id());

create policy "profiles: editar el propio" on profiles
  for update using (id = auth.uid());

create policy "market_items: acceso de la pareja" on market_items
  for all using (couple_id = my_couple_id()) with check (couple_id = my_couple_id());

create policy "important_dates: acceso de la pareja" on important_dates
  for all using (couple_id = my_couple_id()) with check (couple_id = my_couple_id());

create policy "events: acceso de la pareja" on events
  for all using (couple_id = my_couple_id()) with check (couple_id = my_couple_id());

create policy "event_categories: acceso de la pareja" on event_categories
  for all using (couple_id = my_couple_id()) with check (couple_id = my_couple_id());

create policy "event_items: acceso de la pareja" on event_items
  for all using (couple_id = my_couple_id()) with check (couple_id = my_couple_id());

-- 6. Fotos de items (Storage) ----------------------------------------------

insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', false)
on conflict (id) do nothing;

create policy "event_photos: ver las de mi pareja" on storage.objects
  for select using (
    bucket_id = 'event-photos'
    and (storage.foldername(name))[1] = my_couple_id()::text
  );

create policy "event_photos: subir para mi pareja" on storage.objects
  for insert with check (
    bucket_id = 'event-photos'
    and (storage.foldername(name))[1] = my_couple_id()::text
  );

create policy "event_photos: borrar las de mi pareja" on storage.objects
  for delete using (
    bucket_id = 'event-photos'
    and (storage.foldername(name))[1] = my_couple_id()::text
  );
