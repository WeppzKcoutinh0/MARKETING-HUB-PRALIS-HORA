import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const SESSION_COOKIE = 'hub_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Página de login e as APIs que ela usa ficam sempre acessíveis, senão ninguém
  // consegue nem carregar o formulário pra entrar.
  if (pathname === '/login' || pathname.startsWith('/api/login') || pathname.startsWith('/api/logout')) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (session && session === process.env.SESSION_SECRET) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Libera arquivos estáticos (build do Next, imagens públicas, favicon) da checagem —
  // eles não precisam de sessão e forçar login neles quebraria o carregamento da página.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brands/|textures/).*)'],
};
