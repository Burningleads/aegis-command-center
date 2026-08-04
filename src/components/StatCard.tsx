import { Target, Scale, Flame, Trophy } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import type { Stats } from '../types';
import { BackupRestore } from './BackupRestore';

interface StatisticsProps {
  stats: Stats;
}

export function Statistics({ stats }: StatisticsProps) {
  const { ref, inView } = useInView();
  const winRate = useCountUp(stats.winRate, inView);
  const avgRR = useCountUp(stats.avgRR, inView);
  const total = Math.round(useCountUp(stats.total, inView));
  const streak = stats.currentStreak;

  return (
    <div className="animate-tab-in space-y-5" ref={ref}>
      <div className="px-1 pt-1">
        <p className="text-sm text-white/45">{stats.completed} missions completed</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Statistics</h1>
      </div>

      {/* Win rate ring */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-sm">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-4">
          <WinRateRing value={winRate} />
          <div className="flex items-center gap-4 text-center">
            <Pill label="Wins" value={stats.wins} tone="green" />
            <span className="h-8 w-px bg-white/10" />
            <Pill label="Losses" value={stats.losses} tone="red" />
            <span className="h-8 w-px bg-white/10" />
            <Pill label="B/E" value={stats.breakeven} tone="neutral" />
          </div>
        </div>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Total Missions" value={`${total}`} icon={<Target className="h-4 w-4" />} accent="gold" delay={0.05} />
        <MetricCard label="Average R:R" value={avgRR.toFixed(2)} icon={<Scale className="h-4 w-4" />} accent="neutral" delay={0.1} suffix={stats.completed ? 'realized' : undefined} />
        <MetricCard
          label="Current Streak"
          value={streak === 0 ? '—' : `${Math.abs(streak)}`}
          icon={<Flame className="h-4 w-4" />}
          accent={streak > 0 ? 'positive' : streak < 0 ? 'warning' : 'neutral'}
          delay={0.15}
          suffix={streak > 0 ? 'wins' : streak < 0 ? 'losses' : undefined}
        />
        <MetricCard label="Best Streak" value={`${stats.bestStreak}`} icon={<Trophy className="h-4 w-4" />} accent="gold" delay={0.2} suffix="wins" />
      </div>

      {/* Distribution bar */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Win / Loss Distribution
          </span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-white/10">
          {stats.completed > 0 && (
            <>
              <div className="h-full bg-emerald-400/80" style={{ width: `${(stats.wins / stats.completed) * 100}%` }} />
              <div className="h-full bg-white/15" style={{ width: `${(stats.breakeven / stats.completed) * 100}%` }} />
              <div className="h-full bg-red-400/80" style={{ width: `${(stats.losses / stats.completed) * 100}%` }} />
            </>
          )}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-white/35">
          <span className="text-emerald-400/70">{stats.wins}W</span>
          <span>{stats.breakeven}B/E</span>
          <span className="text-red-400/70">{stats.losses}L</span>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Mission Status
        </div>
        <div className="space-y-2.5">
          <StatusRow label="Planned" value={stats.planned} color="bg-sky-400/70" total={stats.total} />
          <StatusRow label="Active" value={stats.active} color="bg-amber-400/70" total={stats.total} />
          <StatusRow label="Completed" value={stats.completed} color="bg-emerald-400/70" total={stats.total} />
          <StatusRow label="Cancelled" value={stats.cancelled} color="bg-white/30" total={stats.total} />
        </div>
      </div>

      {stats.completed === 0 && (
        <p className="px-2 text-center text-xs leading-relaxed text-white/35">
          Complete some missions to unlock win rate, average R:R, and streak insights.
        </p>
      )}

      <BackupRestore />
    </div>
  );
}

function WinRateRing({ value }: { value: number }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative grid place-items-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)' }}
        />
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1d98f" />
            <stop offset="100%" stopColor="#b8941f" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-white tabular-nums">{value.toFixed(0)}%</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-400/70">Win Rate</span>
      </div>
    </div>
  );
}

function Pill({ label, value, tone }: { label: string; value: number; tone: 'green' | 'red' | 'neutral' }) {
  const color = tone === 'green' ? 'text-emerald-400' : tone === 'red' ? 'text-red-400' : 'text-white/60';
  return (
    <div>
      <div className={`font-display text-lg font-bold tabular-nums ${color}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-white/35">{label}</div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  accent,
  suffix,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: 'gold' | 'neutral' | 'positive' | 'warning';
  suffix?: string;
  delay: number;
}) {
  const accentColor =
    accent === 'gold' ? 'text-gold-300'
    : accent === 'positive' ? 'text-emerald-400'
    : accent === 'warning' ? 'text-amber-400'
    : 'text-white/90';
  return (
    <div className="aegis-reveal relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4 backdrop-blur-sm" style={{ animationDelay: `${delay}s` }}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gold-400/5 blur-2xl" />
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">{label}</span>
        <span className={`${accentColor} opacity-70`}>{icon}</span>
      </div>
      <div className={`mt-3 font-display text-2xl font-bold ${accentColor}`}>{value}</div>
      {suffix && <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/30">{suffix}</div>}
    </div>
  );
}

function StatusRow({ label, value, color, total }: { label: string; value: number; color: string; total: number }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-white/55">{label}</span>
        <span className="font-display font-semibold tabular-nums text-white/80">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
