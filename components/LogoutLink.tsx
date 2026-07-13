'use client';

import { LogOut } from 'lucide-react';

/** Botão de sair usado em telas fora do layout de marca (ex: seletor de workspace),
 * que não têm Sidebar/Topbar pra hospedar o botão de logout padrão. */
export default function LogoutLink() {
  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }
  return (
    <button
      onClick={handleLogout}
      className="absolute top-6 right-6 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white"
      style={{ color: '#8A7365', borderColor: '#EEDFC4' }}
    >
      <LogOut size={13} />
      Sair
    </button>
  );
}
