const MINT = "#5eead4";

export function CoverIqLogoSvg({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden
    >
      <g
        stroke="#ffffff"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M82 32c-6-14-20-22-36-20C24 14 10 30 8 48c-1 8 1 16 6 23 3 4 5 9 5 15v8h10v-5c0-7-2-13-7-18 7-1 13-5 17-11 5-7 7-16 6-26-1-11-8-21-18-26 8 4 14 12 15 22 1 13-5 25-16 31-3 2-6 5-8 9-1 3-2 7-2 11v4h10v-3c0-5 1-10 4-14 8-7 13-17 13-29 0-10-5-19-14-24 10 5 16 15 16 27 0 11-6 21-16 26" />
        <path d="M48 44l14-6M62 38l10 12M56 56l16-6M48 44l8 12M42 52l14-4" />
        <path d="M56 56v12M42 52v10" />
      </g>
      <g fill={MINT}>
        <circle cx="48" cy="44" r="6" />
        <circle cx="62" cy="38" r="5.5" />
        <circle cx="72" cy="50" r="5.5" />
        <circle cx="56" cy="56" r="5.5" />
        <circle cx="42" cy="52" r="5" />
      </g>
    </svg>
  );
}
