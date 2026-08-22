export interface TextStats {
  chars: number;
  charsNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingMinutes: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const sentences = trimmed
    ? trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length
    : 0;
  const lines = text ? text.split('\n').length : 0;

  return {
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    words,
    sentences,
    paragraphs,
    lines,
    readingMinutes: words === 0 ? 0 : Math.max(1, Math.ceil(words / 200)),
  };
}

export function keywordDensity(text: string, limit = 8): { word: string; count: number; pct: number }[] {
  const stop = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'is', 'it', 'as', 'be', 'by', 'this', 'that', 'with', 'from', 'are', 'was',
    'were', 'you', 'your', 'we', 'our', 'they', 'their', 'i', 'me', 'my',
  ]);
  const words = text.toLowerCase().match(/[a-z0-9']+/g) || [];
  const counts: Record<string, number> = {};
  words.forEach((w) => {
    if (w.length < 3 || stop.has(w)) return;
    counts[w] = (counts[w] || 0) + 1;
  });
  const total = words.length || 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count, pct: Math.round((count / total) * 1000) / 10 }));
}
