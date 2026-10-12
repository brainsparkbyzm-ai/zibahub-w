export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 10h26.5c2.2 0 3.4 2.6 1.8 4.1L14.2 34.8c-.7.7-.2 1.9.8 1.9H40" fill="none" stroke="#071A3D" strokeWidth="7.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8.5h22" fill="none" stroke="#D6A84F" strokeWidth="5.2" strokeLinecap="round" />
      <path d="M16 39.5h22" fill="none" stroke="#D6A84F" strokeWidth="5.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ tagline = true }: { tagline?: boolean }) {
  return (
    <span className="zh-wordmark">
      <strong>ZibaHub</strong>
      {tagline ? <small>Skilled trades. Brighter futures.</small> : null}
    </span>
  );
}
