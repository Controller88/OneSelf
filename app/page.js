// app/page.js
"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { LuBookOpen, LuLogOut, LuLogIn } from 'react-icons/lu';

// Componente principal da Landing Page/Dashboard
export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  // Estado: Logado
  if (session) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg text-center">
          <LuBookOpen className="mx-auto text-6xl text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a), {session.user.name.split(' ')[0]}!</h1>
          <p className="text-gray-600 mb-6">Pronto para escrever o seu próximo pensamento?</p>
          
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out"
          >
            <LuLogOut className="mr-2 h-5 w-5" />
            Sair
          </button>
        </div>
        
        <p className="mt-4 text-sm text-gray-500">
          Você está logado(a) como: {session.user.email}
        </p>
      </div>
    );
  }

  // Estado: Deslogado
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg text-center">
        <LuBookOpen className="mx-auto text-7xl text-indigo-500 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">OneSelf Diário</h1>
        <p className="text-gray-600 mb-8">
          O seu espaço privado para registar pensamentos, hábitos e objetivos.
        </p>
        
        <button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out"
        >
          <LuLogIn className="mr-2 h-6 w-6" />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}