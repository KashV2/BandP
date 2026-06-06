import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { cn } from '../../utils/format';

export interface ThemeColors {
  accent1: string;
  accent2: string;
  background: string;
}

interface ColorCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: ThemeColors) => void;
}

const PRESETS: { name: string; colors: ThemeColors }[] = [
  { name: 'BPCA Default', colors: { accent1: '#00D4B4', accent2: '#C9A84C', background: '#0A0F1E' } },
  { name: 'Royal Blue', colors: { accent1: '#3B82F6', accent2: '#94A3B8', background: '#0F172A' } },
  { name: 'Emerald', colors: { accent1: '#10B981', accent2: '#F43F5E', background: '#111827' } },
  { name: 'Midnight Purple', colors: { accent1: '#8B5CF6', accent2: '#F59E0B', background: '#0C0A1A' } },
  { name: 'Crimson', colors: { accent1: '#EF4444', accent2: '#06B6D4', background: '#0A0F1E' } },
];

const DEFAULT_THEME = PRESETS[0].colors;
const LS_KEY = 'bpca-theme';

function applyThemeToDOM(theme: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty('--theme-accent1', theme.accent1);
  root.style.setProperty('--theme-accent2', theme.accent2);
  root.style.setProperty('--theme-bg', theme.background);
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({ isOpen, onClose, onApplyTheme }) => {
  const [selected, setSelected] = useState<ThemeColors>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [activePreset, setActivePreset] = useState<string | null>(() => {
    const match = PRESETS.find(
      (p) => p.colors.accent1 === selected.accent1 && p.colors.accent2 === selected.accent2 && p.colors.background === selected.background
    );
    return match?.name ?? null;
  });

  useEffect(() => {
    const match = PRESETS.find(
      (p) => p.colors.accent1 === selected.accent1 && p.colors.accent2 === selected.accent2 && p.colors.background === selected.background
    );
    setActivePreset(match?.name ?? null);
  }, [selected]);

  const handlePresetClick = useCallback((preset: typeof PRESETS[number]) => {
    setSelected(preset.colors);
  }, []);

  const handleApply = useCallback(() => {
    applyThemeToDOM(selected);
    localStorage.setItem(LS_KEY, JSON.stringify(selected));
    onApplyTheme(selected);
  }, [selected, onApplyTheme]);

  const handleReset = useCallback(() => {
    setSelected(DEFAULT_THEME);
    applyThemeToDOM(DEFAULT_THEME);
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_THEME));
    onApplyTheme(DEFAULT_THEME);
  }, [onApplyTheme]);

  const updateField = useCallback((field: keyof ThemeColors, value: string) => {
    setSelected((prev) => ({ ...prev, [field]: value }));
  }, []);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 99998 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[380px] glass-card border-l border-surface-border/60 shadow-2xl overflow-y-auto"
            style={{ zIndex: 99999, background: 'rgba(17, 23, 41, 0.95)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-surface-border/40">
              <div className="flex items-center gap-2.5">
                <Palette size={20} className="text-gold" />
                <h2 className="font-display text-lg text-white">Customize Theme</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface-light transition-colors text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Presets */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Presets</p>
                <div className="space-y-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                        activePreset === preset.name
                          ? 'border-teal/50 bg-teal/10'
                          : 'border-surface-border/40 bg-surface/40 hover:border-surface-border hover:bg-surface-light/40'
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {[preset.colors.accent1, preset.colors.accent2, preset.colors.background].map((color, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full border border-white/10 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-200">{preset.name}</span>
                      {activePreset === preset.name && (
                        <span className="ml-auto text-xs text-teal">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Custom Colors</p>
                <div className="space-y-3">
                  {([
                    { key: 'accent1' as const, label: 'Primary Accent' },
                    { key: 'accent2' as const, label: 'Secondary Accent' },
                    { key: 'background' as const, label: 'Background' },
                  ]).map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={selected[key]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-9 h-9 rounded-lg border border-surface-border cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{label}</p>
                        <p className="text-xs text-gray-500 font-mono">{selected[key]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Preview</p>
                <div
                  className="rounded-lg p-4 border border-surface-border/40"
                  style={{ backgroundColor: selected.background }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.accent1 }} />
                    <span className="text-sm font-medium" style={{ color: selected.accent1 }}>Primary</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.accent2 }} />
                    <span className="text-sm font-medium" style={{ color: selected.accent2 }}>Secondary</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${selected.accent1}, ${selected.accent2})` }} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleApply} className="btn-primary flex-1">
                  Apply Theme
                </button>
                <button onClick={handleReset} className="btn-secondary flex-1">
                  Reset Default
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ColorCustomizer;
