"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell page">
      <div className="error-box">
        <h1 className="page-title">Something failed</h1>
        <p>{error.message || "This page could not be loaded."}</p>
        <button className="btn" type="button" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
