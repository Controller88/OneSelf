// lib/auth.js

import GoogleProvider from "next-auth/providers/google";

/**
 * Opções de autenticação para o NextAuth.
 */
export const authOptions = {
  // 1. Provedores
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // 2. Chave Secreta
  secret: process.env.NEXTAUTH_SECRET,
  // 3. Configuração de Sessão
  session: {
    strategy: "jwt",
  },
  // 4. Configuração de Páginas
  pages: {
    signIn: '/', 
  },
};