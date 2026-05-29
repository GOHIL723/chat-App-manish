import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { MoreVertical, Send, Smile, Paperclip, Image as Img, Mic, X, StopCircle, Sparkles, Settings, Users, AlertCircle, ChevronLeft } from "lucide-react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { useGroupChat } from "../hooks/useGroupChat";
import { useSocket } from "../context/SocketContext";
import { GroupBubble } from "../components/GroupBubble";
import { GroupMembersPanel } from "../components/GroupMembersPanel";
import { GroupSettingsModal } from "../components/GroupSettingsModal";
import { MediaLightbox } from "../components/MediaLightbox";
import { DragDropOverlay } from "../components/DragDropOverlay";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

export const Route = createFileRoute("/app/groups/$id")({
  component: GroupChatRoom,
});

function GroupChatRoom() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { group, setGroup, messages, hasMore, loadingMore, loadMore, sendMessage, emitTyping, remoteTyping, currentUser } = useGroupChat(id);
  const { onlineUsers } = useSocket();
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string, type: 'image' | 'video', name?: string } | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, remoteTyping]);
  useEffect(() => { axios.get("/users").then(r => setAllUsers(r.data)).catch(() => {}); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") nav({ to: "/app/groups" }); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [nav]);
  useEffect(() => {
    const handleOpenLightbox = (e: any) => setLightboxMedia(e.detail);
    window.addEventListener('openLightbox', handleOpenLightbox);
    return () => window.removeEventListener('openLightbox', handleOpenLightbox);
  }, []);

  const handleSend = async () => {
    if (!draft.trim()) return;
    const text = draft; setDraft(""); setReplyingTo(null); setShowEmoji(false);
    await sendMessage({ message: text, replyTo: replyingTo?._id || null });
  };

  const uploadAndSend = useCallback(async (file: File, type: string, duration?: number) => {
    setIsUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const { data } = await axios.post("/messages/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      
      const payload: any = {
        message: file.name,
        messageType: data.type || type,
        media: data.url,
        mediaPublicId: data.publicId || "",
        mediaMimeType: data.mimeType || file.type || "",
        mediaSize: data.size || file.size || 0,
        replyTo: replyingTo?._id || null
      };

      if ((data.type || type) === "voice" && duration) {
        payload.audioDuration = duration;
      }

      await sendMessage(payload);
      setReplyingTo(null);
    } catch (e) { console.error(e); } finally { setIsUploading(false); }
  }, [sendMessage, replyingTo]);

  // ── Voice recorder (fixed) ──────────────────────────────────────────────
  const recorder = useVoiceRecorder({ onUpload: uploadAndSend });
  const isRecording = recorder.state === "recording";
  const isRecordUploading = recorder.state === "uploading";

  const typingNames = remoteTyping.map(uid => {
    const m = group?.members?.find((x: any) => (x._id || x) === uid);
    return m?.name || "Someone";
  }).join(", ");

  if (!group) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-[var(--neon)] border-t-transparent rounded-full" /></div>;

  const onlineCount = group.members?.filter((m: any) => onlineUsers.includes(m._id || m)).length || 0;

  return (
    <>
      <input ref={imageInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAndSend(f, f.type.startsWith("video/") ? "video" : "image"); e.target.value = ""; }} />
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.zip" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAndSend(f, "file"); e.target.value = ""; }} />

      {isDragging && (
        <DragDropOverlay
          onDismiss={() => setIsDragging(false)}
          onDrop={(files) => {
            const file = files[0];
            if (file) {
              const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
              uploadAndSend(file, type);
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

      {showSettings && <GroupSettingsModal group={group} currentUser={currentUser} onClose={() => setShowSettings(false)} onUpdated={setGroup} />}

      <main 
        className="flex-1 flex flex-col min-w-0 relative"
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
      >
        {/* Header */}
        <header className="h-16 px-4 flex items-center justify-between glass border-b border-border/50 z-10">
          <div className="flex items-center gap-2 min-w-0">
            {/* Back button on mobile */}
            <Link
              to="/app/groups"
              className="md:hidden h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground flex items-center justify-center shrink-0 mr-1"
              title="Back to groups"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>

            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--neon)]/60 to-[var(--neon-2)]/60 flex items-center justify-center font-bold text-white shrink-0">
                {group.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate">{group.name}</div>
                <div className="text-xs text-muted-foreground">{group.members?.length || 0} members · {onlineCount} online</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowMembers(v => !v)} className={`h-10 w-10 rounded-xl flex items-center justify-center transition ${showMembers ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"}`}>
              <Users className="h-4 w-4" />
            </button>
            <button onClick={() => setShowSettings(true)} className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center transition">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          {/* Messages */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6 space-y-1">
              {hasMore && (
                <div className="flex justify-center mb-4">
                  <button onClick={loadMore} disabled={loadingMore} className="text-xs px-4 py-2 glass rounded-full hover:bg-accent/60 transition text-muted-foreground disabled:opacity-50">
                    {loadingMore ? "Loading…" : "Load earlier messages"}
                  </button>
                </div>
              )}
              {messages.map((m, i) => (
                <GroupBubble key={m._id} m={m} prev={messages[i - 1]} currentUser={currentUser} onReply={setReplyingTo} />
              ))}
              {remoteTyping.length > 0 && (
                <div className="flex gap-2 items-end mt-3 animate-fade-in">
                  <div className="glass rounded-2xl rounded-bl-sm px-4 py-2 text-xs text-muted-foreground">
                    {typingNames} {remoteTyping.length === 1 ? "is" : "are"} typing…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-4 md:p-5 pb-4 md:pb-5 relative">
              {showEmoji && (
                <div className="absolute bottom-full mb-2 left-4 z-50 animate-fade-in shadow-2xl">
                  <EmojiPicker onEmojiClick={(e: any) => setDraft(p => p + e.emoji)} theme={"dark" as any} />
                </div>
              )}
              {replyingTo && (
                <div className="mb-2 glass-strong rounded-xl p-3 flex items-center justify-between border-l-4 border-[var(--neon)]">
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--neon)] font-medium mb-0.5">Replying to {replyingTo.senderId?.name || "message"}</div>
                    <div className="text-sm truncate text-muted-foreground">{replyingTo.message}</div>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center shrink-0"><X className="h-4 w-4" /></button>
                </div>
              )}
              <div className="glass-strong rounded-2xl p-2 flex items-end gap-2 z-10 relative">
                <button onClick={() => setShowEmoji(v => !v)} className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center"><Smile className="h-4 w-4" /></button>
                <button onClick={() => fileInputRef.current?.click()} className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center"><Paperclip className="h-4 w-4" /></button>
                <button onClick={() => imageInputRef.current?.click()} className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center"><Img className="h-4 w-4" /></button>
                {isUploading || isRecordUploading ? (
                  <div className="flex-1 flex items-center gap-2 px-2 py-2.5">
                    <div className="animate-spin h-4 w-4 border-2 border-[var(--neon)] border-t-transparent rounded-full" />
                    <span className="text-xs text-muted-foreground">{isRecordUploading ? "Sending voice…" : "Uploading…"}</span>
                  </div>
                ) : isRecording ? (
                  <div className="flex-1 flex items-center gap-3 px-3 py-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span className="text-sm text-red-400 font-mono tabular-nums">{recorder.formatTime(recorder.recordingTime)}</span>
                    <span className="text-xs text-muted-foreground flex-1">Recording…</span>
                    <button onClick={recorder.cancelRecording} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-accent transition">Cancel</button>
                  </div>
                ) : recorder.state === "error" ? (
                  <div className="flex-1 flex items-center gap-2 px-2 py-2.5">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    <span className="text-xs text-destructive truncate">{recorder.error}</span>
                    <button onClick={() => recorder.cancelRecording()} className="text-xs text-muted-foreground hover:text-foreground ml-auto">✕</button>
                  </div>
                ) : (
                  <textarea rows={1} value={draft}
                    onChange={e => { setDraft(e.target.value); emitTyping(); }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Message group…"
                    className="flex-1 resize-none bg-transparent outline-none px-2 py-2.5 text-sm placeholder:text-muted-foreground max-h-32" />
                )}
                {isRecording ? (
                  <button onClick={recorder.stopRecording} title="Stop recording" className="h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center"><StopCircle className="h-5 w-5" /></button>
                ) : (
                  <>
                    {!draft.trim() && !isRecordUploading && recorder.state !== "error" && <button onClick={recorder.startRecording} className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center"><Mic className="h-4 w-4" /></button>}
                    <button onClick={handleSend} disabled={!draft.trim() && !isUploading}
                      className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary hover:scale-105 active:scale-95 transition flex items-center justify-center disabled:opacity-40">
                      <Send className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-[var(--neon)]" /> AI smart replies enabled
              </div>
            </div>
          </div>

          {/* Members sidebar */}
          {showMembers && (
            <aside className="hidden xl:flex w-72 flex-col glass border-l border-border/50 overflow-y-auto scrollbar-thin">
              <div className="p-5 border-b border-border/50">
                <h3 className="font-semibold">Group Info</h3>
                {group.description && <p className="text-xs text-muted-foreground mt-1">{group.description}</p>}
                <div className="flex -space-x-2 mt-3">
                  {group.members?.slice(0, 5).map((m: any) => (
                    <img key={m._id || m} src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                      className="h-8 w-8 rounded-full ring-2 ring-card" alt="" />
                  ))}
                  {(group.members?.length || 0) > 5 && (
                    <div className="h-8 w-8 rounded-full glass ring-2 ring-card flex items-center justify-center text-[10px]">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>
              </div>
              <GroupMembersPanel group={group} currentUser={currentUser} onlineUsers={onlineUsers} onUpdated={setGroup} allUsers={allUsers} />
            </aside>
          )}
        </div>
      </main>
    </>
  );
}
