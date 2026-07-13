import { Loader2 } from 'lucide-react';

// Arquivo especial do Next.js: aparece IMEDIATAMENTE ao trocar de aba (Dashboard,
// Tráfego Pago, Relatórios etc.), antes mesmo do componente da página terminar de montar
// e buscar dados — dá a sensação de resposta instantânea ao clique, em vez da tela parecer
// travada enquanto o navegador troca de rota. Sidebar/Topbar continuam visíveis (só o
// conteúdo principal é trocado por isso, brevemente).
export default function BrandSectionLoading() {
  return (
    <div className="flex items-center justify-center py-24 text-brand-textMuted">
      <Loader2 size={22} className="animate-spin" />
    </div>
  );
}
