interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-red-600/50 bg-red-900/20 p-6 text-center text-red-200">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-red-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
