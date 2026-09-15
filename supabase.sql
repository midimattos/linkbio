create table events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  tipo text,
  link text,
  dispositivo text,
  so text,
  navegador text,
  marca text,
  idioma text,
  referrer text,
  ip text,
  cidade text,
  regiao text,
  pais text
);

-- Segurança: liga o RLS (Row Level Security) e não cria nenhuma política.
-- Isso bloqueia qualquer acesso via chave pública (anon key).
-- Só a Service Role Key (usada pelo servidor, nunca pelo navegador) consegue ler/escrever.
alter table events enable row level security;
