import { createClient } from '@supabase/supabase-js'

// As chaves são lidas do .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Cria o cliente Supabase usando a chave de Serviço (com acesso de gravação)
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Função que responde à requisição POST
export async function POST(req) {
  try {
    // Verifica se o Supabase está configurado
    if (!supabase) return new Response(JSON.stringify({ error: 'Serviço indisponível' }), { status: 503 })
    
    // Obtém o e-mail do corpo da requisição
    const { email } = await req.json()
    if (!email) return new Response(JSON.stringify({ error: 'Email é obrigatório' }), { status: 400 })
    
    // Insere o e-mail na tabela 'early_access'
    const { data, error } = await supabase.from('early_access').insert([{ email }])
    
    if (error) {
      console.error(error)
      // Se houver erro, retorna a mensagem de erro do Supabase
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    
    // Sucesso
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 })
  }
}