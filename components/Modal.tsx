'use client';

import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* O padding do wrapper (em vez de items-center no flex) evita que o topo do
          conteúdo seja cortado quando o formulário é mais alto que a viewport. */}
      <div className="min-h-full md:py-10 md:px-6">
        <div
          className={`bg-brand-surface w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} mx-auto md:rounded-2xl shadow-cardHover min-h-screen md:min-h-0`}
        >
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-brand-border sticky top-0 bg-brand-surface md:rounded-t-2xl z-10">
            <div className="flex items-center gap-3 min-w-0">
              {Icon && (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-brand-primary/10">
                  <Icon size={18} className="text-brand-primary" />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="font-heading text-lg font-semibold text-brand-text truncate">{title}</h2>
                {subtitle && <p className="text-xs text-brand-textMuted truncate">{subtitle}</p>}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-brand-surface2 text-brand-textMuted shrink-0" aria-label="Fechar">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
