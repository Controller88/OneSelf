import { createClient } from '@supabase/supabase-js'

// As chaves são lidas das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Cria o cliente Supabase. 'supabase' será o objeto de conexão usado em todo o app.
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// --- Funções de Leitura/Escrita de Dados ---

// Busca um usuário pelo email
export async function getUnifiedUser(email) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('unified_users')
    .select('*')
    .eq('email', email)
    .single()

  // Ignora o erro 'PGRST116' (que significa 'nenhum resultado encontrado')
  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar usuário:', error)
  }
  return data
}

// Busca a lista de provedores (Google, Microsoft, etc.) vinculados a um usuário
export async function getUserProviders(userId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('user_providers')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Erro ao buscar provedores:', error)
  }
  return data || []
}

// [Outras funções como getUserPreferences, getUserDataSync, updateUserPreferences, syncUserData e logSyncHistory estão na documentação, mas omitidas aqui para focar no essencial.]