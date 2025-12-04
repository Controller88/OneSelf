import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente devem estar disponíveis aqui, mas o Next.js prefere a variável privada no backend
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cria um cliente Supabase "anônimo" (sem Service Role) para o login do usuário
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * Tenta fazer login de um usuário usando email e senha diretamente com o Supabase.
 * @param {string} email
 * @param {string} password
 * @returns {object | null} Objeto de usuário do NextAuth ou null em caso de falha.
 */
export async function signInWithSupabaseCredentials(email, password) {
    if (!supabase) {
        console.error('Supabase client não está disponível');
        return null;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Erro de login no Supabase:', error.message);
        return null;
    }

    // Se o login for bem-sucedido, retorna o objeto de usuário do NextAuth
    if (data.user) {
        return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email.split('@')[0], // Nome simples
        };
    }

    return null;
}