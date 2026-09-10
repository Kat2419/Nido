-- Mensaje personal de bienvenida que se muestra como su propia sección en la
-- invitación pública (/invitacion/[code]), antes de la fecha.
-- Ejecutar en el SQL Editor de Supabase.

alter table events
  add column if not exists welcome_message text,
  add column if not exists welcome_message_highlight text;
