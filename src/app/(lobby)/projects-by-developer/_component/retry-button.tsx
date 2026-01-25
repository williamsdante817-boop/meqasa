"use client";

export function RetryButton({ message }: { message: string }) {
  return (
    <button
      onClick={() => window.location.reload()}
      className="bg-brand-primary hover:bg-brand-primary/90 focus:ring-brand-primary rounded-md px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
      aria-label={`Retry loading ${message}`}
    >
      Try again
    </button>
  );
}
