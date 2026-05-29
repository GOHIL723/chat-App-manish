import { useEffect, useCallback } from "react";
import { X, Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaLightboxProps {
  url: string;
  type: "image" | "video";
  name?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function MediaLightbox({
  url,
  type,
  name,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: MediaLightboxProps) {
  // Close on Escape, navigate with arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
    if (e.key === "ArrowRight" && onNext && hasNext) onNext();
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-5 z-10"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }}
        onClick={e => e.stopPropagation()}
      >
        <span className="text-white/80 text-sm font-medium truncate max-w-[60vw]">
          {name || (type === "image" ? "Image Preview" : "Video Preview")}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={url}
            download={name}
            target="_blank"
            rel="noreferrer"
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {hasPrev && onPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center
            text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition z-10"
          onClick={e => { e.stopPropagation(); onPrev(); }}
          title="Previous (←)"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {hasNext && onNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center
            text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition z-10"
          onClick={e => { e.stopPropagation(); onNext(); }}
          title="Next (→)"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Media content */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {type === "image" ? (
          <img
            src={url}
            alt={name || "media"}
            className="max-w-[88vw] max-h-[82vh] object-contain rounded-2xl shadow-2xl"
            style={{ boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}
          />
        ) : (
          <video
            src={url}
            controls
            autoPlay
            className="max-w-[88vw] max-h-[82vh] rounded-2xl shadow-2xl"
            style={{ boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}
          />
        )}
      </div>

      {/* Bottom hint */}
      <div
        className="absolute bottom-4 left-0 right-0 flex justify-center"
        style={{ pointerEvents: "none" }}
      >
        <span className="text-white/30 text-xs">Press Esc to close{(hasPrev || hasNext) ? " · ← → to navigate" : ""}</span>
      </div>
    </div>
  );
}
