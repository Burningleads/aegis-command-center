import { useEffect, useState } from 'react';
import { Check, X, Minus, Award } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { ImageUpload } from './ImageUpload';
import type { Mission, Result } from '../types';
import { plannedRR, defaultRealizedR } from '../lib/missions';
import type { DebriefInput } from '../hooks/useMissions';

interface DebriefModalProps {
  open: boolean;
  mission: Mission | null;
  onClose: () => void;
  onComplete: (id: string, debrief: DebriefInput) => void;
}

export function DebriefModal({ open, mission, onClose, onComplete }: DebriefModalProps) {
  const [result, setResult] = useState<Result | null>(null);
  const [pnlR, setPnlR] = useState<string>('');
  const [lesson, setLesson] = useState('');
  const [afterImageId, setAfterImageId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Reset state whenever a different mission is opened.
  useEffect(() => {
    if (open && mission) {
      setResult(null);
      setPnlR('');
      setLesson('');
      setAfterImageId(undefined);
      setError(null);
    }
  }, [open, mission?.id]);

  if (!mission) return null;
  const planned = plannedRR(mission);

  const selectResult = (r: Result) => {
    setResult(r);
    if (!pnlR) setPnlR(String(defaultRealizedR(r, planned)));
    setError(null);
  };

  const handleSubmit = () => {
    if (!result) {
      setError('Select a result');
      return;
    }
    const r = parseFloat(pnlR);
    if (isNaN(r)) {
      setError('Enter a valid R multiple');
      return;
    }
    if (!lesson.trim()) {
      setError('A lesson learned is required');
      return;
    }
    onComplete(mission.id, { result, pnlR: r, lesson: lesson.trim(), afterImageId });
  };

  return (
    <Modal open={open} onClose={onClose} title="Mission Debrief">
      <div className="space-y-5">
        {/* Mission summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-bold text-white">{mission.pair}</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                mission.direction === 'Long' ? 'text-emerald-300' : 'text-red-300'
              }`}
            >
              {mission.direction}
            </span>
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-white/40">
            Planned R:R {planned ? `1:${planned.toFixed(1)}` : '—'} · Risk {mission.riskPercent}%
          </div>
        </div>

        {/* Result */}
        <div>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Result
          </span>
          <div className="grid grid-cols-3 gap-2">
            <ResultBtn label="Win" icon={<Check className="h-4 w-4" />} tone="green" active={result === 'Win'} onClick={() => selectResult('Win')} />
            <ResultBtn label="Loss" icon={<X className="h-4 w-4" />} tone="red" active={result === 'Loss'} onClick={() => selectResult('Loss')} />
            <ResultBtn label="B/E" icon={<Minus className="h-4 w-4" />} tone="neutral" active={result === 'Breakeven'} onClick={() => selectResult('Breakeven')} />
          </div>
        </div>

        {/* P/L in R */}
        <div>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Profit / Loss in R
          </span>
          <div className="flex items-center gap-3">
            <input
              className="aegis-input w-24 text-center font-display tabular-nums"
              inputMode="decimal"
              placeholder="0.00"
              value={pnlR}
              onChange={(e) => setPnlR(e.target.value)}
            />
            <span className="font-display text-lg font-bold text-gold-300">R</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-white/30">
              e.g. +3.0 / -1.0
            </span>
          </div>
        </div>

        {/* Lesson */}
        <div>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Lesson Learned
          </span>
          <textarea
            className="aegis-input resize-none leading-relaxed"
            placeholder="What did this mission teach you? What would you do differently?"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            rows={3}
          />
          <div className="mt-1 text-right text-[10px] text-white/30">{lesson.length}/300</div>
        </div>

        {/* After Exit screenshot */}
        <ImageUpload
          label="After Exit Chart"
          imageId={afterImageId}
          onChange={setAfterImageId}
        />

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-300/80">
            <Award className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full">
          <Check className="h-4 w-4" />
          Complete Mission
        </Button>
      </div>
    </Modal>
  );
}

function ResultBtn({
  label,
  icon,
  tone,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  tone: 'green' | 'red' | 'neutral';
  active: boolean;
  onClick: () => void;
}) {
  const toneClass = active
    ? tone === 'green'
      ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40'
      : tone === 'red'
      ? 'bg-red-500/15 text-red-300 ring-1 ring-red-400/40'
      : 'bg-white/10 text-white/90 ring-1 ring-white/20'
    : 'border border-white/10 bg-white/[0.03] text-white/45 hover:text-white/70';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-all ${toneClass}`}
    >
      {icon}
      {label}
    </button>
  );
}
