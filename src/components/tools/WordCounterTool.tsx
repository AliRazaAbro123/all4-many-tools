import React, { useMemo, useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { analyzeText, keywordDensity } from '../../utils/textStats';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState(
    'Paste your essay, blog post, or caption here. all4 counts words, characters, sentences, and reading time instantly — nothing is uploaded.'
  );
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => analyzeText(text), [text]);
  const keywords = useMemo(() => keywordDensity(text), [text]);

  const copyStats = () => {
    const report = `Words: ${stats.words}\nCharacters: ${stats.chars}\nCharacters (no spaces): ${stats.charsNoSpaces}\nSentences: ${stats.sentences}\nParagraphs: ${stats.paragraphs}\nLines: ${stats.lines}\nReading time: ${stats.readingMinutes} min`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const downloadReport = () => {
    const blob = new Blob(
      [
        `all4 Word Count Report\n\n${copyableReport(stats)}\n\n--- Text ---\n${text}`,
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all4-word-count.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No spaces', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Read time', value: `${stats.readingMinutes} min` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
            <div className="text-2xl font-extrabold text-slate-900">{c.value}</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Your text</span>
          <div className="flex gap-2">
            <button
              onClick={copyStats}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied stats' : 'Copy stats'}
            </button>
            <button
              onClick={downloadReport}
              className="text-xs font-bold text-slate-600 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Start typing or paste text..."
        />
      </div>

      {keywords.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Keyword density</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span
                key={k.word}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {k.word} · {k.count} ({k.pct}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function copyableReport(stats: ReturnType<typeof analyzeText>) {
  return `Words: ${stats.words}
Characters: ${stats.chars}
Characters (no spaces): ${stats.charsNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}
Reading time: ${stats.readingMinutes} min`;
}
