create table krathongs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) <= 20),
  message     text not null check (char_length(message) <= 40),
  color       text not null,
  x           float not null check (x between 0 and 1),
  y           float not null check (y between 0 and 1),
  created_at  timestamptz default now()
);

create or replace function cleanup_old_krathongs()
returns trigger as $$
begin
  delete from krathongs
  where id not in (
    select id from krathongs order by created_at desc limit 50
  );
  return new;
end;
$$ language plpgsql;

create trigger trg_cleanup
after insert on krathongs
for each row execute function cleanup_old_krathongs();

alter publication supabase_realtime add table krathongs;
