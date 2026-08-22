import React, { useState } from 'react';
import { Download, Code2, Upload } from 'lucide-react';
import { canvasToBlob, downloadFile } from '../../utils/fileHelpers';

export const SvgConverterTool: React.FC = () => {
  const [svgCode, setSvgCode] = useState<string>(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
  );
  const [scale, setScale] = useState<number>(4); // 4x Retina HD
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [bgColor] = useState<string>('#FFFFFF');
  const [useTransparent, setUseTransparent] = useState(true);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) setSvgCode(text);
    };
    reader.readAsText(file);
  };

  const handleConvertDownload = () => {
    if (!svgCode.trim()) return;

    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      const w = (img.width || 512) * scale;
      const h = (img.height || 512) * scale;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!useTransparent || format === 'jpeg') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);

      const mime = `image/${format}`;
      const blob = await canvasToBlob(canvas, mime);
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      downloadFile(blob, `svg_export_${w}x${h}.${ext}`);
    };

    img.src = url;
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      {/* Controls & Code Panel */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" /> SVG Input Code
          </span>
          <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" /> Upload .svg File
            <input
              type="file"
              accept=".svg,image/svg+xml"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <textarea
          rows={8}
          value={svgCode}
          onChange={(e) => setSvgCode(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs code-font text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste <svg>...</svg> code here"
        ></textarea>

        {/* Raster Options */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Export Scale Multiplier
            </label>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
              {[1, 2, 4, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    scale === s ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {s}x {s === 4 ? 'HD' : s === 8 ? '8K' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="png">PNG (Transparent)</option>
              <option value="jpeg">JPG (Solid Background)</option>
            </select>
          </div>
        </div>

        {format === 'png' && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="transCheck"
              checked={useTransparent}
              onChange={(e) => setUseTransparent(e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            <label htmlFor="transCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Transparent Background
            </label>
          </div>
        )}

        <button
          onClick={handleConvertDownload}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Rasterize & Download Image</span>
        </button>
      </div>

      {/* Rendered Live Vector Preview */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <span className="font-bold text-slate-900 dark:text-white text-sm mb-3 block">
          SVG Vector Render Preview
        </span>

        <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-2xl p-6 flex items-center justify-center border border-slate-200/60 dark:border-slate-800 min-h-[300px]">
          <div
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md max-w-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          ></div>
        </div>
      </div>
    </div>
  );
};
