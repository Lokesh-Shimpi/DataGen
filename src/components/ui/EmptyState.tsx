/**
 * EmptyState Component
 * ====================
 * Displays when there's no data to show.
 * Provides helpful messaging and optional action buttons.
 */

import { cn } from '@/lib/utils';
import { LucideIcon, FileQuestion, Database, BarChart3, Upload } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'table' | 'chart' | 'upload';
}

// Variant icons mapping
const variantIcons: Record<string, LucideIcon> = {
  default: FileQuestion,
  table: Database,
  chart: BarChart3,
  upload: Upload,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        'rounded-lg border border-dashed border-border bg-secondary/30',
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {title}
      </h3>
      
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6"
          variant="default"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Preset empty states
export function EmptyTableState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="table"
      title="No data available"
      description="Generate a dataset to see your data displayed here."
      action={onAction ? { label: 'Generate Dataset', onClick: onAction } : undefined}
    />
  );
}

export function EmptyChartState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="chart"
      title="No visualization yet"
      description="Upload or enter data to create visualizations."
      action={onAction ? { label: 'Upload Data', onClick: onAction } : undefined}
    />
  );
}

export function EmptyUploadState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="upload"
      title="No file uploaded"
      description="Drag and drop a file here, or click to browse."
      action={onAction ? { label: 'Browse Files', onClick: onAction } : undefined}
    />
  );
}

export default EmptyState;