'use client';

import { Suspense, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Lê direto do DOM via FormData em vez de confiar só no state controlado: quando o
    // navegador autopreenche os campos (autofill de usuário/senha salvos), ele às vezes
    // muda o valor visual sem disparar o evento "input" que o React escuta — o state fica
    // vazio/desatualizado mesmo com o texto certo aparecendo na tela, e o login falha
    // "sem motivo aparente". FormData sempre reflete o valor real do campo no momento do envio.
    const formData = new FormData(e.currentTarget);
    const submittedUsername = String(formData.get('username') ?? username).trim();
    const submittedPassword = String(formData.get('password') ?? password).trim();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: submittedUsername, password: submittedPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Não foi possível entrar.');
        setLoading(false);
        return;
      }
      const from = searchParams.get('from');
      router.push(from && from !== '/login' ? from : '/');
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: '#8A7365' }}>
            Marketing Hub
          </p>
          <h1 className="text-2xl leading-snug" style={{ fontFamily: 'var(--font-fraunces)', color: '#3A2A22' }}>
            Pralís &amp; Hora Mineira
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] space-y-5"
          style={{ borderColor: '#EEDFC4' }}
        >
          <div>
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#8A7365' }}>
              Usuário
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C9B79C' }} />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/25 focus:border-[#B8860B] transition-shadow"
                style={{ borderColor: '#EEDFC4', color: '#3A2A22' }}
                placeholder="seu usuário"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#8A7365' }}>
              Senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C9B79C' }} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/25 focus:border-[#B8860B] transition-shadow"
                style={{ borderColor: '#EEDFC4', color: '#3A2A22' }}
                placeholder="sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: '#C9B79C' }}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium rounded-lg px-3 py-2.5" style={{ backgroundColor: 'rgba(177,68,53,0.1)', color: '#B14435' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #B8860B, #8A6508)' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#8A7365' }}>
          Acesso restrito à equipe de marketing.
        </p>
      </div>
    </div>
  );
}
