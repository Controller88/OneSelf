'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Landing from '@/components/Landing';

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <p>Carregando...</p>;
    }

    if (session) {
        // Redireciona o usuário logado para o dashboard
        router.push('/dashboard');
        return null; // Não renderiza nada enquanto redireciona
    }

    // Se não estiver logado, exibe a Landing Page
    return (
        <Landing />
    );
}