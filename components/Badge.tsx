import type { FieldOption } from '@/lib/modules';

export default function Badge({ value, options }: { value: string | null | undefined; options?: FieldOption[] }) {
  if (!value) return <span className="text-brand-textMuted text-sm">—</span>;
  const opt = options?.find((o) => o.value === value);
  const color = opt?.color ?? '#969997';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {opt?.label ?? value}
    </span>
  );
}
