import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Zap, Lock } from 'lucide-react';
import { TOOLS_LIST, CATEGORIES } from '../../data/tools';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top privacy promise banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">100% Client-Side Privacy Guarantee</h3>
              <p className="text-slate-300 text-sm mt-0.5">
                All image and PDF processing happens locally in your browser memory. Your files are never uploaded to any server.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> No File Storage
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Processing
            </span>
          </div>
        </div>

        {/* Links grid for SEO */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200 dark:border-slate-800">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
            const catTools = TOOLS_LIST.filter(t => t.category === cat.id);
            return (
              <div key={cat.id}>
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {cat.label}
                </h4>
                <ul className="space-y-2.5">
                  {catTools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        to={tool.path}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-block"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-extrabold">
              4
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">all4</span>
            <span>&copy; {new Date().getFullYear()} — Free Client-Side Utilities</span>
          </div>

          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for privacy & speed
          </p>
        </div>

      </div>
    </footer>
  );
};
