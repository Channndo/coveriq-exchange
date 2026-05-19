"use client";

interface BubbleSelectProps {
  options: { id: string; label: string }[];
  selected: string[];
  multi?: boolean;
  onChange: (selected: string[]) => void;
}

export function BubbleSelect({ options, selected, multi = false, onChange }: BubbleSelectProps) {
  const toggle = (id: string) => {
    if (multi) {
      onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    } else {
      onChange([id]);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "border-cyan-400/60 bg-cyan-500/20 text-cyan-100"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
