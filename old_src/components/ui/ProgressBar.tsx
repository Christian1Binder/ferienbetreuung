import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showText?: boolean;
}

export function ProgressBar({ progress, className, showText = false }: ProgressBarProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={twMerge(clsx('w-full', className))}>
      {showText && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-awo-red">{Math.round(safeProgress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-awo-red h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${safeProgress}%` }}
        ></div>
      </div>
    </div>
  );
}
