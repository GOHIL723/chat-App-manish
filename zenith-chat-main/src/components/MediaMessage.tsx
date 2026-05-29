import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Download, FileText, FileArchive, FileCode,
  File, Volume2, Maximize2, Eye, EyeOff,
} from "lucide-react";
import axios from "axios";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (!mimeType) return File;
  if (mimeType === "application/pdf") return FileText;
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return FileArchive;
  if (mimeType.includes("text/")) return FileCode;
  return File;
}

function getFileAccentColor(mimeType: string): string {
  if (!mimeType) return "var(--muted-foreground)";
  if (mimeType === "application/pdf") return "#ef4444";
  if (mimeType.includes("zip")) return "#f59e0b";
  if (mimeType.includes("word") || mimeType.includes("doc")) return "#3b82f6";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "#22c55e";
  if (mimeType.includes("text/")) return "#a855f7";
  return "var(--neon)";
}

/* ─────────────────────────────────────────────
   Voice Note Player — fixed for local & Cloudinary URLs
───────────────────────────────────────────── */
function VoicePlayer({ src, isMe }: { src: string; isMe: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const seekFixedRef = useRef(false);

  // Determine MIME type from URL
  const getMimeType = () => {
    if (src.includes('.ogg')) return 'audio/ogg';
    if (src.includes('.mp4') || src.includes('.m4a')) return 'audio/mp4';
    if (src.includes('.mp3')) return 'audio/mpeg';
    return 'audio/webm'; // default for recorded audio
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setAudioError(null);
    setIsLoading(true);
    setCanPlay(false);
    seekFixedRef.current = false;

    audio.muted = false;
    audio.volume = 1.0;

    console.log("[VoicePlayer] src:", src);

    const onCanPlay = () => {
      console.log("[VoicePlayer] canplay — duration:", audio.duration, "volume:", audio.volume, "muted:", audio.muted);
      setIsLoading(false);
      setCanPlay(true);
      setAudioError(null);
    };

    const onLoadedMetadata = () => {
      console.log("[VoicePlayer] loadedmetadata — duration:", audio.duration);
      if (!audio.duration || audio.duration === Infinity || isNaN(audio.duration)) {
        // WebM/Ogg streams sometimes report Infinity — seek trick to force duration resolve
        if (!seekFixedRef.current) {
          seekFixedRef.current = true;
          audio.currentTime = 999999;
        }
      } else {
        setDuration(audio.duration);
      }
    };

    const onDurationChange = () => {
      if (audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        if (seekFixedRef.current && audio.currentTime > 1) {
          audio.currentTime = 0;
          seekFixedRef.current = false;
        }
      }
    };

    const onTimeUpdate = () => {
      if (!audio.duration || isNaN(audio.duration) || audio.duration === Infinity) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const onError = () => {
      const err = audio.error;
      const code = err?.code ?? 0;
      const msgs: Record<number, string> = {
        1: 'Playback aborted',
        2: 'Network error loading audio',
        3: 'Audio decode failed — unsupported format',
        4: 'Audio source not found or not supported',
      };
      const msg = msgs[code] || `Audio error (code ${code})`;
      console.error("[VoicePlayer] error:", msg, "src:", src, "error:", err);
      setAudioError(msg);
      setIsLoading(false);
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    audio.load();

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = 1.0;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        console.log("[VoicePlayer] play(). readyState:", audio.readyState, "src:", audio.src);
        await audio.play();
        setPlaying(true);
      } catch (err: any) {
        console.error("[VoicePlayer] play() rejected:", err?.message);
        setAudioError(`Playback failed: ${err?.message || "unknown"}`);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration || isNaN(duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const bars = 20;
  const heights = [3, 5, 8, 12, 16, 20, 18, 14, 10, 7, 9, 15, 20, 17, 12, 8, 11, 6, 4, 3];

  // Error state — show native browser audio player + error message
  if (audioError) {
    return (
      <div className={`flex flex-col gap-2 min-w-[220px] max-w-[300px] py-1`}>
        <audio
          controls
          className={`h-10 w-full max-w-[280px] rounded-lg ${isMe ? "invert" : ""}`}
          style={{ colorScheme: "dark" }}
        >
          <source src={src} type={getMimeType()} />
          <source src={src} type="audio/ogg" />
          <source src={src} type="audio/webm" />
          <source src={src} type="audio/mpeg" />
          Your browser does not support audio playback.
        </audio>
        <div className="text-[10px] text-red-400 truncate max-w-[280px]">
          ⚠ {audioError} — using native player
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 min-w-[220px] max-w-[280px] py-1 ${isMe ? "text-white" : ""}`}>
      {/* Hidden audio element — crossOrigin needed for Cloudinary & local server */}
      <audio
        ref={audioRef}
        preload="metadata"
        style={{ display: "none" }}
        crossOrigin="anonymous"
      >
        <source src={src} type={getMimeType()} />
        <source src={src} type="audio/ogg" />
        <source src={src} type="audio/webm" />
        <source src={src} type="audio/mpeg" />
      </audio>

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        disabled={isLoading && !canPlay}
        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-50
          ${isMe
            ? "bg-white/20 hover:bg-white/30"
            : "bg-[var(--neon)]/20 hover:bg-[var(--neon)]/30 text-[var(--neon)]"
          }`}
      >
        {isLoading && !canPlay ? (
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : playing ? (
          <Pause className="h-4 w-4" fill="currentColor" />
        ) : (
          <Play className="h-4 w-4" fill="currentColor" style={{ marginLeft: "2px" }} />
        )}
      </button>

      {/* Waveform + scrubber */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-px h-8 cursor-pointer" onClick={handleSeek}>
          {Array.from({ length: bars }).map((_, i) => {
            const pct = (i / bars) * 100;
            const isPlayed = pct <= progress;
            const h = heights[i % heights.length];
            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-colors duration-75"
                style={{
                  height: `${h}px`,
                  background: isPlayed
                    ? isMe ? "rgba(255,255,255,0.95)" : "var(--neon)"
                    : isMe ? "rgba(255,255,255,0.25)" : "oklch(0.5 0.02 270 / 0.35)",
                }}
              />
            );
          })}
        </div>
        <div className={`text-[10px] flex justify-between ${isMe ? "text-white/60" : "text-muted-foreground"}`}>
          <span>{fmt(currentTime)}</span>
          <span className="flex items-center gap-1">
            <Volume2 className="h-2.5 w-2.5" />
            {duration > 0 ? fmt(duration) : "--:--"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   File Card
───────────────────────────────────────────── */
function FileCard({ url, name, mimeType, size, isMe }: {
  url: string; name: string; mimeType?: string; size?: number; isMe: boolean;
}) {
  const Icon = getFileIcon(mimeType || "");
  const accentColor = getFileAccentColor(mimeType || "");

  const downloadUrl = url.includes("/upload/")
    ? url.replace("/upload/", "/upload/fl_attachment/")
    : url;

  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noreferrer"
      download={name}
      className={`flex items-center gap-3 min-w-[200px] max-w-[260px] p-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] group/file
        ${isMe ? "bg-white/10 hover:bg-white/20" : "bg-[var(--accent)] hover:bg-[var(--accent)]/80"}`}
    >
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
        style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}
      >
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium truncate max-w-[150px] ${isMe ? "text-white" : "text-foreground"}`}>
          {name || "File"}
        </div>
        <div className={`text-[10px] mt-0.5 ${isMe ? "text-white/60" : "text-muted-foreground"}`}>
          {mimeType?.split("/")[1]?.toUpperCase() || "FILE"}
          {size ? ` · ${formatBytes(size)}` : ""}
        </div>
      </div>
      <Download className={`h-4 w-4 shrink-0 opacity-0 group-hover/file:opacity-100 transition ${isMe ? "text-white" : "text-[var(--neon)]"}`} />
    </a>
  );
}

/* ─────────────────────────────────────────────
   Image Preview  (with View Once support)
───────────────────────────────────────────── */
function ImagePreview({ url, name, isMe, onOpenLightbox, isViewOnce, viewOnceViewed, messageId }: {
  url: string; name?: string; isMe: boolean; onOpenLightbox: () => void;
  isViewOnce?: boolean; viewOnceViewed?: boolean; messageId?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [localViewed, setLocalViewed] = useState(viewOnceViewed);

  useEffect(() => {
    setLocalViewed(viewOnceViewed);
  }, [viewOnceViewed]);

  const handleOpen = async () => {
    if (isViewOnce && !localViewed && messageId) {
      try {
        await axios.post(`/messages/view-once/${messageId}`);
        setLocalViewed(true);
      } catch (err) {
        console.error("Failed to mark view once as seen:", err);
      }
    }
    onOpenLightbox();
  };

  // Already viewed
  if (isViewOnce && localViewed) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground/80 italic text-sm">
        <EyeOff className="h-4 w-4" /> Photo Opened
      </div>
    );
  }

  // View Once — not yet opened
  if (isViewOnce && !localViewed) {
    return (
      <div
        onClick={handleOpen}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all active:scale-95 border
          ${isMe
            ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
            : "bg-[var(--accent)] hover:bg-[var(--accent)]/80 border-border text-foreground"
          }`}
        style={{ minWidth: "160px" }}
      >
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isMe ? "bg-white/20" : "bg-[var(--neon)]/20 text-[var(--neon)]"}`}>
          <Eye className="h-4 w-4" />
        </div>
        <div className="flex-1 font-medium text-sm">View Photo</div>
      </div>
    );
  }

  // Regular image
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-xl -mx-1 mb-1 group/img"
      onClick={onOpenLightbox}
      style={{ maxWidth: "280px" }}
    >
      {!loaded && (
        <div className="w-[280px] h-40 bg-gradient-to-br from-[var(--neon)]/20 to-[var(--neon-2)]/20 animate-pulse rounded-xl" />
      )}
      <img
        src={url}
        alt={name || "image"}
        className={`max-w-full max-h-72 object-cover rounded-xl transition-all duration-300 group-hover/img:brightness-90 ${loaded ? "block" : "hidden"}`}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
        <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Maximize2 className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Video Player
───────────────────────────────────────────── */
function VideoPlayer({ url, name, isMe }: { url: string; name?: string; isMe: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-xl -mx-1 mb-1" style={{ maxWidth: "300px" }}>
      <video
        src={url}
        controls
        preload="metadata"
        className="w-full max-h-56 rounded-xl"
        style={{ background: "#000" }}
      />
      {name && (
        <div className={`text-[10px] mt-1 truncate px-0.5 ${isMe ? "text-white/60" : "text-muted-foreground"}`}>
          {name}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main MediaMessage Component
───────────────────────────────────────────── */
interface MediaMessageProps {
  messageId?: string;
  messageType: "text" | "image" | "video" | "voice" | "file";
  message?: string;
  media?: string;
  mediaMimeType?: string;
  mediaSize?: number;
  isMe: boolean;
  isViewOnce?: boolean;
  viewOnceViewed?: boolean;
  onOpenLightbox?: () => void;
}

export function MediaMessage({
  messageId,
  messageType,
  message,
  media,
  mediaMimeType,
  mediaSize,
  isMe,
  isViewOnce,
  viewOnceViewed,
  onOpenLightbox,
}: MediaMessageProps) {
  switch (messageType) {
    case "image":
      return media ? (
        <ImagePreview
          url={media}
          name={message}
          isMe={isMe}
          isViewOnce={isViewOnce}
          viewOnceViewed={viewOnceViewed}
          messageId={messageId}
          onOpenLightbox={onOpenLightbox ?? (() => window.open(media, "_blank"))}
        />
      ) : null;

    case "video":
      return media ? <VideoPlayer url={media} name={message} isMe={isMe} /> : null;

    case "voice":
      return media ? <VoicePlayer src={media} isMe={isMe} /> : null;

    case "file":
      return media ? (
        <FileCard
          url={media}
          name={message || "File"}
          mimeType={mediaMimeType}
          size={mediaSize}
          isMe={isMe}
        />
      ) : null;

    case "text":
    default:
      return message ? <p className="leading-relaxed whitespace-pre-wrap">{message}</p> : null;
  }
}
