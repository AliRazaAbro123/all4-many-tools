import React, { useRef, useState } from 'react';
import { ScanText, RefreshCw, Copy, Check, Download } from 'lucide-react';
import { analyzeText } from '../../utils/textStats';

declare global {
  interface Window {
    Tesseract?: {
      recognize: (
        image: File | string,
        lang: string,
        opts?: { logger?: (m: { status: string; progress: number }) => void }
      ) => Promise<{ data: { text: string } }>;
    };
  }
}

async function loadTesseract() {
  if (window.Tesseract) return window.Tesseract;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-all4-tesseract]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.async = true;
    script.dataset.all4Tesseract = '1';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load OCR engine'));
    document.head.appendChild(script);
  });
  if (!window.Tesseract) throw new Error('OCR engine unavailable');
  return window.Tesseract;
}

export const ImageWordCounterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runOcr = async (imgFile: File) => {
    if (!imgFile.type.startsWith('image/')) return;
    setFile(imgFile);
    setPreview(URL.createObjectURL(imgFile));
    setText('');
    setLoading(true);
    setProgress('Loading OCR engine...');

    try {
      const Tesseract = await loadTesseract();
      const result = await Tesseract.recognize(imgFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(`Reading text… ${Math.round(m.progress * 100)}%`);
          } else {
            setProgress(m.status.replace(/_/g, ' '));
          }
        },
      });
      setText(result.data.text.trim());
    } catch (err) {
      console.error(err);
      alert('Could not read text from this image. Try a clearer photo.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const stats = analyzeText(text);

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) runOcr(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white rounded-3xl p-12 text-center cursor-pointer"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && runOcr(e.target.files[0])}
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <ScanText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Upload a picture to count words</h3>
          <p className="text-sm text-slate-500">Screenshots, posters, slides, and scanned pages work best.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">Image</h3>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview('');
                  setText('');
                }}
                className="text-xs font-bold text-slate-500"
              >
                Change image
              </button>
            </div>
            {preview && (
              <img src={preview} alt="OCR source" className="w-full rounded-2xl border border-slate-200 max-h-80 object-contain bg-slate-50" />
            )}
            {loading && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> {progress}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Words', value: stats.words },
                { label: 'Characters', value: stats.chars },
                { label: 'Lines', value: stats.lines },
                { label: 'Read time', value: `${stats.readingMinutes} min` },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-3 text-center">
                  <div className="text-xl font-extrabold">{c.value}</div>
                  <div className="text-[10px] font-bold uppercase text-slate-500">{c.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
              <div className="flex justify-between">
                <h3 className="text-sm font-bold">Extracted text (editable)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1600);
                    }}
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'all4-ocr-text.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-xs font-bold text-slate-600 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> .txt
                  </button>
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm"
                placeholder={loading ? 'Reading image…' : 'No text detected yet'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
