import React, { useState, useRef } from 'react';
import { Download, Copy, Check, Sparkles } from 'lucide-react';
import { loadImageFromFile, canvasToBlob, downloadZip } from '../../utils/fileHelpers';

interface FaviconSize {
  size: number;
  label: string;
  blob?: Blob;
  dataUrl?: string;
}

const FAVICON_SIZES = [
  { size: 16, label: '16x16 (Browser Tab)' },
  { size: 32, label: '32x32 (Desktop Shortcut)' },
  { size: 48, label: '48x48 (Windows Site)' },
  { size: 180, label: '180x180 (Apple Touch Icon)' },
  { size: 192, label: '192x192 (Android PWA)' },
  { size: 512, label: '512x512 (Splash Screen)' },
];

export const FaviconGeneratorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [favicons, setFavicons] = useState<FaviconSize[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);

    try {
      const img = await loadImageFromFile(selectedFile);
      const generated: FaviconSize[] = [];

      for (const item of FAVICON_SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = item.size;
        canvas.height = item.size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, item.size, item.size);

          const blob = await canvasToBlob(canvas, 'image/png');
          generated.push({
            size: item.size,
            label: item.label,
            blob,
            dataUrl: canvas.toDataURL('image/png'),
          });
        }
      }

      setFavicons(generated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadZip = async () => {
    if (favicons.length === 0) return;

    const files = favicons
      .filter((f) => f.blob)
      .map((f) => ({
        name: f.size === 180 ? 'apple-touch-icon.png' : `favicon-${f.size}x${f.size}.png`,
        blob: f.blob!,
      }));

    await downloadZip(files, 'favicon_package.zip');
  };

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  const copyCode = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all hover:shadow-lg group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Upload Logo to Generate Favicon Suite
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Generates 16x16, 32x32, 48x48, Apple Touch 180x180, Android 192/512 icons in one ZIP.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Favicons Generated</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {favicons.length} favicon sizes ready to download
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFile(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500"
              >
                Change Logo
              </button>
              <button
                onClick={handleDownloadZip}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
              >
                <Download className="w-4 h-4" /> Download All Icons ZIP
              </button>
            </div>
          </div>

          {/* Favicon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {favicons.map((fav) => (
              <div
                key={fav.size}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-between"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center p-2 mb-2">
                  <img src={fav.dataUrl} alt={fav.label} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                    {fav.size}×{fav.size}
                  </span>
                  <span className="text-[10px] text-slate-500 block line-clamp-1">{fav.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* HTML Link Snippet */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                Copy HTML &lt;head&gt; Snippet
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied Snippet' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-xs code-font overflow-x-auto">
              {htmlSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
