import React, { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';

type CaseKey =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'alternating';

function toWords(text: string): string[] {
  return text
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function convert(text: string, kind: CaseKey): string {
  const words = toWords(text);
  switch (kind) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    case 'sentence':
      return text
        .toLowerCase()
        .replace(/(^\s*[a-z])|([.!?]\s*[a-z])/g, (m) => m.toUpperCase());
    case 'camel':
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('');
    case 'pascal':
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake':
      return words.map((w) => w.toLowerCase()).join('_');
    case 'kebab':
      return words.map((w) => w.toLowerCase()).join('-');
    case 'alternating':
      return text
        .split('')
        .map((ch, i) => (i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase()))
        .join('');
    default:
      return text;
  }
}

const OPTIONS: { key: CaseKey; label: string }[] = [
  { key: 'upper', label: 'UPPER CASE' },
  { key: 'lower', label: 'lower case' },
  { key: 'title', label: 'Title Case' },
  { key: 'sentence', label: 'Sentence case' },
  { key: 'camel', label: 'camelCase' },
  { key: 'pascal', label: 'PascalCase' },
  { key: 'snake', label: 'snake_case' },
  { key: 'kebab', label: 'kebab-case' },
  { key: 'alternating', label: 'aLtErNaTiNg' },
];

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('Convert this heading into any case with all4');
  const [active, setActive] = useState<CaseKey>('title');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => convert(text, active), [text, active]);

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold">Choose a style</h3>
        <div className="grid grid-cols-2 gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActive(opt.key)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                active === opt.key
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200">
          <label className="text-xs font-bold text-slate-700 block mb-2">Input</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm"
          />
        </div>
        <div className="bg-white rounded-3xl p-5 border border-slate-200">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">Result</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
            </button>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold min-h-[120px] whitespace-pre-wrap">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
};
