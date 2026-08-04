import { type ReactNode } from 'react';
import { ShieldAlert, Inbox, Activity, Clock, ArrowRight, Flame, FilePlus2 } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import type { Mission, Stats } from '../types';
import { activeSession, todaysRisk, todaysConfidence } from '../lib/missions';
import { Button } from './Button';

interface DashboardProps {
  missions: Mission[];
  stats: Stats;
  onNewMission: () => void;
}

function Card({
  label,
  value,
  icon,
  children,
  accent = 'neutral',
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  children?: ReactNode;
  accent?: 'gold' | 'neutral' | 'positive' | 'warning';
  delay?: number;
}) {
  const accentColor =
    accent === 'gold'
      ? 'text-gold-300'
      : accent === 'positive'
      ? 'text-emerald-400'
      : accent === 'warning'
      ? 'text-amber-400'
      : 'text-white/90';

  return (
    <div
      className="aegis-reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4 backdrop-blur-sm transition-all duration-300 hover:border-gold-400/30"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-400/5 blur-2xl transition-opacity duration-300 group-hover:bg-gold-400/10" />
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
          {label}
        </span>
        <span className={`${accentColor} opacity-70`}>{icon}</span>
      </div>
      <div className={`mt-3 font-display text-2xl font-semibold ${accentColor}`}>{value}</div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export function Dashboard({ missions, stats, onNewMission }: DashboardProps) {
  const { ref, inView } = useInView();
  const risk = useCountUp(todaysRisk(missions), inView);
  const confidence = Math.round(useCountUp(todaysConfidence(missions), inView));
  const session = activeSession();
  const openCount = stats.active + stats.planned;
  const riskLevel = risk >= 3 ? 4 : risk >= 1.5 ? 2 : 1;

  return (
    <div className="animate-tab-in space-y-5">
      <div className="px-1 pt-1">
        <p className="text-sm text-white/45">Welcome back, Trader.</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
          Command Center
        </h1>
      </div>

      <div ref={ref} className="grid grid-cols-2 gap-3">
        <Card label="Today's Risk" value={`${risk.toFixed(2)}%`} icon={<ShieldAlert className="h-4 w-4" />} accent="warning" delay={0.05}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`h-3 w-1.5 rounded-full transition-colors duration-500 ${
                    i < riskLevel ? 'bg-amber-400' : 'bg-white/15'
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400/80">
              {riskLevel >= 4 ? 'High' : riskLevel >= 2 ? 'Moderate' : 'Low'}
            </span>
          </div>
        </Card>

        <Card label="Open Missions" value={`${openCount}`} icon={<Inbox className="h-4 w-4" />} accent="gold" delay={0.1}>
          <div className="flex gap-3 text-[10px] uppercase tracking-wider">
            <span className="text-amber-400/80">{stats.active} Active</span>
            <span className="text-white/35">{stats.planned} Planned</span>
          </div>
        </Card>

        <Card label="Today's Confidence" value={`${confidence}%`} icon={<Activity className="h-4 w-4" />} accent="gold" delay={0.15}>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 transition-all duration-1000 ease-out"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </Card>

        <Card label="Current Session" value={session.name} icon={<Clock className="h-4 w-4" />} accent="positive" delay={0.2}>
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {session.subtitle}
          </div>
        </Card>
      </div>

      {/* Streak strip */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        <Flame className="h-5 w-5 text-gold-300" />
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">Current Streak</div>
          <div className="font-display text-lg font-bold text-white">
            {stats.currentStreak > 0
              ? `${stats.currentStreak}W`
              : stats.currentStreak < 0
              ? `${Math.abs(stats.currentStreak)}L`
              : '—'}
          </div>
        </div>
        <div className="ml-auto h-8 w-px bg-white/10" />
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wider text-white/40">Win Rate</div>
          <div className="font-display text-lg font-bold text-white">
            {stats.completed ? `${stats.winRate.toFixed(0)}%` : '—'}
          </div>
        </div>
      </div>

      <Button onClick={onNewMission} className="w-full">
        <FilePlus2 className="h-4 w-4" />
        Log New Mission
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
