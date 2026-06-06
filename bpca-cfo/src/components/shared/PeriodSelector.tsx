import React from 'react';
import { cn } from '../../utils/format';

interface PeriodSelectorProps {
  activePeriod: string;
  onPeriodChange: (period: string) => void;
  periods?: string[];
}

const defaultPeriods = ['MTD', 'QTD', 'YTD', 'TTM'];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  activePeriod,
  onPeriodChange,
  periods = defaultPeriods,
}) => {
  return (
    <div className="flex items-center gap-1 bg-navy-50/50 rounded-lg p-1">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={cn(
            'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
            activePeriod === period
              ? 'bg-teal/15 text-teal border border-teal/30'
              : 'text-gray-400 hover:text-white hover:bg-surface-light'
          )}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
