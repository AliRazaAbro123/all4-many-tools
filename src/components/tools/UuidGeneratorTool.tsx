import React, { useState } from 'react';
import { Copy, Check, Download, RefreshCw } from 'lucide-react';

function makeUuid(upper: boolean, noHyphen: boolean): string {
  let id: string = crypto.randomUUID();
  if (upper) id = id.toUpperCase();
  if (noHyphen) id = id.replace(/-/g, '');
  return id;
}

export const UuidGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [noHyphen, setNoHyphen] = useState(false);
  const [ids, setIds] = useState<string[]>(() => Array.from({ length: 5 }, () => makeUuid(false, false)));
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const n = Math.min(500, Math.max(1, count));
    setIds(Array.from({ length: n }, () => makeUuid(upper, noHyphen)));
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <div>
          <label className="text-xs font-bold block mb-1">How many (1–500)</label>
          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="accent-indigo-600" />
          Uppercase
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold">
          <input type="checkbox" checked={noHyphen} onChange={(e) => setNoHyphen(e.target.checked)} className="accent-indigo-600" />
          Remove hyphens
        </label>
        <button
          onClick={generate}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Generate UUID v4
        </button>
      </div>

      <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-bold">{ids.length} identifiers</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(ids.join('\n'));
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy all
            </button>
            <button
              onClick={() => {
                const blob = new Blob([ids.join('\n')], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'all4-uuids.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-xs font-bold text-slate-600 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
        <div className="space-y-1.5 max-h-[420px] overflow-auto">
          {ids.map((id) => (
            <div key={id} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
              {id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
