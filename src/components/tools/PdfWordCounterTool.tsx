import React, { useState, useRef } from 'react';
import { FileSearch, RefreshCw, Copy, Check } from 'lucide-react';
import { loadPdfDocument } from '../../utils/pdfHelpers';
import { formatBytes } from '../../utils/fileHelpers';
import { analyzeText } from '../../utils/textStats';

interface PageCount {
  page: number;
  words: number;
  chars: number;
  text: string;
}

export const PdfWordCounterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [fullText, setFullText] = useState('');
  const [pages, setPages] = useState<PageCount[]>([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processPdf = async (pdfFile: File) => {
    if (pdfFile.type !== 'application/pdf') return;
    setFile(pdfFile);
    setLoading(true);
    setProgress('Opening PDF...');
    setPages([]);
    setFullText('');

    try {
      const doc = await loadPdfDocument(pdfFile);
      const list: PageCount[] = [];
      let combined = '';

      for (let i = 1; i <= doc.numPages; i++) {
        setProgress(`Reading page ${i} of ${doc.numPages}...`);
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        const stats = analyzeText(text);
        list.push({ page: i, words: stats.words, chars: stats.chars, text });
        combined += (combined ? '\n\n' : '') + text;
      }

      setPages(list);
      setFullText(combined);
    } catch (err) {
      console.error(err);
      alert('Could not read this PDF. It may be scanned or password protected.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const stats = analyzeText(fullText);

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) processPdf(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white rounded-3xl p-12 text-center cursor-pointer"
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && processPdf(e.target.files[0])}
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <FileSearch className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Upload a PDF to count words</h3>
          <p className="text-sm text-slate-500">Text is extracted locally. Scanned image PDFs should use Image Word Counter.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-900">{file.name}</h4>
              <p className="text-xs text-slate-500">
                {formatBytes(file.size)} · {pages.length} pages
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPages([]);
                setFullText('');
              }}
              className="text-xs font-bold text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5"
            >
              Change PDF
            </button>
          </div>

          {loading && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-sm font-bold text-indigo-700 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> {progress}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Words', value: stats.words },
              { label: 'Characters', value: stats.chars },
              { label: 'Sentences', value: stats.sentences },
              { label: 'Read time', value: `${stats.readingMinutes} min` },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                <div className="text-2xl font-extrabold">{c.value}</div>
                <div className="text-[11px] font-bold uppercase text-slate-500 mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          {pages.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200">
              <h3 className="text-sm font-bold mb-3">Per-page breakdown</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {pages.map((p) => (
                  <div key={p.page} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                    <span className="font-bold">Page {p.page}</span>
                    <span className="text-slate-500">{p.words} words</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fullText && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">Extracted text</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(fullText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  }}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy all'}
                </button>
              </div>
              <textarea
                readOnly
                value={fullText}
                rows={10}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
