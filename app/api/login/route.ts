import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/middleware';

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const username = body.username?.trim() ?? '';
  const password = body.password?.trim() ?? '';
  const validUsername = process.env.ADMIN_USERNAME?.trim();
  const validPassword = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.SESSION_SECRET;

  if (!validUsername || !validPassword || !secret) {
    return NextResponse.json({ error: 'Login não configurado no servidor.' }, { status: 500 });
  }

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
  return response;
}
