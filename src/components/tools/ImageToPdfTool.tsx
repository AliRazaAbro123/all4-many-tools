import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { loadImageFromFile, formatBytes, downloadFile } from '../../utils/fileHelpers';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'auto'>('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [margin, setMargin] = useState<'none' | 'small' | 'large'>('small');
  const [pdfName, setPdfName] = useState('converted_document');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: ImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('image/')) {
        try {
          const img = await loadImageFromFile(f);
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
            previewUrl: img.src,
            width: img.width,
            height: img.height,
          });
        } catch (e) {
          console.error('Failed to load image', e);
        }
      }
    }

    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setLoading(true);

    try {
      let marginMm = 0;
      if (margin === 'small') marginMm = 10;
      if (margin === 'large') marginMm = 20;

      // Create PDF instance
      let doc: jsPDF;

      if (pageSize === 'auto') {
        // Fit page to first image
        const first = images[0];
        doc = new jsPDF({
          orientation: first.width > first.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [first.width, first.height],
        });
      } else {
        doc = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: pageSize,
        });
      }

      for (let i = 0; i < images.length; i++) {
        if (i > 0) {
          if (pageSize === 'auto') {
            const current = images[i];
            doc.addPage([current.width, current.height], current.width > current.height ? 'landscape' : 'portrait');
          } else {
            doc.addPage(pageSize, orientation);
          }
        }

        const imgItem = images[i];
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        const availWidth = pdfWidth - marginMm * 2;
        const availHeight = pdfHeight - marginMm * 2;

        const imgAspect = imgItem.width / imgItem.height;
        const availAspect = availWidth / availHeight;

        let drawW = availWidth;
        let drawH = availHeight;

        if (imgAspect > availAspect) {
          drawH = availWidth / imgAspect;
        } else {
          drawW = availHeight * imgAspect;
        }

        const x = marginMm + (availWidth - drawW) / 2;
        const y = marginMm + (availHeight - drawH) / 2;

        doc.addImage(imgItem.previewUrl, 'JPEG', x, y, drawW, drawH);
      }

      const pdfBlob = doc.output('blob');
      const filename = `${pdfName.trim() || 'document'}.pdf`;
      downloadFile(pdfBlob, filename);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
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
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Select or Drag & Drop Images (JPG, PNG, WebP)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Select multiple photos to combine into a single clean PDF file
        </p>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          {/* Options & Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                PDF File Name
              </label>
              <input
                type="text"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                placeholder="Name your PDF file"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="a4">A4 (Standard Document)</option>
                <option value="letter">US Letter</option>
                <option value="auto">Auto (Fit Original Image)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                disabled={pageSize === 'auto'}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none disabled:opacity-50"
              >
                <option value="p">Portrait (Vertical)</option>
                <option value="l">Landscape (Horizontal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Page Margin
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(e.target.value as any)}
                disabled={pageSize === 'auto'}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none disabled:opacity-50"
              >
                <option value="none">No Margin (Full Bleed)</option>
                <option value="small">Small Margin (10mm)</option>
                <option value="large">Big Margin (20mm)</option>
              </select>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-100 dark:bg-slate-800/60 p-3.5 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {images.length} Image{images.length > 1 ? 's' : ''} queued
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add More Images
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setImages([])}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={generatePdf}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{loading ? 'Generating PDF...' : 'Convert & Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Image List / Order Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs relative group"
              >
                <div className="p-2 bg-slate-100 dark:bg-slate-950 h-40 flex items-center justify-center overflow-hidden">
                  <img
                    src={img.previewUrl}
                    alt={img.file.name}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>

                <div className="p-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {index + 1}. {img.file.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {img.width}x{img.height} px • {formatBytes(img.file.size)}
                  </p>
                </div>

                {/* Move & Delete Controls Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-white hover:text-indigo-400 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 text-white hover:text-indigo-400 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
