import React, { useState } from 'react';
import { Upload, Copy, Check, Download, Binary } from 'lucide-react';
import { downloadFile } from '../../utils/fileHelpers';

export const Base64ImageTool: React.FC = () => {
  const [tab, setMode] = useState<'encode' | 'decode'>('encode');
  const [file, setFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Decode states
  const [inputBase64, setInputBase64] = useState('');

  const handleFileUpload = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) setBase64String(res);
    };
    reader.readAsDataURL(f);
  };

  const copySnippet = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadDecoded = () => {
    if (!inputBase64.trim()) return;
    try {
      const parts = inputBase64.split(';base64,');
      const contentType = parts[0].replace('data:', '') || 'image/png';
      const raw = window.atob(parts[1] || parts[0]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      const ext = contentType.split('/')[1] || 'png';
      downloadFile(blob, `decoded_image.${ext}`);
    } catch (e) {
      alert('Invalid Base64 string format.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switch Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 w-fit font-bold text-xs">
        <button
          onClick={() => setMode('encode')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            tab === 'encode' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Image to Base64 (Encoder)
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            tab === 'decode' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          Base64 to Image (Decoder)
        </button>
      </div>

      {tab === 'encode' ? (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">Upload Image</span>
            <div
              onClick={() => document.getElementById('base64Input')?.click()}
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <input
                id="base64Input"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Click to select image file
              </p>
            </div>

            {file && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
                {file.name} ({Math.round(base64String.length / 1024)} KB encoded string)
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">Base64 Snippets</span>

            {base64String ? (
              <div className="space-y-3">
                {[
                  {
                    type: 'raw',
                    label: 'Raw Data URI String',
                    code: base64String,
                  },
                  {
                    type: 'html',
                    label: 'HTML <img> Tag',
                    code: `<img src="${base64String}" alt="Base64 Image" />`,
                  },
                  {
                    type: 'css',
                    label: 'CSS Background Property',
                    code: `background-image: url('${base64String}');`,
                  },
                ].map((s) => (
                  <div key={s.type} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.label}</span>
                      <button
                        onClick={() => copySnippet(s.code, s.type)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                      >
                        {copiedType === s.type ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedType === s.type ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] code-font text-slate-600 dark:text-slate-400 truncate">
                      {s.code.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400">
                Upload an image on the left to generate Base64 strings
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Binary className="w-4 h-4 text-indigo-500" /> Paste Base64 Data String
          </span>

          <textarea
            rows={6}
            value={inputBase64}
            onChange={(e) => setInputBase64(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs code-font focus:outline-none"
            placeholder="Paste data:image/png;base64,iVBORw0KG..."
          ></textarea>

          <button
            onClick={handleDownloadDecoded}
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Decoded Image File
          </button>
        </div>
      )}
    </div>
  );
};
