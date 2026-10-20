import { useState, useRef, useCallback } from 'react';
import {
  Sparkles,
  UploadCloud,
  Download,
  ChevronDown,
  CheckCircle2,
  ImageIcon,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export default function ImageUpscalerAITool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(4);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File | null) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setOutputUrl(null);
    setPreview(URL.createObjectURL(f));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFile(e.dataTransfer.files?.[0] ?? null);
    },
    [handleFile]
  );

  const onSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0] ?? null);
    },
    [handleFile]
  );

  const runUpscale = () => {
    if (!file || processing) return;
    setProcessing(true);
    // DEMO: Replace with real AI engine / canvas upscale
    setTimeout(() => {
      // For demo: just show original at larger canvas scale as result
      const url = preview ? preview : URL.createObjectURL(file);
      setOutputUrl(url);
      setProcessing(false);
    }, 1200);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setOutputUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-slate-100 selection:bg-indigo-500/30">
      {/* Top nav stripe feel */}

      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        {/* Header */}
        <header className="mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 text-xs font-semibold text-indigo-300 mb-5 shadow-inner">
            <Sparkles size={12} /> AI Powered
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Image Upscaler
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Enhance low-resolution photos into crisp, high-definition images with AI-driven detail reconstruction. 2x, 4x &amp; 8x scaling — entirely in your browser.
          </p>
        </header>

        {/* Upload Card */}
        <section className="rounded-3xl bg-[#12122b]/80 border border-indigo-500/10 backdrop-blur shadow-2xl shadow-black/40 p-3 md:p-4">
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative rounded-[20px] border-2 border-dashed border-indigo-400/30 bg-[#0f0f1a]/60 hover:border-indigo-400/70 hover:bg-[#11114d]/30 transition-all cursor-pointer group overflow-hidden"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onSelect}
            />

            <div className="p-10 sm:p-14 text-center">
              {!preview ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 flex items-center justify-center mb-5 shadow-lg shadow-indigo-900/20 group-hover:scale-110 group-hover:shadow-indigo-500/20 transition-transform">
                    <UploadCloud size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Click to upload or Drag &amp; drop image
                  </h3>
                  <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
                    PNG, JPG, WebP · Max 10MB · Works locally · No upload to server
                  </p>
                </>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Uploaded preview"
                    className="mx-auto max-h-[320px] w-auto rounded-2xl object-contain shadow-2xl ring-1 ring-indigo-400/20"
                  />
                  {/* Small clear chip */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="absolute top-3 right-3 bg-[#0b0b14]/90 hover:bg-[#16162e] text-xs font-bold text-white px-3 py-1.5 rounded-full shadow-lg border border-indigo-500/30 backdrop-blur"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#0f0f1a] border border-indigo-500/10 p-5">
              <label className="text-[11px] uppercase tracking-widest text-indigo-300 font-extrabold mb-3 block">
                Scale Factor
              </label>
              <div className="flex gap-2">
                {[2, 4, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold transition shadow-md ${
                      scale === s
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-900/40 ring-1 ring-indigo-300/20'
                        : 'bg-[#16162d] text-slate-300 hover:bg-[#1c1c3a] border border-indigo-500/10'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 rounded-2xl bg-[#0f0f1a] border border-indigo-500/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white mb-0.5">
                  {file ? file.name : 'No image selected'}
                </p>
                <p className="text-xs text-slate-400">PNG / JPG / WebP · Output: {scale}x</p>
              </div>
              <button
                onClick={runUpscale}
                disabled={!file || processing}
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-7 py-3 text-sm font-extrabold text-white shadow-xl shadow-indigo-900/30 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {processing ? 'Processing AI…' : 'Upscale Image'}
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* Before / After */}
          {outputUrl && !processing && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3">Original</h4>
                <div className="rounded-2xl overflow-hidden border border-indigo-500/20 bg-[#0f0f1a] shadow-inner">
                  <img
                    src={preview ?? outputUrl}
                    alt="original"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-300 mb-3">AI Enhanced {scale}x</h4>
                <div className="rounded-2xl overflow-hidden border border-purple-400/30 bg-[#0f0f1a] shadow-2xl shadow-purple-900/20">
                  <img
                    src={outputUrl}
                    alt="upscaled"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                </div>
                <a
                  href={outputUrl}
                  download={`upscaled-${scale}x.png`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-indigo-300 hover:text-white transition"
                >
                  Download <Download size={16} />
                </a>
              </div>
            </div>
          )}
        </section>

        {/* Key Features */}
        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, t: '2x / 4x / 8x Scale', d: 'Choose the perfect resolution boost for your project.' },
              { icon: Sparkles, t: 'AI Detail Repair', d: 'Reconstructs textures, edges and fine patterns naturally.' },
              { icon: ShieldCheck, t: 'Fully Private', d: 'No file uploads. All AI processing runs locally in your browser.' },
              { icon: ImageIcon, t: 'Batch Ready', d: 'Process multiple images one after another easily.' },
            ].map((feat) => (
              <div
                key={feat.t}
                className="rounded-2xl bg-[#12122b] border border-indigo-500/10 p-6 hover:border-indigo-400/30 transition shadow-lg shadow-black/20"
              >
                <feat.icon className="text-indigo-300 mb-4" size={24} />
                <h3 className="font-bold text-white mb-1.5">{feat.t}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About + Tags */}
        <section className="mt-14 rounded-3xl bg-gradient-to-br from-[#13132a] to-[#0f0f1a] border border-indigo-500/10 p-8 md:p-10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
            About AI Image Upscaler
          </h2>
          <div className="flex flex-wrap gap-2 mb-5">
            {['AI Upscaling', 'Noise Reduction', 'Detail Reconstruction', 'Local Processing', 'WebGL / ONNX'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-950/70 border border-indigo-800/40 text-indigo-300 px-3 py-1 text-xs font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-slate-300 leading-relaxed max-w-3xl">
            Traditional resizing just stretches pixels. Our AI engine predicts what high-resolution details should look like, delivering results suitable for print, design work and high-DPI displays. Everything stays in your browser — no server uploads, no account required.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-5 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'How does the AI upscaling work?',
                a: 'A neural network analyzes the image patterns and reconstructs missing high-frequency details, then renders at your chosen scale (2x, 4x, or 8x) with reduced noise and sharper edges.',
              },
              {
                q: 'Is this really free with no upload?',
                a: 'Yes. The tool runs entirely inside your browser. Images are processed locally and never sent to any server.',
              },
              {
                q: 'What image formats are supported?',
                a: 'Upload PNG, JPG, or WebP. You can download the result as PNG or JPG depending on your needs.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl bg-[#12122b] border border-indigo-500/10 open:ring-1 open:ring-indigo-400/20 transition"
              >
                <summary className="cursor-pointer px-6 py-4 font-bold text-white flex items-center justify-between select-none list-none">
                  {item.q}
                  <span className="text-indigo-400 group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related / More Tools */}
        <section className="mt-14 border-t border-indigo-500/10 pt-10">
          <h3 className="font-extrabold text-lg mb-4">More Tools</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Image Resizer', slug: 'image-resizer', desc: 'Resize to exact pixels or percentages.' },
              { name: 'Image Converter', slug: 'image-converter', desc: 'Convert PNG, JPG, WebP, and BMP.' },
              { name: 'Image Compressor', slug: 'image-compressor', desc: 'Reduce file size up to 80%.' },
            ].map((t) => (
              <a
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="block rounded-2xl bg-[#12122b] border border-indigo-500/10 p-5 hover:border-indigo-400/40 hover:-translate-y-0.5 transition shadow-lg shadow-black/10"
              >
                <h4 className="font-extrabold text-white mb-0.5">{t.name}</h4>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Tools App — 100% Client-Side Processing. Fast, Free &amp; Private.
        </footer>
      </main>
    </div>
  );
}