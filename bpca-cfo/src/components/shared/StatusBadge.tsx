import React from 'react';
import { getStatusBadgeClass } from '../../utils/format';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const badgeClass = getStatusBadgeClass(status);
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : '';

  return (
    <span className={`${badgeClass} ${sizeClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
