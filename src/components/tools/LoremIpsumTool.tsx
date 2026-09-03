import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

function sentence(min = 6, max = 14): string {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const parts = Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  return `${parts.join(' ')}.`;
}

function paragraph(sentences = 4): string {
  return Array.from({ length: sentences }, () => sentence()).join(' ');
}

export const LoremIpsumTool: React.FC = () => {
  const [kind, setKind] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [amount, setAmount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const n = Math.min(50, Math.max(1, amount));
    let out = '';
    if (kind === 'paragraphs') {
      const paras = Array.from({ length: n }, () => paragraph(3 + Math.floor(Math.random() * 3)));
      if (classic) {
        paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0];
      }
      out = paras.join('\n\n');
    } else if (kind === 'sentences') {
      out = Array.from({ length: n }, () => sentence()).join(' ');
      if (classic) out = 'Lorem ipsum dolor sit amet. ' + out;
    } else {
      const words = Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
      if (classic) {
        words.splice(0, 0, 'Lorem', 'ipsum');
      }
      out = words.join(' ') + '.';
    }
    setText(out);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
          {(['paragraphs', 'sentences', 'words'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`py-2 rounded-lg capitalize ${kind === k ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              {k}
            </button>
          ))}
        </div>
        <div>
          <label className="text-xs font-bold block mb-1 text-black">Amount</label>
          <input
            type="number"
            min={1}
            max={50}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-black"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-black">
          <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} className="accent-indigo-600 text-black" />
          Start with “Lorem ipsum…”
        </label>
        <button onClick={generate} className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm">
          Generate dummy text
        </button>
      </div>

      <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-bold">Output</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'lorem-ipsum.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-xs font-bold text-slate-600 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          placeholder="Click generate to create placeholder copy"
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm leading-relaxed text-black"
        />
      </div>
    </div>
  );
};
