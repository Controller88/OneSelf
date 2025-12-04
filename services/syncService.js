import { supabase } from './supabase'

/**
 * Serviço de sincronização que unifica dados de múltiplos provedores.
 * Este é o "Robô Organizador" do seu projeto.
 */

// 1. Simula a busca de dados de diferentes provedores (APIs reais iriam aqui)
const mockProviderData = {
  google: {
    contacts: [
      { id: 'g1', name: 'João Silva', email: 'joao@gmail.com', phone: '11999999999' },
      { id: 'g2', name: 'Maria Santos', email: 'maria@gmail.com', phone: '11988888888' },
      { id: 'g3', name: 'João Silva', email: 'joao.silva@work.com', phone: '11999999999' }, // Duplicado
    ],
    calendar: [
      { id: 'gc1', title: 'Reunião com cliente', date: '2025-11-28', time: '10:00', duration: 60 },
    ],
  },
  microsoft: {
    contacts: [
      { id: 'm1', name: 'João Silva', email: 'joao@outlook.com', phone: '11999999999' }, // Duplicado
      { id: 'm2', name: 'Pedro Souza', email: 'pedro@hotmail.com', phone: '11977777777' },
    ],
    calendar: [
      { id: 'mc1', title: 'Daily Standup', date: '2025-11-28', time: '09:00', duration: 30 },
    ],
  },
}

/**
 * Algoritmo de Unificação de Contatos
 * @param {Array} allContacts - Lista de contatos de todos os provedores
 * @returns {Array} Contatos unificados e sem duplicatas
 */
function mergeContacts(allContacts) {
  const unified = {}
  
  // A regra de unificação é: chave (email + telefone)
  allContacts.forEach(contact => {
    const key = `${contact.email.toLowerCase()}-${contact.phone}`
    
    if (!unified[key]) {
      // Se não existe, cria o contato unificado
      unified[key] = { ...contact, sources: [contact.provider] }
    } else {
      // Se já existe, apenas adiciona a nova fonte
      if (!unified[key].sources.includes(contact.provider)) {
        unified[key].sources.push(contact.provider)
      }
    }
  })
  return Object.values(unified)
}

/**
 * Função principal que orquestra a sincronização de um usuário
 * @param {string} userId - ID do usuário unificado
 */
export async function runSyncService(userId) {
  console.log(`Iniciando sincronização para o usuário: ${userId}`)
  const providers = await supabase.from('user_providers').select('provider') // Simula a busca dos provedores vinculados

  // 1. Coleta todos os dados de Contatos, Calendário, etc.
  let allContacts = []
  let allCalendar = []

  // Neste mock, usamos os dados simulados
  for (const provider of ['google', 'microsoft']) {
    if (mockProviderData[provider]?.contacts) {
      const contactsWithProvider = mockProviderData[provider].contacts.map(c => ({ ...c, provider }))
      allContacts = allContacts.concat(contactsWithProvider)
    }
    if (mockProviderData[provider]?.calendar) {
      const calendarWithProvider = mockProviderData[provider].calendar.map(c => ({ ...c, provider }))
      allCalendar = allCalendar.concat(calendarWithProvider)
    }
  }

  // 2. Unificação e Merge de Dados
  const unifiedContacts = mergeContacts(allContacts)
  const unifiedCalendar = allCalendar // Calendário é mais simples, apenas concatena (sem merge por enquanto)
  
  // 3. Salva os dados unificados de volta no Supabase (user_data_sync)
  // [Este é o passo que seria implementado, salvando os dados limpos no banco]
  // Exemplo: await syncUserData(userId, 'contacts', 'unified', unifiedContacts)
  
  // 4. Loga o histórico (simulado)
  // [Este é o passo que seria implementado, logando o sucesso da operação]
  // Exemplo: await logSyncHistory(userId, 'UNIFY', 'contacts', 'success', null, unifiedContacts.length)

  console.log('Sincronização concluída. Contatos unificados:', unifiedContacts.length)
  return { unifiedContacts, unifiedCalendar }
}