// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; 

// --- DEBUG CRÍTICO: 
// Isto deve garantir que o handler é criado com o NEXTAUTH_URL correto
if (process.env.NEXTAUTH_URL) {
    console.log("NEXTAUTH_URL (Lido na Rota):", process.env.NEXTAUTH_URL);
} else {
    console.error("ERRO CRÍTICO: NEXTAUTH_URL não está definido!");
}
// --- FIM DEBUG

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };