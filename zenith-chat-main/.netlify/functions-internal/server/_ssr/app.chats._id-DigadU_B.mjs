import { r as reactExports, V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { g as Route2, u as useNavigate, b as useSocket, a as useAuth, d as axios, X, S as Search, C as ChatListPanel, c as createLucideIcon } from "./router-IDBMxkhe.mjs";
import { u as useVoiceRecorder, D as DragDropOverlay, M as MediaLightbox, E as EmojiPicker$1, a as CircleStop, d as Pause, e as Play, b as Send, S as Smile, I as Image$1, P as Paperclip, C as CircleAlert, c as MediaMessage, R as Reply, F as Forward } from "./useVoiceRecorder-DEUPm9e2.mjs";
import { P as Phone } from "./phone-Cz5pj2yn.mjs";
import { V as Video } from "./video-DDmJJbPG.mjs";
import { T as Trash2, C as Check } from "./trash-2-CbXBbjVy.mjs";
import { M as Mic } from "./mic-CV27caOA.mjs";
import { S as Sparkles } from "./sparkles-D0VnYmi_.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "net";
import "tls";
import "assert";
import "./index.mjs";
import "node:events";
import "os";
import "events";
import "http2";
import "zlib";
import "./eye-B02W7Mst.mjs";
import "./chevron-right-EwS0buAi.mjs";
const __iconNode$2 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("ellipsis-vertical", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  [
    "path",
    {
      d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
      key: "1nkz8b"
    }
  ]
];
const Pin = createLucideIcon("pin", __iconNode);
function ChatRoom() {
  const {
    id
  } = Route2.useParams();
  const nav = useNavigate();
  const [chatUser, setChatUser] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [hasMore, setHasMore] = reactExports.useState(false);
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [loadingMore, setLoadingMore] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState("");
  const [showInfo, setShowInfo] = reactExports.useState(true);
  const [showProfile, setShowProfile] = reactExports.useState(false);
  const [remoteTyping, setRemoteTyping] = reactExports.useState(false);
  const [replyingTo, setReplyingTo] = reactExports.useState(null);
  const [showEmoji, setShowEmoji] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [lightboxMedia, setLightboxMedia] = reactExports.useState(null);
  const typingTimeoutRef = reactExports.useRef(null);
  const imageInputRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useRef(null);
  const {
    socket,
    onlineUsers
  } = useSocket();
  const {
    user: currentUser
  } = useAuth();
  reactExports.useEffect(() => {
    const handleOpenLightbox = (e) => setLightboxMedia(e.detail);
    window.addEventListener("openLightbox", handleOpenLightbox);
    return () => window.removeEventListener("openLightbox", handleOpenLightbox);
  }, []);
  reactExports.useEffect(() => {
    setMessages([]);
    setCurrentPage(1);
    setHasMore(false);
    axios.get(`/users/${id}`).then((res) => setChatUser(res.data)).catch(console.error);
    axios.get(`/messages/${id}?page=1&limit=50`).then((res) => {
      const data = res.data;
      const msgs = Array.isArray(data) ? data : data.messages;
      const pagination = Array.isArray(data) ? null : data.pagination;
      setMessages(msgs || []);
      setHasMore(pagination ? pagination.hasMore : false);
    }).catch(console.error);
    axios.post(`/messages/seen/${id}`).then(() => {
      if (socket) socket.emit("markedSeen", {
        senderId: id
      });
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
      setMessages((prev) => [...msgs || [], ...prev]);
      setCurrentPage(nextPage);
      setHasMore(pagination ? pagination.hasMore : false);
    } catch (err) {
      console.error("Failed to load more messages", err);
    } finally {
      setLoadingMore(false);
    }
  };
  reactExports.useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      const msgSenderId = String(newMessage.senderId);
      const msgReceiverId = String(newMessage.receiverId);
      const chatId = String(id);
      const myId = String(currentUser?._id);
      const isFromThem = msgSenderId === chatId && msgReceiverId === myId;
      const isFromMe = msgSenderId === myId && msgReceiverId === chatId;
      if (isFromThem || isFromMe) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(newMessage._id))) return prev;
          return [...prev, newMessage];
        });
        if (isFromThem) {
          axios.post(`/messages/seen/${id}`).then(() => {
            if (socket) socket.emit("markedSeen", {
              senderId: id
            });
          }).catch(console.error);
        }
      }
    };
    const handleMessagesSeen = ({
      receiverId
    }) => {
      if (String(receiverId) === String(id)) {
        setMessages((prev) => prev.map((m) => String(m.senderId) === String(currentUser?._id) && m.status !== "seen" ? {
          ...m,
          status: "seen",
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        } : m));
      }
    };
    const handleTyping = ({
      senderId
    }) => {
      if (senderId === id) setRemoteTyping(true);
    };
    const handleStopTyping = ({
      senderId
    }) => {
      if (senderId === id) setRemoteTyping(false);
    };
    const handleViewOnceOpened = ({
      messageId
    }) => {
      setMessages((prev) => prev.map((m) => String(m._id) === String(messageId) ? {
        ...m,
        viewOnceViewed: true,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      } : m));
    };
    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("viewOnceOpened", handleViewOnceOpened);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("viewOnceOpened", handleViewOnceOpened);
    };
  }, [socket, id, currentUser]);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        nav({
          to: "/app"
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nav]);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, remoteTyping]);
  const handleDraftChange = (e) => {
    setDraft(e.target.value);
    if (socket) {
      socket.emit("typing", {
        receiverId: id
      });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", {
          receiverId: id
        });
      }, 2e3);
    }
  };
  const handleSend = async () => {
    if (!draft.trim()) return;
    try {
      const payload = {
        message: draft,
        replyTo: replyingTo?._id || null
      };
      const res = await axios.post(`/messages/send/${id}`, payload);
      setMessages((prev) => [...prev, res.data]);
      setDraft("");
      setReplyingTo(null);
      setShowEmoji(false);
      if (socket) socket.emit("stopTyping", {
        receiverId: id
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };
  const uploadAndSend = reactExports.useCallback(async (file, messageType, duration) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post("/messages/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      const {
        url,
        type,
        publicId,
        mimeType,
        size
      } = uploadRes.data;
      const resolvedType = type || messageType;
      const payload = {
        message: file.name,
        messageType: resolvedType,
        media: url,
        mediaPublicId: publicId || "",
        mediaMimeType: mimeType || file.type || "",
        mediaSize: size || file.size || 0,
        replyTo: replyingTo?._id || null,
        isViewOnce: resolvedType === "image"
      };
      if (resolvedType === "voice" && duration) {
        payload.audioDuration = duration;
      }
      const res = await axios.post(`/messages/send/${id}`, payload);
      setMessages((prev) => [...prev, res.data]);
      setReplyingTo(null);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  }, [id, replyingTo]);
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadAndSend(file, "image");
    e.target.value = "";
  };
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadAndSend(file, "file");
    e.target.value = "";
  };
  const recorder = useVoiceRecorder({
    onUpload: uploadAndSend
  });
  const isRecording = recorder.state === "recording";
  const isPreview = recorder.state === "preview";
  const isRecordUploading = recorder.state === "uploading";
  const onEmojiClick = (emojiObject) => {
    setDraft((prev) => prev + emojiObject.emoji);
  };
  if (!chatUser) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: "Loading..." });
  const isOnline = onlineUsers.includes(id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: imageInputRef, type: "file", accept: "image/*,video/*", className: "hidden", onChange: handleImageSelect }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: ".pdf,.doc,.docx,.txt,.zip,.xls,.xlsx,.ppt,.pptx", className: "hidden", onChange: handleFileSelect }),
    isDragging && /* @__PURE__ */ jsxRuntimeExports.jsx(DragDropOverlay, { onDismiss: () => setIsDragging(false), onDrop: (files) => {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        uploadAndSend(file, "image");
      } else {
        alert("Only images are allowed.");
        setIsDragging(false);
      }
    } }),
    lightboxMedia && /* @__PURE__ */ jsxRuntimeExports.jsx(MediaLightbox, { url: lightboxMedia.url, type: lightboxMedia.type, name: lightboxMedia.name, onClose: () => setLightboxMedia(null) }),
    showProfile && chatUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: () => setShowProfile(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl animate-slide-up", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowProfile(false), className: "absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: chatUser.avatar, className: "h-24 w-24 rounded-full ring-4 ring-[var(--neon)]/40", alt: chatUser.name }),
        isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 right-1 h-4 w-4 rounded-full bg-[var(--success)] ring-2 ring-card" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-2xl font-bold", children: chatUser.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "@",
        chatUser.username
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${isOnline ? "bg-[var(--success)]/20 text-[var(--success)]" : "bg-muted text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${isOnline ? "bg-[var(--success)]" : "bg-muted-foreground"}` }),
        isOnline ? "Online" : "Offline"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex flex-col items-center gap-1.5 p-3 glass rounded-xl hover:glow-neon transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Call" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex flex-col items-center gap-1.5 p-3 glass rounded-xl hover:glow-neon transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Video" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex flex-col items-center gap-1.5 p-3 glass rounded-xl hover:glow-neon transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Search" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatListPanel, { active: id }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col min-w-0 relative", onDragEnter: (e) => {
      e.preventDefault();
      setIsDragging(true);
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 px-4 flex items-center justify-between glass border-b border-border/50 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0 cursor-pointer", onClick: () => setShowProfile(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: chatUser.avatar, className: "h-10 w-10 rounded-full", alt: chatUser.name }),
            isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-card" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate hover:text-[var(--neon)] transition", children: chatUser.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: remoteTyping ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--neon)] animate-pulse", children: "typing…" }) : isOnline ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-[var(--success)] inline-block animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--success)]", children: "Online" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/70", children: "Offline" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Search }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Video }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Pin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: EllipsisVertical, onClick: () => setShowInfo((s) => !s) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6 space-y-1", children: [
        hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: loadMoreMessages, disabled: loadingMore, className: "text-xs px-4 py-2 glass rounded-full hover:bg-accent/60 transition text-muted-foreground disabled:opacity-50", children: loadingMore ? "Loading…" : "Load earlier messages" }) }),
        messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bubble, { m, prev: messages[i - 1], currentUser, chatUser, onReply: setReplyingTo }, m._id)),
        remoteTyping && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-end mt-4 animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: chatUser.avatar, className: "h-7 w-7 rounded-full", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl rounded-bl-sm px-4 py-3 inline-flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-foreground/60 animate-typing", style: {
            animationDelay: `${i * 0.15}s`
          } }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 pb-20 md:pb-5 relative", children: [
        showEmoji && !(isRecording || isPreview || isRecordUploading) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full mb-2 left-4 z-50 animate-fade-in shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmojiPicker$1, { onEmojiClick, theme: "dark" }) }),
        replyingTo && !(isRecording || isPreview || isRecordUploading) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 glass-strong rounded-xl p-3 flex items-center justify-between border-l-4 border-[var(--neon)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[var(--neon)] font-medium mb-0.5", children: [
              "Replying to ",
              replyingTo.senderId === currentUser?._id ? "yourself" : chatUser.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm truncate text-muted-foreground", children: replyingTo.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReplyingTo(null), className: "h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        isRecording && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-3 flex items-center gap-3 relative z-10 animate-fade-in border border-red-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.cancelRecording, className: "h-10 w-10 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0", title: "Cancel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full bg-red-500 animate-pulse shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-400 font-mono tabular-nums font-semibold", children: recorder.formatTime(recorder.recordingTime) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-[2px] flex-1 h-8 overflow-hidden", children: Array.from({
              length: 30
            }).map((_, i) => {
              const baseH = [3, 5, 8, 12, 16, 20, 18, 14, 10, 7, 9, 15, 20, 17, 12, 8, 11, 6, 4, 3, 7, 13, 18, 15, 9, 5, 11, 16, 8, 4];
              const vol = recorder.volumeLevel;
              const h = Math.max(3, baseH[i % baseH.length] * (0.3 + vol * 1.5));
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 rounded-full transition-all duration-75", style: {
                height: `${Math.min(h, 28)}px`,
                background: `linear-gradient(to top, rgba(239,68,68,0.9), rgba(239,68,68,0.4))`
              } }, i);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.stopRecording, className: "h-11 w-11 rounded-full bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30", title: "Stop recording", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleStop, { className: "h-5 w-5" }) })
        ] }),
        isPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-3 flex items-center gap-3 relative z-10 animate-fade-in border border-[var(--neon)]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.cancelRecording, className: "h-10 w-10 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0", title: "Delete recording", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.togglePreviewPlayback, className: "h-10 w-10 rounded-full bg-[var(--neon)]/15 text-[var(--neon)] hover:bg-[var(--neon)]/25 hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0", title: recorder.isPreviewPlaying ? "Pause" : "Play preview", children: recorder.isPreviewPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4", fill: "currentColor" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4", fill: "currentColor", style: {
            marginLeft: "2px"
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-[2px] h-7", children: Array.from({
              length: 30
            }).map((_, i) => {
              const heights = [3, 5, 8, 12, 16, 20, 18, 14, 10, 7, 9, 15, 20, 17, 12, 8, 11, 6, 4, 3, 7, 13, 18, 15, 9, 5, 11, 16, 8, 4];
              const h = heights[i % heights.length];
              const pct = recorder.previewDuration > 0 ? i / 30 * 100 : 0;
              const playedPct = recorder.previewDuration > 0 ? recorder.previewCurrentTime / recorder.previewDuration * 100 : 0;
              const isPlayed = pct <= playedPct;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 rounded-full transition-colors duration-75", style: {
                height: `${h}px`,
                background: isPlayed ? "var(--neon)" : "oklch(0.5 0.02 270 / 0.3)"
              } }, i);
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: recorder.formatTime(recorder.previewCurrentTime) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: recorder.formatTime(recorder.previewDuration || recorder.recordingTime) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.sendRecording, className: "h-11 w-11 rounded-full bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary hover:scale-105 active:scale-95 transition flex items-center justify-center shrink-0 shadow-lg", title: "Send voice message", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
        ] }),
        isRecordUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-3 flex items-center gap-3 relative z-10 animate-fade-in border border-[var(--neon)]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-[var(--neon)]/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 border-2 border-[var(--neon)] border-t-transparent rounded-full animate-spin" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Sending voice message…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-[var(--neon)] font-mono", children: [
                Math.round(recorder.uploadProgress),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-accent overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] transition-all duration-300", style: {
              width: `${recorder.uploadProgress}%`
            } }) })
          ] })
        ] }),
        !isRecording && !isPreview && !isRecordUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-2 flex items-end gap-2 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Smile, onClick: () => setShowEmoji(!showEmoji) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Image$1, onClick: () => imageInputRef.current?.click() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Paperclip, onClick: () => fileInputRef.current?.click() }),
          isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 px-2 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-4 w-4 border-2 border-[var(--neon)] border-t-transparent rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Uploading…" })
          ] }) : recorder.state === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 px-2 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive truncate", children: recorder.error }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => recorder.cancelRecording(), className: "text-xs text-muted-foreground hover:text-foreground ml-auto", children: "✕" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 1, value: draft, onChange: handleDraftChange, onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }, placeholder: "Type a message…", className: "flex-1 resize-none bg-transparent outline-none px-2 py-2.5 text-sm placeholder:text-muted-foreground max-h-32" }),
          !draft.trim() && !isUploading && recorder.state !== "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { icon: Mic, onClick: recorder.startRecording }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSend, disabled: !draft.trim() && !isUploading, className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary hover:scale-105 active:scale-95 transition flex items-center justify-center disabled:opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-[var(--neon)]" }),
          " AI smart replies enabled"
        ] })
      ] })
    ] }),
    showInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden xl:flex w-80 flex-col glass border-l border-border/50 overflow-y-auto scrollbar-thin", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center border-b border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: chatUser.avatar, className: "h-24 w-24 rounded-full mx-auto ring-4 ring-[var(--neon)]/30", alt: "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-semibold text-lg", children: chatUser.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "@",
          chatUser.username
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-2 text-muted-foreground", children: "Joined recently ✨" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mt-5", children: [Phone, Video, Search].map((Icon, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-12 rounded-xl glass hover:glow-neon transition flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "Shared media" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground text-center py-2 mt-2", children: "View Once photos cannot be saved to media." })
      ] })
    ] })
  ] });
}
function SectionTitle({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground", children });
}
function IconBtn({
  icon: Icon,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: "h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) });
}
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1e3);
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
function Bubble({
  m,
  prev,
  currentUser,
  chatUser,
  onReply
}) {
  const me = m.senderId === currentUser?._id;
  const sameAuthor = prev?.senderId === m.senderId;
  const time = new Date(m.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2.5 group ${me ? "justify-end" : ""} ${sameAuthor ? "mt-0.5" : "mt-3"}`, children: [
    !me && (sameAuthor ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: chatUser.avatar, className: "h-8 w-8 rounded-full", alt: "" })),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-md ${me ? "items-end" : "items-start"} flex flex-col`, children: [
      m.replyTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-xs glass rounded-lg px-3 py-1.5 border-l-2 border-[var(--neon)] mb-1 ${me ? "self-end" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[var(--neon)] font-medium", children: [
          "Replying to ",
          m.replyTo.senderId === currentUser?._id ? "yourself" : chatUser.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground truncate opacity-80", children: m.replyTo.message || "Attachment" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative px-4 py-2.5 text-sm shadow-sm animate-fade-in ${me ? "bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white rounded-2xl rounded-br-sm" : "glass rounded-2xl rounded-bl-sm"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MediaMessage, { messageId: m._id, messageType: m.messageType, message: m.message, media: m.media, mediaMimeType: m.mediaMimeType, mediaSize: m.mediaSize, isMe: me, isViewOnce: m.isViewOnce, viewOnceViewed: m.viewOnceViewed, onOpenLightbox: m.messageType === "image" || m.messageType === "video" ? () => {
          const ev = new CustomEvent("openLightbox", {
            detail: {
              url: m.media,
              type: m.messageType,
              name: m.message
            }
          });
          window.dispatchEvent(ev);
        } : void 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[10px] mt-1.5 flex items-center gap-1 ${me ? "text-white/80 justify-end" : "text-muted-foreground"}`, children: [
          time,
          me && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: m.status === "seen" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 ml-1 text-white/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3 w-3" }),
            " Seen ",
            timeAgo(m.updatedAt)
          ] }) : m.status === "delivered" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3 w-3 opacity-60 ml-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 opacity-60 ml-1" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute ${me ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2 hidden group-hover:flex glass-strong rounded-full p-1 gap-0.5`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onReply(m), className: "h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Forward, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }),
      m.reactions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex gap-1 mt-1 ${me ? "self-end" : ""}`, children: m.reactions.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "glass text-xs rounded-full px-2 py-0.5", children: [
        r.emoji,
        " ",
        r.count
      ] }, i)) })
    ] })
  ] });
}
export {
  ChatRoom as component
};
