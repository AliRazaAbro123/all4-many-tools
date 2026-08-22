import React, { useState } from 'react';
import { Copy, Check, Download, Dices } from 'lucide-react';

function cryptoInt(min: number, max: number): number {
  const span = max - min + 1;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return min + (buf[0] % span);
}

function cryptoFloat(min: number, max: number, decimals: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const t = buf[0] / 0xffffffff;
  const n = min + t * (max - min);
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

export const RandomNumberTool: React.FC = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [decimals, setDecimals] = useState(0);
  const [unique, setUnique] = useState(false);
  const [values, setValues] = useState<number[]>([42]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = Math.min(1000, Math.max(1, count));
    const out: number[] = [];

    if (decimals === 0 && unique) {
      const span = hi - lo + 1;
      const take = Math.min(n, span);
      const pool = Array.from({ length: span }, (_, i) => lo + i);
      for (let i = 0; i < take; i++) {
        const idx = cryptoInt(i, pool.length - 1);
        const tmp = pool[i];
        pool[i] = pool[idx];
        pool[idx] = tmp;
        out.push(pool[i]);
      }
    } else {
      for (let i = 0; i < n; i++) {
        out.push(decimals === 0 ? cryptoInt(lo, hi) : cryptoFloat(lo, hi, decimals));
      }
    }
    setValues(out);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold block mb-1">Minimum</label>
            <input type="number" value={min} onChange={(e) => setMin(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold" />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">Maximum</label>
            <input type="number" value={max} onChange={(e) => setMax(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">How many</label>
          <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold" />
        </div>
        <div>
          <label className="text-xs font-bold block mb-1">Decimal places ({decimals})</label>
          <input type="range" min={0} max={6} value={decimals} onChange={(e) => setDecimals(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} disabled={decimals > 0} className="accent-indigo-600" />
          Unique integers only
        </label>
        <button onClick={generate} className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2">
          <Dices className="w-4 h-4" /> Generate
        </button>
      </div>

      <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="flex justify-between">
          <span className="text-sm font-bold">{values.length} number{values.length === 1 ? '' : 's'}</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(values.join(', '));
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([values.join('\n')], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'all4-random-numbers.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-xs font-bold text-slate-600 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span key={`${v}-${i}`} className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-800 font-extrabold text-lg border border-indigo-100">
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
