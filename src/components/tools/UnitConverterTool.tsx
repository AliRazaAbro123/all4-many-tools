import React, { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';

type Category = 'length' | 'weight' | 'temp' | 'data' | 'time';

interface UnitDef {
  id: string;
  label: string;
  toBase: (n: number) => number;
  fromBase: (n: number) => number;
}

const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { id: 'px', label: 'Pixels (px)', toBase: (n) => n / 96, fromBase: (n) => n * 96 },
    { id: 'in', label: 'Inches', toBase: (n) => n, fromBase: (n) => n },
    { id: 'cm', label: 'Centimeters', toBase: (n) => n / 2.54, fromBase: (n) => n * 2.54 },
    { id: 'mm', label: 'Millimeters', toBase: (n) => n / 25.4, fromBase: (n) => n * 25.4 },
    { id: 'm', label: 'Meters', toBase: (n) => n / 0.0254, fromBase: (n) => n * 0.0254 },
    { id: 'ft', label: 'Feet', toBase: (n) => n * 12, fromBase: (n) => n / 12 },
    { id: 'yd', label: 'Yards', toBase: (n) => n * 36, fromBase: (n) => n / 36 },
    { id: 'km', label: 'Kilometers', toBase: (n) => n / 0.0000254, fromBase: (n) => n * 0.0000254 },
  ],
  weight: [
    { id: 'g', label: 'Grams', toBase: (n) => n, fromBase: (n) => n },
    { id: 'kg', label: 'Kilograms', toBase: (n) => n * 1000, fromBase: (n) => n / 1000 },
    { id: 'lb', label: 'Pounds', toBase: (n) => n * 453.592, fromBase: (n) => n / 453.592 },
    { id: 'oz', label: 'Ounces', toBase: (n) => n * 28.3495, fromBase: (n) => n / 28.3495 },
    { id: 't', label: 'Metric tons', toBase: (n) => n * 1_000_000, fromBase: (n) => n / 1_000_000 },
  ],
  temp: [
    { id: 'c', label: 'Celsius', toBase: (n) => n, fromBase: (n) => n },
    { id: 'f', label: 'Fahrenheit', toBase: (n) => (n - 32) * (5 / 9), fromBase: (n) => n * (9 / 5) + 32 },
    { id: 'k', label: 'Kelvin', toBase: (n) => n - 273.15, fromBase: (n) => n + 273.15 },
  ],
  data: [
    { id: 'b', label: 'Bytes', toBase: (n) => n, fromBase: (n) => n },
    { id: 'kb', label: 'Kilobytes', toBase: (n) => n * 1024, fromBase: (n) => n / 1024 },
    { id: 'mb', label: 'Megabytes', toBase: (n) => n * 1024 ** 2, fromBase: (n) => n / 1024 ** 2 },
    { id: 'gb', label: 'Gigabytes', toBase: (n) => n * 1024 ** 3, fromBase: (n) => n / 1024 ** 3 },
    { id: 'tb', label: 'Terabytes', toBase: (n) => n * 1024 ** 4, fromBase: (n) => n / 1024 ** 4 },
  ],
  time: [
    { id: 's', label: 'Seconds', toBase: (n) => n, fromBase: (n) => n },
    { id: 'min', label: 'Minutes', toBase: (n) => n * 60, fromBase: (n) => n / 60 },
    { id: 'h', label: 'Hours', toBase: (n) => n * 3600, fromBase: (n) => n / 3600 },
    { id: 'd', label: 'Days', toBase: (n) => n * 86400, fromBase: (n) => n / 86400 },
    { id: 'w', label: 'Weeks', toBase: (n) => n * 604800, fromBase: (n) => n / 604800 },
  ],
};

const CATS: { id: Category; label: string }[] = [
  { id: 'length', label: 'Length' },
  { id: 'weight', label: 'Weight' },
  { id: 'temp', label: 'Temperature' },
  { id: 'data', label: 'Data' },
  { id: 'time', label: 'Time' },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toFixed(6)).toString();
}

export const UnitConverterTool: React.FC = () => {
  const [cat, setCat] = useState<Category>('length');
  const [fromId, setFromId] = useState('cm');
  const [value, setValue] = useState('10');
  const [copied, setCopied] = useState<string | null>(null);

  const units = UNITS[cat];

  const results = useMemo(() => {
    const n = parseFloat(value);
    const from = units.find((u) => u.id === fromId) || units[0];
    if (!Number.isFinite(n)) return units.map((u) => ({ ...u, out: '—' }));
    const base = from.toBase(n);
    return units.map((u) => ({ ...u, out: fmt(u.fromBase(base)) }));
  }, [units, fromId, value]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit text-xs font-bold">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCat(c.id);
              setFromId(UNITS[c.id][0].id);
            }}
            className={`px-3 py-1.5 rounded-xl ${cat === c.id ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
          <label className="text-xs font-bold">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-lg font-extrabold"
          />
          <label className="text-xs font-bold">From unit</label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-2">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                navigator.clipboard.writeText(r.out);
                setCopied(r.id);
                setTimeout(() => setCopied(null), 1200);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-left"
            >
              <span className="text-xs font-semibold text-slate-500">{r.label}</span>
              <span className="text-sm font-extrabold flex items-center gap-2">
                {r.out}
                {copied === r.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
