'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            loadPreferences();
        }
    }, [session]);

    async function loadPreferences() {
        try {
            const response = await fetch('/api/user/preferences');
            if (response.ok) {
                const data = await response.json();
                setPreferences(data.preferences);
            }
        } catch (error) {
            console.error('Erro ao carregar preferências:', error);
        } finally {
            setLoading(false);
        }
    }

    async function savePreferences() {
        setSaving(true);
        setMessage('');
        try {
            const response = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences),
            });

            if (response.ok) {
                setMessage('Preferências salvas com sucesso!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Erro ao salvar preferências');
            }
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
            setMessage('Erro ao salvar preferências');
        } finally {
            setSaving(false);
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                        ← Voltar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('sucesso') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferências de Sincronização</h2>

                    {preferences && (
                        <div className="space-y-6">
                            {/* Sync Enabled */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900">Sincronização Automática</h3>
                                    <p className="text-sm text-gray-600">Sincronizar dados automaticamente entre suas contas</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.sync_enabled}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        sync_enabled: e.target.checked
                                    })}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                            </div>

                            {/* Auto Merge Duplicates */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900">Mesclar Duplicatas Automaticamente</h3>
                                    <p className="text-sm text-gray-600">Detectar e mesclar contatos duplicados</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.auto_merge_duplicates}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        auto_merge_duplicates: e.target.checked
                                    })}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                            </div>

                            {/* Privacy Level */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="block font-medium text-gray-900 mb-3">Nível de Privacidade</label>
                                <select
                                    value={preferences.privacy_level}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        privacy_level: e.target.value
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="private">Privado (Apenas você)</option>
                                    <option value="protected">Protegido (Contas conectadas)</option>
                                    <option value="public">Público</option>
                                </select>
                            </div>

                            {/* Save Button */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={savePreferences}
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {saving ? 'Salvando...' : 'Salvar Preferências'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Danger Zone */}
                <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                    <h2 className="text-lg font-semibold text-red-900 mb-4">Zona de Perigo</h2>
                    <p className="text-red-800 mb-4">
                        Estas ações são irreversíveis. Use com cuidado.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Deletar Conta
                    </button>
                </div>
            </main>
        </div>
    );
}
