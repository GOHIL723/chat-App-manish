import { useEffect, useRef } from "react";
import { Upload, ImageIcon, FileText, Mic, Video } from "lucide-react";

interface DragDropOverlayProps {
  onDrop: (files: FileList) => void;
  onDismiss: () => void;
}

export function DragDropOverlay({ onDrop, onDismiss }: DragDropOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDragLeave = (e: DragEvent) => {
      // Only dismiss if leaving the overlay itself (not a child)
      if (!overlayRef.current?.contains(e.relatedTarget as Node)) {
        onDismiss();
      }
    };
    const el = overlayRef.current;
    el?.addEventListener("dragleave", handleDragLeave);
    return () => el?.removeEventListener("dragleave", handleDragLeave);
  }, [onDismiss]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
    onDismiss();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const supportedTypes = [
    { icon: ImageIcon, label: "Images", ext: "JPG, PNG, GIF, WebP" },
    { icon: Video, label: "Videos", ext: "MP4, WebM, MOV" },
    { icon: Mic, label: "Audio", ext: "MP3, OGG, WAV" },
    { icon: FileText, label: "Documents", ext: "PDF, DOCX, TXT" },
  ];

  return (
    <div
      ref={overlayRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{
        background: "oklch(0.14 0.02 270 / 0.88)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Animated border box */}
      <div
        className="flex flex-col items-center justify-center gap-5 w-full max-w-sm mx-4 p-10 rounded-3xl text-center"
        style={{
          border: "2px dashed",
          borderColor: "var(--neon)",
          background: "oklch(0.2 0.04 285 / 0.5)",
          boxShadow: "0 0 60px -10px var(--neon), inset 0 0 40px -20px var(--neon)",
          animation: "pulse-glow 2s ease-in-out infinite",
        }}
      >
        {/* Upload icon with glow */}
        <div
          className="h-20 w-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--neon)/30, var(--neon-2)/20)",
            border: "1px solid var(--neon)/40",
            boxShadow: "0 0 30px var(--neon)/30",
          }}
        >
          <Upload className="h-9 w-9" style={{ color: "var(--neon)" }} />
        </div>

        <div>
          <p className="text-xl font-semibold text-white">Drop to send</p>
          <p className="text-sm text-white/60 mt-1">Release to upload your file</p>
        </div>

        {/* Supported type badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {supportedTypes.map(({ icon: Icon, label, ext }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: "oklch(1 0 0 / 0.08)",
                border: "1px solid oklch(1 0 0 / 0.12)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <Icon className="h-3 w-3" style={{ color: "var(--neon)" }} />
              <span className="font-medium">{label}</span>
              <span className="opacity-50">{ext}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/30">Max 50MB per file</p>
      </div>
    </div>
  );
}
