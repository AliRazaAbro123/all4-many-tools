import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { downloadFile } from '../../utils/fileHelpers';

export const TextToPdfTool: React.FC = () => {
  const [docTitle, setDocTitle] = useState('My Document');
  const [textContent, setTextContent] = useState(
    `Welcome to all4 Text to PDF Generator!\n\nWrite or paste any notes, markdown, or report text here.\nYou can customize font size, margins, and document title.\n\nKey Highlights:\n- 100% Free & Browser-Based\n- No server uploads required\n- Auto-pagination for long documents`
  );
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState<'helvetica' | 'times' | 'courier'>('helvetica');

  const handleGeneratePdf = () => {
    if (!textContent.trim()) return;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;

    // Header Title
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(22);
    doc.text(docTitle || 'Document', margin, 50);

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 65, pageWidth - margin, 65);

    // Body text
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(textContent, maxLineWidth);
    let y = 90;
    const lineHeight = fontSize * 1.4;

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }

    const blob = doc.output('blob');
    downloadFile(blob, `${(docTitle || 'document').toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      {/* Editor Panel */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" /> Document Content Editor
          </span>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Document Title
          </label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Typography Font
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="helvetica">Sans-Serif (Helvetica)</option>
              <option value="times">Serif (Times Roman)</option>
              <option value="courier">Monospace (Courier)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Font Size ({fontSize}pt)
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer mt-2"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Body Text / Notes
          </label>
          <textarea
            rows={10}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none"
          ></textarea>
        </div>

        <button
          onClick={handleGeneratePdf}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Generate & Download PDF</span>
        </button>
      </div>

      {/* Live Printable Preview */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <span className="font-bold text-slate-900 dark:text-white text-sm mb-3 block">
          A4 Page Layout Preview
        </span>

        <div className="flex-1 bg-slate-200 dark:bg-slate-950 rounded-2xl p-6 flex justify-center overflow-auto min-h-[380px]">
          <div
            className="bg-white text-slate-900 p-8 shadow-xl rounded-lg w-full max-w-[480px] min-h-[500px]"
            style={{
              fontFamily:
                fontFamily === 'times'
                  ? 'serif'
                  : fontFamily === 'courier'
                  ? 'monospace'
                  : 'sans-serif',
            }}
          >
            <h1 className="text-2xl font-bold text-slate-900 pb-2 border-b border-slate-200">
              {docTitle || 'Document'}
            </h1>
            <div
              className="mt-4 text-slate-800 whitespace-pre-wrap leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              {textContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
