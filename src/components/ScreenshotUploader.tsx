import React, { useRef, useState } from 'react';
import { saveUpload } from '../services/uploadService';

type Props = {
  onUploaded?: () => void;
};

export default function ScreenshotUploader({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        await saveUpload({ name: file.name, dataUrl });
        setUploading(false);
        inputRef.current!.value = '';
        onUploaded && onUploaded();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploading(false);
      console.error(err);
    }
  }

  async function handleCapture() {
    // Use MediaDevices.getUserMedia to capture a photo from camera if available
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new (window as any).ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      track.stop();
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        await saveUpload({ name: `capture-${Date.now()}.jpg`, dataUrl });
        onUploaded && onUploaded();
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      // Fallback: trigger file input
      inputRef.current?.click();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCapture}
          className="px-3 py-2 rounded-md bg-aegis-gold-500 text-black font-medium"
        >
          Capture
        </button>
        <label className="px-3 py-2 rounded-md bg-black/60 border border-black/40 text-sm text-gray-200 cursor-pointer">
          Choose File
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        {uploading && <div className="text-sm text-gray-300">Uploading...</div>}
      </div>
    </div>
  );
}
