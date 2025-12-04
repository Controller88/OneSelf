-- Tabela de usuários unificados (o perfil central)
create table unified_users (
  id bigint generated always as identity primary key,
  email text not null unique,
  name text,
  image text,
  unified_id text not null unique, -- ID único para uso interno, ex: UUID
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de provedores de autenticação vinculados
create table user_providers (
  id bigint generated always as identity primary key,
  user_id bigint not null references unified_users(id) on delete cascade,
  provider text not null, -- Ex: 'google', 'microsoft', 'apple'
  provider_account_id text not null,
  provider_data jsonb, -- Dados brutos do provedor
  created_at timestamptz default now(),
  unique(user_id, provider)
);

-- Tabela de dados sincronizados (contatos, calendário, etc)
create table user_data_sync (
  id bigint generated always as identity primary key,
  user_id bigint not null references unified_users(id) on delete cascade,
  data_type text not null, -- Ex: 'contacts', 'calendar', 'notes'
  provider text not null,
  provider_data jsonb,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, data_type, provider)
);

-- Tabela de preferências e configurações do usuário
create table user_preferences (
  id bigint generated always as identity primary key,
  user_id bigint not null unique references unified_users(id) on delete cascade,
  sync_enabled boolean default true,
  auto_merge_duplicates boolean default true,
  privacy_level text default 'private',
  notification_preferences jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de histórico de sincronização
create table sync_history (
  id bigint generated always as identity primary key,
  user_id bigint not null references unified_users(id) on delete cascade,
  provider text not null,
  data_type text not null,
  status text, -- 'success', 'error', 'pending'
  error_message text,
  synced_items_count integer,
  created_at timestamptz default now()
);

-- Índices para melhor performance
create index idx_user_providers_user_id on user_providers(user_id);
create index idx_user_data_sync_user_id on user_data_sync(user_id);