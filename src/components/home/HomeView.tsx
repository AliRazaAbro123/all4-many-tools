import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
  Lock,
  Grid,
} from 'lucide-react';
import { TOOLS_LIST, CATEGORIES } from '../../data/tools';
import { ToolCategory } from '../../types/tool';
import { SEOHead } from '../common/SEOHead';
import { ToolIcon } from '../common/ToolIcon';

interface HomeViewProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ favorites, toggleFavorite }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = (searchParams.get('category') as ToolCategory) || 'all';

  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return TOOLS_LIST.filter((tool) => {
      const matchesCat =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const popularTools = useMemo(() => {
    return TOOLS_LIST.filter((t) => t.isPopular);
  }, []);

  return (
    <>
      <SEOHead />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Hero Banner Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>100% Free Client-Side Browser Media Suite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            PDF, Image & Everyday Tools.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Fast, Free & Private.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Convert PDF to Image, generate passwords, count words in text, photos or PDFs, resize images, and more. Zero file uploads — 100% browser processing.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tools (password, word count, PDF to image, QR, crop)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm sm:text-base focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> No File Uploads
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Instant Client Execution
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500" /> Unlimited Usage
            </span>
          </div>
        </section>

        {/* Popular Tools Carousel Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Most Popular Tools
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group relative p-5 rounded-3xl bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-110 transition-transform">
                        <ToolIcon name={tool.icon} size={24} />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(tool.id);
                        }}
                        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.includes(tool.id)
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Selector Tabs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-indigo-500" />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                All Available Tools ({filteredTools.length})
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'all') {
                        setSearchParams({});
                      } else {
                        setSearchParams({ category: cat.id });
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredTools.map((tool) => {
                const isFav = favorites.includes(tool.id);
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-105 transition-transform">
                          <ToolIcon name={tool.icon} size={22} />
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(tool.id);
                          }}
                          className="p-1 text-slate-300 dark:text-slate-600 hover:text-amber-500"
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                          {tool.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1">
                        {tool.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {tool.category}
                      </span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center">
                        Launch <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Sparkles className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">No tools found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for a different keyword like "PDF", "Convert", "Resize", or "Compress".
              </p>
            </div>
          )}
        </section>

        {/* Informational SEO Content Banner */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Why Choose OmniTools for Your PDF & Image Tasks?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Complete Privacy</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Unlike traditional online converters that upload your confidential documents to unknown cloud servers, all4 executes all transformations inside your local browser memory using modern Web APIs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Lightning Speed</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Zero network latency for uploading or downloading large multi-megabyte files. Processing happens instantly on your CPU/GPU hardware.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">100% Free Forever</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                No account registration, no subscriptions, no file count limits, and no watermark restrictions on your generated documents.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
