import { Check, CheckCheck, Reply, Smile, Forward, Play, FileText } from "lucide-react";
import { MediaMessage } from "./MediaMessage";

function timeStr(d: string) {
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface Props {
  m: any;
  prev?: any;
  currentUser: any;
  onReply: (m: any) => void;
}

export function GroupBubble({ m, prev, currentUser, onReply }: Props) {
  if (m.messageType === "system") {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-muted-foreground glass px-3 py-1 rounded-full">{m.message}</span>
      </div>
    );
  }

  const senderId = m.senderId?._id || m.senderId;
  const me = String(senderId) === String(currentUser?._id);
  const sameAuthor = prev && (String(prev.senderId?._id || prev.senderId) === String(senderId));
  const sender = m.senderId;

  return (
    <div className={`flex gap-2.5 group ${me ? "justify-end" : ""} ${sameAuthor ? "mt-0.5" : "mt-3"}`}>
      {!me && (
        sameAuthor
          ? <div className="w-8" />
          : <img src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.username}`}
              className="h-8 w-8 rounded-full shrink-0" alt="" />
      )}
      <div className={`max-w-md flex flex-col ${me ? "items-end" : "items-start"}`}>
        {!me && !sameAuthor && (
          <span className="text-[11px] text-[var(--neon)] font-medium mb-0.5 ml-1">{sender?.name || "Unknown"}</span>
        )}
        {m.replyTo && (
          <div className={`text-xs glass rounded-lg px-3 py-1.5 border-l-2 border-[var(--neon)] mb-1 ${me ? "self-end" : ""}`}>
            <div className="text-[var(--neon)] font-medium">{m.replyTo.senderId?.name || "Someone"}</div>
            <div className="text-muted-foreground truncate">{m.replyTo.message || "Attachment"}</div>
          </div>
        )}
        <div className={`relative px-4 py-2.5 text-sm shadow-sm animate-fade-in ${
          me
            ? "bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white rounded-2xl rounded-br-sm"
            : "glass rounded-2xl rounded-bl-sm"
        }`}>
          <MediaMessage
            messageType={m.messageType}
            message={m.message}
            media={m.media}
            mediaMimeType={m.mediaMimeType}
            mediaSize={m.mediaSize}
            audioDuration={m.audioDuration}
            isMe={me}
            onOpenLightbox={m.messageType === 'image' || m.messageType === 'video' ? () => {
              const ev = new CustomEvent('openLightbox', { detail: { url: m.media, type: m.messageType, name: m.message } });
              window.dispatchEvent(ev);
            } : undefined}
          />
          <div className={`text-[10px] mt-1 flex items-center gap-1 ${me ? "text-white/70 justify-end" : "text-muted-foreground"}`}>
            {timeStr(m.createdAt)}
          </div>
          <div className={`absolute ${me ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2 hidden group-hover:flex glass-strong rounded-full p-1 gap-0.5`}>
            <button className="h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center"><Smile className="h-3.5 w-3.5" /></button>
            <button onClick={() => onReply(m)} className="h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center"><Reply className="h-3.5 w-3.5" /></button>
            <button className="h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center"><Forward className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
