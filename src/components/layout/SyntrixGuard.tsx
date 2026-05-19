const SYNTRIX_URL = "https://syntrix.solutions";
const LOGO_SRC = "/syntrix-logo.png";

export function SyntrixGuard() {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex justify-center pb-20 md:pb-5">
      <a
        href={SYNTRIX_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-[#030712]/70 px-4 py-2 backdrop-blur-md transition hover:border-cyan-500/30 hover:bg-[#030712]/90"
        aria-label="Guarded by SYNTRIX — opens syntrix.solutions"
      >
        <img
          src={LOGO_SRC}
          alt=""
          width={22}
          height={22}
          className="h-[22px] w-[22px] shrink-0 object-contain"
          decoding="async"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Guarded by <span className="text-slate-200">SYNTRIX</span>
        </span>
      </a>
    </div>
  );
}
