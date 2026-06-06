import React from 'react';
import { Bell, Settings, Sun, Moon } from 'lucide-react';
import GlobalSearch from '../shared/GlobalSearch';

interface TopBarProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onNavigate?: (section: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ darkMode = true, onToggleDarkMode, onNavigate }) => {
  return (
    <header
      className="h-16 backdrop-blur-md border-b flex items-center justify-between px-6 flex-shrink-0 print:hidden"
      style={{ backgroundColor: 'var(--topbar-bg)', borderColor: 'var(--topbar-border)' }}
    >
      {/* Left: Logo + Tagline */}
      <div className="flex flex-col min-w-[180px]">
        <h1 className="font-display text-xl text-gradient-gold leading-tight">BPCA CFO</h1>
        <p className="text-[10px] tracking-wide leading-tight" style={{ color: 'var(--icon-muted)' }}>
          Unlocking Growth | Powering IPOs | Enabling M&amp;A &amp; Fundraising
        </p>
      </div>

      {/* Center: Search */}
      <div className="flex items-center">
        <GlobalSearch onNavigate={onNavigate || (() => {})} />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg transition-colors topbar-icon-btn"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 rounded-lg transition-colors topbar-icon-btn">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--topbar-bg)]" />
        </button>

        <button className="p-2 rounded-lg transition-colors topbar-icon-btn">
          <Settings size={18} />
        </button>

        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-600 flex items-center justify-center text-navy text-xs font-bold">
          KS
        </button>
      </div>
    </header>
  );
};

export default TopBar;
