'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { FieldConfig, ModuleConfig } from '@/lib/modules';
import { MONTHS_2026, monthLabel } from '@/lib/format';

export default function RecordForm({
  moduleConfig,
  initial,
  onCancel,
  onSubmit,
  submitting,
}: {
  moduleConfig: ModuleConfig;
  initial: Record<string, any>;
  onCancel: () => void;
  onSubmit: (values: Record<string, any>) => void;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<Record<string, any>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(key: string, value: any) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const f of moduleConfig.fields) {
      if (f.required && f.type !== 'boolean' && !f.computed) {
        const v = values[f.key];
        if (v === null || v === undefined || v === '') newErrors[f.key] = 'Campo obrigatório';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  }

  const sections: { name: string; fields: FieldConfig[] }[] = [];
  for (const f of moduleConfig.fields) {
    const name = f.section ?? moduleConfig.title;
    let section = sections.find((s) => s.name === name);
    if (!section) {
      section = { name, fields: [] };
      sections.push(section);
    }
    section.fields.push(f);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {sections.map((section, i) => (
        <div key={section.name} className={i > 0 ? 'pt-6 border-t border-brand-border' : ''}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand-primary mb-4">{section.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
            {section.fields.map((f) => (
              <div key={f.key} className={f.colSpan === 2 ? 'sm:col-span-2' : ''}>
                <FieldInput field={f} value={values[f.key]} onChange={(v) => setField(f.key, v)} />
                {errors[f.key] && <p className="text-xs text-brand-danger mt-1.5">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-5 border-t border-brand-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-brand-textMuted hover:bg-brand-surface2 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primaryDark disabled:opacity-60 transition-colors shadow-sm"
        >
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  onChange: (v: any) => void;
}) {
  const baseClass =
    'w-full rounded-xl border border-brand-border bg-brand-surface2 px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-textMuted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary';

  const options = field.key === 'month' ? MONTHS_2026.map((m) => ({ value: m, label: monthLabel(m) })) : field.options;

  const label = (
    <label className="block text-xs font-semibold text-brand-textMuted mb-1.5">
      {field.label}
      {field.required && <span className="text-brand-danger ml-0.5">*</span>}
    </label>
  );

  if (field.computed) {
    return (
      <div>
        {label}
        <div className="w-full rounded-xl border border-dashed border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-brand-textMuted italic flex items-center gap-1.5 opacity-80">
          <Sparkles size={13} className="shrink-0" />
          {value !== null && value !== undefined && value !== '' ? String(value) : 'Calculado automaticamente'}
        </div>
      </div>
    );
  }

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          {label}
          <textarea
            className={baseClass}
            rows={3}
            value={value ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case 'select':
      return (
        <div>
          {label}
          <select className={baseClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">Selecione...</option>
            {options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case 'boolean':
      return (
        <label className="flex items-center gap-3 h-full rounded-xl border border-brand-border bg-brand-surface2 px-3.5 py-2.5 cursor-pointer">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-brand-primary" />
          <span className="text-sm text-brand-text font-medium">{field.label}</span>
        </label>
      );
    case 'rating':
      return (
        <div>
          {label}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className="text-2xl leading-none transition-transform hover:scale-110"
                style={{ color: n <= (value ?? 0) ? 'var(--brand-primary)' : 'var(--brand-border)' }}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      );
    case 'number':
      return (
        <div>
          {label}
          <input
            type="number"
            step="any"
            className={baseClass}
            value={value ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>
      );
    case 'currency':
      return (
        <div>
          {label}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-brand-textMuted">R$</span>
            <input
              type="number"
              step="0.01"
              className={`${baseClass} pl-9`}
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>
        </div>
      );
    case 'date':
      return (
        <div>
          {label}
          <input type="date" className={baseClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'url':
      return (
        <div>
          {label}
          <input
            type="url"
            className={baseClass}
            placeholder="https://..."
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    default:
      return (
        <div>
          {label}
          <input
            type="text"
            className={baseClass}
            placeholder={field.placeholder}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
  }
}
