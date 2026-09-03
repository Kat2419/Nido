-- Agrupa las categorias de eventos en secciones fijas.
-- Ejecutar en el SQL Editor de Supabase.

alter table event_categories add column if not exists group_name text not null default 'Otros';

alter table event_categories drop constraint if exists event_categories_group_name_check;
alter table event_categories add constraint event_categories_group_name_check
  check (group_name in (
    'Logística y decoración',
    'Comida y bebidas',
    'Vestuario y accesorios',
    'Invitados',
    'Documentos y legal',
    'Otros'
  ));

-- Reclasifica las categorias existentes segun su nombre.
update event_categories set group_name = case name
  when 'Mesas' then 'Logística y decoración'
  when 'Manteles' then 'Logística y decoración'
  when 'Sillas' then 'Logística y decoración'
  when 'Copas' then 'Logística y decoración'
  when 'Decoracion de casa' then 'Logística y decoración'
  when 'Comida' then 'Comida y bebidas'
  when 'Snacks' then 'Comida y bebidas'
  when 'Pastel' then 'Comida y bebidas'
  when 'bebidas/vino' then 'Comida y bebidas'
  when 'Traje' then 'Vestuario y accesorios'
  when 'Anillos' then 'Vestuario y accesorios'
  when 'Cofre' then 'Vestuario y accesorios'
  when 'Invitados' then 'Invitados'
  when 'Invitacion' then 'Invitados'
  when 'Registro civil' then 'Documentos y legal'
  when 'Notaria' then 'Documentos y legal'
  else 'Otros'
end
where group_name = 'Otros';
