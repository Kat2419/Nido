-- Fecha límite para confirmar asistencia, mostrada como aviso en la sección
-- de RSVP de la invitación pública.
-- Ejecutar en el SQL Editor de Supabase.

alter table events
  add column if not exists rsvp_deadline date;
