import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ArrowRight, BarChart3, FileText,
  TrendingUp, PieChart, Wallet, Scale, Landmark, Users,
  ClipboardCheck, BookOpen, Target, DollarSign, Layers,
  Calculator, Building2, CreditCard, Clock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/format';

interface GlobalSearchProps {
  onNavigate: (sectionId: string) => void;
}

interface SearchItem {
  title: string;
  section: string;
  sectionId: string;
  description: string;
  icon: LucideIcon;
}

const SEARCH_ITEMS: SearchItem[] = [
  { title: 'Revenue KPIs', section: 'Overview', sectionId: 'overview', description: 'Total revenue, growth rate, MRR tracking', icon: TrendingUp },
  { title: 'EBITDA Margin', section: 'Overview', sectionId: 'overview', description: 'Earnings before interest, taxes & depreciation', icon: BarChart3 },
  { title: 'Receivables Ageing', section: 'Overview', sectionId: 'overview', description: 'Outstanding receivables by age bucket', icon: Clock },
  { title: 'Trade Payables', section: 'Overview', sectionId: 'overview', description: 'Payable balances and vendor terms', icon: CreditCard },
  { title: 'Net Operating Income', section: 'Overview', sectionId: 'overview', description: 'Net income after operating expenses', icon: DollarSign },
  { title: 'Month-End Close Tasks', section: 'Month-End', sectionId: 'month-end', description: 'Task checklist for month-end closing', icon: ClipboardCheck },
  { title: 'Close Progress Tracker', section: 'Month-End', sectionId: 'month-end', description: 'Real-time completion of close items', icon: Target },
  { title: 'MIS Variance Register', section: 'MIS Pack', sectionId: 'mis-pack', description: 'Budget vs actual variance analysis', icon: Scale },
  { title: 'MIS Summary Reports', section: 'MIS Pack', sectionId: 'mis-pack', description: 'Monthly management information summaries', icon: FileText },
  { title: 'Expense Ratio Analysis', section: 'Cost Efficiency', sectionId: 'cost-efficiency', description: 'Expense ratios across departments', icon: PieChart },
  { title: 'Cost Efficiency Benchmarks', section: 'Cost Efficiency', sectionId: 'cost-efficiency', description: 'Industry benchmarks comparison', icon: Layers },
  { title: 'Financial Statements', section: 'Financials', sectionId: 'financial-statements', description: 'P&L, balance sheet, cash flow statements', icon: Landmark },
  { title: 'Balance Sheet', section: 'Financials', sectionId: 'financial-statements', description: 'Assets, liabilities, and equity overview', icon: Building2 },
  { title: 'Working Capital Simulator', section: 'Working Capital', sectionId: 'working-capital', description: 'Simulate working capital scenarios', icon: Calculator },
  { title: 'Cash Conversion Cycle', section: 'Working Capital', sectionId: 'working-capital', description: 'DSO, DPO, DIO metrics and trends', icon: Wallet },
  { title: 'Pipeline Stages', section: 'Sales', sectionId: 'sales', description: 'Sales pipeline by deal stage', icon: Target },
  { title: 'Sales Performance', section: 'Sales', sectionId: 'sales', description: 'Revenue targets, win rates, deal velocity', icon: TrendingUp },
  { title: 'Forecast Scenarios', section: 'FP&A', sectionId: 'fp-and-a', description: 'Best, base, worst case projections', icon: BarChart3 },
  { title: 'Budget vs Actuals', section: 'FP&A', sectionId: 'fp-and-a', description: 'Real-time budget utilization tracking', icon: Scale },
  { title: 'Board Pack Summary', section: 'Board Pack', sectionId: 'board-pack', description: 'Executive summary for board meetings', icon: BookOpen },
  { title: 'Board Deck Builder', section: 'Board Pack', sectionId: 'board-pack', description: 'Create and export board presentations', icon: FileText },
  { title: 'Report Library', section: 'Reports', sectionId: 'report-library', description: 'Browse and download all reports', icon: BookOpen },
  { title: 'Ledger Drilldowns', section: 'Drilldowns', sectionId: 'drilldowns', description: 'Detailed GL account drilldowns', icon: Layers },
  { title: 'Department Spend', section: 'Drilldowns', sectionId: 'drilldowns', description: 'Spend breakdown by department', icon: Users },
  { title: 'Vendor Payments', section: 'Drilldowns', sectionId: 'drilldowns', description: 'Payment history and vendor analysis', icon: CreditCard },
];

const MAX_RESULTS = 8;

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sectionId.toLowerCase().includes(q)
    ).slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const navigateTo = useCallback(
    (item: SearchItem) => {
      setRecentSearches((prev) => {
        const next = [item.title, ...prev.filter((s) => s !== item.title)].slice(0, 5);
        return next;
      });
      onNavigate(item.sectionId);
      setIsOpen(false);
    },
    [onNavigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        navigateTo(filteredResults[selectedIndex]);
      }
    },
    [filteredResults, selectedIndex, navigateTo]
  );

  useEffect(() => {
    if (resultsRef.current) {
      const active = resultsRef.current.querySelector('[data-active="true"]');
      active?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/60 border border-surface-border/40 text-gray-400 hover:text-white hover:border-surface-border transition-all duration-200 text-sm"
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-surface-light text-[10px] font-mono text-gray-500 border border-surface-border/50 ml-1">
          Ctrl+K
        </kbd>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
              style={{ zIndex: 99999 }}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full max-w-xl shadow-2xl overflow-hidden rounded-xl"
                style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--card-border)' }}
                onClick={(e) => e.stopPropagation()}
              >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border/40">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, KPIs, reports..."
                  className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-surface-light text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div ref={resultsRef} className="max-h-[360px] overflow-y-auto">
                {query.trim() && filteredResults.length > 0 && (
                  <div className="p-2">
                    {filteredResults.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={`${item.sectionId}-${item.title}`}
                          data-active={idx === selectedIndex}
                          onClick={() => navigateTo(item)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100',
                            idx === selectedIndex ? 'bg-teal/10 text-white' : 'text-gray-300 hover:bg-surface-light/60'
                          )}
                        >
                          <div className={cn(
                            'p-1.5 rounded-md shrink-0',
                            idx === selectedIndex ? 'bg-teal/20' : 'bg-surface-light'
                          )}>
                            <Icon size={14} className={idx === selectedIndex ? 'text-teal' : 'text-gray-400'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 truncate">{item.description}</p>
                          </div>
                          <span className="badge-draft text-[10px] shrink-0">{item.section}</span>
                          <ArrowRight size={12} className="text-gray-600 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {query.trim() && filteredResults.length === 0 && (
                  <div className="py-10 text-center">
                    <Search size={32} className="mx-auto mb-3 text-gray-600" />
                    <p className="text-sm text-gray-400">No results found for "{query}"</p>
                    <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
                  </div>
                )}

                {!query.trim() && (
                  <div className="p-4">
                    {recentSearches.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Searches</p>
                        <div className="space-y-1">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => setQuery(term)}
                              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-surface-light/50 transition-colors text-left"
                            >
                              <Clock size={12} className="text-gray-600 shrink-0" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 text-center">
                      Type to search across all dashboard sections
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-5 py-2.5 border-t border-surface-border/30 text-[10px] text-gray-600">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-surface-light border border-surface-border/40 font-mono">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-surface-light border border-surface-border/40 font-mono">↵</kbd> Open</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-surface-light border border-surface-border/40 font-mono">Esc</kbd> Close</span>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default GlobalSearch;
