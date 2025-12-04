-- Tabela de usuários unificados
CREATE TABLE unified_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  unified_id TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de provedores vinculados a cada usuário
CREATE TABLE user_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES unified_users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  provider_email TEXT,
  provider_name TEXT,
  provider_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Tabela de dados sincronizados (contatos, calendário, etc)
CREATE TABLE user_data_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES unified_users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_data JSONB,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type, provider)
);

-- Tabela de preferências do usuário
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES unified_users(id) ON DELETE CASCADE,
  sync_enabled BOOLEAN DEFAULT TRUE,
  auto_merge_duplicates BOOLEAN DEFAULT TRUE,
  privacy_level TEXT DEFAULT 'private',
  notification_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_user_providers_user_id ON user_providers(user_id);
CREATE INDEX idx_user_data_sync_user_id ON user_data_sync(user_id);
CREATE INDEX idx_unified_users_email ON unified_users(email);
