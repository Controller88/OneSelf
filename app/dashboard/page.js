'use client'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [unifiedUser, setUnifiedUser] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            loadUserData();
        }
    }, [session]);

    async function loadUserData() {
        try {
            const response = await fetch('/api/user/unified-profile');
            if (response.ok) {
                const data = await response.json();
                setUnifiedUser(data.user);
                setProviders(data.providers || []);
            } else if (response.status === 503) {
                // Supabase nao esta configurado, usar dados da sessao
                console.warn('Supabase nao esta configurado. Usando dados da sessao.');
                setUnifiedUser({
                    id: session?.user?.id,
                    email: session?.user?.email,
                    name: session?.user?.name,
                    unified_id: session?.user?.unifiedId,
                    created_at: new Date().toISOString(),
                });
                setProviders(session?.user?.provider ? [{
                    id: '1',
                    provider: session.user.provider,
                    provider_email: session?.user?.email,
                    provider_name: session?.user?.name,
                }] : []);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuario:', error);
            // Fallback: usar dados da sessao
            setUnifiedUser({
                id: session?.user?.id,
                email: session?.user?.email,
                name: session?.user?.name,
                unified_id: session?.user?.unifiedId,
                created_at: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">OneSelf</h1>
                        <p className="text-sm text-gray-600">Dashboard</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-medium text-gray-900">{session?.user?.name}</p>
                            <p className="text-sm text-gray-600">{session?.user?.email}</p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Unified ID Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white mb-8">
                    <h2 className="text-xl font-semibold mb-2">Seu ID Unificado</h2>
                    <p className="text-blue-100 mb-4">
                        Todos os seus dados estao sincronizados em um unico perfil seguro
                    </p>
                    {unifiedUser && (
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 font-mono text-sm break-all">
                            {unifiedUser.unified_id}
                        </div>
                    )}
                </div>

                {/* Grid de Secoes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contas Conectadas */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contas Conectadas</h3>
                        <div className="space-y-3">
                            {providers.length > 0 ? (
                                providers.map((provider) => (
                                    <div
                                        key={provider.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                                                {provider.provider === 'google' && '🔵'}
                                                {provider.provider === 'azure-ad' && '⬜'}
                                                {provider.provider === 'apple' && '🍎'}
                                                {provider.provider === 'credentials' && '🔐'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 capitalize">{provider.provider}</p>
                                                <p className="text-xs text-gray-600">
                                                    {provider.provider_email || provider.provider_name || 'Conectado'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-green-600 text-sm font-medium">✓ Ativo</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 text-sm">Nenhuma conta conectada</p>
                            )}
                        </div>
                        <Link
                            href="/dashboard/connect-account"
                            className="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Conectar Nova Conta
                        </Link>
                    </div>

                    {/* Informacoes do Perfil */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacoes do Perfil</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email Principal</p>
                                <p className="font-medium text-gray-900">{unifiedUser?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Nome</p>
                                <p className="font-medium text-gray-900">{unifiedUser?.name || 'Nao definido'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Membro Desde</p>
                                <p className="font-medium text-gray-900">
                                    {unifiedUser?.created_at 
                                        ? new Date(unifiedUser.created_at).toLocaleDateString('pt-BR')
                                        : 'Hoje'
                                    }
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/settings"
                            className="mt-4 block w-full text-center px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                        >
                            Editar Perfil
                        </Link>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Como funciona o OneSelf?</h3>
                    <p className="text-gray-700 mb-4">
                        O OneSelf unifica suas multiplas identidades digitais em um unico perfil. Voce pode conectar suas contas do Google, Microsoft e Apple, e todos os seus dados serao sincronizados e gerenciados de forma segura.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Documentacao
                        </a>
                        <a href="#" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                            Suporte
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
