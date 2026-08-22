import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Share2,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { TOOLS_LIST } from '../../data/tools';
import { SEOHead } from './SEOHead';
import { Breadcrumbs } from './Breadcrumbs';
import { ToolIcon } from './ToolIcon';

interface ToolLayoutProps {
  tool: ToolItem;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  favorites,
  toggleFavorite,
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isFavorite = favorites.includes(tool.id);

  const relatedTools = TOOLS_LIST.filter(
    (t) => t.id !== tool.id && t.category === tool.category
  ).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEOHead tool={tool} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs tool={tool} />

        {/* Tool Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                <ToolIcon name={tool.icon} size={32} />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {tool.name}
                  </h1>
                  {tool.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>
            </div>

            {/* Quick tool actions */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              <button
                onClick={() => toggleFavorite(tool.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                  }`}
                />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                title="Copy tool link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Tool Working Area */}
        <div className="mb-16">{children}</div>

        {/* Features Checklist */}
        <div className="grid md:grid-cols-2 gap-8 my-16">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Key Features
            </h2>
            <ul className="space-y-3">
              {tool.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950/40 rounded-3xl p-6 sm:p-8 border border-indigo-100 dark:border-indigo-900/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              About {tool.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {tool.fullDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {tool.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        {tool.faqs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 mb-16">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {tool.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between gap-4 py-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed animate-in fade-in duration-200">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              More {tool.category.toUpperCase()} Tools
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  to={rel.path}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                      <ToolIcon name={rel.icon} size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
};
