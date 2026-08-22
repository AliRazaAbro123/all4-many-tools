import React, { useMemo, useState } from 'react';
import { Copy, Check, RefreshCw, Download, Shield } from 'lucide-react';

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const NUMS = '23456789';
const SYMBOLS = '!@#$%^&*_-+=?';
const SIMILAR_UPPER = 'IO';
const SIMILAR_LOWER = 'lo';
const SIMILAR_NUMS = '01';

function secureRandom(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function buildCharset(opts: {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}): string {
  let set = '';
  if (opts.upper) set += UPPER + (opts.excludeSimilar ? '' : SIMILAR_UPPER);
  if (opts.lower) set += LOWER + (opts.excludeSimilar ? '' : SIMILAR_LOWER);
  if (opts.numbers) set += NUMS + (opts.excludeSimilar ? '' : SIMILAR_NUMS);
  if (opts.symbols) set += SYMBOLS;
  return set;
}

function generateOne(length: number, charset: string): string {
  if (!charset) return '';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += charset[secureRandom(charset.length)];
  }
  return out;
}

function scorePassword(pw: string): { label: string; color: string; pct: number } {
  let score = 0;
  if (pw.length >= 8) score += 20;
  if (pw.length >= 12) score += 20;
  if (pw.length >= 16) score += 15;
  if (/[a-z]/.test(pw)) score += 10;
  if (/[A-Z]/.test(pw)) score += 10;
  if (/[0-9]/.test(pw)) score += 10;
  if (/[^A-Za-z0-9]/.test(pw)) score += 15;
  score = Math.min(100, score);
  if (score >= 80) return { label: 'Very strong', color: 'bg-emerald-500', pct: score };
  if (score >= 60) return { label: 'Strong', color: 'bg-indigo-500', pct: score };
  if (score >= 40) return { label: 'Fair', color: 'bg-amber-500', pct: score };
  return { label: 'Weak', color: 'bg-rose-500', pct: score };
}

export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>(() => {
    const set = buildCharset({ upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: true });
    return [generateOne(16, set)];
  });
  const [copied, setCopied] = useState<string | null>(null);

  const charset = useMemo(
    () => buildCharset({ upper, lower, numbers, symbols, excludeSimilar }),
    [upper, lower, numbers, symbols, excludeSimilar]
  );

  const regenerate = () => {
    const list = Array.from({ length: Math.min(50, Math.max(1, count)) }, () =>
      generateOne(length, charset)
    );
    setPasswords(list);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1600);
  };

  const downloadList = () => {
    const blob = new Blob([passwords.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all4-passwords.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const primary = passwords[0] || '';
  const strength = scorePassword(primary);

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" /> Options
          </h3>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Length</span>
            <span className="text-indigo-600">{length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          {[
            { label: 'Uppercase (A-Z)', val: upper, set: setUpper },
            { label: 'Lowercase (a-z)', val: lower, set: setLower },
            { label: 'Numbers (0-9)', val: numbers, set: setNumbers },
            { label: 'Symbols (!@#)', val: symbols, set: setSymbols },
          ].map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={opt.val}
                onChange={(e) => opt.set(e.target.checked)}
                className="accent-indigo-600"
              />
              {opt.label}
            </label>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="accent-indigo-600"
          />
          Exclude similar characters (0/O, 1/l/I)
        </label>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">How many passwords</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
          />
        </div>

        <button
          onClick={regenerate}
          disabled={!charset}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" /> Generate
        </button>
      </div>

      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-lg sm:text-xl font-bold text-slate-900 break-all leading-relaxed">
              {primary || 'Select at least one character set'}
            </p>
            <button
              onClick={() => primary && copy(primary)}
              className="shrink-0 p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600"
            >
              {copied === primary ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-bold mb-1">
              <span className="text-slate-500">Strength</span>
              <span className="text-slate-800">{strength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className={`h-full ${strength.color}`} style={{ width: `${strength.pct}%` }} />
            </div>
          </div>
        </div>

        {passwords.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{passwords.length} passwords</span>
              <button
                onClick={downloadList}
                className="text-xs font-bold text-indigo-600 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download list
              </button>
            </div>
            {passwords.map((pw) => (
              <button
                key={pw + Math.random()}
                onClick={() => copy(pw)}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs flex items-center justify-between hover:border-indigo-300"
              >
                <span className="truncate">{pw}</span>
                {copied === pw ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
