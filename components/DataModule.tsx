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
      if (f.type === 'boolean') defaults[f.key] = false;
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-brand-textMuted text-sm">{moduleConfig.description}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-brand text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primaryDark transition-colors shrink-0"
        >
          <Plus size={16} /> Novo registro
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-textMuted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-2.5 rounded-brand border border-brand-border bg-brand-surface text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
        </div>
        {statusField && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-brand border border-brand-border bg-brand-surface text-sm text-brand-text"
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
        <div className="p-12 text-center flex flex-col items-center gap-2 text-brand-textMuted">
          <Inbox size={32} />
          <p className="text-sm">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="rounded-brand border border-brand-border bg-brand-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                {tableFields.map((f) => (
                  <th key={f.key} className="text-left px-4 py-3 font-semibold text-brand-textMuted text-xs uppercase tracking-wide whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface2/50">
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
    if (f.type === 'number' || f.type === 'currency') v = v === '' || v === undefined ? null : Number(v);
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
