import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileCheck,
  Check,
  Maximize2,
  RefreshCw,
  Archive,
} from 'lucide-react';
import { loadPdfDocument, renderPdfPage, RenderedPdfPage } from '../../utils/pdfHelpers';
import { downloadFile, downloadZip, formatBytes, canvasToBlob } from '../../utils/fileHelpers';

export const PdfToImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [pages, setPages] = useState<RenderedPdfPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [renderScale, setRenderScale] = useState<number>(2.0); // 2x = 200 DPI
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [previewPage, setPreviewPage] = useState<RenderedPdfPage | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      await processPdf(selectedFile, renderScale);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      await processPdf(droppedFile, renderScale);
    }
  };

  const processPdf = async (pdfFile: File, scale: number) => {
    setFile(pdfFile);
    setLoading(true);
    setPages([]);
    setProgressText('Loading PDF document...');

    try {
      const pdfDoc = await loadPdfDocument(pdfFile);
      const totalPages = pdfDoc.numPages;
      const renderedList: RenderedPdfPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProgressText(`Rendering page ${i} of ${totalPages}...`);
        const pageData = await renderPdfPage(pdfDoc, i, scale);
        renderedList.push(pageData);
      }

      setPages(renderedList);
      setSelectedPages(renderedList.map((p) => p.pageNumber));
    } catch (err) {
      console.error(err);
      alert('Could not render PDF file. Please ensure it is not password protected.');
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const togglePageSelection = (num: number) => {
    if (selectedPages.includes(num)) {
      setSelectedPages(selectedPages.filter((p) => p !== num));
    } else {
      setSelectedPages([...selectedPages, num]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(pages.map((p) => p.pageNumber));
    }
  };

  const handleDownloadPage = async (page: RenderedPdfPage) => {
    const mime = `image/${format}`;
    const blob = await canvasToBlob(page.canvas, mime, 0.95);
    const ext = format === 'jpeg' ? 'jpg' : format;
    const filename = `${file?.name.replace('.pdf', '')}_page_${page.pageNumber}.${ext}`;
    downloadFile(blob, filename);
  };

  const handleDownloadAllZip = async () => {
    if (selectedPages.length === 0) return;
    setLoading(true);
    setProgressText('Packaging ZIP archive...');

    try {
      const mime = `image/${format}`;
      const ext = format === 'jpeg' ? 'jpg' : format;
      const baseName = file?.name.replace('.pdf', '') || 'pdf_export';

      const fileBlobs = await Promise.all(
        pages
          .filter((p) => selectedPages.includes(p.pageNumber))
          .map(async (p) => {
            const blob = await canvasToBlob(p.canvas, mime, 0.95);
            return {
              name: `${baseName}_page_${p.pageNumber}.${ext}`,
              blob,
            };
          })
      );

      await downloadZip(fileBlobs, `${baseName}_images.zip`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate ZIP download.');
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
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all hover:shadow-xl group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Click to upload PDF or drag & drop file here
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Supports any standard PDF file. Render pages into high-resolution PNG, JPG, or WebP.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Header Info & Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatBytes(file.size)} • {pages.length} Pages Loaded
                </p>
              </div>
            </div>

            {/* Scale, Format, Actions */}
            <div className="flex items-center flex-wrap gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Quality:</span>
                <select
                  value={renderScale}
                  onChange={(e) => {
                    const newScale = parseFloat(e.target.value);
                    setRenderScale(newScale);
                    processPdf(file, newScale);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={1.5}>Standard (150 DPI)</option>
                  <option value={2.0}>High Sharp (200 DPI)</option>
                  <option value={3.0}>Ultra HD (300 DPI)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Format:</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpeg">JPG (Photo)</option>
                  <option value="webp">WebP (Modern)</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  setPages([]);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Change PDF
              </button>
            </div>
          </div>

          {/* Loading status bar */}
          {loading && (
            <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 flex items-center gap-3 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{progressText}</span>
            </div>
          )}

          {/* Selection toolbar & Download ZIP */}
          {pages.length > 0 && (
            <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  onClick={toggleSelectAll}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                >
                  {selectedPages.length === pages.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-slate-500 dark:text-slate-400">
                  {selectedPages.length} of {pages.length} selected
                </span>
              </div>

              <button
                onClick={handleDownloadAllZip}
                disabled={selectedPages.length === 0 || loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                <Archive className="w-4 h-4" />
                <span>Download Selected as ZIP ({selectedPages.length})</span>
              </button>
            </div>
          )}

          {/* Page Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((p) => {
              const isSelected = selectedPages.includes(p.pageNumber);
              return (
                <div
                  key={p.pageNumber}
                  className={`group relative bg-white dark:bg-slate-900 rounded-2xl border-2 overflow-hidden shadow-xs transition-all ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => togglePageSelection(p.pageNumber)}
                    className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900/60 text-white hover:bg-slate-900'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : p.pageNumber}
                  </button>

                  {/* Canvas Thumbnail Preview */}
                  <div className="p-2 bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[160px] max-h-[220px] overflow-hidden">
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-full max-w-full object-contain shadow-xs"
                    />
                  </div>

                  {/* Bottom Hover Actions */}
                  <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Page {p.pageNumber}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewPage(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Expand Preview"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPage(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewPage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewPage(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 max-w-4xl max-h-[90vh] rounded-3xl p-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Page {previewPage.pageNumber} Preview
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPage(previewPage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download Image
                </button>
                <button
                  onClick={() => setPreviewPage(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-2xl mt-3">
              <img
                src={previewPage.dataUrl}
                alt={`Page ${previewPage.pageNumber}`}
                className="max-h-full object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
