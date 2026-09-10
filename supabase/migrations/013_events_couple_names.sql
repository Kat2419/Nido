-- Nombres de la pareja (ej. "David y Viviana"), mostrados como firma grande
-- en la página de confirmación de la invitación pública. Distinto del nombre
-- del invitado, que es por invitación individual.
-- Ejecutar en el SQL Editor de Supabase.

alter table events
  add column if not exists couple_names text;
