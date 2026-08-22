import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Lock,
  Unlock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { loadImageFromFile, canvasToBlob, downloadFile, formatBytes, getCleanFileName } from '../../utils/fileHelpers';

export const ImageResizerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [scalePercent, setScalePercent] = useState(100);

  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(90);

  const [estSize, setEstSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    try {
      const img = await loadImageFromFile(selectedFile);
      setImgElement(img);
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      setScalePercent(100);
    } catch (e) {
      console.error(e);
    }
  };

  // Update canvas & estimate blob size whenever width, height, format, or quality changes
  useEffect(() => {
    if (!imgElement || width <= 0 || height <= 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgElement, 0, 0, width, height);

    const mime = `image/${format}`;
    canvasToBlob(canvas, mime, quality / 100).then((blob) => {
      setEstSize(blob.size);
    });
  }, [imgElement, width, height, format, quality]);

  const handleWidthChange = (val: number) => {
    const newW = Math.max(1, val);
    setWidth(newW);
    if (lockRatio && origWidth > 0) {
      const ratio = origHeight / origWidth;
      setHeight(Math.round(newW * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    const newH = Math.max(1, val);
    setHeight(newH);
    if (lockRatio && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setWidth(Math.round(newH * ratio));
    }
  };

  const handlePercentChange = (pct: number) => {
    setScalePercent(pct);
    if (origWidth > 0 && origHeight > 0) {
      const newW = Math.round((origWidth * pct) / 100);
      const newH = Math.round((origHeight * pct) / 100);
      setWidth(newW);
      setHeight(newH);
    }
  };

  const applyPreset = (presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    setLockRatio(false);
  };

  const handleDownload = async () => {
    if (!imgElement || width <= 0 || height <= 0 || !file) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgElement, 0, 0, width, height);

    const mime = `image/${format}`;
    const blob = await canvasToBlob(canvas, mime, quality / 100);
    const ext = format === 'jpeg' ? 'jpg' : format;
    const cleanName = getCleanFileName(file.name);
    downloadFile(blob, `${cleanName}_${width}x${height}.${ext}`);
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
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Upload Image to Resize
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            PNG, JPG, WebP, SVG, BMP supported. Resize by dimensions or scaling percentage.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls Side Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Resize Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Original: {origWidth} × {origHeight} px ({formatBytes(file.size)})
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setImgElement(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Change Image
              </button>
            </div>

            {/* Scale % Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Scale Percentage</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{scalePercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={scalePercent}
                onChange={(e) => handlePercentChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between gap-2 mt-2">
                {[25, 50, 75, 100, 150].map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePercentChange(p)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                      scalePercent === p
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Pixel Inputs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Exact Dimensions (px)
                </span>
                <button
                  onClick={() => setLockRatio(!lockRatio)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg border ${
                    lockRatio
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lockRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{lockRatio ? 'Ratio Locked' : 'Ratio Unlocked'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1 block">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1 block">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Popular Aspect Presets
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => applyPreset(1920, 1080)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left"
                >
                  <span className="font-bold block text-slate-900 dark:text-white">1080p Full HD</span>
                  <span className="text-[10px] text-slate-500">1920 × 1080 px</span>
                </button>
                <button
                  onClick={() => applyPreset(1280, 720)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left"
                >
                  <span className="font-bold block text-slate-900 dark:text-white">720p HD</span>
                  <span className="text-[10px] text-slate-500">1280 × 720 px</span>
                </button>
                <button
                  onClick={() => applyPreset(1080, 1080)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left"
                >
                  <span className="font-bold block text-slate-900 dark:text-white">Instagram Post</span>
                  <span className="text-[10px] text-slate-500">1080 × 1080 px</span>
                </button>
                <button
                  onClick={() => applyPreset(512, 512)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left"
                >
                  <span className="font-bold block text-slate-900 dark:text-white">Avatar Icon</span>
                  <span className="text-[10px] text-slate-500">512 × 512 px</span>
                </button>
              </div>
            </div>

            {/* Output Format & Quality */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Export Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Quality ({quality}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    disabled={format === 'png'}
                    className="w-full accent-indigo-600 cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Estimated size badge */}
              {estSize && (
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Est. File Size:
                  </span>
                  <span>{formatBytes(estSize)}</span>
                </div>
              )}

              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download Resized Image</span>
              </button>
            </div>
          </div>

          {/* Canvas Live Visual Preview */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Live Preview
              </span>
              <button
                onClick={() => {
                  setWidth(origWidth);
                  setHeight(origHeight);
                  setScalePercent(100);
                  setLockRatio(true);
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Original
              </button>
            </div>

            <div className="flex-1 min-h-[350px] bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center overflow-auto border border-slate-200/60 dark:border-slate-800">
              {imgElement && (
                <img
                  src={imgElement.src}
                  alt="Resized preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '450px',
                    objectFit: 'contain',
                  }}
                  className="rounded-lg shadow-md"
                />
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center font-medium">
              <span>Target output: {width} × {height} pixels</span>
              <span>Aspect ratio: {(width / (height || 1)).toFixed(2)}:1</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
