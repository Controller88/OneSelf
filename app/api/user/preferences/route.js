import { getServerSession } from 'next-auth/next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function GET(req) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ error: 'Não autenticado' }),
                { status: 401 }
            );
        }

        if (!supabase) {
            return new Response(
                JSON.stringify({ error: 'Serviço indisponível' }),
                { status: 503 }
            );
        }

        const { data: preferences, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar preferências:', error);
            return new Response(
                JSON.stringify({ error: 'Erro ao buscar preferências' }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                preferences: preferences || {
                    sync_enabled: true,
                    auto_merge_duplicates: true,
                    privacy_level: 'private',
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao obter preferências:', error);
        return new Response(
            JSON.stringify({ error: 'Erro ao obter preferências' }),
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ error: 'Não autenticado' }),
                { status: 401 }
            );
        }

        if (!supabase) {
            return new Response(
                JSON.stringify({ error: 'Serviço indisponível' }),
                { status: 503 }
            );
        }

        const body = await req.json();

        const { data: preferences, error } = await supabase
            .from('user_preferences')
            .update({
                sync_enabled: body.sync_enabled,
                auto_merge_duplicates: body.auto_merge_duplicates,
                privacy_level: body.privacy_level,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', session.user.id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar preferências:', error);
            return new Response(
                JSON.stringify({ error: 'Erro ao atualizar preferências' }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                preferences,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao atualizar preferências:', error);
        return new Response(
            JSON.stringify({ error: 'Erro ao atualizar preferências' }),
            { status: 500 }
        );
    }
}
