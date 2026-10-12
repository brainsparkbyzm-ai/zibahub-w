"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const email = String(new FormData(event.currentTarget).get("email") || "");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) setError(payload?.error?.message || "Could not save that email.");
    else setMessage("You are on the list.");
  }
  return (
    <form className="zh-news" onSubmit={onSubmit}>
      <div className="zh-news-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#071A3D" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></svg>
      </div>
      <div>
        <h2>Get Better Trade Career Insights</h2>
        <p>Job alerts, salary trends, training tips and more.</p>
      </div>
      <div className="zh-news-row">
        <label className="sr-only" htmlFor="zh-news-email">Email address</label>
        <input id="zh-news-email" name="email" type="email" required placeholder="Enter your email address" />
        <button type="submit">Subscribe</button>
      </div>
      {error ? <p className="zh-form-error" role="alert">{error}</p> : null}
      {message ? <p className="zh-form-ok" role="status">{message}</p> : null}
      <ul>
        <li>No spam</li>
        <li>Unsubscribe anytime</li>
        <li>100% free</li>
      </ul>
    </form>
  );
}
