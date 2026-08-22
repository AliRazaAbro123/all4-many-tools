import React, { useState } from 'react';
import { Copy, Check, Fingerprint } from 'lucide-react';

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

async function digest(algo: Algo, data: ArrayBuffer): Promise<string> {
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const HashGeneratorTool: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('hello all4');
  const [fileName, setFileName] = useState('');
  const [hashes, setHashes] = useState<Record<Algo, string> | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const algos: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  const run = async (buffer: ArrayBuffer) => {
    setBusy(true);
    try {
      const next = {} as Record<Algo, string>;
      for (const algo of algos) {
        next[algo] = await digest(algo, buffer);
      }
      setHashes(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex gap-2 text-xs font-bold">
        <button
          onClick={() => setMode('text')}
          className={`px-4 py-2 rounded-xl ${mode === 'text' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
        >
          Hash text
        </button>
        <button
          onClick={() => setMode('file')}
          className={`px-4 py-2 rounded-xl ${mode === 'file' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
        >
          Hash file
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        {mode === 'text' ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm"
          />
        ) : (
          <label className="block border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setFileName(f.name);
                await run(await f.arrayBuffer());
              }}
            />
            <Fingerprint className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
            <p className="text-sm font-bold">{fileName || 'Choose any file to checksum'}</p>
          </label>
        )}

        {mode === 'text' && (
          <button
            onClick={() => {
              const bytes = new TextEncoder().encode(text);
              run(bytes.buffer as ArrayBuffer);
            }}
            disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold"
          >
            {busy ? 'Hashing…' : 'Generate hashes'}
          </button>
        )}
      </div>

      {hashes && (
        <div className="space-y-2">
          {algos.map((algo) => (
            <div key={algo} className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">{algo}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(hashes[algo]);
                    setCopied(algo);
                    setTimeout(() => setCopied(null), 1600);
                  }}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                >
                  {copied === algo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-[11px] code-font break-all text-slate-600">{hashes[algo]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
