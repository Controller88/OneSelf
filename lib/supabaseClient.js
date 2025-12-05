// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Pegando as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificação de segurança (evita crashes)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase: Variáveis de ambiente não configuradas. O cliente não será inicializado.'
  );
}

// Exporta null se faltar algo → evita erros no código
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
