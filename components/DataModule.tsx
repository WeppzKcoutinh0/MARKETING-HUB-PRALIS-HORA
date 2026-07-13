'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Inbox, AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ModuleConfig } from '@/lib/modules';
import type { BrandSlug } from '@/lib/brands';
import Modal from './Modal';
import RecordForm from './RecordForm';
import Badge from './Badge';
import { getBrandId } from '@/lib/data';
import { getSupabaseClient } from '@/lib/supabase';
import { computePaidTrafficMetrics } from '@/lib/calc';
import { formatCurrency, formatDateBR, formatNumber, monthLabel } from '@/lib/format';

export default function DataModule({ brandSlug, moduleConfig }: { brandSlug: BrandSlug; moduleConfig: ModuleConfig }) {
  const [brandId, setBrandId] = useState<string | null>(null);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Record<string, any> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const id = await getBrandId(brandSlug);
      setBrandId(id);
      const supabase = getSupabaseClient();
      const { data, error: qError } = await supabase
        .from(moduleConfig.table)
        .select('*')
        .eq('brand_id', id)
        .order(moduleConfig.defaultSort.key, { ascending: moduleConfig.defaultSort.direction === 'asc' });
      if (qError) throw qError;
      setRows(data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar dados. Verifique a configuração do Supabase.');
    } finally {
      setLoading(false);
    }
  }, [brandSlug, moduleConfig.table, moduleConfig.defaultSort]);

  useEffect(() => {
    load();
  }, [load]);

  const statusField = moduleConfig.fields.find((f) => f.key === 'status');

  const filtered = useMemo(() => {
    let list = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        moduleConfig.searchableKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q))
      );
    }
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    return list;
  }, [rows, search, statusFilter, moduleConfig.searchableKeys]);

  const tableFields = moduleConfig.fields.filter((f) => f.showInTable);
  const ModuleIcon = (LucideIcons as unknown as Record<string, LucideIcon>)[moduleConfig.icon];

  function openCreate() {
    const defaults: Record<string, any> = {};
    for (const f of moduleConfig.fields) {
      if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue;
      else if (f.type === 'boolean') defaults[f.key] = false;
    }
    setEditing(null);
    setModalOpen(true);
    setPendingValues(defaults);
  }

  const [pendingValues, setPendingValues] = useState<Record<string, any>>({});

  function openEdit(row: Record<string, any>) {
    setEditing(row);
    setPendingValues(row);
    setModalOpen(true);
  }

  async function handleSubmit(values: Record<string, any>) {
    if (!brandId) return;
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const payload = buildPayload(moduleConfig, values);

      if (moduleConfig.table === 'paid_traffic') {
        const metrics = computePaidTrafficMetrics({
          amount_spent: Number(values.amount_spent) || 0,
          days: Number(values.days) || 0,
          followers_gained: Number(values.followers_gained) || 0,
          paid_profile_visits: Number(values.paid_profile_visits) || 0,
          paid_interactions: Number(values.paid_interactions) || 0,
        });
        Object.assign(payload, metrics);
      }

      if (editing) {
        const { error: upErr } = await supabase.from(moduleConfig.table).update(payload).eq('id', editing.id);
        if (upErr) throw upErr;
      } else {
        const { error: insErr } = await supabase.from(moduleConfig.table).insert({ ...payload, brand_id: brandId });
        if (insErr) throw insErr;
      }
      setModalOpen(false);
      await load();
    } catch (e: any) {
      alert(`Erro ao salvar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      const supabase = getSupabaseClient();
      const { error: delErr } = await supabase.from(moduleConfig.table).delete().eq('id', confirmDelete.id);
      if (delErr) throw delErr;
      setConfirmDelete(null);
      await load();
    } catch (e: any) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  }

  const isPralis = brandSlug === 'pralis';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {ModuleIcon && (
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-brand-primary/10">
              <ModuleIcon size={20} className="text-brand-primary" />
            </div>
          )}
          <p className="text-brand-textMuted text-sm max-w-md">{moduleConfig.description}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-brand text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primaryDark transition-colors shrink-0"
          style={{ boxShadow: '0 8px 18px -6px var(--brand-primary)' }}
        >
          <Plus size={16} /> Novo registro
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-10 pr-3 py-2.5 rounded-brand border border-brand-border bg-brand-surface text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
          />
        </div>
        {statusField && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-brand border border-brand-border bg-brand-surface text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            <option value="">Todos os status</option>
            {statusField.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-brand bg-brand-danger/10 text-brand-danger text-sm">{error}</div>
      )}

      {loading ? (
        <div className="p-12 text-center text-brand-textMuted text-sm">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="relative overflow-hidden rounded-brand border border-brand-border bg-brand-surface p-12 text-center flex flex-col items-center gap-3 text-brand-textMuted">
          {isPralis ? (
            <svg viewBox="0 0 97.34 139.35" aria-hidden className="w-9 h-auto text-brand-primary/50">
              <g fill="currentColor" fillRule="evenodd">
                <path d="M97.34,88.33c-14,2.58-23.62,7.13-32.81,18.19-7.44,8.85-9.84,15.98-11.81,26.92-.87,4.79,1.53,6.27,6.34,5.65,14.66-1.48,25.59-9.96,33.03-18.19,5.69-6.64,10.5-17.33,11.59-26.92.66-5.04-1.75-6.51-6.34-5.65" />
                <path d="M.23,94.55c2.58,14,7.13,23.62,18.19,32.81,8.85,7.44,15.98,9.84,26.92,11.81,4.79.87,6.27-1.53,5.65-6.34-1.48-14.66-9.96-25.59-18.19-33.03-6.64-5.69-17.33-10.5-26.92-11.59-5.04-.66-6.51,1.75-5.65,6.34" />
              </g>
            </svg>
          ) : (
            <Inbox size={32} />
          )}
          <p className="text-sm">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-brand border border-brand-border bg-brand-surface overflow-x-auto">
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))' }}
          />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface2/60">
                {tableFields.map((f) => (
                  <th key={f.key} className="text-left px-4 py-3.5 font-semibold text-brand-textMuted text-xs uppercase tracking-wide whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3.5 w-24" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface2/50 transition-colors">
                  {tableFields.map((f) => (
                    <td key={f.key} className="px-4 py-3 whitespace-nowrap max-w-xs truncate text-brand-text">
                      {renderCell(f, row[f.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(row)} className="p-1.5 rounded-brand hover:bg-brand-surface2 text-brand-textMuted" aria-label="Editar">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setConfirmDelete(row)} className="p-1.5 rounded-brand hover:bg-brand-danger/10 text-brand-danger" aria-label="Excluir">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar registro' : 'Novo registro'}
        subtitle={moduleConfig.title}
        icon={ModuleIcon}
        wide
      >
        <RecordForm
          moduleConfig={moduleConfig}
          initial={pendingValues}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        />
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar exclusão" icon={AlertTriangle}>
        <p className="text-sm text-brand-text mb-6">
          Tem certeza que deseja excluir <strong>{confirmDelete?.[moduleConfig.primaryLabelKey] ?? 'este registro'}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-brand text-sm font-medium text-brand-textMuted hover:bg-brand-surface2">
            Cancelar
          </button>
          <button onClick={handleDelete} className="px-4 py-2 rounded-brand text-sm font-semibold text-white bg-brand-danger hover:opacity-90">
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}

function buildPayload(moduleConfig: ModuleConfig, values: Record<string, any>) {
  const payload: Record<string, any> = {};
  for (const f of moduleConfig.fields) {
    if (f.computed) continue;
    let v = values[f.key];
    // "year" é um select (pra virar dropdown de anos), mas a coluna no banco é integer.
    if (f.type === 'number' || f.type === 'currency' || f.key === 'year') v = v === '' || v === undefined ? null : Number(v);
    if (v === undefined) v = null;
    payload[f.key] = v;
  }
  return payload;
}

function renderCell(field: { key: string; type: string; options?: any[] }, value: any) {
  if (value === null || value === undefined || value === '') return <span className="text-brand-textMuted">—</span>;
  switch (field.type) {
    case 'currency':
      return formatCurrency(Number(value));
    case 'number':
      return formatNumber(Number(value));
    case 'date':
      return formatDateBR(value);
    case 'select':
      if (field.key === 'month') return monthLabel(value);
      if (field.key === 'year') return String(value);
      return <Badge value={value} options={field.options} />;
    case 'boolean':
      return value ? 'Sim' : 'Não';
    case 'url':
      return (
        <a href={value} target="_blank" rel="noreferrer" className="text-brand-primary hover:underline">
          Ver link
        </a>
      );
    case 'rating':
      return '★'.repeat(Number(value)) || '—';
    default:
      return String(value);
  }
}
