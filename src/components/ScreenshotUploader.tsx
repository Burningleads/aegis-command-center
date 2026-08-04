import { useRef, useState } from 'react';
import { ImagePlus, X, ImageIcon } from 'lucide-react';
import { putImage, deleteImage, uid } from '../lib/imageStore';
import { useStoredImage } from '../hooks/useStoredImage';

interface ImageUploadProps {
  label: string;
  imageId?: string;
  onChange: (imageId: string | undefined) => void;
}

const MAX_DIM = 1280;
const QUALITY = 0.72;

/** Resize + compress an image file to a JPEG blob to keep IndexedDB lean. */
function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read-failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode-failed'));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const scale = MAX_DIM / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('ctx-failed'));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('blob-failed'))),
          'image/jpeg',
          QUALITY
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ label, imageId, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing image preview when an imageId is present (e.g. editing).
  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await compressImage(file);
      const newId = uid();
      await putImage(newId, blob);
      // Remove the previous image if present
      if (imageId) await deleteImage(imageId).catch(() => {});
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      onChange(newId);
    } catch {
      setError('Could not load image');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (imageId) await deleteImage(imageId).catch(() => {});
    setPreviewUrl(null);
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {previewUrl || imageId ? (
        <PreviewSlot url={previewUrl} imageId={imageId} onRemove={remove} loading={loading} />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-7 text-white/40 transition-all hover:border-gold-400/40 hover:text-gold-300/70 active:scale-[0.98]"
        >
          {loading ? (
            <span className="text-xs font-medium text-gold-300">Processing…</span>
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs font-medium">Upload or choose screenshot</span>
            </>
          )}
        </button>
      )}

      {error && <p className="mt-1.5 text-[11px] text-red-400/80">{error}</p>}
    </div>
  );
}

function PreviewSlot({
  url,
  imageId,
  onRemove,
  loading,
}: {
  url: string | null;
  imageId?: string;
  onRemove: () => void;
  loading: boolean;
}) {
  // If we have a fresh upload url use it, otherwise lazy-load from store.
  const stored = useStoredImage(!url ? imageId : undefined);
  const display = url ?? stored;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      {display ? (
        <img src={display} alt="Chart screenshot" className="h-44 w-full object-cover" />
      ) : (
        <div className="grid h-44 place-items-center text-white/30">
          <ImageIcon className="h-7 w-7" />
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white/80 backdrop-blur transition-colors hover:bg-red-500/40 hover:text-white"
        aria-label="Remove screenshot"
      >
        <X className="h-4 w-4" />
      </button>
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 text-xs font-medium text-gold-300">
          Processing…
        </div>
      )}
    </div>
  );
}
