import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Sliders } from 'lucide-react';
import { loadImageFromFile, canvasToBlob, downloadFile, getCleanFileName } from '../../utils/fileHelpers';

export const ImageFiltersTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Filters state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    try {
      const img = await loadImageFromFile(selectedFile);
      setImgElement(img);
      resetFilters();
    } catch (e) {
      console.error(e);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
    setInvert(0);
  };

  const applyPreset = (preset: 'cyberpunk' | 'vintage' | 'bw' | 'sepia') => {
    resetFilters();
    if (preset === 'cyberpunk') {
      setContrast(130);
      setSaturate(180);
      setHueRotate(310);
    } else if (preset === 'vintage') {
      setSepia(30);
      setContrast(90);
      setSaturate(120);
      setBrightness(105);
    } else if (preset === 'bw') {
      setGrayscale(100);
      setContrast(140);
    } else if (preset === 'sepia') {
      setSepia(80);
      setContrast(110);
    }
  };

  const cssFilterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg) invert(${invert}%)`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.filter = cssFilterString;
    ctx.drawImage(imgElement, 0, 0);
  }, [imgElement, cssFilterString]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;

    const blob = await canvasToBlob(canvas, 'image/png');
    downloadFile(blob, `${getCleanFileName(file.name)}_filtered.png`);
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
            Upload Image for Photo Adjustments
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Tune brightness, contrast, saturation, blur, sepia, grayscale, and cyberpunk filters.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Side Sliders */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" /> Filter Controls
              </span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Presets */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Quick Filter Presets
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => applyPreset('cyberpunk')}
                  className="py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                >
                  Cyberpunk Neon
                </button>
                <button
                  onClick={() => applyPreset('vintage')}
                  className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                >
                  Vintage Warm
                </button>
                <button
                  onClick={() => applyPreset('bw')}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  High B&W Contrast
                </button>
                <button
                  onClick={() => applyPreset('sepia')}
                  className="py-2 px-3 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                >
                  Sepia Memory
                </button>
              </div>
            </div>

            {/* Adjustment Sliders */}
            <div className="space-y-3 pt-2">
              {[
                { label: 'Brightness', val: brightness, set: setBrightness, min: 0, max: 200, unit: '%' },
                { label: 'Contrast', val: contrast, set: setContrast, min: 0, max: 200, unit: '%' },
                { label: 'Saturation', val: saturate, set: setSaturate, min: 0, max: 300, unit: '%' },
                { label: 'Grayscale', val: grayscale, set: setGrayscale, min: 0, max: 100, unit: '%' },
                { label: 'Sepia', val: sepia, set: setSepia, min: 0, max: 100, unit: '%' },
                { label: 'Blur Radius', val: blur, set: setBlur, min: 0, max: 20, unit: 'px' },
                { label: 'Hue Rotation', val: hueRotate, set: setHueRotate, min: 0, max: 360, unit: 'deg' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{s.label}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                      {s.val}{s.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={s.val}
                    onChange={(e) => s.set(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Edited Image</span>
            </button>
          </div>

          {/* Rendered Canvas Preview */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm mb-3 block">
              Realtime GPU Filter Canvas
            </span>

            <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center border border-slate-200/60 dark:border-slate-800 min-h-[380px]">
              <canvas
                ref={canvasRef}
                className="max-h-[440px] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
