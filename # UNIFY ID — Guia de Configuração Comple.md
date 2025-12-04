# UNIFY ID — Guia de Configuração Completo

## Visão Geral

O UNIFY ID é uma solução moderna para unificar múltiplas identidades digitais em um único perfil seguro. O aplicativo permite que usuários façam login com suas contas Google, Microsoft ou Apple, e sincronizem todos os seus dados (contatos, calendário, notas, senhas) em um único hub centralizado.

## Arquitetura

### Stack Tecnológico

- **Frontend:** Next.js 14 com App Router, React 18, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **Autenticação:** NextAuth.js com suporte a múltiplos provedores OAuth
- **Banco de Dados:** Supabase (PostgreSQL)
- **Hospedagem:** Vercel (recomendado)

### Estrutura de Banco de Dados

O projeto utiliza as seguintes tabelas principais:

1. **unified_users** — Armazena informações dos usuários unificados
2. **user_providers** — Rastreia quais provedores (Google, Microsoft, Apple) estão vinculados a cada usuário
3. **user_data_sync** — Armazena dados sincronizados de cada provedor
4. **user_preferences** — Armazena preferências e configurações do usuário
5. **sync_history** — Registra o histórico de sincronizações

## Pré-requisitos

- Node.js 18+ e npm/pnpm
- Conta Supabase (https://supabase.com)
- Aplicações OAuth registradas em:
  - Google Cloud Console
  - Microsoft Azure
  - Apple Developer

## Instalação

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd unify...