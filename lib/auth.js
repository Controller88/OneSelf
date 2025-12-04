import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';

// Funcoes utilitarias do Supabase para o fluxo de credenciais
import { signInWithSupabaseCredentials } from './supabaseUtils';
import { getOrCreateUnifiedUser, linkProviderToUser } from './unifiedUserUtils';

/**
 * Opções de Configuração do NextAuth
 * @type {NextAuthOptions}
 */
export const authOptions = {
    // 1. ADAPTER - REMOVIDO para forçar o uso de JWT e evitar conflitos.
    // adapter: SupabaseAdapter({
    //     url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    //     secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // }),

    // 2. PROVIDERS - Define os métodos de login
    providers: [
        // Provedor de Credenciais (Email e Senha) - MANTIDO
        CredentialsProvider({
            name: 'Credenciais',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                // Tenta logar usando as credenciais e a função utilitária
                const user = await signInWithSupabaseCredentials(
                    credentials.email,
                    credentials.password
                );

                // Retorna o objeto user se o login for bem-sucedido
                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
        // Provedor Google (OAuth) - MANTIDO
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Provedor Microsoft (Azure AD) - NOVO
        AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            tenantId: process.env.MICROSOFT_TENANT_ID || 'common',
        }),
        // Provedor Apple - NOVO
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
        }),
    ],

    // 3. CONFIGURAÇÕES DA SESSÃO
    session: {
        strategy: 'jwt', // MANTIDO
    },
    
    // 4. PAGES (MANTIDO)
    pages: {
        signIn: '/', 
        error: '/auth/error', 
    },
    
    // 5. CALLBACKS (MODIFICADO para incluir lógica de unificação com fallback)
    callbacks: {
        // Callback signIn - Implementa a lógica de unificação de ID
        async signIn({ user, account, profile }) {
            try {
                if (!user.email) {
                    console.error('Email não disponível no perfil do usuário');
                    return false;
                }

                // Verificar se o Supabase está configurado
                const supabaseUrl = process.env.SUPABASE_URL;
                const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

                if (!supabaseUrl || !supabaseServiceKey) {
                    // FALLBACK: Se o Supabase não está configurado, permitir login com dados mínimos
                    console.warn('⚠️ Supabase não está configurado. Usando modo de fallback para testes.');
                    
                    // Gerar um ID unificado simples para testes
                    const unifiedId = `unify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    user.id = user.email; // Usar email como ID temporário
                    user.unifiedId = unifiedId;
                    
                    return true;
                }

                // Se o Supabase está configurado, usar a lógica completa
                const unifiedUser = await getOrCreateUnifiedUser(user.email, {
                    name: user.name || profile?.name,
                    image: user.image || profile?.image,
                });

                if (!unifiedUser) {
                    console.error('Falha ao criar ou obter usuário unificado');
                    return false;
                }

                // Vincular o provedor ao usuário unificado
                if (account) {
                    await linkProviderToUser(
                        unifiedUser.id,
                        account.provider,
                        account.providerAccountId,
                        {
                            email: user.email,
                            name: user.name || profile?.name,
                            image: user.image || profile?.image,
                        }
                    );
                }

                // Atualizar o objeto user com o ID unificado
                user.id = unifiedUser.id;
                user.unifiedId = unifiedUser.unified_id;

                return true;
            } catch (error) {
                console.error('Erro no callback signIn:', error);
                return false;
            }
        },
        // Callback para adicionar o ID do usuário ao JWT
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.unifiedId = user.unifiedId;
                token.email = user.email;
                token.provider = account?.provider;
            }
            return token;
        },
        // Callback para adicionar o ID do usuário à sessão
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.unifiedId = token.unifiedId;
                session.user.email = token.email;
                session.user.provider = token.provider;
            }
            return session;
        },
    },
};
