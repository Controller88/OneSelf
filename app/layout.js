import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers' // Importa o provedor de sessão do NextAuth

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'UNIFY ID: Identidade Digital Unificada',
  description: 'Um único perfil para sincronizar e organizar suas informações entre Google, Apple, Microsoft e todos os seus apps.',
}

// O componente RootLayout engloba toda a aplicação
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        {/* O componente Providers envolve o resto da aplicação (children) */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}