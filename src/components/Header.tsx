import { Shield } from 'lucide-react';

interface HeaderProps {
  subtitle?: string;
}

export function Header({ subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 -mx-5 mb-2 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border-b border-white/5" />
      <div className="relative flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-gold-400/30 bg-gradient-to-br from-gold-400/15 to-transparent">
          <Shield className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
        </div>
        <div>
          <div className="font-display text-base font-bold tracking-tight text-white leading-none">
            Aegis
          </div>
          {subtitle && (
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/40">
              {subtitle}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-300/80">
            Live
          </span>
        </div>
      </div>
    </header>
  );
}
