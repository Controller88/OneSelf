import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseServer as supabase } from "@/lib/supabaseServer"; 

const siteUrl =
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
};

console.log("Using NEXTAUTH_URL =", siteUrl);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
