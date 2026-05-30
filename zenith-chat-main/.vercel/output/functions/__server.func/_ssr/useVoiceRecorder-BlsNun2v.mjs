import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as axios } from "../_libs/axios.mjs";
import { ak as Upload, a8 as Image, V as Video, W as Mic, al as FileText, am as Download, an as ExternalLink, X, a5 as ChevronLeft, D as ChevronRight, ah as Pause, ai as Play, ao as Volume2, f as EyeOff, E as Eye, ap as Maximize2, aq as File$1, ar as FileArchive, as as FileCode } from "../_libs/lucide-react.mjs";
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function getFileIcon(mimeType) {
  if (!mimeType) return File$1;
  if (mimeType === "application/pdf") return FileText;
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return FileArchive;
  if (mimeType.includes("text/")) return FileCode;
  return File$1;
}
function getFileAccentColor(mimeType) {
  if (!mimeType) return "var(--muted-foreground)";
  if (mimeType === "application/pdf") return "#ef4444";
  if (mimeType.includes("zip")) return "#f59e0b";
  if (mimeType.includes("word") || mimeType.includes("doc")) return "#3b82f6";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "#22c55e";
  if (mimeType.includes("text/")) return "#a855f7";
  return "var(--neon)";
}
function VoicePlayer({ src, isMe }) {
  const audioRef = reactExports.useRef(null);
  const [playing, setPlaying] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [audioError, setAudioError] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [canPlay, setCanPlay] = reactExports.useState(false);
  const seekFixedRef = reactExports.useRef(false);
  const getMimeType = () => {
    if (src.includes(".ogg")) return "audio/ogg";
    if (src.includes(".mp4") || src.includes(".m4a")) return "audio/mp4";
    if (src.includes(".mp3")) return "audio/mpeg";
    return "audio/webm";
  };
  reactExports.useEffect(() => {
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
    audio.volume = 1;
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
      setProgress(audio.currentTime / audio.duration * 100);
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
      const msgs = {
        1: "Playback aborted",
        2: "Network error loading audio",
        3: "Audio decode failed — unsupported format",
        4: "Audio source not found or not supported"
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
    audio.volume = 1;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        console.log("[VoicePlayer] play(). readyState:", audio.readyState, "src:", audio.src);
        await audio.play();
        setPlaying(true);
      } catch (err) {
        console.error("[VoicePlayer] play() rejected:", err?.message);
        setAudioError(`Playback failed: ${err?.message || "unknown"}`);
      }
    }
  };
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration || isNaN(duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
  };
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const bars = 20;
  const heights = [3, 5, 8, 12, 16, 20, 18, 14, 10, 7, 9, 15, 20, 17, 12, 8, 11, 6, 4, 3];
  if (audioError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-2 min-w-[220px] max-w-[300px] py-1`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "audio",
        {
          controls: true,
          className: `h-10 w-full max-w-[280px] rounded-lg ${isMe ? "invert" : ""}`,
          style: { colorScheme: "dark" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: getMimeType() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: "audio/ogg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: "audio/webm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: "audio/mpeg" }),
            "Your browser does not support audio playback."
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-red-400 truncate max-w-[280px]", children: [
        "⚠ ",
        audioError,
        " — using native player"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 min-w-[220px] max-w-[280px] py-1 ${isMe ? "text-white" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "audio",
      {
        ref: audioRef,
        preload: "metadata",
        style: { display: "none" },
        crossOrigin: "anonymous",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: getMimeType() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: "audio/ogg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: "audio/webm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src, type: "audio/mpeg" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: togglePlay,
        disabled: isLoading && !canPlay,
        className: `h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-50
          ${isMe ? "bg-white/20 hover:bg-white/30" : "bg-[var(--neon)]/20 hover:bg-[var(--neon)]/30 text-[var(--neon)]"}`,
        children: isLoading && !canPlay ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4", fill: "currentColor" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4", fill: "currentColor", style: { marginLeft: "2px" } })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-px h-8 cursor-pointer", onClick: handleSeek, children: Array.from({ length: bars }).map((_, i) => {
        const pct = i / bars * 100;
        const isPlayed = pct <= progress;
        const h = heights[i % heights.length];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-1 rounded-full transition-colors duration-75",
            style: {
              height: `${h}px`,
              background: isPlayed ? isMe ? "rgba(255,255,255,0.95)" : "var(--neon)" : isMe ? "rgba(255,255,255,0.25)" : "oklch(0.5 0.02 270 / 0.35)"
            }
          },
          i
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[10px] flex justify-between ${isMe ? "text-white/60" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmt(currentTime) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-2.5 w-2.5" }),
          duration > 0 ? fmt(duration) : "--:--"
        ] })
      ] })
    ] })
  ] });
}
function FileCard({ url, name, mimeType, size, isMe }) {
  const Icon = getFileIcon(mimeType || "");
  const accentColor = getFileAccentColor(mimeType || "");
  const downloadUrl = url.includes("/upload/") ? url.replace("/upload/", "/upload/fl_attachment/") : url;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: downloadUrl,
      target: "_blank",
      rel: "noreferrer",
      download: name,
      className: `flex items-center gap-3 min-w-[200px] max-w-[260px] p-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] group/file
        ${isMe ? "bg-white/10 hover:bg-white/20" : "bg-[var(--accent)] hover:bg-[var(--accent)]/80"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
            style: { background: `${accentColor}22`, border: `1px solid ${accentColor}44` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5", style: { color: accentColor } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs font-medium truncate max-w-[150px] ${isMe ? "text-white" : "text-foreground"}`, children: name || "File" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[10px] mt-0.5 ${isMe ? "text-white/60" : "text-muted-foreground"}`, children: [
            mimeType?.split("/")[1]?.toUpperCase() || "FILE",
            size ? ` · ${formatBytes(size)}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: `h-4 w-4 shrink-0 opacity-0 group-hover/file:opacity-100 transition ${isMe ? "text-white" : "text-[var(--neon)]"}` })
      ]
    }
  );
}
function ImagePreview({ url, name, isMe, onOpenLightbox, isViewOnce, viewOnceViewed, messageId }) {
  const [loaded, setLoaded] = reactExports.useState(false);
  const [localViewed, setLocalViewed] = reactExports.useState(viewOnceViewed);
  reactExports.useEffect(() => {
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
  if (isViewOnce && localViewed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 text-muted-foreground/80 italic text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }),
      " Photo Opened"
    ] });
  }
  if (isViewOnce && !localViewed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: handleOpen,
        className: `flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all active:scale-95 border
          ${isMe ? "bg-white/10 hover:bg-white/20 border-white/20 text-white" : "bg-[var(--accent)] hover:bg-[var(--accent)]/80 border-border text-foreground"}`,
        style: { minWidth: "160px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-8 w-8 rounded-full flex items-center justify-center ${isMe ? "bg-white/20" : "bg-[var(--neon)]/20 text-[var(--neon)]"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 font-medium text-sm", children: "View Photo" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative cursor-pointer overflow-hidden rounded-xl -mx-1 mb-1 group/img",
      onClick: onOpenLightbox,
      style: { maxWidth: "280px" },
      children: [
        !loaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[280px] h-40 bg-gradient-to-br from-[var(--neon)]/20 to-[var(--neon-2)]/20 animate-pulse rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: url,
            alt: name || "image",
            className: `max-w-full max-h-72 object-cover rounded-xl transition-all duration-300 group-hover/img:brightness-90 ${loaded ? "block" : "hidden"}`,
            onLoad: () => setLoaded(true)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-5 w-5 text-white" }) }) })
      ]
    }
  );
}
function VideoPlayer({ url, name, isMe }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl -mx-1 mb-1", style: { maxWidth: "300px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: url,
        controls: true,
        preload: "metadata",
        className: "w-full max-h-56 rounded-xl",
        style: { background: "#000" }
      }
    ),
    name && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] mt-1 truncate px-0.5 ${isMe ? "text-white/60" : "text-muted-foreground"}`, children: name })
  ] });
}
function MediaMessage({
  messageId,
  messageType,
  message,
  media,
  mediaMimeType,
  mediaSize,
  isMe,
  isViewOnce,
  viewOnceViewed,
  onOpenLightbox
}) {
  switch (messageType) {
    case "image":
      return media ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ImagePreview,
        {
          url: media,
          name: message,
          isMe,
          isViewOnce,
          viewOnceViewed,
          messageId,
          onOpenLightbox: onOpenLightbox ?? (() => window.open(media, "_blank"))
        }
      ) : null;
    case "video":
      return media ? /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayer, { url: media, name: message, isMe }) : null;
    case "voice":
      return media ? /* @__PURE__ */ jsxRuntimeExports.jsx(VoicePlayer, { src: media, isMe }) : null;
    case "file":
      return media ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        FileCard,
        {
          url: media,
          name: message || "File",
          mimeType: mediaMimeType,
          size: mediaSize,
          isMe
        }
      ) : null;
    case "text":
    default:
      return message ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "leading-relaxed whitespace-pre-wrap", children: message }) : null;
  }
}
function MediaLightbox({
  url,
  type,
  name,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}) {
  const handleKeyDown = reactExports.useCallback((e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
    if (e.key === "ArrowRight" && onNext && hasNext) onNext();
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);
  reactExports.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-[200] flex items-center justify-center",
      style: { background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" },
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-5 z-10",
            style: { background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/80 text-sm font-medium truncate max-w-[60vw]", children: name || (type === "image" ? "Image Preview" : "Video Preview") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: url,
                    download: name,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition",
                    title: "Download",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: url,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition",
                    title: "Open in new tab",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition",
                    title: "Close (Esc)",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
                  }
                )
              ] })
            ]
          }
        ),
        hasPrev && onPrev && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center\n            text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition z-10",
            onClick: (e) => {
              e.stopPropagation();
              onPrev();
            },
            title: "Previous (←)",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-6 w-6" })
          }
        ),
        hasNext && onNext && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full flex items-center justify-center\n            text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition z-10",
            onClick: (e) => {
              e.stopPropagation();
              onNext();
            },
            title: "Next (→)",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-6 w-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative max-w-[90vw] max-h-[85vh] flex items-center justify-center animate-slide-up",
            onClick: (e) => e.stopPropagation(),
            children: type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: url,
                alt: name || "media",
                className: "max-w-[88vw] max-h-[82vh] object-contain rounded-2xl shadow-2xl",
                style: { boxShadow: "0 0 80px rgba(0,0,0,0.8)" }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "video",
              {
                src: url,
                controls: true,
                autoPlay: true,
                className: "max-w-[88vw] max-h-[82vh] rounded-2xl shadow-2xl",
                style: { boxShadow: "0 0 80px rgba(0,0,0,0.8)" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-4 left-0 right-0 flex justify-center",
            style: { pointerEvents: "none" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/30 text-xs", children: [
              "Press Esc to close",
              hasPrev || hasNext ? " · ← → to navigate" : ""
            ] })
          }
        )
      ]
    }
  );
}
function DragDropOverlay({ onDrop, onDismiss }) {
  const overlayRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleDragLeave = (e) => {
      if (!overlayRef.current?.contains(e.relatedTarget)) {
        onDismiss();
      }
    };
    const el = overlayRef.current;
    el?.addEventListener("dragleave", handleDragLeave);
    return () => el?.removeEventListener("dragleave", handleDragLeave);
  }, [onDismiss]);
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
    onDismiss();
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const supportedTypes = [
    { icon: Image, label: "Images", ext: "JPG, PNG, GIF, WebP" },
    { icon: Video, label: "Videos", ext: "MP4, WebM, MOV" },
    { icon: Mic, label: "Audio", ext: "MP3, OGG, WAV" },
    { icon: FileText, label: "Documents", ext: "PDF, DOCX, TXT" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: overlayRef,
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      className: "absolute inset-0 z-50 flex items-center justify-center animate-fade-in",
      style: {
        background: "oklch(0.14 0.02 270 / 0.88)",
        backdropFilter: "blur(8px)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center gap-5 w-full max-w-sm mx-4 p-10 rounded-3xl text-center",
          style: {
            border: "2px dashed",
            borderColor: "var(--neon)",
            background: "oklch(0.2 0.04 285 / 0.5)",
            boxShadow: "0 0 60px -10px var(--neon), inset 0 0 40px -20px var(--neon)",
            animation: "pulse-glow 2s ease-in-out infinite"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-20 w-20 rounded-2xl flex items-center justify-center",
                style: {
                  background: "linear-gradient(135deg, var(--neon)/30, var(--neon-2)/20)",
                  border: "1px solid var(--neon)/40",
                  boxShadow: "0 0 30px var(--neon)/30"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-9 w-9", style: { color: "var(--neon)" } })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold text-white", children: "Drop to send" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60 mt-1", children: "Release to upload your file" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2", children: supportedTypes.map(({ icon: Icon, label, ext }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs",
                style: {
                  background: "oklch(1 0 0 / 0.08)",
                  border: "1px solid oklch(1 0 0 / 0.12)",
                  color: "rgba(255,255,255,0.7)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3", style: { color: "var(--neon)" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-50", children: ext })
                ]
              },
              label
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/30", children: "Max 50MB per file" })
          ]
        }
      )
    }
  );
}
function getSupportedMimeType() {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4"
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}
function useVoiceRecorder({ onUpload }) {
  const [state, setState] = reactExports.useState("idle");
  const [recordingTime, setRecordingTime] = reactExports.useState(0);
  const [error, setError] = reactExports.useState(null);
  const [volumeLevel, setVolumeLevel] = reactExports.useState(0);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const [previewDuration, setPreviewDuration] = reactExports.useState(0);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = reactExports.useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = reactExports.useState(0);
  const mediaRecorderRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const chunksRef = reactExports.useRef([]);
  const timerRef = reactExports.useRef(null);
  const cancelledRef = reactExports.useRef(false);
  const audioBlobRef = reactExports.useRef(null);
  const audioFileRef = reactExports.useRef(null);
  const previewAudioRef = reactExports.useRef(null);
  const recordingTimeRef = reactExports.useRef(0);
  const audioContextRef = reactExports.useRef(null);
  const analyserRef = reactExports.useRef(null);
  const animFrameRef = reactExports.useRef(null);
  const dataArrayRef = reactExports.useRef(null);
  const startMeter = reactExports.useCallback(() => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;
    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = (dataArray[i] - 128) / 128;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const level = Math.min(1, rms * 3);
      setVolumeLevel(level);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);
  const stopMeter = reactExports.useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setVolumeLevel(0);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {
      });
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
  }, []);
  const stopStream = reactExports.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopMeter();
  }, [stopMeter]);
  const cleanupPreviewAudio = reactExports.useCallback(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.removeAttribute("src");
      previewAudioRef.current = null;
    }
    setIsPreviewPlaying(false);
    setPreviewCurrentTime(0);
  }, []);
  const startRecording = reactExports.useCallback(async () => {
    setError(null);
    cancelledRef.current = false;
    chunksRef.current = [];
    audioBlobRef.current = null;
    audioFileRef.current = null;
    setUploadProgress(0);
    cleanupPreviewAudio();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser does not support audio recording.");
      setState("error");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setError("MediaRecorder is not supported in this browser.");
      setState("error");
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      streamRef.current = stream;
      const tracks = stream.getAudioTracks();
      tracks.forEach((t) => {
        if (!t.enabled) t.enabled = true;
      });
      if (tracks.length === 0 || tracks[0].readyState !== "live") {
        throw new Error("Microphone stream is not live.");
      }
    } catch (err) {
      const msg = err.name === "NotAllowedError" ? "Microphone permission denied. Please allow access in browser settings." : err.name === "NotFoundError" ? "No microphone found. Please connect a microphone." : `Microphone error: ${err.message}`;
      setError(msg);
      setState("error");
      return;
    }
    try {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch (err) {
    }
    const mimeType = getSupportedMimeType();
    let recorder;
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      setError(`Could not start recorder: ${err.message}`);
      setState("error");
      stopStream();
      return;
    }
    recorder.ondataavailable = (e) => {
      console.log("[VoiceRecorder] Chunk received, size:", e.data?.size, "bytes");
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    recorder.onstop = async () => {
      console.log("[VoiceRecorder] MediaRecorder stopped. Chunks count:", chunksRef.current.length);
      stopStream();
      if (cancelledRef.current) {
        console.log("[VoiceRecorder] Recording cancelled, discarding chunks.");
        chunksRef.current = [];
        setState("idle");
        setRecordingTime(0);
        return;
      }
      const finalMime = recorder.mimeType || "audio/webm";
      const audioBlob = new Blob(chunksRef.current, { type: finalMime });
      console.log("[VoiceRecorder] Final audio Blob size:", audioBlob.size, "bytes, mime:", finalMime);
      if (audioBlob.size < 100) {
        console.warn("[VoiceRecorder] Empty recording! Blob size too small:", audioBlob.size);
        setError("Recording was empty. Please check your microphone and try again.");
        setState("error");
        chunksRef.current = [];
        return;
      }
      audioBlobRef.current = audioBlob;
      let ext = "webm";
      if (finalMime.includes("ogg")) ext = "ogg";
      if (finalMime.includes("mp4")) ext = "mp4";
      const audioFile = new File(
        [audioBlob],
        `voice_${Date.now()}.${ext}`,
        { type: finalMime }
      );
      audioFileRef.current = audioFile;
      const url = URL.createObjectURL(audioBlob);
      console.log("[VoiceRecorder] Created preview URL:", url);
      setPreviewUrl(url);
      const tempAudio = new Audio();
      tempAudio.src = url;
      tempAudio.addEventListener("loadedmetadata", () => {
        if (tempAudio.duration && tempAudio.duration !== Infinity && !isNaN(tempAudio.duration)) {
          setPreviewDuration(tempAudio.duration);
        } else {
          tempAudio.currentTime = 999999;
          tempAudio.addEventListener("durationchange", () => {
            if (tempAudio.duration && tempAudio.duration !== Infinity && !isNaN(tempAudio.duration)) {
              setPreviewDuration(tempAudio.duration);
              tempAudio.currentTime = 0;
            }
          }, { once: true });
        }
      });
      tempAudio.load();
      setPreviewDuration((prev) => prev || recordingTime);
      setState("preview");
    };
    recorder.onerror = (e) => {
      console.error("[VoiceRecorder] MediaRecorder error:", e.error);
      setError(`Recording error: ${e.error?.message || "unknown"}`);
      setState("error");
      stopStream();
    };
    recorder.start(250);
    console.log("[VoiceRecorder] Recorder started");
    setState("recording");
    setRecordingTime(0);
    startMeter();
    timerRef.current = setInterval(() => {
      setRecordingTime((t) => {
        const nextVal = t + 1;
        recordingTimeRef.current = nextVal;
        return nextVal;
      });
    }, 1e3);
  }, [onUpload, stopStream, startMeter, previewUrl, cleanupPreviewAudio]);
  const stopRecording = reactExports.useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    console.log("[VoiceRecorder] Stopping recorder...");
    recorder.stop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const cancelRecording = reactExports.useCallback(() => {
    console.log("[VoiceRecorder] Cancelling recording...");
    cancelledRef.current = true;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    stopStream();
    cleanupPreviewAudio();
    chunksRef.current = [];
    audioBlobRef.current = null;
    audioFileRef.current = null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setState("idle");
    setRecordingTime(0);
    recordingTimeRef.current = 0;
    setPreviewDuration(0);
    setUploadProgress(0);
    setError(null);
  }, [stopStream, previewUrl, cleanupPreviewAudio]);
  const sendRecording = reactExports.useCallback(async () => {
    const file = audioFileRef.current;
    if (!file) {
      setError("No recording to send.");
      setState("error");
      return;
    }
    console.log("[VoiceRecorder] Sending voice file, size:", file.size, "bytes");
    cleanupPreviewAudio();
    setState("uploading");
    setUploadProgress(10);
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);
      await onUpload(file, "voice", previewDuration);
      clearInterval(progressInterval);
      setUploadProgress(100);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      audioBlobRef.current = null;
      audioFileRef.current = null;
      chunksRef.current = [];
      setState("idle");
      setRecordingTime(0);
      recordingTimeRef.current = 0;
      setPreviewDuration(0);
      setUploadProgress(0);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
      setState("error");
      setUploadProgress(0);
    }
  }, [onUpload, previewUrl, cleanupPreviewAudio, previewDuration]);
  const togglePreviewPlayback = reactExports.useCallback(() => {
    if (!previewUrl) return;
    if (!previewAudioRef.current) {
      const audio2 = new Audio(previewUrl);
      previewAudioRef.current = audio2;
      audio2.addEventListener("timeupdate", () => {
        setPreviewCurrentTime(audio2.currentTime);
      });
      audio2.addEventListener("ended", () => {
        setIsPreviewPlaying(false);
        setPreviewCurrentTime(0);
        audio2.currentTime = 0;
      });
    }
    const audio = previewAudioRef.current;
    audio.volume = 1;
    audio.muted = false;
    if (isPreviewPlaying) {
      audio.pause();
      setIsPreviewPlaying(false);
    } else {
      console.log("[VoiceRecorder] Playing preview audio...", previewUrl);
      audio.play().then(() => {
        setIsPreviewPlaying(true);
      }).catch((err) => {
        console.error("[VoiceRecorder] Preview play failed:", err);
      });
    }
  }, [previewUrl, isPreviewPlaying]);
  reactExports.useEffect(() => {
    return () => {
      stopStream();
      cleanupPreviewAudio();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [stopStream, cleanupPreviewAudio]);
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return {
    state,
    recordingTime,
    error,
    volumeLevel,
    previewUrl,
    previewDuration,
    uploadProgress,
    startRecording,
    stopRecording,
    cancelRecording,
    sendRecording,
    togglePreviewPlayback,
    isPreviewPlaying,
    previewCurrentTime,
    formatTime
  };
}
export {
  DragDropOverlay as D,
  MediaLightbox as M,
  MediaMessage as a,
  useVoiceRecorder as u
};
