import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshBannerProps {
  lastSync: string;
  status: 'live' | 'fallback' | 'offline';
  onRefresh: () => void;
}

const statusConfig = {
  live: { dot: 'bg-teal', label: 'Live', ring: 'ring-teal/30' },
  fallback: { dot: 'bg-amber-400', label: 'Fallback', ring: 'ring-amber-400/30' },
  offline: { dot: 'bg-red-500', label: 'Offline', ring: 'ring-red-500/30' },
};

function formatTimeSince(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
}

const RefreshBanner: React.FC<RefreshBannerProps> = ({ lastSync, status, onRefresh }) => {
  const [spinning, setSpinning] = useState(false);
  const config = statusConfig[status];

  const handleRefresh = () => {
    setSpinning(true);
    onRefresh();
    setTimeout(() => setSpinning(false), 1500);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-surface/40 border border-surface-border/30 rounded-lg">
      <div className="flex items-center gap-3">
        {/* Status dot */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot} ring-2 ${config.ring}`} />
          <span className="text-xs font-medium text-gray-300">{config.label}</span>
        </div>

        <span className="text-surface-border">|</span>

        {/* Last synced */}
        <span className="text-xs text-gray-500">
          Last synced: {formatTimeSince(lastSync)}
        </span>
      </div>

      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        disabled={spinning}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal transition-colors disabled:cursor-not-allowed"
      >
        <RefreshCw
          size={13}
          className={`transition-transform ${spinning ? 'animate-spin' : ''}`}
        />
        Refresh
      </button>
    </div>
  );
};

export default RefreshBanner;
