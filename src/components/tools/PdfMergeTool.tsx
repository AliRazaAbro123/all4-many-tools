import React, { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  FileCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { loadPdfDocument, renderPdfPage } from '../../utils/pdfHelpers';
import { formatBytes, downloadFile } from '../../utils/fileHelpers';

interface PdfFileItem {
  id: string;
  file: File;
  numPages: number;
}

export const PdfMergeTool: React.FC = () => {
  const [pdfItems, setPdfItems] = useState<PdfFileItem[]>([]);
  const [mergedName, setMergedName] = useState('merged_document');
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const newItems: PdfFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type === 'application/pdf') {
        try {
          const pdfDoc = await loadPdfDocument(f);
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
            numPages: pdfDoc.numPages,
          });
        } catch (e) {
          console.error('Failed to load PDF file', e);
        }
      }
    }

    setPdfItems((prev) => [...prev, ...newItems]);
  };

  const moveItem = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= pdfItems.length) return;
    const list = [...pdfItems];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    setPdfItems(list);
  };

  const removeItem = (id: string) => {
    setPdfItems(pdfItems.filter((i) => i.id !== id));
  };

  const handleMerge = async () => {
    if (pdfItems.length < 2) {
      alert('Please upload at least 2 PDF files to merge.');
      return;
    }

    setLoading(true);
    setProgressText('Preparing merge task...');

    try {
      let masterDoc: jsPDF | null = null;

      for (let i = 0; i < pdfItems.length; i++) {
        const item = pdfItems[i];
        setProgressText(`Rendering "${item.file.name}"...`);
        const pdfDoc = await loadPdfDocument(item.file);

        for (let p = 1; p <= pdfDoc.numPages; p++) {
          const pageData = await renderPdfPage(pdfDoc, p, 2.0); // 200 DPI

          if (!masterDoc) {
            masterDoc = new jsPDF({
              orientation: pageData.width > pageData.height ? 'l' : 'p',
              unit: 'px',
              format: [pageData.width, pageData.height],
            });
          } else {
            masterDoc.addPage(
              [pageData.width, pageData.height],
              pageData.width > pageData.height ? 'l' : 'p'
            );
          }

          masterDoc.addImage(
            pageData.dataUrl,
            'PNG',
            0,
            0,
            pageData.width,
            pageData.height
          );
        }
      }

      if (masterDoc) {
        const blob = masterDoc.output('blob');
        downloadFile(blob, `${mergedName.trim() || 'merged'}.pdf`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to merge PDFs. Please try again.');
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const totalPages = pdfItems.reduce((acc, curr) => acc + curr.numPages, 0);

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
          accept="application/pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Select or Drag & Drop Multiple PDF Files
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Combine separate PDF files into a single ordered PDF document.
        </p>
      </div>

      {pdfItems.length > 0 && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-64">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Output PDF Name
              </label>
              <input
                type="text"
                value={mergedName}
                onChange={(e) => setMergedName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {pdfItems.length} Files ({totalPages} Pages Total)
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add More
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-3 text-indigo-700 dark:text-indigo-300 text-sm font-bold">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{progressText}</span>
            </div>
          )}

          {/* List of PDFs */}
          <div className="space-y-3">
            {pdfItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.file.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatBytes(item.file.size)} • {item.numPages} Pages
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === pdfItems.length - 1}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleMerge}
            disabled={loading || pdfItems.length < 2}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            <Layers className="w-5 h-5" />
            <span>Merge {pdfItems.length} PDF Documents</span>
          </button>
        </div>
      )}
    </div>
  );
};
