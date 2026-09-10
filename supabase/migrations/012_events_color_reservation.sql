-- Nota aparte de "reserva de color" que se muestra en un recuadro propio
-- dentro de la caja de código de vestimenta en la invitación pública.
-- Ejecutar en el SQL Editor de Supabase.

alter table events
  add column if not exists color_reservation_note text;
