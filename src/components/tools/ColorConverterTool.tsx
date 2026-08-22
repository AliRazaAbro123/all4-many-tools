import React, { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } | null {
  const h = hex.replace('#', '').trim();
  if (![3, 4, 6, 8].includes(h.length)) return null;
  const full =
    h.length <= 4
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b, a };
}

function rgbToHex(r: number, g: number, b: number, a = 1): string {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  const base = `#${to(r)}${to(g)}${to(b)}`;
  return a < 1 ? `${base}${to(a * 255)}` : base.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(max * 100) };
}

export const ColorConverterTool: React.FC = () => {
  const [hex, setHex] = useState('#6366F1');
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => hexToRgb(hex), [hex]);

  const formats = useMemo(() => {
    if (!parsed) return null;
    const { r, g, b, a } = parsed;
    const hsl = rgbToHsl(r, g, b);
    const hsv = rgbToHsv(r, g, b);
    return {
      hex: rgbToHex(r, g, b, a),
      rgb: a < 1 ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      css: `--color: ${rgbToHex(r, g, b, a)};`,
    };
  }, [parsed]);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
        <label className="text-xs font-bold">Pick or paste HEX</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={hex.slice(0, 7)}
            onChange={(e) => setHex(e.target.value.toUpperCase())}
            className="w-16 h-16 rounded-2xl border border-slate-200 cursor-pointer"
          />
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 font-mono font-bold"
          />
        </div>
        <div
          className="h-28 rounded-2xl border border-slate-200 shadow-inner"
          style={{ background: parsed ? `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})` : '#fff' }}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3 text-xs font-bold" style={{ background: '#fff', color: hex }}>
            On light
          </div>
          <div className="rounded-xl p-3 text-xs font-bold bg-slate-900" style={{ color: hex }}>
            On dark
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-2">
        {formats ? (
          Object.entries(formats).map(([label, val]) => (
            <button
              key={label}
              onClick={() => copy(val)}
              className="w-full bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-left"
            >
              <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
              <span className="text-sm font-mono font-bold flex items-center gap-2">
                {val}
                {copied === val ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-300" />}
              </span>
            </button>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-rose-200 text-rose-600 text-sm font-semibold">
            Enter a valid HEX color like #6366F1
          </div>
        )}
      </div>
    </div>
  );
};
