// lib/auth.js

import GoogleProvider from "next-auth/providers/google";

/**
 * Opções de autenticação a serem exportadas e usadas no route.js.
 */
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/', 
  },
};