import { useRef, useState } from 'react';
import { Download, Upload, Database, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import {
  exportBackup,
  downloadBackup,
  validateBackupFile,
  importBackup,
  countExistingImages,
  type BackupFile,
} from '../lib/backup';

type Phase = 'idle' | 'exporting' | 'validating' | 'importing';

export function BackupRestore() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ backup: BackupFile; existing: number } | null>(null);

  const handleExport = async () => {
    setPhase('exporting');
    setError(null);
    try {
      const backup = await exportBackup();
      downloadBackup(backup);
    } catch {
      setError('Export failed — could not read stored data.');
    } finally {
      setPhase('idle');
    }
  };

  const handleFile = async (file: File) => {
    setPhase('validating');
    setError(null);
    try {
      const result = await validateBackupFile(file);
      if (!result.ok || !result.backup) {
        setError(result.error ?? 'Invalid backup file.');
        return;
      }
      const existing = await countExistingImages(result.backup);
      setPending({ backup: result.backup, existing });
    } catch {
      setError('Could not read the selected file.');
    } finally {
      setPhase('idle');
    }
  };

  const confirmImport = async () => {
    if (!pending) return;
    setPhase('importing');
    setError(null);
    try {
      await importBackup(pending.backup);
      setPending(null);
      // Refresh the application so all in-memory state reloads from storage.
      setTimeout(() => window.location.reload(), 300);
    } catch {
      setError('Import failed — data was not changed.');
      setPhase('idle');
    }
  };

  const cancelImport = () => {
    setPending(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Database className="h-4 w-4 text-gold-300" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-400/80">
          Utilities
        </span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-white/45">
        Back up every mission and screenshot to a single file, or restore from a previous export.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <Button variant="ghost" onClick={handleExport} disabled={phase !== 'idle'} className="w-full">
          {phase === 'exporting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting…
            </>
            ) : (
            <>
              <Download className="h-4 w-4" />
              Export Backup
            </>
            )}
        </Button>
        <Button
          variant="ghost"
          onClick={() => fileRef.current?.click()}
          disabled={phase !== 'idle'}
          className="w-full"
        >
          {phase === 'validating' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating…
            </>
            ) : (
            <>
              <Upload className="h-4 w-4" />
              Import Backup
            </>
            )}
        </Button>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-red-400/80">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}

      <Modal
        open={!!pending}
        onClose={cancelImport}
        title="Confirm Restore"
      >
        {pending && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-100/80">
                Importing will <span className="font-semibold">replace all current missions and screenshots</span> with the contents of this backup. This cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Missions in backup" value={`${pending.backup.missions.length}`} />
              <Stat label="Screenshots in backup" value={`${pending.backup.images.length}`} />
            </div>

            <p className="text-[11px] text-white/40">
              Exported {new Date(pending.backup.exportedAt).toLocaleString()}. The app will refresh after import.
            </p>

            <div className="flex gap-2.5">
              <Button variant="ghost" onClick={cancelImport} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={confirmImport}
                disabled={phase === 'importing'}
                className="flex-1"
              >
                {phase === 'importing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Restoring…
                  </>
                ) : (
                  'Restore & Refresh'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <div className="font-display text-lg font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/40">{label}</div>
    </div>
  );
}
