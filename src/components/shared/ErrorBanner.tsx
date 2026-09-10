import { Button } from '@/components/ui/Button';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="bg-error-bg rounded-sm flex items-center justify-between gap-4 px-4 py-3">
      <p className="text-body-sm text-error-text">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
