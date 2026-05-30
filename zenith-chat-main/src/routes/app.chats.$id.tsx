import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ChatListPanel } from "./app";
import {
  Phone, Video, MoreVertical, Pin, Search, Smile, Paperclip, Image as ImageIcon,
  Mic, Send, Reply, Forward, Check, CheckCheck, Play, Pause, Sparkles, X, StopCircle, AlertCircle, Trash2, ChevronLeft, Eye, EyeOff,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "@/lib/api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import EmojiPicker from 'emoji-picker-react';
import { MediaMessage } from '../components/MediaMessage';
import { MediaLightbox } from '../components/MediaLightbox';
import { DragDropOverlay } from '../components/DragDropOverlay';
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

export const Route = createFileRoute("/app/chats/$id")({
  component: ChatRoom,
});

function ChatRoom() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [chatUser, setChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [draft, setDraft] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sendAsViewOnce, setSendAsViewOnce] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string, type: 'image' | 'video', name?: string } | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);

  const { socket, onlineUsers } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const handleOpenLightbox = (e: any) => setLightboxMedia(e.detail);
    window.addEventListener('openLightbox', handleOpenLightbox);
    return () => window.removeEventListener('openLightbox', handleOpenLightbox);
  }, []);

  useEffect(() => {
    setMessages([]);
    setCurrentPage(1);
    setHasMore(false);
    // Fetch chat user info
    axios.get(`/users/${id}`).then(res => setChatUser(res.data)).catch(console.error);
    // Fetch first page of messages
    axios.get(`/messages/${id}?page=1&limit=50`).then(res => {
      const data = res.data;
      // Handle both paginated { messages, pagination } and plain array (backwards compat)
      const msgs = Array.isArray(data) ? data : data.messages;
      const pagination = Array.isArray(data) ? null : data.pagination;
      setMessages(msgs || []);
      setHasMore(pagination ? pagination.hasMore : false);
    }).catch(console.error);
    // Mark seen on load
    axios.post(`/messages/seen/${id}`).then(() => {
      if (socket) socket.emit("markedSeen", { senderId: id });
    }).catch(console.error);
  }, [id, socket]);

  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const res = await axios.get(`/messages/${id}?page=${nextPage}&limit=50`);
      const data = res.data;
      const msgs = Array.isArray(data) ? data : data.messages;
      const pagination = Array.isArray(data) ? null : data.pagination;
      setMessages(prev => [...(msgs || []), ...prev]);
      setCurrentPage(nextPage);
      setHasMore(pagination ? pagination.hasMore : false);
    } catch (err) {
      console.error("Failed to load more messages", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      // Use String() safely and handle if it's an object
      const msgSenderId = typeof newMessage.senderId === 'object' && newMessage.senderId !== null ? String(newMessage.senderId._id) : String(newMessage.senderId);
      const msgReceiverId = typeof newMessage.receiverId === 'object' && newMessage.receiverId !== null ? String(newMessage.receiverId._id) : String(newMessage.receiverId);
      const chatId = String(id);
      const myId = String(currentUser?._id);

      // Message belongs to THIS chat if it's between us and the chatted user
      const isFromThem = msgSenderId === chatId && msgReceiverId === myId;
      const isFromMe = msgSenderId === myId && msgReceiverId === chatId;

      if (isFromThem || isFromMe) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => String(m._id) === String(newMessage._id))) return prev;
          return [...prev, newMessage];
        });
        // If they sent it to us and we're actively in this chat → auto mark seen
        if (isFromThem) {
          axios.post(`/messages/seen/${id}`).then(() => {
            if (socket) socket.emit("markedSeen", { senderId: id });
          }).catch(console.error);
        }
      }
    };

    const handleMessagesSeen = ({ receiverId }: { receiverId: string }) => {
      // Sender receives this: receiverId = the person who read our messages
      if (String(receiverId) === String(id)) {
        setMessages(prev =>
          prev.map(m =>
            String(m.senderId) === String(currentUser?._id) && m.status !== "seen"
              ? { ...m, status: "seen", updatedAt: new Date().toISOString() }
              : m
          )
        );
      }
    };

    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === id) setRemoteTyping(true);
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === id) setRemoteTyping(false);
    };

    const handleViewOnceOpened = ({ messageId }: { messageId: string }) => {
      setMessages(prev =>
        prev.map(m =>
          String(m._id) === String(messageId)
            ? { ...m, viewOnceViewed: true, updatedAt: new Date().toISOString() }
            : m
        )
      );
    };

    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.filter(m => String(m._id) !== String(messageId)));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("viewOnceOpened", handleViewOnceOpened);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("viewOnceOpened", handleViewOnceOpened);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, id, currentUser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        nav({ to: "/app" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nav]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, remoteTyping]);

  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);

    if (socket) {
      socket.emit("typing", { receiverId: id });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId: id });
      }, 2000);
    }
  };

  const handleSend = async () => {
    if (!draft.trim()) return;
    try {
      const payload = { message: draft, replyTo: replyingTo?._id || null };
      const res = await axios.post(`/messages/send/${id}`, payload);
      setMessages(prev => [...prev, res.data]);
      setDraft("");
      setReplyingTo(null);
      setShowEmoji(false);
      if (socket) socket.emit("stopTyping", { receiverId: id });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleDeleteMessage = async (msgId: string, forEveryone: boolean) => {
    try {
      if (forEveryone) {
        await axios.delete(`/messages/${msgId}`);
      } else {
        await axios.post(`/messages/delete-for-me/${msgId}`);
        setMessages(prev => prev.filter(m => String(m._id) !== String(msgId)));
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear this chat? This cannot be undone.")) return;
    try {
      await axios.delete(`/messages/clear/${id}`);
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat", err);
    }
  };

  // Upload file (image or file attachment) to backend → Cloudinary
  const uploadAndSend = useCallback(async (file: File, messageType: string, duration?: number) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post("/messages/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { url, type, publicId, mimeType, size } = uploadRes.data;
      const resolvedType = type || messageType;
      const payload: any = {
        message: file.name,
        messageType: resolvedType,
        media: url,
        mediaPublicId: publicId || "",
        mediaMimeType: mimeType || file.type || "",
        mediaSize: size || file.size || 0,
        replyTo: replyingTo?._id || null,
        isViewOnce: resolvedType === "image" && sendAsViewOnce,
      };
      // Pass recording duration for voice messages
      if (resolvedType === "voice" && duration) {
        payload.audioDuration = duration;
      }
      const res = await axios.post(`/messages/send/${id}`, payload);
      setMessages(prev => [...prev, res.data]);
      setReplyingTo(null);
      setSendAsViewOnce(false); // Reset view once toggle after sending
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  }, [id, replyingTo]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAndSend(file, "image");
    e.target.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAndSend(file, "file");
    e.target.value = "";
  };

  // ── Voice recorder ──────────────────────────────────────────────
  const recorder = useVoiceRecorder({ onUpload: uploadAndSend });
  const isRecording = recorder.state === "recording";
  const isPreview = recorder.state === "preview";
  const isRecordUploading = recorder.state === "uploading";

  const onEmojiClick = (emojiObject: any) => {
    setDraft(prev => prev + emojiObject.emoji);
  };

  if (!chatUser) return <div className="flex-1 flex items-center justify-center">Loading...</div>;

  const isOnline = onlineUsers.includes(id);

  return (
    <>
      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.zip,.xls,.xlsx,.ppt,.pptx" className="hidden" onChange={handleFileSelect} />

      {isDragging && (
        <DragDropOverlay
          onDismiss={() => setIsDragging(false)}
          onDrop={(files) => {
            const file = files[0];
            if (file && file.type.startsWith("image/")) {
              uploadAndSend(file, "image");
            } else {
              alert("Only images are allowed.");
              setIsDragging(false);
            }
          }}
        />
      )}

      {lightboxMedia && (
        <MediaLightbox
          url={lightboxMedia.url}
          type={lightboxMedia.type}
          name={lightboxMedia.name}
          onClose={() => setLightboxMedia(null)}
        />
      )}

      {/* Profile Modal */}
      {showProfile && chatUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowProfile(false)}>
          <div className="glass-strong rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center"><X className="h-4 w-4" /></button>
            <div className="relative inline-block">
              <img src={chatUser.avatar} className="h-24 w-24 rounded-full ring-4 ring-[var(--neon)]/40" alt={chatUser.name} />
              {isOnline && <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-[var(--success)] ring-2 ring-card" />}
            </div>
            <h2 className="mt-4 text-2xl font-bold">{chatUser.name}</h2>
            <p className="text-sm text-muted-foreground">@{chatUser.username}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${isOnline ? 'bg-[var(--success)]/20 text-[var(--success)]' : 'bg-muted text-muted-foreground'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-[var(--success)]' : 'bg-muted-foreground'}`} />
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button className="flex flex-col items-center gap-1.5 p-3 glass rounded-xl hover:glow-neon transition">
                <Phone className="h-5 w-5" /><span className="text-[10px]">Call</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 glass rounded-xl hover:glow-neon transition">
                <Video className="h-5 w-5" /><span className="text-[10px]">Video</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 glass rounded-xl hover:glow-neon transition">
                <Search className="h-5 w-5" /><span className="text-[10px]">Search</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="hidden md:block"><ChatListPanel active={id} /></div>

      <main 
        className="flex-1 flex flex-col min-w-0 relative"
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
      >
        {/* Header */}
        <header className="h-16 px-4 flex items-center justify-between glass border-b border-border/50 z-10">
          <div className="flex items-center gap-2 min-w-0">
            {/* Back button on mobile */}
            <Link
              to="/app/chats"
              className="md:hidden h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground flex items-center justify-center shrink-0 mr-1"
              title="Back to chats"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>

            <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => setShowProfile(true)}>
              <div className="relative shrink-0">
                <img src={chatUser.avatar} className="h-10 w-10 rounded-full" alt={chatUser.name} />
                {isOnline && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-card" />}
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate hover:text-[var(--neon)] transition">{chatUser.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  {remoteTyping ? (
                    <span className="text-[var(--neon)] animate-pulse">typing…</span>
                  ) : isOnline ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[var(--success)] inline-block animate-pulse" />
                      <span className="text-[var(--success)]">Online</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground/70">Offline</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <IconBtn icon={Search} />
            <IconBtn icon={Phone} />
            <IconBtn icon={Video} />
            <IconBtn icon={Pin} />
            <IconBtn icon={MoreVertical} onClick={() => setShowInfo(s => !s)} />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6 space-y-1">
          {hasMore && (
            <div className="flex justify-center mb-4">
              <button
                onClick={loadMoreMessages}
                disabled={loadingMore}
                className="text-xs px-4 py-2 glass rounded-full hover:bg-accent/60 transition text-muted-foreground disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load earlier messages"}
              </button>
            </div>
          )}
          {messages.map((m, i) => (
            <Bubble 
              key={m._id} 
              m={m} 
              prev={messages[i - 1]} 
              currentUser={currentUser} 
              chatUser={chatUser} 
              onReply={setReplyingTo} 
              onDelete={handleDeleteMessage}
            />
          ))}

          {/* Typing indicator */}
          {remoteTyping && (
            <div className="flex gap-3 items-end mt-4 animate-fade-in">
              <img src={chatUser.avatar} className="h-7 w-7 rounded-full" alt="" />
              <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 inline-flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-typing" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-5 pb-4 md:pb-5 relative">
          {showEmoji && !(isRecording || isPreview || isRecordUploading) && (
            <div className="absolute bottom-full mb-2 left-4 z-50 animate-fade-in shadow-2xl">
              <EmojiPicker onEmojiClick={onEmojiClick} theme={"dark" as any} />
            </div>
          )}
          {replyingTo && !(isRecording || isPreview || isRecordUploading) && (
            <div className="mb-2 glass-strong rounded-xl p-3 flex items-center justify-between border-l-4 border-[var(--neon)]">
              <div className="min-w-0">
                <div className="text-xs text-[var(--neon)] font-medium mb-0.5">Replying to {replyingTo.senderId === currentUser?._id ? "yourself" : chatUser.name}</div>
                <div className="text-sm truncate text-muted-foreground">{replyingTo.message}</div>
              </div>
              <button onClick={() => setReplyingTo(null)} className="h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── RECORDING STATE ── */}
          {isRecording && (
            <div className="glass-strong rounded-2xl p-3 flex items-center gap-3 relative z-10 animate-fade-in border border-red-500/30">
              <button onClick={recorder.cancelRecording} className="h-10 w-10 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0" title="Cancel">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="text-sm text-red-400 font-mono tabular-nums font-semibold">{recorder.formatTime(recorder.recordingTime)}</span>
                {/* Live waveform bars */}
                <div className="flex items-center gap-[2px] flex-1 h-8 overflow-hidden">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const baseH = [3,5,8,12,16,20,18,14,10,7,9,15,20,17,12,8,11,6,4,3,7,13,18,15,9,5,11,16,8,4];
                    const vol = recorder.volumeLevel;
                    const h = Math.max(3, baseH[i % baseH.length] * (0.3 + vol * 1.5));
                    return (
                      <div key={i} className="flex-1 rounded-full transition-all duration-75" style={{
                        height: `${Math.min(h, 28)}px`,
                        background: `linear-gradient(to top, rgba(239,68,68,0.9), rgba(239,68,68,0.4))`,
                      }} />
                    );
                  })}
                </div>
              </div>
              <button onClick={recorder.stopRecording} className="h-11 w-11 rounded-full bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30" title="Stop recording">
                <StopCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* ── PREVIEW STATE ── */}
          {isPreview && (
            <div className="glass-strong rounded-2xl p-3 flex items-center gap-3 relative z-10 animate-fade-in border border-[var(--neon)]/30">
              <button onClick={recorder.cancelRecording} className="h-10 w-10 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0" title="Delete recording">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={recorder.togglePreviewPlayback} className="h-10 w-10 rounded-full bg-[var(--neon)]/15 text-[var(--neon)] hover:bg-[var(--neon)]/25 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0" title={recorder.isPreviewPlaying ? "Pause" : "Play preview"}>
                {recorder.isPreviewPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" style={{ marginLeft: "2px" }} />}
              </button>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-[2px] h-7">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const heights = [3,5,8,12,16,20,18,14,10,7,9,15,20,17,12,8,11,6,4,3,7,13,18,15,9,5,11,16,8,4];
                    const h = heights[i % heights.length];
                    const pct = recorder.previewDuration > 0 ? (i / 30) * 100 : 0;
                    const playedPct = recorder.previewDuration > 0 ? (recorder.previewCurrentTime / recorder.previewDuration) * 100 : 0;
                    const isPlayed = pct <= playedPct;
                    return (
                      <div key={i} className="flex-1 rounded-full transition-colors duration-75" style={{
                        height: `${h}px`,
                        background: isPlayed ? "var(--neon)" : "oklch(0.5 0.02 270 / 0.3)",
                      }} />
                    );
                  })}
                </div>
                <div className="text-[10px] flex justify-between text-muted-foreground">
                  <span>{recorder.formatTime(recorder.previewCurrentTime)}</span>
                  <span>{recorder.formatTime(recorder.previewDuration || recorder.recordingTime)}</span>
                </div>
              </div>
              <button onClick={recorder.sendRecording} className="h-11 w-11 rounded-full bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0 shadow-lg" title="Send voice message">
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── UPLOADING STATE ── */}
          {isRecordUploading && (
            <div className="glass-strong rounded-2xl p-3 flex items-center gap-3 relative z-10 animate-fade-in border border-[var(--neon)]/30">
              <div className="h-10 w-10 rounded-full bg-[var(--neon)]/15 flex items-center justify-center shrink-0">
                <div className="h-5 w-5 border-2 border-[var(--neon)] border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Sending voice message…</span>
                  <span className="text-[10px] text-[var(--neon)] font-mono">{Math.round(recorder.uploadProgress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] transition-all duration-300" style={{ width: `${recorder.uploadProgress}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* ── NORMAL / ERROR INPUT STATE ── */}
          {!isRecording && !isPreview && !isRecordUploading && (
            <div className="glass-strong rounded-2xl p-2 flex items-end gap-2 relative z-10">
              <IconBtn icon={Smile} onClick={() => setShowEmoji(!showEmoji)} />
              <button 
                onClick={() => setSendAsViewOnce(!sendAsViewOnce)} 
                className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition ${sendAsViewOnce ? 'bg-[var(--neon)]/20 text-[var(--neon)]' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                title={sendAsViewOnce ? "Sending as View Once" : "Send as View Once"}
              >
                {sendAsViewOnce ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <IconBtn icon={ImageIcon} onClick={() => imageInputRef.current?.click()} />
              <IconBtn icon={Paperclip} onClick={() => fileInputRef.current?.click()} />
              {isUploading ? (
                <div className="flex-1 flex items-center gap-2 px-2 py-2.5">
                  <div className="animate-spin h-4 w-4 border-2 border-[var(--neon)] border-t-transparent rounded-full" />
                  <span className="text-xs text-muted-foreground">Uploading…</span>
                </div>
              ) : recorder.state === "error" ? (
                <div className="flex-1 flex items-center gap-2 px-2 py-2.5">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-xs text-destructive truncate">{recorder.error}</span>
                  <button onClick={() => recorder.cancelRecording()} className="text-xs text-muted-foreground hover:text-foreground ml-auto">✕</button>
                </div>
              ) : (
                <textarea
                  rows={1}
                  value={draft}
                  onChange={handleDraftChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message…"
                  className="flex-1 resize-none bg-transparent outline-none px-2 py-2.5 text-sm placeholder:text-muted-foreground max-h-32"
                />
              )}
              {!draft.trim() && !isUploading && recorder.state !== "error" && (
                <IconBtn icon={Mic} onClick={recorder.startRecording} />
              )}
              <button
                onClick={handleSend}
                disabled={!draft.trim() && !isUploading}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary hover:scale-105 active:scale-95 transition flex items-center justify-center disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-[var(--neon)]" /> AI smart replies enabled
          </div>
        </div>
      </main>

      {/* Right info panel */}
      {showInfo && (
        <aside className="hidden xl:flex w-80 flex-col glass border-l border-border/50 overflow-y-auto scrollbar-thin">
          <div className="p-6 text-center border-b border-border/50">
            <img src={chatUser.avatar} className="h-24 w-24 rounded-full mx-auto ring-4 ring-[var(--neon)]/30" alt="" />
            <h3 className="mt-3 font-semibold text-lg">{chatUser.name}</h3>
            <p className="text-xs text-muted-foreground">@{chatUser.username}</p>
            <p className="text-xs mt-2 text-muted-foreground">Joined recently ✨</p>
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[Phone, Video, Search].map((Icon, i) => (
                <button key={i} className="h-12 rounded-xl glass hover:glow-neon transition flex items-center justify-center"><Icon className="h-4 w-4" /></button>
              ))}
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div>
              <SectionTitle>Shared media</SectionTitle>
              <div className="text-xs text-muted-foreground text-center py-2 mt-2">
                View Once photos cannot be saved to media.
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-border/50">
              <button 
                onClick={handleClearChat}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" /> Clear Chat History
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{children}</div>;
}

function IconBtn({ icon: Icon, onClick }: { icon: typeof Pin; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition flex items-center justify-center">
      <Icon className="h-4 w-4" />
    </button>
  );
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function Bubble({ m, prev, currentUser, chatUser, onReply, onDelete }: { m: any; prev?: any; currentUser: any; chatUser: any; onReply: (m: any) => void; onDelete: (msgId: string, forEveryone: boolean) => void; }) {
  const me = m.senderId === currentUser?._id;
  const sameAuthor = prev?.senderId === m.senderId;
  const time = new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex gap-2.5 group ${me ? "justify-end" : ""} ${sameAuthor ? "mt-0.5" : "mt-3"}`}>
      {!me && (sameAuthor ? <div className="w-8" /> : <img src={chatUser.avatar} className="h-8 w-8 rounded-full" alt="" />)}
      <div className={`max-w-md ${me ? "items-end" : "items-start"} flex flex-col`}>
        {m.replyTo && (
          <div 
            onClick={() => {
              const el = document.getElementById(`msg-${m.replyTo._id}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('bg-white/20');
                setTimeout(() => el.classList.remove('bg-white/20'), 1000);
              }
            }}
            className={`cursor-pointer transition-colors text-xs glass rounded-lg px-3 py-1.5 border-l-2 border-[var(--neon)] mb-1 ${me ? "self-end" : ""}`}
          >
            <div className="text-[var(--neon)] font-medium">Replying to {m.replyTo.senderId === currentUser?._id ? "yourself" : chatUser.name}</div>
            <div className="text-muted-foreground truncate opacity-80">{m.replyTo.message || "Attachment"}</div>
          </div>
        )}
        <div id={`msg-${m._id}`} className={`relative px-4 py-2.5 text-sm shadow-sm transition-colors duration-500 animate-fade-in ${me
          ? "bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white rounded-2xl rounded-br-sm"
          : "glass rounded-2xl rounded-bl-sm"
          }`}>
          <MediaMessage
            messageId={m._id}
            messageType={m.messageType}
            message={m.message}
            media={m.media}
            mediaMimeType={m.mediaMimeType}
            mediaSize={m.mediaSize}
            isMe={me}
            isViewOnce={m.isViewOnce}
            viewOnceViewed={m.viewOnceViewed}
            onOpenLightbox={m.messageType === 'image' || m.messageType === 'video' ? () => {
              const ev = new CustomEvent('openLightbox', { detail: { url: m.media, type: m.messageType, name: m.message } });
              window.dispatchEvent(ev);
            } : undefined}
          />
          <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${me ? "text-white/80 justify-end" : "text-muted-foreground"}`}>
            {time}
            {me && (
              <>
                {m.status === "seen" ? (
                  <span className="flex items-center gap-1 ml-1 text-white/90">
                    <CheckCheck className="h-3 w-3" /> Seen {timeAgo(m.updatedAt)}
                  </span>
                ) : m.status === "delivered" ? (
                  <CheckCheck className="h-3 w-3 opacity-60 ml-1" />
                ) : (
                  <Check className="h-3 w-3 opacity-60 ml-1" />
                )}
              </>
            )}
          </div>

          {/* hover actions */}
          <div className={`absolute ${me ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2 hidden group-hover:flex glass-strong rounded-full p-1 gap-0.5 z-10`}>
            <button className="h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center text-foreground" title="React"><Smile className="h-3.5 w-3.5" /></button>
            <button onClick={() => onReply(m)} className="h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center text-foreground" title="Reply"><Reply className="h-3.5 w-3.5" /></button>
            <button 
              onClick={() => {
                const forEveryone = me ? window.confirm("Unsend message for everyone?") : false;
                if (!me && !window.confirm("Delete message for yourself?")) return;
                onDelete(m._id, forEveryone);
              }} 
              className="h-7 w-7 rounded-full hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-foreground transition" 
              title={me ? "Unsend" : "Delete for me"}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {m.reactions && (
          <div className={`flex gap-1 mt-1 ${me ? "self-end" : ""}`}>
            {m.reactions.map((r: any, i: number) => (
              <span key={i} className="glass text-xs rounded-full px-2 py-0.5">{r.emoji} {r.count}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
