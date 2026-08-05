import { cn } from '@/lib/utils';
import type { ApplicationStatusStatus } from '@workspace/api-client-react';

interface StatusBadgeProps {
  status: ApplicationStatusStatus;
}

const statusConfig: Record<ApplicationStatusStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  waitlisted: {
    label: 'Waitlisted',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        config.className
      )}
      data-testid={`badge-status-${status}`}
    >
      {config.label}
    </span>
  );
}
