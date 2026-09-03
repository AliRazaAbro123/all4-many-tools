import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Star,
  Sparkles,
  X,
  ChevronRight,
} from 'lucide-react';
import { TOOLS_LIST } from '../../data/tools';
import { ToolIcon } from './ToolIcon';

interface NavbarProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ favorites, toggleFavorite }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setFavoritesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = searchQuery.trim()
    ? TOOLS_LIST.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : TOOLS_LIST;

  const favoriteToolsList = TOOLS_LIST.filter((t) => favorites.includes(t.id));

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 font-extrabold text-lg">
              4
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                  All4
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                  Free
                </span>
              </div>
              <p className="text-[12px] text-slate-500 font-medium hidden sm:block -mt-1">
                Unlimited private browser tools
              </p>
            </div>
          </Link>

          <div className="flex-1 max-w-md mx-2 sm:mx-6 hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/60 rounded-xl transition-all group"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                <span className="truncate">Search unlimited PDF, image & text tools...</span>
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                ⌘ + K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors md:hidden"
              title="Search tools"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Browser Private</span>
            </div>

            <button
              onClick={() => setFavoritesOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Favorite Tools"
            >
              <Star className="w-6 h-6 text-amber-500 fill-amber-500/10" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search tools (password, word count, PDF, QR, crop)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-2 divide-y divide-slate-100">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate(tool.path);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                        <ToolIcon name={tool.icon} size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{tool.shortDescription}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-medium">No tools matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
              <span>Quick jump to tools</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}

      {favoritesOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end"
          onClick={() => setFavoritesOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white h-full shadow-2xl p-5 border-l border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-slate-900">Your Favorite Tools</h3>
              </div>
              <button onClick={() => setFavoritesOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2">
              {favoriteToolsList.length > 0 ? (
                favoriteToolsList.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                  >
                    <button
                      onClick={() => {
                        setFavoritesOpen(false);
                        navigate(tool.path);
                      }}
                      className="flex items-center gap-3 text-left min-w-0 flex-1"
                    >
                      <ToolIcon name={tool.icon} className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-900 truncate">{tool.name}</div>
                        <div className="text-[10px] text-slate-500 capitalize">{tool.category} tool</div>
                      </div>
                    </button>
                    <button onClick={() => toggleFavorite(tool.id)} className="p-1.5 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Star className="w-10 h-10 mx-auto mb-2 stroke-1 opacity-50" />
                  <p className="text-sm font-medium">No favorite tools yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
