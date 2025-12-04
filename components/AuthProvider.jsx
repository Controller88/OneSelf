"use client";

import { SessionProvider } from "next-auth/react";

/**
 * AuthProvider
 * Componente de cliente que envolve a aplicação para fornecer o contexto de sessão do NextAuth.
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - Conteúdo filho.
 */
export default function AuthProvider({ children }) {
  // A SessionProvider deve sempre ser um componente de cliente ("use client").
  return <SessionProvider>{children}</SessionProvider>;
}