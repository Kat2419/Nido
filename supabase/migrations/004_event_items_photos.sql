-- Fotos para items de Comida, Snacks, Traje y Anillos.
-- Ejecutar en el SQL Editor de Supabase.

alter table event_items add column if not exists photo_path text;

insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', false)
on conflict (id) do nothing;

create policy "event_photos: ver las de mi pareja" on storage.objects
  for select using (
    bucket_id = 'event-photos'
    and (storage.foldername(name))[1] = my_couple_id()::text
  );

create policy "event_photos: subir para mi pareja" on storage.objects
  for insert with check (
    bucket_id = 'event-photos'
    and (storage.foldername(name))[1] = my_couple_id()::text
  );

create policy "event_photos: borrar las de mi pareja" on storage.objects
  for delete using (
    bucket_id = 'event-photos'
    and (storage.foldername(name))[1] = my_couple_id()::text
  );
