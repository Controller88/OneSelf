'use client'
import { SessionProvider } from 'next-auth/react'

// Este componente envolve toda a aplicação no layout.js para fornecer o contexto de sessão.
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}