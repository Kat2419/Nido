-- Nombres individuales de las personas adicionales que cubre una invitación
-- (ej. si "número de invitados" es 4, aquí van los otros 3 nombres, además
-- del nombre principal que ya existe en event_items.name).
-- Ejecutar en el SQL Editor de Supabase.

alter table event_items
  add column if not exists additional_guest_names text[] not null default '{}';
