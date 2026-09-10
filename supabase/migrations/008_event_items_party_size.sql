-- Cuántas personas cubre una invitación de invitado (ej. "Familia Pérez" = 4).
-- Se usa en la tarjeta pública de invitación (/invitacion/[code]).
-- Ejecutar en el SQL Editor de Supabase.

alter table event_items
  add column if not exists party_size integer not null default 1 check (party_size >= 1);
