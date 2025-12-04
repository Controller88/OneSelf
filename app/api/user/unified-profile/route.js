import { getServerSession } from 'next-auth/next';
import { getUnifiedUserById, getUserProviders } from '@/lib/unifiedUserUtils';

export async function GET(req) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ error: 'Não autenticado' }),
                { status: 401 }
            );
        }

        // Obter usuário unificado
        const user = await getUnifiedUserById(session.user.id);
        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Usuário não encontrado' }),
                { status: 404 }
            );
        }

        // Obter provedores vinculados
        const providers = await getUserProviders(session.user.id);

        return new Response(
            JSON.stringify({
                success: true,
                user,
                providers,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao obter perfil unificado:', error);
        return new Response(
            JSON.stringify({ error: 'Erro ao obter perfil' }),
            { status: 500 }
        );
    }
}
