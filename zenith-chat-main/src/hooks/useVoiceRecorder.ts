import { useState, useRef, useCallback, useEffect } from "react";

export type RecorderState = "idle" | "recording" | "preview" | "uploading" | "error";

interface UseVoiceRecorderOptions {
  onUpload: (file: File, type: string, duration?: number) => Promise<void>;
}

interface UseVoiceRecorderReturn {
  state: RecorderState;
  recordingTime: number;
  error: string | null;
  /** 0–1 live volume level for waveform visualization */
  volumeLevel: number;
  /** Blob URL for previewing recorded audio before sending */
  previewUrl: string | null;
  /** Duration of the recorded audio in seconds */
  previewDuration: number;
  /** Upload progress 0–100 */
  uploadProgress: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  sendRecording: () => Promise<void>;
  /** Play/pause the preview audio */
  togglePreviewPlayback: () => void;
  /** Whether the preview audio is currently playing */
  isPreviewPlaying: boolean;
  /** Current playback time of preview */
  previewCurrentTime: number;
  formatTime: (s: number) => string;
}

/**
 * Detect the best supported MIME type for audio recording.
 */
function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

export function useVoiceRecorder({ onUpload }: UseVoiceRecorderOptions): UseVoiceRecorderReturn {
  const [state, setState] = useState<RecorderState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioFileRef = useRef<File | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  // Ref mirror of recordingTime so external callbacks can read it without deps
  const recordingTimeRef = useRef(0);

  // Web Audio API for live volume metering
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<any>(null);

  // Live volume meter loop
  const startMeter = useCallback(() => {
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

  const stopMeter = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setVolumeLevel(0);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
  }, []);

  const stopStream = useCallback(() => {
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

  // Cleanup preview audio element
  const cleanupPreviewAudio = useCallback(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.removeAttribute("src");
      previewAudioRef.current = null;
    }
    setIsPreviewPlaying(false);
    setPreviewCurrentTime(0);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    cancelledRef.current = false;
    chunksRef.current = [];
    audioBlobRef.current = null;
    audioFileRef.current = null;
    setUploadProgress(0);
    cleanupPreviewAudio();

    // Revoke old preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    // Check browser support
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

    // Request microphone
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      const tracks = stream.getAudioTracks();
      tracks.forEach((t) => {
        if (!t.enabled) t.enabled = true;
      });

      if (tracks.length === 0 || tracks[0].readyState !== "live") {
        throw new Error("Microphone stream is not live.");
      }
    } catch (err: any) {
      const msg =
        err.name === "NotAllowedError"
          ? "Microphone permission denied. Please allow access in browser settings."
          : err.name === "NotFoundError"
          ? "No microphone found. Please connect a microphone."
          : `Microphone error: ${err.message}`;
      setError(msg);
      setState("error");
      return;
    }

    // Setup Web Audio API for live volume metering
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
      // Non-critical
    }

    // Create MediaRecorder
    const mimeType = getSupportedMimeType();
    let recorder: MediaRecorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
    } catch (err: any) {
      setError(`Could not start recorder: ${err.message}`);
      setState("error");
      stopStream();
      return;
    }

    // Wire up events
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

      // Store blob and create preview URL
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

      // Create an audio element to get duration
      const tempAudio = new Audio();
      tempAudio.src = url;
      tempAudio.addEventListener("loadedmetadata", () => {
        if (tempAudio.duration && tempAudio.duration !== Infinity && !isNaN(tempAudio.duration)) {
          setPreviewDuration(tempAudio.duration);
        } else {
          // WebM duration hack
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

      // Also use recording time as fallback duration
      setPreviewDuration((prev) => prev || recordingTime);

      setState("preview");
    };

    recorder.onerror = (e: any) => {
      console.error("[VoiceRecorder] MediaRecorder error:", e.error);
      setError(`Recording error: ${e.error?.message || "unknown"}`);
      setState("error");
      stopStream();
    };

    // Start recording with 250ms timeslice
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
    }, 1000);
  }, [onUpload, stopStream, startMeter, previewUrl, cleanupPreviewAudio]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    console.log("[VoiceRecorder] Stopping recorder...");
    recorder.stop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancelRecording = useCallback(() => {
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

  const sendRecording = useCallback(async () => {
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
      // Simulate progress increments during upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);

      await onUpload(file, "voice", previewDuration);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Clean up
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
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
      setState("error");
      setUploadProgress(0);
    }
  }, [onUpload, previewUrl, cleanupPreviewAudio, previewDuration]);

  // Toggle preview playback
  const togglePreviewPlayback = useCallback(() => {
    if (!previewUrl) return;

    if (!previewAudioRef.current) {
      const audio = new Audio(previewUrl);
      previewAudioRef.current = audio;

      audio.addEventListener("timeupdate", () => {
        setPreviewCurrentTime(audio.currentTime);
      });
      audio.addEventListener("ended", () => {
        setIsPreviewPlaying(false);
        setPreviewCurrentTime(0);
        audio.currentTime = 0;
      });
    }

    const audio = previewAudioRef.current;
    audio.volume = 1.0;
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
      cleanupPreviewAudio();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      // Revoke preview URL on unmount
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [stopStream, cleanupPreviewAudio]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

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
    formatTime,
  };
}
