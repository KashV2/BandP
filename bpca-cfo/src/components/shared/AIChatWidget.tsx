import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const aiResponses: Record<string, string> = {
  cash: "Based on current cash flow patterns, your cash conversion cycle is 68 days. I'd recommend negotiating payment terms with your top 5 vendors to extend AP by 15 days — this could free up ₹2.3 Cr in working capital without impacting relationships.",
  working: "Your working capital ratio stands at 1.4x, which is healthy but below the industry benchmark of 1.6x. The primary drag is receivables — DSO has increased from 42 to 51 days over the last quarter. I recommend tightening collection follow-ups on accounts exceeding ₹10L outstanding.",
  revenue: "Revenue grew 18% YoY, led by the industrial segment (+27%). However, gross margins compressed 180bps due to raw material inflation. FP&A models suggest a price adjustment of 6-8% on Category A products would restore margins without significant volume impact.",
  profit: "EBITDA margin is at 14.2%, down from 15.8% last quarter. Key contributors: (1) Employee costs rose 12% due to new hires, (2) Logistics costs spiked 22% from fuel surcharges. Operating leverage should improve next quarter as new hires ramp up productivity.",
  ipo: "Based on your current financials, your company is approximately 18-24 months from IPO readiness. Key gaps: (1) Need 3 years of audited financials under Ind AS, (2) Corporate governance structure needs an independent audit committee, (3) Revenue run-rate should target ₹500 Cr for a strong listing.",
  default: "That's a great question. Based on the latest financial data, I'd recommend we look at this from both a short-term liquidity and long-term strategic perspective. Would you like me to pull up the detailed analysis from the MIS pack, or shall I generate a custom report?",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('cash')) return aiResponses.cash;
  if (lower.includes('working capital') || lower.includes('wc')) return aiResponses.working;
  if (lower.includes('revenue') || lower.includes('sales') || lower.includes('growth')) return aiResponses.revenue;
  if (lower.includes('profit') || lower.includes('margin') || lower.includes('ebitda')) return aiResponses.profit;
  if (lower.includes('ipo') || lower.includes('listing') || lower.includes('fundrais')) return aiResponses.ipo;
  return aiResponses.default;
}

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: "I'm your AI CFO. Ask me anything about your financial position, working capital, or growth strategy.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: getAIResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Toggle button + label */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          >
            {/* "Ask BPCA" label */}
            {showLabel && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg border"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--section-title-color)' }}>
                  Ask BPCA
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLabel(false);
                  }}
                  className="p-0.5 rounded-full hover:bg-red-500/10 transition-colors"
                  style={{ color: 'var(--icon-muted)' }}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}

            {/* FAB button */}
            <button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-600 shadow-lg shadow-gold/20 flex items-center justify-center hover:shadow-xl hover:shadow-gold/30 transition-shadow"
            >
              <Sparkles size={22} className="text-navy" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[520px] flex flex-col backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(17, 23, 41, 0.97)', borderColor: 'rgba(55, 65, 110, 0.5)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(55,65,110,0.4)', backgroundColor: 'rgba(17,23,41,0.8)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-navy" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>AI CFO</h3>
                  <p className="text-[10px]" style={{ color: '#00D4B4' }}>Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: '#9ca3af' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed border"
                    style={msg.role === 'user'
                      ? { backgroundColor: 'rgba(0,212,180,0.12)', color: '#d4ffF5', borderColor: 'rgba(0,212,180,0.2)' }
                      : { backgroundColor: 'rgba(26,32,64,0.8)', color: '#e2e8f0', borderColor: 'rgba(55,65,110,0.3)' }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-3 flex items-center gap-1.5 border" style={{ backgroundColor: 'rgba(26,32,64,0.8)', borderColor: 'rgba(55,65,110,0.3)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#9ca3af' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:200ms]" style={{ backgroundColor: '#9ca3af' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:400ms]" style={{ backgroundColor: '#9ca3af' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t" style={{ borderColor: 'rgba(55,65,110,0.4)' }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about financials..."
                  className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors"
                  style={{ backgroundColor: '#1a2040', border: '1px solid rgba(55,65,110,0.5)', color: '#e2e8f0' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-lg bg-teal text-navy hover:bg-teal-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
