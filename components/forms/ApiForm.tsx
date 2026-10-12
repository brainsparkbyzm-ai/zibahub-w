"use client";

import { useState, type ReactNode, type FormEvent } from "react";

export function ApiForm({ action, children, submitLabel }: { action: string; children: ReactNode; submitLabel: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(action, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => null);
    setPending(false);
    if (!response.ok || !payload?.ok) {
      setError(payload?.error?.message || "The request failed.");
      return;
    }
    setMessage(payload.message || "Saved.");
    if (payload.redirect) window.location.href = payload.redirect;
  }

  return (
    <form className="card" onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      {children}
      {error ? <div className="error-box" role="alert">{error}</div> : null}
      {message ? <div className="notice" role="status">{message}</div> : null}
      <button className="btn btn-amber" type="submit" disabled={pending}>{pending ? "Working…" : submitLabel}</button>
    </form>
  );
}
