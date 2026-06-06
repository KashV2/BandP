import React from 'react';
import { formatIndianCurrency } from '../../utils/format';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  formatter?: (value: number) => string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
}) => {
  if (!active || !payload?.length) return null;

  const format = formatter || ((v: number) => formatIndianCurrency(v));

  return (
    <div className="bg-surface/90 backdrop-blur-md border border-surface-border/60 rounded-lg px-3 py-2 shadow-xl">
      {label && (
        <p className="text-xs text-gray-400 mb-1.5 font-medium">{label}</p>
      )}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-400">{entry.name}:</span>
          <span className="font-mono text-white font-medium">
            {format(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChartTooltip;
