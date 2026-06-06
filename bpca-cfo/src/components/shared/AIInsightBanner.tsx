import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface AIInsightBannerProps {
  insights: string[];
  pageTitle?: string;
}

const AIInsightBanner: React.FC<AIInsightBannerProps> = ({ insights, pageTitle }) => {
  const [expanded, setExpanded] = useState(true);

  if (!insights.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card border border-teal/20 overflow-hidden"
    >
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal/10">
            <Brain size={16} className="text-teal" />
          </div>
          <span className="text-sm font-medium text-teal">
            AI Insights{pageTitle ? ` — ${pageTitle}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="ai-regenerate-btn p-1.5 rounded-lg hover:bg-surface-light transition-colors text-gray-400 hover:text-teal"
            onClick={(e) => {
              e.stopPropagation();
            }}
            title="Regenerate insights"
          >
            <RefreshCw size={14} />
          </button>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                  <span className="text-teal mt-0.5 shrink-0">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIInsightBanner;
