import { Inter } from 'next/font/google';
import './globals.css';
// CORREÇÃO: Uso de caminho relativo (../components/AuthProvider) em vez de alias.
import AuthProvider from '../components/AuthProvider'; 

const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata do Layout
 */
export const metadata = {
  title: 'OneSelf - O Seu Diário Pessoal',
  description: 'Uma aplicação para registo de tarefas, hábitos e pensamentos.',
};

/**
 * Root Layout Component
 * Define a estrutura básica da página e envolve a aplicação com o AuthProvider.
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - Conteúdo da página atual.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* AuthProvider deve envolver toda a aplicação */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}