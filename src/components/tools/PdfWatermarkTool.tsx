import React, { useState, useRef } from 'react';
import {
  Download,
  Stamp,
  RefreshCw,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { loadPdfDocument, renderPdfPage, RenderedPdfPage } from '../../utils/pdfHelpers';
import { downloadFile, formatBytes } from '../../utils/fileHelpers';

export const PdfWatermarkTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [pages, setPages] = useState<RenderedPdfPage[]>([]);

  // Watermark parameters
  const [mode, setMode] = useState<'text' | 'number'>('text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(0.25);
  const [angle, setAngle] = useState(-30);
  const [textColor, setTextColor] = useState('#6366F1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      await processPdf(selectedFile);
    }
  };

  const processPdf = async (pdfFile: File) => {
    setFile(pdfFile);
    setLoading(true);
    setPages([]);
    setProgressText('Loading PDF pages...');

    try {
      const pdfDoc = await loadPdfDocument(pdfFile);
      const totalPages = pdfDoc.numPages;
      const list: RenderedPdfPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProgressText(`Rendering page ${i} of ${totalPages}...`);
        const pageData = await renderPdfPage(pdfDoc, i, 1.5);
        list.push(pageData);
      }

      setPages(list);
    } catch (err) {
      console.error(err);
      alert('Could not render PDF file.');
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const handleApplyWatermark = async () => {
    if (!file || pages.length === 0) return;
    setLoading(true);
    setProgressText('Applying watermark to PDF...');

    try {
      const pdfDoc = await loadPdfDocument(file);
      const totalPages = pdfDoc.numPages;

      let doc: jsPDF | null = null;

      for (let i = 1; i <= totalPages; i++) {
        const pageData = await renderPdfPage(pdfDoc, i, 2.0);

        if (!doc) {
          doc = new jsPDF({
            orientation: pageData.width > pageData.height ? 'l' : 'p',
            unit: 'px',
            format: [pageData.width, pageData.height],
          });
        } else {
          doc.addPage(
            [pageData.width, pageData.height],
            pageData.width > pageData.height ? 'l' : 'p'
          );
        }

        // Draw original page canvas onto doc
        doc.addImage(pageData.dataUrl, 'PNG', 0, 0, pageData.width, pageData.height);

        // Apply Watermark Overlay
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: opacity }));
        doc.setTextColor(textColor);
        doc.setFontSize(fontSize);

        const textToDraw =
          mode === 'number'
            ? `Page ${i} of ${totalPages}`
            : watermarkText;

        const centerX = pageData.width / 2;
        const centerY = pageData.height / 2;

        if (mode === 'text') {
          doc.text(textToDraw, centerX, centerY, {
            align: 'center',
            angle: angle,
          });
        } else {
          // Bottom center page numbering
          doc.text(textToDraw, centerX, pageData.height - 30, {
            align: 'center',
          });
        }

        doc.restoreGraphicsState();
      }

      if (doc) {
        const blob = doc.output('blob');
        downloadFile(blob, `${file.name.replace('.pdf', '')}_watermarked.pdf`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to stamp watermark.');
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) processPdf(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all hover:shadow-lg group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Stamp className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Upload PDF to Add Watermark or Page Numbers
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Add confidential text overlays, logos, or page numbering with custom opacity & angle.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Watermark Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {file.name} ({formatBytes(file.size)})
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Change PDF
              </button>
            </div>

            {/* Mode selection */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Watermark Type
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setMode('text')}
                  className={`py-2 rounded-xl border transition-colors ${
                    mode === 'text'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Custom Text Watermark
                </button>
                <button
                  onClick={() => setMode('number')}
                  className={`py-2 rounded-xl border transition-colors ${
                    mode === 'number'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Page Numbers ("1 of N")
                </button>
              </div>
            </div>

            {mode === 'text' && (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                  placeholder="e.g. CONFIDENTIAL"
                />
              </div>
            )}

            {/* Color & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Text Color
                </label>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {textColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Font Size ({fontSize}pt)
                </label>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Opacity & Angle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {mode === 'text' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Angle ({angle}°)
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleApplyWatermark}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Apply & Download Watermarked PDF</span>
            </button>
          </div>

          {/* Page Preview Area */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm mb-3 block">
              Live First Page Preview
            </span>

            {loading && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{progressText}</span>
              </div>
            )}

            <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center overflow-auto border border-slate-200/60 dark:border-slate-800 min-h-[360px] relative">
              {pages[0] && (
                <div className="relative inline-block max-h-[440px] shadow-lg rounded overflow-hidden">
                  <img
                    src={pages[0].dataUrl}
                    alt="Watermark target preview"
                    className="max-h-[420px] max-w-full object-contain"
                  />
                  {/* Simulated Watermark Text Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none font-bold"
                    style={{
                      opacity: opacity,
                      color: textColor,
                      fontSize: `${fontSize * 0.8}px`,
                      transform: `rotate(${mode === 'text' ? angle : 0}deg)`,
                    }}
                  >
                    {mode === 'text' ? watermarkText : `Page 1 of ${pages.length}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
