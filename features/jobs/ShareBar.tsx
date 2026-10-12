"use client";

export function ShareBar({ url }: { url: string }) {
  return (
    <button className="btn-ghost" type="button" onClick={async () => {
      if (navigator.share) await navigator.share({ url, title: "ZibaHub job" });
      else { await navigator.clipboard.writeText(url); window.alert("Link copied."); }
    }}>Share</button>
  );
}
