"use client";

export function ErrorFallback() {
  return (
    <div className="py-12 text-center">
      <p className="text-brand-muted mb-4">
        Unable to load developers at this time.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="text-brand-primary hover:text-brand-primary-darken underline"
      >
        Try again
      </button>
    </div>
  );
}
