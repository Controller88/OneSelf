'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

// Isso é JavaScript
export default function Header() {
  // Isso é JavaScript (Hook do React)
  const { data: session } = useSession() 

  // Isso é o JSX - o código que parece HTML
  return (
    <header className="bg-white shadow-sm"> 
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ... mais JSX ... */}
        {/* Lógica condicional usando JSX e JavaScript */}
        {!session ? (
            // Se NÃO logado, exibe isso:
            <Link href="/api/auth/signin">Entrar</Link>
        ) : (
            // Se logado, exibe isso:
            <button onClick={handleLogout}>Sair</button>
        )}
      </div>
    </header>
  )
}