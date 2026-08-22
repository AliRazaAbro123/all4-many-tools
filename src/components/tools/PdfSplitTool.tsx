import React, { useState, useRef } from 'react';
import {
  Download,
  Scissors,
  Check,
  RefreshCw,
  Archive,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { loadPdfDocument, renderPdfPage, RenderedPdfPage } from '../../utils/pdfHelpers';
import { formatBytes, downloadFile, downloadZip } from '../../utils/fileHelpers';

export const PdfSplitTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [pages, setPages] = useState<RenderedPdfPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

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
    setProgressText('Rendering PDF page thumbnails...');

    try {
      const pdfDoc = await loadPdfDocument(pdfFile);
      const totalPages = pdfDoc.numPages;
      const list: RenderedPdfPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProgressText(`Rendering thumbnail ${i} of ${totalPages}...`);
        const pageData = await renderPdfPage(pdfDoc, i, 1.5);
        list.push(pageData);
      }

      setPages(list);
      setSelectedPages(list.map((p) => p.pageNumber));
    } catch (err) {
      console.error(err);
      alert('Could not render PDF file.');
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const togglePage = (num: number) => {
    if (selectedPages.includes(num)) {
      setSelectedPages(selectedPages.filter((p) => p !== num));
    } else {
      setSelectedPages([...selectedPages, num]);
    }
  };

  const extractToSinglePdf = async () => {
    if (selectedPages.length === 0 || !file) return;
    setLoading(true);
    setProgressText('Extracting selected pages to new PDF...');

    try {
      const sortedPages = [...selectedPages].sort((a, b) => a - b);
      const pdfDoc = await loadPdfDocument(file);

      let doc: jsPDF | null = null;

      for (const pNum of sortedPages) {
        const pageData = await renderPdfPage(pdfDoc, pNum, 2.0);

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

        doc.addImage(pageData.dataUrl, 'PNG', 0, 0, pageData.width, pageData.height);
      }

      if (doc) {
        const blob = doc.output('blob');
        downloadFile(blob, `${file.name.replace('.pdf', '')}_extracted.pdf`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const extractToZip = async () => {
    if (selectedPages.length === 0 || !file) return;
    setLoading(true);
    setProgressText('Creating individual PDFs & packaging ZIP...');

    try {
      const sortedPages = [...selectedPages].sort((a, b) => a - b);
      const pdfDoc = await loadPdfDocument(file);
      const baseName = file.name.replace('.pdf', '');

      const zipFiles = await Promise.all(
        sortedPages.map(async (pNum) => {
          const pageData = await renderPdfPage(pdfDoc, pNum, 2.0);
          const doc = new jsPDF({
            orientation: pageData.width > pageData.height ? 'l' : 'p',
            unit: 'px',
            format: [pageData.width, pageData.height],
          });
          doc.addImage(pageData.dataUrl, 'PNG', 0, 0, pageData.width, pageData.height);
          const pdfBlob = doc.output('blob');
          return {
            name: `${baseName}_page_${pNum}.pdf`,
            blob: pdfBlob,
          };
        })
      );

      await downloadZip(zipFiles, `${baseName}_split_pages.zip`);
    } catch (err) {
      console.error(err);
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
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Upload PDF to Split or Extract Pages
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Visual page selection grid. Extract pages into new PDF or export individual page ZIP.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white truncate">
                {file.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {formatBytes(file.size)} • {pages.length} Pages • {selectedPages.length} Selected
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() => setSelectedPages(pages.map((p) => p.pageNumber))}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedPages([])}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Deselect All
              </button>
              <button
                onClick={() => setFile(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500"
              >
                Change PDF
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-3 text-indigo-700 dark:text-indigo-300 text-sm font-bold">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{progressText}</span>
            </div>
          )}

          {/* Page Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((p) => {
              const isSelected = selectedPages.includes(p.pageNumber);
              return (
                <div
                  key={p.pageNumber}
                  onClick={() => togglePage(p.pageNumber)}
                  className={`group relative bg-white dark:bg-slate-900 rounded-2xl border-2 overflow-hidden shadow-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800/80 text-white'
                  }`}>
                    {isSelected ? <Check className="w-4 h-4" /> : p.pageNumber}
                  </div>

                  <div className="p-2 bg-slate-100 dark:bg-slate-950 h-40 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="p-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    Page {p.pageNumber}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Export Action Bar */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={extractToSinglePdf}
              disabled={loading || selectedPages.length === 0}
              className="py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Extract Selected Pages into 1 PDF ({selectedPages.length})</span>
            </button>

            <button
              onClick={extractToZip}
              disabled={loading || selectedPages.length === 0}
              className="py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              <Archive className="w-5 h-5" />
              <span>Export as Separate PDFs in ZIP ({selectedPages.length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
