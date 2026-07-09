import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FFFBF5] text-center p-6">
      <h1 className="text-4xl font-bold text-[#5E3731]">Página não encontrada</h1>
      <p className="text-[#8A7365]">O endereço que você tentou acessar não existe.</p>
      <Link href="/pralis" className="mt-2 px-5 py-2.5 rounded-xl bg-[#B8860B] text-white font-medium">
        Ir para o Dashboard
      </Link>
    </div>
  );
}
