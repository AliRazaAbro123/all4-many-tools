import React, { useState } from 'react';
import { Check, Copy, Download, Braces } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState('{"name":"all4","tools":["pdf","image","password"],"free":true}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = (pretty: boolean) => {
    try {
      const parsed = JSON.parse(input);
      const next = pretty ? JSON.stringify(parsed, null, indent) : JSON.stringify(parsed);
      setOutput(next);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <Braces className="w-4 h-4 text-indigo-500" /> Indent
        </span>
        {[2, 4].map((n) => (
          <button
            key={n}
            onClick={() => setIndent(n)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${indent === n ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
          >
            {n} spaces
          </button>
        ))}
        <button onClick={() => format(true)} className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold">
          Beautify
        </button>
        <button onClick={() => format(false)} className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold">
          Minify
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-slate-200">
          <label className="text-xs font-bold text-slate-700 block mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs code-font"
          />
        </div>
        <div className="bg-white rounded-3xl p-4 border border-slate-200">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">Output</label>
            {output && (
              <div className="flex gap-2">
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
                <button
                  onClick={() => {
                    const blob = new Blob([output], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'formatted.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-xs font-bold text-slate-600 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-xs text-rose-600 font-semibold mb-2">{error}</p>}
          <textarea
            readOnly
            value={output}
            rows={16}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs code-font"
          />
        </div>
      </div>
    </div>
  );
};
