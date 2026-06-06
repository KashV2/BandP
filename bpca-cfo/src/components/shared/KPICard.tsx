import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/format';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: LucideIcon;
  sparklineData?: number[];
  onClick?: () => void;
}

const changeColors = {
  positive: 'text-teal',
  negative: 'text-red-400',
  neutral: 'text-gray-400',
};

const sparklineColors = {
  positive: '#00D4B4',
  negative: '#f87171',
  neutral: '#9ca3af',
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  icon: Icon,
  sparklineData,
  onClick,
}) => {
  const chartData = sparklineData?.map((v, i) => ({ idx: i, val: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'glass-card-hover p-5 flex flex-col gap-3 h-full',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-teal/10">
            <Icon size={16} className="text-teal" />
          </div>
        )}
      </div>

      {/* Value + change */}
      <div className="flex items-end gap-2">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="kpi-value text-white"
        >
          {value}
        </motion.span>
        {change && (
          <span className={`text-sm font-medium mb-0.5 ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}

      {/* Sparkline */}
      {chartData && chartData.length > 0 && (
        <div className="h-10 -mx-1 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`spark-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparklineColors[changeType]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={sparklineColors[changeType]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke={sparklineColors[changeType]}
                strokeWidth={1.5}
                fill={`url(#spark-${title.replace(/\s/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;
