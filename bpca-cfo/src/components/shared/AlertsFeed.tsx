import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

interface Alert {
  id: string;
  type: 'high' | 'medium' | 'positive';
  title: string;
  description: string;
  timestamp: string;
}

interface AlertsFeedProps {
  alerts: Alert[];
}

const alertConfig = {
  high: {
    border: 'border-l-red-500',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    bg: 'bg-red-500/5',
  },
  medium: {
    border: 'border-l-amber-500',
    icon: AlertCircle,
    iconColor: 'text-amber-400',
    bg: 'bg-amber-500/5',
  },
  positive: {
    border: 'border-l-teal',
    icon: TrendingUp,
    iconColor: 'text-teal',
    bg: 'bg-teal/5',
  },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts }) => {
  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      {alerts.map((alert, index) => {
        const config = alertConfig[alert.type];
        const Icon = config.icon;

        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className={`glass-card border-l-[3px] ${config.border} ${config.bg} p-3.5`}
          >
            <div className="flex items-start gap-3">
              <Icon size={16} className={`${config.iconColor} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-gray-200 truncate">
                    {alert.title}
                  </h4>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {timeAgo(alert.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}

      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No alerts at this time
        </div>
      )}
    </div>
  );
};

export default AlertsFeed;
