import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { loadImageFromFile, canvasToBlob, downloadFile, formatBytes, getCleanFileName } from '../../utils/fileHelpers';

export const ImageCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [quality, setQuality] = useState(70);

  const [compBlob, setCompBlob] = useState<Blob | null>(null);
  const [compSize, setCompSize] = useState<number>(0);
  const [compDataUrl, setCompDataUrl] = useState<string>('');

  const [comparePos, setComparePos] = useState(50); // Split slider %

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    try {
      const img = await loadImageFromFile(selectedFile);
      setImgElement(img);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!imgElement || !file) return;

    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mime = file.type;
    if (mime !== 'image/jpeg' && mime !== 'image/webp' && mime !== 'image/png') {
      mime = 'image/jpeg';
    }

    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(imgElement, 0, 0);

    canvasToBlob(canvas, mime, quality / 100).then((blob) => {
      setCompBlob(blob);
      setCompSize(blob.size);
      setCompDataUrl(canvas.toDataURL(mime, quality / 100));
    });
  }, [imgElement, file, quality]);

  const handleDownload = () => {
    if (!compBlob || !file) return;
    const cleanName = getCleanFileName(file.name);
    const ext = file.type.split('/')[1] || 'jpg';
    downloadFile(compBlob, `${cleanName}_compressed.${ext}`);
  };

  const origSize = file?.size || 0;
  const savedBytes = origSize - compSize;
  const savedPct = origSize > 0 ? Math.round((savedBytes / origSize) * 100) : 0;

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
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Upload Image to Compress
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Drag & drop PNG, JPG, or WebP to optimize file size with live split preview.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls Side Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Compressor Controls</h3>
              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Change Image
              </button>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Compression Quality</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{quality}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>Max Compression</span>
                <span>Best Quality</span>
              </div>
            </div>

            {/* Savings Overview Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Compression Results</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/20">
                <div>
                  <span className="opacity-80 block text-[10px]">Original</span>
                  <span className="font-bold">{formatBytes(origSize)}</span>
                </div>
                <div>
                  <span className="opacity-80 block text-[10px]">Compressed</span>
                  <span className="font-bold">{formatBytes(compSize)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs font-medium opacity-90">Size Saved:</span>
                <span className="text-lg font-extrabold text-emerald-300">
                  {savedPct > 0 ? `-${savedPct}%` : '0%'}
                </span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Compressed Image</span>
            </button>
          </div>

          {/* Interactive Split Comparison View */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400">
                Original ({formatBytes(origSize)})
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                Split Comparison Slider ({comparePos}%) <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                Compressed ({formatBytes(compSize)})
              </span>
            </div>

            {/* Visual Container */}
            <div className="relative flex-1 min-h-[380px] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 flex items-center justify-center select-none">
              {imgElement && compDataUrl && (
                <div className="relative w-full h-full max-h-[460px] flex items-center justify-center">
                  {/* Compressed Image (Background Base) */}
                  <img
                    src={compDataUrl}
                    alt="Compressed"
                    className="max-h-full max-w-full object-contain pointer-events-none"
                  />

                  {/* Original Image Overlay clipped by slider */}
                  <div
                    className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none"
                    style={{ clipPath: `polygon(0 0, ${comparePos}% 0, ${comparePos}% 100%, 0 100%)` }}
                  >
                    <img
                      src={imgElement.src}
                      alt="Original"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Split Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-xl pointer-events-none"
                    style={{ left: `${comparePos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-slate-800 font-bold text-[10px] flex items-center justify-center shadow-lg border border-slate-300">
                      ↔
                    </div>
                  </div>

                  {/* Split Control Slider Input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={comparePos}
                    onChange={(e) => setComparePos(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
                  />
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              Drag left or right across the image to inspect visual comparison.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
