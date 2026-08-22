import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ToolItem } from '../../types/tool';

interface BreadcrumbsProps {
  tool?: ToolItem;
  categoryLabel?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ tool, categoryLabel }) => {
  return (
    <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap gap-1.5" aria-label="Breadcrumb">
      <Link
        to="/"
        className="inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        Home
      </Link>

      {categoryLabel && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <span className="capitalize">{categoryLabel}</span>
        </>
      )}

      {tool && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <Link
            to={`/?category=${tool.category}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize font-medium"
          >
            {tool.category} Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px] sm:max-w-none">
            {tool.name}
          </span>
        </>
      )}
    </nav>
  );
};
