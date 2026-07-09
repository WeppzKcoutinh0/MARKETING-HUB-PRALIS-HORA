'use client';

import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts';

const gridColor = 'rgba(150,150,150,0.15)';

export function TrendLineChart({
  data,
  lines,
  colors,
}: {
  data: any[];
  lines: { key: string; label: string }[];
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {lines.map((l, i) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={colors[i % colors.length]} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ComparisonBarChart({
  data,
  bars,
  colors,
}: {
  data: any[];
  bars: { key: string; label: string }[];
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {bars.map((b, i) => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={colors[i % colors.length]} radius={[6, 6, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SimplePieChart({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
