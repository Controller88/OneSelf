'use client'
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ConnectAccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading') {
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
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                        ← Voltar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Conectar Nova Conta</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow p-8">
                    <p className="text-gray-600 mb-8">
                        Conecte suas contas de outros provedores para unificar seus dados e ter acesso a tudo em um único lugar.
                    </p>

                    {/* Providers Grid */}
                    <div className="space-y-4">
                        {/* Google */}
                        <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition cursor-pointer">
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                                        🔵
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">Google</h3>
                                        <p className="text-sm text-gray-600">Gmail, Google Drive, Google Calendar</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                        </div>

                        {/* Microsoft */}
                        <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition cursor-pointer">
                            <button
                                onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                        ⬜
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">Microsoft</h3>
                                        <p className="text-sm text-gray-600">Outlook, OneDrive, Microsoft 365</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                        </div>

                        {/* Apple */}
                        <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition cursor-pointer">
                            <button
                                onClick={() => signIn('apple', { callbackUrl: '/dashboard' })}
                                className="w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                                        🍎
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">Apple</h3>
                                        <p className="text-sm text-gray-600">iCloud, Apple ID</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <strong>Dica:</strong> Você pode conectar múltiplas contas do mesmo provedor usando diferentes emails.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
