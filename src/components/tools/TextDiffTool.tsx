import React, { useMemo, useState } from 'react';

function tokenizeLines(text: string, ignoreWs: boolean): string[] {
  return text.split('\n').map((l) => (ignoreWs ? l.trim() : l));
}

type Mark = { type: 'same' | 'add' | 'del'; text: string };

function diffLines(a: string[], b: string[]): Mark[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: Mark[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ type: 'same', text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: 'del', text: a[i] });
      i++;
    } else {
      out.push({ type: 'add', text: b[j] });
      j++;
    }
  }
  while (i < n) {
    out.push({ type: 'del', text: a[i++] });
  }
  while (j < m) {
    out.push({ type: 'add', text: b[j++] });
  }
  return out;
}

export const TextDiffTool: React.FC = () => {
  const [left, setLeft] = useState('Welcome to all4.\nConvert PDF files for free.\nKeep your documents private.');
  const [right, setRight] = useState('Welcome to all4.\nConvert PDF and image files for free.\nKeep your documents private.\nNew tools added weekly.');
  const [ignoreWs, setIgnoreWs] = useState(false);

  const marks = useMemo(
    () => diffLines(tokenizeLines(left, ignoreWs), tokenizeLines(right, ignoreWs)),
    [left, right, ignoreWs]
  );

  const added = marks.filter((m) => m.type === 'add').length;
  const removed = marks.filter((m) => m.type === 'del').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200">
        <label className="text-xs font-semibold flex items-center gap-2">
          <input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} className="accent-indigo-600" />
          Ignore leading/trailing whitespace
        </label>
        <div className="flex gap-2 text-[11px] font-bold">
          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">+{added} added</span>
          <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700">-{removed} removed</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-slate-200">
          <label className="text-xs font-bold block mb-2">Original</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            rows={10}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm"
          />
        </div>
        <div className="bg-white rounded-3xl p-4 border border-slate-200">
          <label className="text-xs font-bold block mb-2">Changed</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            rows={10}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200">
        <h3 className="text-sm font-bold mb-3">Diff</h3>
        <div className="space-y-1 font-mono text-xs">
          {marks.map((m, idx) => (
            <div
              key={idx}
              className={`px-3 py-1.5 rounded-lg whitespace-pre-wrap ${
                m.type === 'add'
                  ? 'bg-emerald-50 text-emerald-800'
                  : m.type === 'del'
                    ? 'bg-rose-50 text-rose-800'
                    : 'bg-slate-50 text-slate-700'
              }`}
            >
              <span className="opacity-50 mr-2">{m.type === 'add' ? '+' : m.type === 'del' ? '−' : ' '}</span>
              {m.text || ' '}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
