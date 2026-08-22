import React, { useState, useRef } from 'react';
import {
  Upload,
  Copy,
  Check,
  Pipette,
  Palette,
  Code,
} from 'lucide-react';
import { loadImageFromFile } from '../../utils/fileHelpers';

interface ExtractedColor {
  hex: string;
  rgb: string;
  hsl: string;
}

export const ColorPickerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [pickedColor, setPickedColor] = useState<ExtractedColor>({
    hex: '#6366F1',
    rgb: 'rgb(99, 102, 241)',
    hsl: 'hsl(239, 84%, 67%)',
  });
  const [palette, setPalette] = useState<ExtractedColor[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    try {
      const img = await loadImageFromFile(selectedFile);
      setImgElement(img);
      extractPalette(img);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1).toUpperCase()}`;
    const rgb = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
    const hsl = rgbToHsl(p[0], p[1], p[2]);

    setPickedColor({ hex, rgb, hsl });
  };

  const extractPalette = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, 100, 100);
    const imgData = ctx.getImageData(0, 0, 100, 100).data;

    const colorCounts: { [hex: string]: number } = {};
    for (let i = 0; i < imgData.length; i += 16) {
      const r = Math.round(imgData[i] / 16) * 16;
      const g = Math.round(imgData[i + 1] / 16) * 16;
      const b = Math.round(imgData[i + 2] / 16) * 16;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }

    const sortedHexes = Object.keys(colorCounts)
      .sort((a, b) => colorCounts[b] - colorCounts[a])
      .slice(0, 6);

    const extracted = sortedHexes.map((hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return {
        hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: rgbToHsl(r, g, b),
      };
    });

    setPalette(extracted);
    if (extracted[0]) setPickedColor(extracted[0]);
  };

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
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
            Upload Image to Extract Colors
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Click anywhere on the image to inspect pixel HEX/RGB codes and generate dominant palettes.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Active Picked Color & Palette Side Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Pipette className="w-4 h-4 text-indigo-500" /> Selected Color
                </span>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Change Image
                </button>
              </div>

              {/* Color Swatch Display */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl shadow-inner border border-slate-200/80 dark:border-slate-700 shrink-0"
                  style={{ backgroundColor: pickedColor.hex }}
                ></div>
                <div>
                  <h4 className="font-extrabold text-2xl text-slate-900 dark:text-white code-font">
                    {pickedColor.hex}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {pickedColor.rgb}
                  </p>
                </div>
              </div>

              {/* Copy Code Buttons */}
              <div className="grid gap-2 pt-2">
                {[
                  { label: 'HEX Code', val: pickedColor.hex },
                  { label: 'RGB Code', val: pickedColor.rgb },
                  { label: 'HSL Code', val: pickedColor.hsl },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => copyToClipboard(item.val)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}:</span>
                    <span className="code-font font-bold">{item.val}</span>
                    {copiedHex === item.val ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dominant Palette Box */}
            {palette.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-500" /> Extracted Dominant Palette
                </span>

                <div className="grid grid-cols-6 gap-2 h-16">
                  {palette.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPickedColor(col)}
                      className="h-full rounded-xl shadow-xs transition-transform hover:scale-105 border border-slate-200/50"
                      style={{ backgroundColor: col.hex }}
                      title={`Select ${col.hex}`}
                    ></button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const cssVars = palette
                      .map((c, i) => `--color-${i + 1}: ${c.hex};`)
                      .join('\n');
                    copyToClipboard(cssVars);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Code className="w-4 h-4" /> Copy Palette CSS Variables
                </button>
              </div>
            )}
          </div>

          {/* Interactive Eyedropper Canvas */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm mb-3 block">
              Click anywhere on image to pick color
            </span>

            <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center overflow-auto border border-slate-200/60 dark:border-slate-800 min-h-[350px]">
              {imgElement && (
                <canvas
                  ref={(node) => {
                    if (node && imgElement) {
                      (canvasRef as any).current = node;
                      node.width = imgElement.width;
                      node.height = imgElement.height;
                      const ctx = node.getContext('2d');
                      ctx?.drawImage(imgElement, 0, 0);
                    }
                  }}
                  onClick={handleCanvasClick}
                  className="max-h-[420px] max-w-full object-contain cursor-crosshair rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
