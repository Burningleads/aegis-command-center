import { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Target,
  Inbox,
  Play,
  ClipboardCheck,
  Brain,
  ImageIcon,
  Ban,
} from 'lucide-react';
import type { Mission, MissionStatus } from '../types';
import { plannedRR, formatRelative } from '../lib/missions';
import { Button } from './Button';
import { useStoredImage } from '../hooks/useStoredImage';

interface HistoryProps {
  missions: Mission[];
  onActivate: (id: string) => void;
  onCancel: (id: string) => void;
  onDebrief: (id: string) => void;
  onDelete: (id: string) => void;
  onNewMission: () => void;
}

type Filter = 'All' | MissionStatus;

const FILTERS: Filter[] = ['All', 'Planned', 'Active', 'Completed', 'Cancelled'];

export function MissionHistory({
  missions,
  onActivate,
  onCancel,
  onDebrief,
  onDelete,
  onNewMission,
}: HistoryProps) {
  const [filter, setFilter] = useState<Filter>('All');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Mission | null>(null);

  const filtered = missions.filter((m) => filter === 'All' || m.status === filter);
  const counts = Object.fromEntries(
    FILTERS.map((f) => [
      f,
      f === 'All' ? missions.length : missions.filter((m) => m.status === f).length,
    ])
  ) as Record<Filter, number>;

  return (
    <div className="animate-tab-in space-y-4">
      <div className="px-1 pt-1">
        <p className="text-sm text-white/45">{missions.length} missions logged</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
          Mission History
        </h1>
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/40'
                : 'bg-white/[0.04] text-white/45 hover:text-white/70'
            }`}
          >
            {f}
            <span className="text-[10px] opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState onNewMission={onNewMission} hasMissions={missions.length > 0} />
      ) : (
        <div className="stagger space-y-3">
          {filtered.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              isConfirmDelete={confirmDelete === m.id}
              onActivate={() => onActivate(m.id)}
              onCancel={() => onCancel(m.id)}
              onDebrief={() => onDebrief(m.id)}
              onViewEvidence={() => setViewing(m)}
              onRequestDelete={() => setConfirmDelete(m.id)}
              onConfirmDelete={() => {
                onDelete(m.id);
                setConfirmDelete(null);
              }}
              onCancelDelete={() => setConfirmDelete(null)}
            />
          ))}
        </div>
      )}

      {/* Evidence viewer */}
      {viewing && (
        <EvidenceViewer mission={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

function MissionCard({
  mission: m,
  isConfirmDelete,
  onActivate,
  onCancel,
  onDebrief,
  onViewEvidence,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  mission: Mission;
  isConfirmDelete: boolean;
  onActivate: () => void;
  onCancel: () => void;
  onDebrief: () => void;
  onViewEvidence: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const isLong = m.direction === 'Long';
  const rr = plannedRR(m);
  const status = STATUS_STYLES[m.status];
  const hasEvidence = !!m.beforeImageId || !!m.afterImageId;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-sm transition-all duration-300 hover:border-white/20">
      <div className={`absolute inset-y-0 left-0 w-1 ${isLong ? 'bg-emerald-400/70' : 'bg-red-400/70'}`} />

      <div className="p-4 pl-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold text-white">{m.pair}</span>
            <span
              className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                isLong ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-300'
              }`}
            >
              {isLong ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
              {m.direction}
            </span>
          </div>
          <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
            {m.status}
          </span>
        </div>

        {/* Levels */}
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          <Level label="Entry" value={m.entry} />
          <Level label="SL" value={m.stopLoss} tone="red" />
          <Level label="TP" value={m.takeProfit} tone="green" />
          <Level label="R:R" value={rr ? `1:${rr.toFixed(1)}` : '—'} tone="gold" />
        </div>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-wider text-white/35">
          <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {m.confidence}%</span>
          <span>Risk {m.riskPercent}%</span>
          <span>{m.session}</span>
          <span className="text-white/30">{m.emotion}</span>
          <span className="ml-auto">{formatRelative(m.createdAt)}</span>
        </div>

        {/* Reason */}
        {m.reason && (
          <p className="mt-3 rounded-lg bg-black/30 px-3 py-2 text-xs leading-relaxed text-white/55">
            {m.reason}
          </p>
        )}

        {/* Debrief summary for completed */}
        {m.status === 'Completed' && (m.lesson || typeof m.pnlR === 'number') && (
          <div className="mt-3 rounded-xl border border-gold-400/15 bg-gold-400/[0.04] p-3">
            {typeof m.pnlR === 'number' && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-gold-400/70">Realized</span>
                <span
                  className={`font-display text-sm font-bold ${
                    m.pnlR > 0 ? 'text-emerald-300' : m.pnlR < 0 ? 'text-red-300' : 'text-white/60'
                  }`}
                >
                  {m.pnlR > 0 ? '+' : ''}
                  {m.pnlR.toFixed(2)}R
                </span>
              </div>
            )}
            {m.lesson && (
              <p className="mt-2 flex gap-1.5 text-xs leading-relaxed text-white/60">
                <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" />
                {m.lesson}
              </p>
            )}
          </div>
        )}

        {/* Evidence + Actions */}
        {isConfirmDelete ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 p-2.5">
            <span className="flex-1 px-1 text-xs text-red-200/80">Delete this mission?</span>
            <button onClick={onConfirmDelete} className="rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/30">
              Delete
            </button>
            <button onClick={onCancelDelete} className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-white/60 hover:text-white">
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {m.status === 'Planned' && (
              <ActionButton onClick={onActivate} tone="gold">
                <Play className="h-3.5 w-3.5" /> Activate
              </ActionButton>
            )}
            {(m.status === 'Planned' || m.status === 'Active') && (
              <ActionButton onClick={onDebrief} tone="gold-strong">
                <ClipboardCheck className="h-3.5 w-3.5" /> Complete
              </ActionButton>
            )}
            {(m.status === 'Planned' || m.status === 'Active') && (
              <ActionButton onClick={onCancel} tone="neutral">
                <Ban className="h-3.5 w-3.5" /> Cancel
              </ActionButton>
            )}
            {hasEvidence && (
              <ActionButton onClick={onViewEvidence} tone="ghost">
                <ImageIcon className="h-3.5 w-3.5" /> Evidence
              </ActionButton>
            )}
            <button
              onClick={onRequestDelete}
              className="ml-auto grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/40 transition-all hover:border-red-400/30 hover:text-red-400"
              aria-label="Delete mission"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<MissionStatus, { text: string; bg: string }> = {
  Planned: { text: 'text-sky-300', bg: 'bg-sky-400/10' },
  Active: { text: 'text-amber-300', bg: 'bg-amber-400/10' },
  Completed: { text: 'text-emerald-300', bg: 'bg-emerald-400/10' },
  Cancelled: { text: 'text-white/40', bg: 'bg-white/5' },
};

function Level({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  tone?: 'neutral' | 'red' | 'green' | 'gold';
}) {
  const toneClass =
    tone === 'red' ? 'text-red-300/90'
    : tone === 'green' ? 'text-emerald-300/90'
    : tone === 'gold' ? 'text-gold-300'
    : 'text-white/85';
  return (
    <div className="rounded-lg bg-black/20 px-1 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-white/35">{label}</div>
      <div className={`mt-0.5 font-display text-xs font-semibold tabular-nums ${toneClass}`}>
        {typeof value === 'number' ? formatNum(value) : value}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone: 'gold' | 'gold-strong' | 'neutral' | 'ghost';
}) {
  const cls =
    tone === 'gold-strong'
      ? 'bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/40 hover:bg-gold-400/25'
      : tone === 'gold'
      ? 'border border-gold-400/30 bg-gold-400/10 text-gold-300 hover:bg-gold-400/20'
      : tone === 'ghost'
      ? 'border border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
      : 'border border-white/10 bg-white/[0.03] text-white/45 hover:text-white/70';
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${cls}`}>
      {children}
    </button>
  );
}

function formatNum(n: number): string {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (n >= 100) return n.toFixed(2);
  return n.toString();
}

function EvidenceViewer({ mission, onClose }: { mission: Mission; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="aegis-backdrop absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <div className="aegis-modal-panel relative max-h-[88vh] w-full max-w-shell overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-display text-base font-bold text-white">{mission.pair} · Evidence</span>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/50 hover:text-white">✕</button>
        </div>
        <div className="space-y-4">
          <EvidenceSlot label="Before Entry" imageId={mission.beforeImageId} />
          <EvidenceSlot label="After Exit" imageId={mission.afterImageId} />
        </div>
      </div>
    </div>
  );
}

function EvidenceSlot({ label, imageId }: { label: string; imageId?: string }) {
  const url = useStoredImage(imageId);
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400/70">{label}</div>
      {url ? (
        <img src={url} alt={label} className="w-full rounded-xl border border-white/10" />
      ) : (
        <div className="grid h-32 place-items-center rounded-xl border border-dashed border-white/10 text-white/25">
          <ImageIcon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

function EmptyState({ onNewMission, hasMissions }: { onNewMission: () => void; hasMissions: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <Inbox className="h-7 w-7 text-white/30" />
      </div>
      <p className="mt-4 font-display text-base font-semibold text-white/70">
        {hasMissions ? 'No missions in this filter' : 'No missions yet'}
      </p>
      <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-white/40">
        {hasMissions ? 'Try a different filter to see your tracked trades.' : 'Log your first mission to start building your edge.'}
      </p>
      {!hasMissions && (
        <Button onClick={onNewMission} variant="ghost" className="mt-5">
          <Target className="h-4 w-4" /> New Mission
        </Button>
      )}
    </div>
  );
}
