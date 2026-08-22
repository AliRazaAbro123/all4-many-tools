import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';
import { downloadFile } from '../../utils/fileHelpers';

type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone';

export const QrCodeGeneratorTool: React.FC = () => {
  const [kind, setKind] = useState<QrType>('url');
  const [value, setValue] = useState('https://all4.app');
  const [ssid, setSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState('WPA');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [size, setSize] = useState(320);
  const [dark, setDark] = useState('#0f172a');
  const [light, setLight] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dataUrl, setDataUrl] = useState('');

  const payload = (() => {
    if (kind === 'wifi') return `WIFI:T:${wifiEnc};S:${ssid};P:${wifiPass};;`;
    if (kind === 'email') return `mailto:${email}`;
    if (kind === 'phone') return `tel:${phone}`;
    return value;
  })();

  useEffect(() => {
    if (!payload.trim()) {
      setDataUrl('');
      return;
    }
    QRCode.toDataURL(payload, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark, light },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [payload, size, dark, light, level]);

  const download = async () => {
    if (!dataUrl) return;
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    downloadFile(blob, 'all4-qr-code.png');
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 space-y-5">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          {(['url', 'text', 'wifi', 'email', 'phone'] as QrType[]).map((t) => (
            <button
              key={t}
              onClick={() => setKind(t)}
              className={`px-3 py-1.5 rounded-lg capitalize ${kind === t ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              {t === 'wifi' ? 'Wi‑Fi' : t}
            </button>
          ))}
        </div>

        {kind === 'wifi' ? (
          <div className="space-y-3">
            <input
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="Network name (SSID)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
            />
            <input
              value={wifiPass}
              onChange={(e) => setWifiPass(e.target.value)}
              placeholder="Wi‑Fi password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
            />
            <select
              value={wifiEnc}
              onChange={(e) => setWifiEnc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Open (no password)</option>
            </select>
          </div>
        ) : kind === 'email' ? (
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
          />
        ) : kind === 'phone' ? (
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 0100"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            placeholder={kind === 'url' ? 'https://' : 'Any text'}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Size ({size}px)</label>
            <input type="range" min={160} max={1024} step={16} value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Error correction</label>
            <select value={level} onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold">
              <option value="L">L — 7%</option>
              <option value="M">M — 15%</option>
              <option value="Q">Q — 25%</option>
              <option value="H">H — 30%</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Dots</label>
            <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="w-full h-10 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Background</label>
            <input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="w-full h-10 rounded-xl border border-slate-200" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 flex flex-col items-center justify-center gap-4">
        {dataUrl ? (
          <img src={dataUrl} alt="Generated QR code" className="w-64 h-64 rounded-2xl border border-slate-200 bg-white" />
        ) : (
          <div className="w-64 h-64 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
            <QrCode className="w-10 h-10" />
          </div>
        )}
        <button
          onClick={download}
          disabled={!dataUrl}
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Download PNG
        </button>
      </div>
    </div>
  );
};
