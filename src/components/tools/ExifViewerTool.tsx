import React, { useState, useRef } from 'react';
import { Info, ShieldCheck } from 'lucide-react';
import { loadImageFromFile, canvasToBlob, downloadFile, formatBytes, getCleanFileName } from '../../utils/fileHelpers';

interface MetadataInfo {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: string;
  lastModified: string;
}

export const ExifViewerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<MetadataInfo | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);

    try {
      const img = await loadImageFromFile(f);
      setImgElement(img);

      const ratio = (img.width / (img.height || 1)).toFixed(2);
      setMeta({
        name: f.name,
        size: f.size,
        type: f.type,
        width: img.width,
        height: img.height,
        aspectRatio: `${ratio}:1`,
        lastModified: new Date(f.lastModified).toLocaleString(),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const stripMetadataDownload = async () => {
    if (!imgElement || !file) return;

    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(imgElement, 0, 0);

    // canvas.toBlob creates a brand new image payload with 0 EXIF metadata
    const blob = await canvasToBlob(canvas, file.type || 'image/jpeg');
    downloadFile(blob, `${getCleanFileName(file.name)}_clean.${file.name.split('.').pop()}`);
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
            <Info className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Upload Image to Inspect & Strip Metadata
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Inspect resolution, dates, payload info, and scrub EXIF data for online privacy.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Image Technical Details</span>
              <button
                onClick={() => setFile(null)}
                className="text-xs font-semibold text-slate-500"
              >
                Change Image
              </button>
            </div>

            {meta && (
              <div className="space-y-2 text-xs">
                {[
                  { label: 'File Name', val: meta.name },
                  { label: 'File Size', val: formatBytes(meta.size) },
                  { label: 'MIME Type', val: meta.type },
                  { label: 'Dimensions', val: `${meta.width} × ${meta.height} px` },
                  { label: 'Aspect Ratio', val: meta.aspectRatio },
                  { label: 'Last Modified', val: meta.lastModified },
                ].map((row) => (
                  <div key={row.label} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{row.label}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{row.val}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={stripMetadataDownload}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all mt-4"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Strip EXIF & Download Clean Image</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            {imgElement && (
              <img src={imgElement.src} alt="Preview" className="max-h-[380px] max-w-full object-contain rounded-xl shadow-md" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
