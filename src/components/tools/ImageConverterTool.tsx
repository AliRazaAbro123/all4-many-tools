import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Archive,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { loadImageFromFile, canvasToBlob, downloadFile, downloadZip, formatBytes, getCleanFileName } from '../../utils/fileHelpers';

interface BatchItem {
  id: string;
  file: File;
  imgElement: HTMLImageElement;
  convertedBlob?: Blob;
  convertedSize?: number;
}

export const ImageConverterTool: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('webp');
  const [quality, setQuality] = useState(85);
  const [converting, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const list: BatchItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('image/')) {
        try {
          const img = await loadImageFromFile(f);
          list.push({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
            imgElement: img,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    const updated = [...items, ...list];
    setItems(updated);
    processConversion(updated, targetFormat, quality);
  };

  const processConversion = async (
    itemList: BatchItem[],
    fmt: 'png' | 'jpeg' | 'webp',
    q: number
  ) => {
    setLoading(true);
    const mime = `image/${fmt}`;
    const nextList = await Promise.all(
      itemList.map(async (item) => {
        const canvas = document.createElement('canvas');
        canvas.width = item.imgElement.width;
        canvas.height = item.imgElement.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return item;

        if (fmt === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(item.imgElement, 0, 0);
        const blob = await canvasToBlob(canvas, mime, q / 100);
        return {
          ...item,
          convertedBlob: blob,
          convertedSize: blob.size,
        };
      })
    );

    setItems(nextList);
    setLoading(false);
  };

  const handleFormatChange = (fmt: 'png' | 'jpeg' | 'webp') => {
    setTargetFormat(fmt);
    if (items.length > 0) {
      processConversion(items, fmt, quality);
    }
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (items.length > 0) {
      processConversion(items, targetFormat, q);
    }
  };

  const removeItem = (id: string) => {
    const remaining = items.filter((it) => it.id !== id);
    setItems(remaining);
  };

  const downloadSingle = (item: BatchItem) => {
    if (!item.convertedBlob) return;
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const cleanName = getCleanFileName(item.file.name);
    downloadFile(item.convertedBlob, `${cleanName}.${ext}`);
  };

  const downloadAllZip = async () => {
    if (items.length === 0) return;
    const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;

    const fileBlobs = items
      .filter((it) => it.convertedBlob)
      .map((it) => ({
        name: `${getCleanFileName(it.file.name)}.${ext}`,
        blob: it.convertedBlob!,
      }));

    await downloadZip(fileBlobs, `converted_images_${targetFormat}.zip`);
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all hover:shadow-lg group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Select or Drop Batch Images to Convert
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Convert PNG, JPG, WebP, GIF, or BMP into modern compressed web formats
        </p>
      </div>

      {items.length > 0 && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Format
                </label>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  {(['webp', 'png', 'jpeg'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormatChange(fmt)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        targetFormat === fmt
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {fmt === 'jpeg' ? 'JPG' : fmt}
                    </button>
                  ))}
                </div>
              </div>

              {targetFormat !== 'png' && (
                <div className="flex-1 sm:w-48">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Quality</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add More
              </button>
              <button
                onClick={downloadAllZip}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
              >
                <Archive className="w-4 h-4" />
                <span>Download All ZIP</span>
              </button>
            </div>
          </div>

          {converting && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Converting batch images...
            </div>
          )}

          {/* Table / Cards List */}
          <div className="grid gap-3">
            {items.map((it) => {
              const origSize = it.file.size;
              const newSize = it.convertedSize || 0;
              const diffPct =
                origSize > 0 && newSize > 0
                  ? Math.round(((origSize - newSize) / origSize) * 100)
                  : 0;

              return (
                <div
                  key={it.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={it.imgElement.src}
                      alt={it.file.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {it.file.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{formatBytes(origSize)}</span>
                        <span>→</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {newSize ? formatBytes(newSize) : '...'}
                        </span>
                        {diffPct !== 0 && (
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                              diffPct > 0
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {diffPct > 0 ? `-${diffPct}%` : `+${Math.abs(diffPct)}%`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => downloadSingle(it)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
