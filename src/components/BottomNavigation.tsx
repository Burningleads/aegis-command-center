import { LayoutDashboard, FilePlus2, History, BarChart3 } from 'lucide-react';

export type TabId = 'dashboard' | 'log' | 'history' | 'stats';

interface NavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'log', label: 'Mission Log', icon: FilePlus2 },
  { id: 'history', label: 'History', icon: History },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
];

export function BottomNav({ active, onChange }: NavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-shell -translate-x-1/2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-black/85 px-1.5 py-1.5 backdrop-blur-xl shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.8)]">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors"
              aria-label={tab.label}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold-400/15 to-gold-400/[0.04] ring-1 ring-gold-400/25" />
              )}
              <Icon
                className={`relative h-5 w-5 transition-colors ${isActive ? 'text-gold-300' : 'text-white/40'}`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                className={`relative text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  isActive ? 'text-gold-300' : 'text-white/40'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
