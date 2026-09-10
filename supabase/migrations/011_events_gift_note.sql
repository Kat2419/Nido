-- Nota opcional sobre regalos / lluvia de sobres, mostrada junto al código de
-- vestimenta en la sección "Detalles" de la invitación pública.
-- Ejecutar en el SQL Editor de Supabase.

alter table events
  add column if not exists gift_note text;
