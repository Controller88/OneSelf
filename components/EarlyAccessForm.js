'use client'
import { useState } from 'react'

export default function EarlyAccessForm(){
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e){
    e.preventDefault()
    setStatus('loading')
    try{
      // Conecta-se à API Route para salvar o e-mail no Supabase
      const res = await fetch('/api/subscribe', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ email }) 
      })
      if(res.ok){ setStatus('success'); setEmail('') }
      else setStatus('error')
    }catch(err){ setStatus('error') }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex gap-3">
      <input type="email" required placeholder="seu@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded-lg border" />
      <button type="submit" className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg">Quero Participar</button>
      {status === 'loading' && <div className="text-sm text-slate-500">Enviando...</div>}
      {status === 'success' && <div className="text-sm text-green-600">Obrigado! Conferiremos seu e-mail.</div>}
      {status === 'error' && <div className="text-sm text-red-600">Erro ao enviar. Tente novamente.</div>}
    </form>
  )
}