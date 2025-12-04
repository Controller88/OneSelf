import { createClient } from '@supabase/supabase-js';

// Cria um cliente Supabase com a chave de service role (para operações do servidor)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Gera um ID unificado único para o usuário
 * @returns {string} ID unificado no formato unify_TIMESTAMP_RANDOM
 */
export function generateUnifiedId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `unify_${timestamp}_${random}`;
}

/**
 * Obtém ou cria um usuário unificado baseado no email
 * @param {string} email - Email do usuário
 * @param {object} profile - Dados do perfil do usuário (name, image, etc)
 * @returns {object} Usuário unificado criado ou existente
 */
export async function getOrCreateUnifiedUser(email, profile = {}) {
  if (!supabase) {
    console.error('Supabase client não está disponível');
    return null;
  }

  try {
    // Verificar se o usuário já existe
    const { data: existingUser, error: selectError } = await supabase
      .from('unified_users')
      .select('*')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 significa "nenhuma linha encontrada", o que é esperado
      console.error('Erro ao buscar usuário:', selectError);
      return null;
    }

    if (existingUser) {
      // Usuário já existe, retornar
      return existingUser;
    }

    // Criar novo usuário unificado
    const unifiedId = generateUnifiedId();
    const { data: newUser, error: insertError } = await supabase
      .from('unified_users')
      .insert([
        {
          email,
          unified_id: unifiedId,
          name: profile.name || email.split('@')[0],
          avatar_url: profile.image,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar usuário unificado:', insertError);
      return null;
    }

    // Criar preferências padrão para o novo usuário
    await supabase
      .from('user_preferences')
      .insert([
        {
          user_id: newUser.id,
          sync_enabled: true,
          auto_merge_duplicates: true,
          privacy_level: 'private',
        },
      ]);

    return newUser;
  } catch (error) {
    console.error('Erro em getOrCreateUnifiedUser:', error);
    return null;
  }
}

/**
 * Vincula um novo provedor a um usuário unificado existente
 * @param {string} userId - ID do usuário unificado
 * @param {string} provider - Nome do provedor (google, azure-ad, apple, etc)
 * @param {string} providerAccountId - ID da conta no provedor
 * @param {object} providerProfile - Dados do perfil do provedor
 * @returns {object} Registro do provedor vinculado
 */
export async function linkProviderToUser(userId, provider, providerAccountId, providerProfile = {}) {
  if (!supabase) {
    console.error('Supabase client não está disponível');
    return null;
  }

  try {
    // Verificar se este provedor já está vinculado
    const { data: existingProvider, error: selectError } = await supabase
      .from('user_providers')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Erro ao verificar provedor existente:', selectError);
      return null;
    }

    if (existingProvider) {
      // Provedor já está vinculado
      return existingProvider;
    }

    // Vincular novo provedor
    const { data: linkedProvider, error: insertError } = await supabase
      .from('user_providers')
      .insert([
        {
          user_id: userId,
          provider,
          provider_account_id: providerAccountId,
          provider_email: providerProfile.email,
          provider_name: providerProfile.name,
          provider_image: providerProfile.image,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao vincular provedor:', insertError);
      return null;
    }

    return linkedProvider;
  } catch (error) {
    console.error('Erro em linkProviderToUser:', error);
    return null;
  }
}

/**
 * Obtém todos os provedores vinculados a um usuário
 * @param {string} userId - ID do usuário unificado
 * @returns {array} Lista de provedores vinculados
 */
export async function getUserProviders(userId) {
  if (!supabase) {
    console.error('Supabase client não está disponível');
    return [];
  }

  try {
    const { data: providers, error } = await supabase
      .from('user_providers')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar provedores:', error);
      return [];
    }

    return providers || [];
  } catch (error) {
    console.error('Erro em getUserProviders:', error);
    return [];
  }
}

/**
 * Obtém um usuário unificado pelo email
 * @param {string} email - Email do usuário
 * @returns {object} Usuário unificado
 */
export async function getUnifiedUserByEmail(email) {
  if (!supabase) {
    console.error('Supabase client não está disponível');
    return null;
  }

  try {
    const { data: user, error } = await supabase
      .from('unified_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }

    return user || null;
  } catch (error) {
    console.error('Erro em getUnifiedUserByEmail:', error);
    return null;
  }
}

/**
 * Obtém um usuário unificado pelo ID
 * @param {string} userId - ID do usuário unificado
 * @returns {object} Usuário unificado com seus provedores
 */
export async function getUnifiedUserById(userId) {
  if (!supabase) {
    console.error('Supabase client não está disponível');
    return null;
  }

  try {
    const { data: user, error: userError } = await supabase
      .from('unified_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return null;
    }

    if (!user) return null;

    // Buscar provedores vinculados
    const providers = await getUserProviders(userId);
    user.providers = providers;

    return user;
  } catch (error) {
    console.error('Erro em getUnifiedUserById:', error);
    return null;
  }
}
