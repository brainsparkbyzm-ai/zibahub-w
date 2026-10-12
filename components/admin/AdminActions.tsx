"use client";

export function AdminActions({ id, entity, statuses }: { id: string; entity: string; statuses: string[] }) {
  async function send(action: string, extra: Record<string, string> = {}) {
    if (action === "delete" && !window.confirm("Delete this record? This cannot be undone.")) return;
    const response = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, entity, id, ...extra }) });
    const payload = await response.json();
    if (!response.ok) window.alert(payload?.error?.message || "Action failed.");
    else window.location.reload();
  }
  return (
    <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {statuses.map((status) => <button key={status} className="btn-line" type="button" onClick={() => send("status", { status })}>{status}</button>)}
      <button className="btn-line" type="button" onClick={() => send("delete")}>Delete</button>
    </span>
  );
}
