import React, { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const UrlEncoderTool: React.FC = () => {
  const [input, setInput] = useState('https://all4.app/search?q=pdf to image');
  const [mode, setMode] = useState<'component' | 'full'>('component');
  const [action, setAction] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      const next =
        action === 'encode'
          ? mode === 'component'
            ? encodeURIComponent(input)
            : encodeURI(input)
          : mode === 'component'
            ? decodeURIComponent(input)
            : decodeURI(input);
      return { output: next, error: '' };
    } catch {
      return { output: '', error: 'Could not decode this string. It may be malformed.' };
    }
  }, [input, mode, action]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setAction('encode')}
          className={`px-4 py-2 rounded-xl ${action === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
        >
          Encode
        </button>
        <button
          onClick={() => setAction('decode')}
          className={`px-4 py-2 rounded-xl ${action === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
        >
          Decode
        </button>
        <button
          onClick={() => setMode('component')}
          className={`px-4 py-2 rounded-xl ${mode === 'component' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
        >
          URI component
        </button>
        <button
          onClick={() => setMode('full')}
          className={`px-4 py-2 rounded-xl ${mode === 'full' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}
        >
          Full URL
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200">
          <label className="text-xs font-bold block mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm"
          />
        </div>
        <div className="bg-white rounded-3xl p-5 border border-slate-200">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold">Output</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
            </button>
          </div>
          {error && <p className="text-xs text-rose-600 mb-2">{error}</p>}
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm break-all"
          />
        </div>
      </div>
    </div>
  );
};
