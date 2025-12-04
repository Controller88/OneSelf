'use client'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const errorMessages = {
        'OAuthSignin': 'Erro ao conectar com o provedor OAuth.',
        'OAuthCallback': 'Erro no callback do provedor OAuth.',
        'OAuthCreateAccount': 'Erro ao criar conta via OAuth.',
        'EmailCreateAccount': 'Erro ao criar conta com email.',
        'Callback': 'Erro no callback de autenticação.',
        'EmailSignIn': 'Erro ao fazer login com email.',
        'CredentialsSignIn': 'Email ou senha inválidos.',
        'SessionCallback': 'Erro na sessão.',
        'Default': 'Erro desconhecido na autenticação.',
    };

    const message = errorMessages[error] || errorMessages['Default'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro de Autenticação</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
                        <p className="text-xs text-red-800 font-mono">Erro: {error}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Voltar para Home
                    </Link>
                    <Link
                        href="/"
                        className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        Tentar Novamente
                    </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Se o problema persistir, entre em contato com o suporte.
                    </p>
                </div>
            </div>
        </div>
    );
}
