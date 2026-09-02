-- Agrega campos de familia y mesa a event_items, usados por la categoria "Invitados".
-- Ejecutar en el SQL Editor de Supabase (ya tienes el esquema base corriendo).

alter table event_items add column if not exists family text;
alter table event_items add column if not exists table_number text;
