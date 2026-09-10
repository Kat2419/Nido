-- Agrega RSVP por invitado y datos de sede/vestimenta para las invitaciones
-- digitales públicas (/invitacion/[code]).
-- Ejecutar en el SQL Editor de Supabase.

alter table event_items
  add column if not exists rsvp_code text unique default encode(gen_random_bytes(6), 'hex'),
  add column if not exists rsvp_status text not null default 'pendiente'
    check (rsvp_status in ('pendiente', 'asiste', 'no_asiste')),
  add column if not exists rsvp_responded_at timestamptz;

alter table events
  add column if not exists venue_name text,
  add column if not exists venue_address text,
  add column if not exists event_time text,
  add column if not exists dress_code text;
