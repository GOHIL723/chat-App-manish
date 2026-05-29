import { r as reactExports, V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { f as Route$1, u as useNavigate, b as useSocket, d as axios, X, a as useAuth, e as LoaderCircle, t as toast, c as createLucideIcon } from "./router-IDBMxkhe.mjs";
import { u as useVoiceRecorder, D as DragDropOverlay, M as MediaLightbox, E as EmojiPicker$1, S as Smile, P as Paperclip, I as Image$1, C as CircleAlert, a as CircleStop, b as Send, c as MediaMessage, R as Reply, F as Forward } from "./useVoiceRecorder-DEUPm9e2.mjs";
import { U as Users } from "./users-B9uToy3U.mjs";
import { S as Settings } from "./settings-rgvlXSBL.mjs";
import { L as LogOut } from "./log-out-BPhzCA5B.mjs";
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
import "./video-DDmJJbPG.mjs";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function useGroupChat(groupId) {
  const [group, setGroup] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [hasMore, setHasMore] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const [loadingMore, setLoadingMore] = reactExports.useState(false);
  const [remoteTyping, setRemoteTyping] = reactExports.useState([]);
  const typingTimeout = reactExports.useRef(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const fetchGroup = reactExports.useCallback(async () => {
    const res = await axios.get(`/groups/${groupId}`);
    setGroup(res.data);
  }, [groupId]);
  const fetchMessages = reactExports.useCallback(async (p = 1) => {
    const res = await axios.get(`/groups/${groupId}/messages?page=${p}&limit=50`);
    const { messages: msgs, pagination } = res.data;
    if (p === 1) setMessages(msgs);
    else setMessages((prev) => [...msgs, ...prev]);
    setHasMore(pagination.hasMore);
    setPage(p);
  }, [groupId]);
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchMessages(page + 1);
    setLoadingMore(false);
  };
  const sendMessage = async (payload) => {
    const res = await axios.post(`/groups/${groupId}/messages`, payload);
    setMessages((prev) => [...prev, res.data]);
    return res.data;
  };
  const emitTyping = () => {
    if (!socket) return;
    socket.emit("groupTyping", { groupId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("groupStopTyping", { groupId });
    }, 2e3);
  };
  reactExports.useEffect(() => {
    fetchGroup();
    fetchMessages(1);
  }, [fetchGroup, fetchMessages]);
  reactExports.useEffect(() => {
    if (!socket) return;
    socket.emit("joinGroup", { groupId });
    const onNewMsg = ({ groupId: gid, message }) => {
      if (gid !== groupId) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };
    const onGroupUpdated = (updated) => {
      if (updated._id === groupId || String(updated._id) === groupId) setGroup(updated);
    };
    const onTyping = ({ senderId }) => {
      setRemoteTyping((p) => p.includes(senderId) ? p : [...p, senderId]);
    };
    const onStopTyping = ({ senderId }) => {
      setRemoteTyping((p) => p.filter((id) => id !== senderId));
    };
    socket.on("newGroupMessage", onNewMsg);
    socket.on("groupUpdated", onGroupUpdated);
    socket.on("groupTyping", onTyping);
    socket.on("groupStopTyping", onStopTyping);
    return () => {
      socket.emit("leaveGroup", { groupId });
      socket.off("newGroupMessage", onNewMsg);
      socket.off("groupUpdated", onGroupUpdated);
      socket.off("groupTyping", onTyping);
      socket.off("groupStopTyping", onStopTyping);
    };
  }, [socket, groupId]);
  return { group, setGroup, messages, hasMore, loadingMore, loadMore, sendMessage, emitTyping, remoteTyping, currentUser: user };
}
function timeStr(d) {
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function GroupBubble({ m, prev, currentUser, onReply }) {
  if (m.messageType === "system") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center my-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground glass px-3 py-1 rounded-full", children: m.message }) });
  }
  const senderId = m.senderId?._id || m.senderId;
  const me = String(senderId) === String(currentUser?._id);
  const sameAuthor = prev && String(prev.senderId?._id || prev.senderId) === String(senderId);
  const sender = m.senderId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2.5 group ${me ? "justify-end" : ""} ${sameAuthor ? "mt-0.5" : "mt-3"}`, children: [
    !me && (sameAuthor ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.username}`,
        className: "h-8 w-8 rounded-full shrink-0",
        alt: ""
      }
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-md flex flex-col ${me ? "items-end" : "items-start"}`, children: [
      !me && !sameAuthor && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-[var(--neon)] font-medium mb-0.5 ml-1", children: sender?.name || "Unknown" }),
      m.replyTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-xs glass rounded-lg px-3 py-1.5 border-l-2 border-[var(--neon)] mb-1 ${me ? "self-end" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--neon)] font-medium", children: m.replyTo.senderId?.name || "Someone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground truncate", children: m.replyTo.message || "Attachment" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative px-4 py-2.5 text-sm shadow-sm animate-fade-in ${me ? "bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white rounded-2xl rounded-br-sm" : "glass rounded-2xl rounded-bl-sm"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaMessage,
          {
            messageType: m.messageType,
            message: m.message,
            media: m.media,
            mediaMimeType: m.mediaMimeType,
            mediaSize: m.mediaSize,
            isMe: me,
            onOpenLightbox: m.messageType === "image" || m.messageType === "video" ? () => {
              const ev = new CustomEvent("openLightbox", { detail: { url: m.media, type: m.messageType, name: m.message } });
              window.dispatchEvent(ev);
            } : void 0
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] mt-1 flex items-center gap-1 ${me ? "text-white/70 justify-end" : "text-muted-foreground"}`, children: timeStr(m.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute ${me ? "right-full mr-2" : "left-full ml-2"} top-1/2 -translate-y-1/2 hidden group-hover:flex glass-strong rounded-full p-1 gap-0.5`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onReply(m), className: "h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-7 w-7 rounded-full hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Forward, { className: "h-3.5 w-3.5" }) })
        ] })
      ] })
    ] })
  ] });
}
function GroupMembersPanel({ group, currentUser, onlineUsers, onUpdated, allUsers }) {
  const [adding, setAdding] = reactExports.useState(false);
  const [selectedToAdd, setSelectedToAdd] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const isAdmin = group?.admin?._id === currentUser?._id || group?.admin === currentUser?._id;
  const nonMembers = allUsers.filter((u) => !group?.members?.some((m) => (m._id || m) === u.id));
  const handleAddMembers = async () => {
    if (!selectedToAdd.length) return;
    setLoading(true);
    try {
      const res = await axios.post(`/groups/${group._id}/members`, { memberIds: selectedToAdd });
      onUpdated(res.data);
      setAdding(false);
      setSelectedToAdd([]);
      toast.success("Members added");
    } catch {
      toast.error("Failed to add members");
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = async (userId) => {
    try {
      const res = await axios.delete(`/groups/${group._id}/members/${userId}`);
      onUpdated(res.data);
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-border/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
        " Members (",
        group?.members?.length || 0,
        ")"
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAdding((v) => !v), className: "text-xs text-[var(--neon)] hover:underline flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3 w-3" }),
        " Add"
      ] })
    ] }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 glass rounded-xl p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-40 overflow-y-auto space-y-1 scrollbar-thin", children: [
        nonMembers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground text-center py-2", children: "All users are members" }),
        nonMembers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-accent/30 rounded-lg p-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: selectedToAdd.includes(u.id),
              onChange: (e) => setSelectedToAdd((p) => e.target.checked ? [...p, u.id] : p.filter((id) => id !== u.id)),
              className: "accent-[var(--neon)]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar, className: "h-7 w-7 rounded-full", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: u.name })
        ] }, u.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleAddMembers,
          disabled: loading || !selectedToAdd.length,
          className: "mt-2 w-full h-8 rounded-lg bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-xs disabled:opacity-40 flex items-center justify-center gap-1",
          children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : "Add Selected"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-60 overflow-y-auto scrollbar-thin", children: group?.members?.map((m) => {
      const id = m._id || m;
      const isOnline = onlineUsers.includes(id);
      const memberIsAdmin = (group.admin?._id || group.admin) === id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 py-1.5 px-1 rounded-lg hover:bg-accent/30 group/member", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username || id}`, className: "h-8 w-8 rounded-full", alt: "" }),
          isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[var(--success)] ring-1 ring-card" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium truncate flex items-center gap-1", children: [
          m.name || id,
          memberIsAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3 text-yellow-400 shrink-0" })
        ] }) }),
        isAdmin && !memberIsAdmin && id !== currentUser?._id && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleRemove(id),
            className: "opacity-0 group-hover/member:opacity-100 h-6 w-6 rounded-full hover:bg-destructive/20 text-destructive flex items-center justify-center transition",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
          }
        )
      ] }, id);
    }) })
  ] });
}
function GroupSettingsModal({ group, currentUser, onClose, onUpdated }) {
  const [name, setName] = reactExports.useState(group?.name || "");
  const [description, setDescription] = reactExports.useState(group?.description || "");
  const [isPrivate, setIsPrivate] = reactExports.useState(group?.isPrivate ?? true);
  const [loading, setLoading] = reactExports.useState(false);
  const nav = useNavigate();
  const isAdmin = (group?.admin?._id || group?.admin) === currentUser?._id;
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`/groups/${group._id}`, { name, description, isPrivate });
      onUpdated(res.data);
      toast.success("Group updated");
      onClose();
    } catch {
      toast.error("Failed to update group");
    } finally {
      setLoading(false);
    }
  };
  const handleLeave = async () => {
    if (!confirm("Leave this group?")) return;
    try {
      await axios.post(`/groups/${group._id}/leave`);
      toast.success("Left group");
      nav({ to: "/app/groups" });
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to leave");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-[var(--neon)]" }),
        " Group Settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Group Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            className: "w-full h-10 px-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: description,
            onChange: (e) => setDescription(e.target.value),
            rows: 3,
            className: "w-full px-3 py-2 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `relative w-10 h-6 rounded-full transition ${isPrivate ? "bg-[var(--neon)]" : "bg-muted"}`,
            onClick: () => setIsPrivate((v) => !v),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPrivate ? "translate-x-5" : "translate-x-1"}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Private group" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSave,
          disabled: loading || !name.trim(),
          className: "w-full h-10 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm disabled:opacity-40 flex items-center justify-center gap-2",
          children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save Changes"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Only the group admin can edit settings." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: handleLeave,
        className: "mt-3 w-full h-10 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 text-sm flex items-center justify-center gap-2 transition",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Leave Group"
        ]
      }
    )
  ] }) });
}
function GroupChatRoom() {
  const {
    id
  } = Route$1.useParams();
  const nav = useNavigate();
  const {
    group,
    setGroup,
    messages,
    hasMore,
    loadingMore,
    loadMore,
    sendMessage,
    emitTyping,
    remoteTyping,
    currentUser
  } = useGroupChat(id);
  const {
    onlineUsers
  } = useSocket();
  const [draft, setDraft] = reactExports.useState("");
  const [replyingTo, setReplyingTo] = reactExports.useState(null);
  const [showEmoji, setShowEmoji] = reactExports.useState(false);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const [showMembers, setShowMembers] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [lightboxMedia, setLightboxMedia] = reactExports.useState(null);
  const [allUsers, setAllUsers] = reactExports.useState([]);
  const imageInputRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const endRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, remoteTyping]);
  reactExports.useEffect(() => {
    axios.get("/users").then((r) => setAllUsers(r.data)).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") nav({
        to: "/app/groups"
      });
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [nav]);
  reactExports.useEffect(() => {
    const handleOpenLightbox = (e) => setLightboxMedia(e.detail);
    window.addEventListener("openLightbox", handleOpenLightbox);
    return () => window.removeEventListener("openLightbox", handleOpenLightbox);
  }, []);
  const handleSend = async () => {
    if (!draft.trim()) return;
    const text = draft;
    setDraft("");
    setReplyingTo(null);
    setShowEmoji(false);
    await sendMessage({
      message: text,
      replyTo: replyingTo?._id || null
    });
  };
  const uploadAndSend = reactExports.useCallback(async (file, type) => {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const {
        data
      } = await axios.post("/messages/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      await sendMessage({
        message: file.name,
        messageType: data.type || type,
        media: data.url,
        mediaPublicId: data.publicId || "",
        mediaMimeType: data.mimeType || file.type || "",
        mediaSize: data.size || file.size || 0,
        replyTo: replyingTo?._id || null
      });
      setReplyingTo(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  }, [sendMessage, replyingTo]);
  const recorder = useVoiceRecorder({
    onUpload: uploadAndSend
  });
  const isRecording = recorder.state === "recording";
  const isRecordUploading = recorder.state === "uploading";
  const typingNames = remoteTyping.map((uid) => {
    const m = group?.members?.find((x) => (x._id || x) === uid);
    return m?.name || "Someone";
  }).join(", ");
  if (!group) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-8 w-8 border-2 border-[var(--neon)] border-t-transparent rounded-full" }) });
  const onlineCount = group.members?.filter((m) => onlineUsers.includes(m._id || m)).length || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: imageInputRef, type: "file", accept: "image/*,video/*", className: "hidden", onChange: (e) => {
      const f = e.target.files?.[0];
      if (f) uploadAndSend(f, f.type.startsWith("video/") ? "video" : "image");
      e.target.value = "";
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: ".pdf,.doc,.docx,.txt,.zip", className: "hidden", onChange: (e) => {
      const f = e.target.files?.[0];
      if (f) uploadAndSend(f, "file");
      e.target.value = "";
    } }),
    isDragging && /* @__PURE__ */ jsxRuntimeExports.jsx(DragDropOverlay, { onDismiss: () => setIsDragging(false), onDrop: (files) => {
      const file = files[0];
      if (file) {
        const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
        uploadAndSend(file, type);
      }
    } }),
    lightboxMedia && /* @__PURE__ */ jsxRuntimeExports.jsx(MediaLightbox, { url: lightboxMedia.url, type: lightboxMedia.type, name: lightboxMedia.name, onClose: () => setLightboxMedia(null) }),
    showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(GroupSettingsModal, { group, currentUser, onClose: () => setShowSettings(false), onUpdated: setGroup }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col min-w-0 relative", onDragEnter: (e) => {
      e.preventDefault();
      setIsDragging(true);
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 px-4 flex items-center justify-between glass border-b border-border/50 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-br from-[var(--neon)]/60 to-[var(--neon-2)]/60 flex items-center justify-center font-bold text-white shrink-0", children: group.name?.[0]?.toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: group.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              group.members?.length || 0,
              " members · ",
              onlineCount,
              " online"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowMembers((v) => !v), className: `h-10 w-10 rounded-xl flex items-center justify-center transition ${showMembers ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowSettings(true), className: "h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6 space-y-1", children: [
            hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: loadMore, disabled: loadingMore, className: "text-xs px-4 py-2 glass rounded-full hover:bg-accent/60 transition text-muted-foreground disabled:opacity-50", children: loadingMore ? "Loading…" : "Load earlier messages" }) }),
            messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(GroupBubble, { m, prev: messages[i - 1], currentUser, onReply: setReplyingTo }, m._id)),
            remoteTyping.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 items-end mt-3 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl rounded-bl-sm px-4 py-2 text-xs text-muted-foreground", children: [
              typingNames,
              " ",
              remoteTyping.length === 1 ? "is" : "are",
              " typing…"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 pb-20 md:pb-5 relative", children: [
            showEmoji && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-full mb-2 left-4 z-50 animate-fade-in shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmojiPicker$1, { onEmojiClick: (e) => setDraft((p) => p + e.emoji), theme: "dark" }) }),
            replyingTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 glass-strong rounded-xl p-3 flex items-center justify-between border-l-4 border-[var(--neon)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[var(--neon)] font-medium mb-0.5", children: [
                  "Replying to ",
                  replyingTo.senderId?.name || "message"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm truncate text-muted-foreground", children: replyingTo.message })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReplyingTo(null), className: "h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-2 flex items-end gap-2 z-10 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowEmoji((v) => !v), className: "h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fileInputRef.current?.click(), className: "h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => imageInputRef.current?.click(), className: "h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-4 w-4" }) }),
              isUploading || isRecordUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 px-2 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-4 w-4 border-2 border-[var(--neon)] border-t-transparent rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRecordUploading ? "Sending voice…" : "Uploading…" })
              ] }) : isRecording ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-3 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-400 font-mono tabular-nums", children: recorder.formatTime(recorder.recordingTime) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-1", children: "Recording…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.cancelRecording, className: "text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-accent transition", children: "Cancel" })
              ] }) : recorder.state === "error" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 px-2 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive truncate", children: recorder.error }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => recorder.cancelRecording(), className: "text-xs text-muted-foreground hover:text-foreground ml-auto", children: "✕" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 1, value: draft, onChange: (e) => {
                setDraft(e.target.value);
                emitTyping();
              }, onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }, placeholder: "Message group…", className: "flex-1 resize-none bg-transparent outline-none px-2 py-2.5 text-sm placeholder:text-muted-foreground max-h-32" }),
              isRecording ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.stopRecording, title: "Stop recording", className: "h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleStop, { className: "h-5 w-5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                !draft.trim() && !isRecordUploading && recorder.state !== "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: recorder.startRecording, className: "h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSend, disabled: !draft.trim() && !isUploading, className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary hover:scale-105 active:scale-95 transition flex items-center justify-center disabled:opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-[var(--neon)]" }),
              " AI smart replies enabled"
            ] })
          ] })
        ] }),
        showMembers && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden xl:flex w-72 flex-col glass border-l border-border/50 overflow-y-auto scrollbar-thin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Group Info" }),
            group.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: group.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2 mt-3", children: [
              group.members?.slice(0, 5).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`, className: "h-8 w-8 rounded-full ring-2 ring-card", alt: "" }, m._id || m)),
              (group.members?.length || 0) > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-8 w-8 rounded-full glass ring-2 ring-card flex items-center justify-center text-[10px]", children: [
                "+",
                group.members.length - 5
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(GroupMembersPanel, { group, currentUser, onlineUsers, onUpdated: setGroup, allUsers })
        ] })
      ] })
    ] })
  ] });
}
export {
  GroupChatRoom as component
};
