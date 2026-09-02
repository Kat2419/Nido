-- Agrega el campo de ingredientes a event_items, usado por la categoria "Comida".
-- Ejecutar en el SQL Editor de Supabase.

alter table event_items add column if not exists ingredients text;
