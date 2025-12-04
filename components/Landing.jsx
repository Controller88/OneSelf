'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaLock } from 'react-icons/fa';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full text-center bg-gray-800 p-8 rounded-xl shadow-2xl">
                {/* Ícone de Cadeado */}
                <FaLock className="mx-auto h-16 w-16 text-emerald-400 mb-4" />
                <h1 className="text-4xl font-extrabold text-white mb-3">OneSelf Vault</h1>
                <p className="text-gray-400 mb-8">
                    Seu gerenciador de senhas seguro e auto-hospedado.
                    Acesse sua conta ou cadastre-se com uma das opções abaixo.
                </p>

                {/* Botão de Credenciais Personalizadas */}
                <button
                    onClick={() => signIn('credentials', { callbackUrl: '/dashboard' })}
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out mb-3"
                >
                    <span className="text-lg">🔐</span> Login/Cadastro por Email e Senha
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-400">Ou continue com</span>
                    </div>
                </div>

                {/* Botão Google OAuth */}
                <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="w-full flex justify-center items-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out"
                >
                    <FcGoogle className="w-5 h-5 mr-3" />
                    Entrar com Google
                </button>

            </div>
            <p className="mt-8 text-sm text-gray-500">
                Garantindo sua segurança digital.
            </p>
        </div>
    );
}
