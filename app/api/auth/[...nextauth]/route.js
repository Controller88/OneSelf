// Exemplo de uso seguro
const siteUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const authOptions = {
  // ...outros options
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
    // ...
  ],
  // adicione o NEXTAUTH_URL dinamicamente se o NextAuth estiver exigindo:
  // nextAuth options will consume NEXTAUTH_URL from env; ensure fallback
}

console.log('Using NEXTAUTH_URL =', siteUrl);
