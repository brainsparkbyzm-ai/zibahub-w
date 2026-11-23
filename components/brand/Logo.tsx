export function LogoMark({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="zh-hardhat" x1="12" y1="5" x2="52" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD36A" />
          <stop offset="1" stopColor="#FF9900" />
        </linearGradient>
        <linearGradient id="zh-shield" x1="9" y1="31" x2="55" y2="57" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#B8D7FF" />
        </linearGradient>
      </defs>
      <path d="M8 35c0-15.46 10.54-28 24-28s24 12.54 24 28H8Z" fill="url(#zh-hardhat)" stroke="#F6A21A" strokeWidth="2"/>
      <path d="M32 8v24M18 15l4 17M46 15l-4 17" stroke="#FFF4D8" strokeWidth="3.2" strokeLinecap="round"/>
      <path d="M5 34h54v6c0 3.31-2.69 6-6 6H11c-3.31 0-6-2.69-6-6v-6Z" fill="#0B2C58" stroke="#8BB7F5" strokeWidth="2"/>
      <path d="M12 44c2.5 8.2 10.2 14 20 14s17.5-5.8 20-14H12Z" fill="url(#zh-shield)" stroke="#0B2C58" strokeWidth="2"/>
      <path d="M20 48h24M25 53h14" stroke="#0B2C58" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

export function Wordmark({ tagline = true }: { tagline?: boolean }) {
  return (
    <span className="zh-wordmark">
      <strong><span className="zh-word-ziba">Ziba</span><span className="zh-word-hub">Hub</span></strong>
      {tagline ? <small>Skilled trades. Brighter futures.</small> : null}
    </span>
  );
}
