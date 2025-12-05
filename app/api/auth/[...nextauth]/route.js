// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
// Importa APENAS as opções do ficheiro de configuração lib/auth
import { authOptions } from "@/lib/auth"; 

// A função NextAuth cria os handlers GET e POST automaticamente.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };