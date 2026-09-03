-- Permite marcar una categoria para que el costo de sus items se multiplique
-- por el numero de invitados (ej. Sillas, Copas, Comida por persona).
-- Ejecutar en el SQL Editor de Supabase.

alter table event_categories add column if not exists per_guest boolean not null default false;
