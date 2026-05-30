import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, e as useRouterState, d as useNavigate, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { L as Logo } from "./logo-BCHQzBYa.mjs";
import { T as ThemeToggle } from "./theme-toggle-Do2BfjFB.mjs";
import { a as useSocket, u as useAuth } from "./router-B-OB1NeJ.mjs";
import { a as axios } from "../_libs/axios.mjs";
import "../_libs/sonner.mjs";
import "../_libs/socket.io-client.mjs";
import { S as Search, X, L as LoaderCircle, H as House, g as MessageCircle, U as Users, P as Phone, B as Bell, h as Settings, i as Shield, j as LogOut, k as LayoutDashboard } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "crypto";
import "async_hooks";
import "util";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/form-data.mjs";
import "url";
import "fs";
import "../_libs/combined-stream.mjs";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/asynckit.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/proxy-from-env.mjs";
import "../_libs/https-proxy-agent.mjs";
import "net";
import "tls";
import "assert";
import "../_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "../_libs/agent-base.mjs";
import "events";
import "http2";
import "../_libs/follow-redirects.mjs";
import "zlib";
import "../_libs/engine.io-client.mjs";
import "../_libs/xmlhttprequest-ssl.mjs";
import "child_process";
import "../_libs/engine.io-parser.mjs";
import "../_libs/socket.io__component-emitter.mjs";
import "../_libs/ws.mjs";
import "buffer";
import "../_libs/socket.io-parser.mjs";
const navItems = [{
  to: "/app",
  icon: House,
  label: "Home",
  exact: true
}, {
  to: "/app/chats",
  icon: MessageCircle,
  label: "Chats"
}, {
  to: "/app/groups",
  icon: Users,
  label: "Groups"
}, {
  to: "/app/calls",
  icon: Phone,
  label: "Calls"
}, {
  to: "/app/notifications",
  icon: Bell,
  label: "Alerts"
}, {
  to: "/app/settings",
  icon: Settings,
  label: "Settings"
}];
function AppLayout() {
  const path = useRouterState({
    select: (s) => s.location.pathname
  });
  const isChatRoom = /^\/app\/chats\/.+/.test(path) || /^\/app\/groups\/.+/.test(path);
  const {
    user,
    loading,
    logout
  } = useAuth();
  const nav = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !user) {
      nav({
        to: "/login"
      });
    }
  }, [user, loading, nav]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-screen w-screen flex items-center justify-center glass", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--neon)]" }) });
  }
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-screen flex overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 gradient-mesh opacity-30 -z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-[76px] flex-col items-center py-5 glass border-r border-border/50 z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { withText: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mt-8 flex-1 flex flex-col gap-2", children: [
        navItems.map((item) => {
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: `group relative h-11 w-11 flex items-center justify-center rounded-xl transition-all ${active ? "bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white glow-primary" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-full ml-3 px-2 py-1 rounded-md text-xs glass-strong opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50", children: item.label })
          ] }, item.to);
        }),
        (user?.role === "admin" || user?.role === "moderator") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "group relative h-11 w-11 flex items-center justify-center rounded-xl transition-all hover:bg-accent/50 text-muted-foreground hover:text-foreground border border-[var(--neon)]/20 hover:border-[var(--neon)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-[var(--neon)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-full ml-3 px-2 py-1 rounded-md text-xs glass-strong opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50", children: "Admin Panel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          logout();
          nav({
            to: "/login"
          });
        }, className: "h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileDropdown, { user, logout, nav })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    !isChatRoom && /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "md:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-2xl px-2 py-2 flex justify-around", children: [
      navItems.slice(0, 5).map((item) => {
        const active = item.exact ? path === item.to : path.startsWith(item.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.to, className: `h-10 w-10 rounded-xl flex items-center justify-center transition ${active ? "bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white" : "text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-5 w-5" }) }, item.to);
      }),
      (user?.role === "admin" || user?.role === "moderator") && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-[var(--neon)] transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-[var(--neon)]" }) })
    ] })
  ] });
}
function ProfileDropdown({
  user,
  logout,
  nav
}) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const isAdmin = user?.role === "admin" || user?.role === "moderator";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((prev) => !prev), className: "relative group focus:outline-none", title: "Profile options", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`, alt: user.name, className: "h-9 w-9 rounded-full ring-2 ring-[var(--neon)] bg-muted group-hover:ring-4 transition-all duration-200" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-background" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-full ml-3 z-50 w-64 glass-strong rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in slide-in-from-left-2 fade-in duration-150", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`, alt: user.name, className: "h-11 w-11 rounded-full ring-2 ring-[var(--neon)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-background" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm truncate", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
              "@",
              user.username
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/20 text-[var(--neon)] border border-[var(--neon)]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
          user.role === "moderator" ? "Moderator" : "Administrator"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-muted-foreground", children: "User" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 space-y-0.5", children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", onClick: () => setOpen(false), className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--neon)] hover:bg-[var(--neon)]/10 transition group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] flex items-center justify-center shadow-sm group-hover:scale-105 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Admin Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Manage users & platform" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/settings", onClick: () => setOpen(false), className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent/50 transition group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-105 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Profile, privacy & more" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        logout();
        nav({
          to: "/login"
        });
        setOpen(false);
      }, className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:scale-105 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Sign out" })
      ] }) })
    ] })
  ] });
}
function ChatListPanel({
  active
}) {
  const [recentChats, setRecentChats] = reactExports.useState([]);
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [messageResults, setMessageResults] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const [activeFilter, setActiveFilter] = reactExports.useState("All");
  const {
    onlineUsers,
    socket
  } = useSocket();
  const {
    user: currentUser
  } = useAuth();
  const searchTimeoutRef = reactExports.useRef(null);
  const fetchRecentChats = reactExports.useCallback(async () => {
    try {
      const res = await axios.get("/users/chats");
      setRecentChats(res.data);
    } catch (error) {
      console.error("Failed to fetch recent chats", error);
    }
  }, []);
  reactExports.useEffect(() => {
    fetchRecentChats();
  }, [fetchRecentChats]);
  reactExports.useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
  reactExports.useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!search.trim()) {
      setSearchResults([]);
      setMessageResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const [usersRes, msgsRes] = await Promise.all([axios.get(`/users/search?q=${encodeURIComponent(search.trim())}`), axios.get(`/messages/search-all?q=${encodeURIComponent(search.trim())}`)]);
        setSearchResults(usersRes.data);
        setMessageResults(msgsRes.data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);
  reactExports.useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      const senderId = String(newMessage.senderId);
      setRecentChats((prev) => {
        const existingIdx = prev.findIndex((u) => String(u.id) === senderId);
        const isActiveChat = String(active) === senderId;
        if (existingIdx === -1) {
          fetchRecentChats();
          return prev;
        }
        const updated = prev.map((u) => {
          if (String(u.id) === senderId) {
            return {
              ...u,
              lastMessage: newMessage.messageType === "text" ? newMessage.message : `Sent a ${newMessage.messageType}`,
              time: new Date(newMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              unread: isActiveChat ? 0 : (u.unread || 0) + 1
            };
          }
          return u;
        });
        const senderEntry = updated.find((u) => String(u.id) === senderId);
        const rest = updated.filter((u) => String(u.id) !== senderId);
        return senderEntry ? [senderEntry, ...rest] : updated;
      });
      if (document.hidden || String(active) !== senderId) {
        const sender = recentChats.find((u) => String(u.id) === senderId);
        if (sender && "Notification" in window && Notification.permission === "granted") {
          new Notification(`New message from ${sender.name}`, {
            body: newMessage.message || "Sent an attachment",
            icon: sender.avatar,
            tag: senderId
          });
        }
      }
    };
    const handleMarkedSeen = ({
      senderId
    }) => {
      setRecentChats((prev) => prev.map((u) => u.id === senderId ? {
        ...u,
        unread: 0
      } : u));
    };
    socket.on("newMessage", handleNewMessage);
    socket.on("markedSeen", handleMarkedSeen);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("markedSeen", handleMarkedSeen);
    };
  }, [socket, active, recentChats, fetchRecentChats]);
  reactExports.useEffect(() => {
    if (active) {
      setRecentChats((prev) => prev.map((u) => u.id === active ? {
        ...u,
        unread: 0
      } : u));
    }
  }, [active]);
  const displayChats = activeFilter === "Unread" ? recentChats.filter((u) => u.unread > 0) : recentChats;
  const isSearchMode = search.trim().length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-[340px] flex-shrink-0 glass border-r border-border/50 flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Messages" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white flex items-center justify-center text-lg leading-none", children: "+" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search people, messages…", className: "w-full h-10 pl-9 pr-9 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm" }),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearch(""), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      !isSearchMode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-3 text-xs", children: ["All", "Unread"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveFilter(t), className: `px-3 py-1.5 rounded-full transition ${activeFilter === t ? "bg-foreground text-background" : "glass hover:bg-accent/50"}`, children: [
        t,
        t === "Unread" && recentChats.some((u) => u.unread > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] bg-[var(--neon)] text-white rounded-full", children: recentChats.reduce((acc, u) => acc + (u.unread || 0), 0) })
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto scrollbar-thin", children: isSearchMode ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-6 text-muted-foreground text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      "Searching…"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      searchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "People" }),
        searchResults.map((u) => {
          const isOnline = onlineUsers.includes(u.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/chats/$id", params: {
            id: u.id
          }, onClick: () => setSearch(""), className: `flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition border-l-2 ${active === u.id ? "bg-accent/50 border-[var(--neon)]" : "border-transparent"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar, alt: u.name, className: "h-11 w-11 rounded-full bg-muted" }),
              isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-card" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: u.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                "@",
                u.username
              ] })
            ] })
          ] }, u.id);
        })
      ] }),
      messageResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Messages" }),
        messageResults.map((msg) => {
          const otherId = String(msg.senderId?._id || msg.senderId) === String(currentUser?._id) ? String(msg.receiverId?._id || msg.receiverId) : String(msg.senderId?._id || msg.senderId);
          const otherUser = msg.senderId?._id ? String(msg.senderId._id) === String(currentUser?._id) ? msg.receiverId : msg.senderId : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/chats/$id", params: {
            id: otherId
          }, onClick: () => setSearch(""), className: "flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition border-l-2 border-transparent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username || otherId}`, alt: otherUser?.name || "User", className: "h-11 w-11 rounded-full bg-muted" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate text-sm", children: otherUser?.name || "User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: msg.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/60", children: new Date(msg.createdAt).toLocaleDateString() })
            ] })
          ] }, msg._id);
        })
      ] }),
      searchResults.length === 0 && messageResults.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center text-sm text-muted-foreground", children: [
        'No results found for "',
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: search }),
        '"'
      ] })
    ] }) }) : (
      /* ── Recent chats list ─────────────────────────────────────── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        displayChats.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: activeFilter === "Unread" ? "No unread messages." : "No chats yet. Search to start one!" }),
        displayChats.map((c) => {
          const isOnline = onlineUsers.includes(c.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/chats/$id", params: {
            id: c.id
          }, className: `flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition border-l-2 ${active === c.id ? "bg-accent/50 border-[var(--neon)]" : "border-transparent"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.avatar, alt: c.name, className: "h-12 w-12 rounded-full bg-muted" }),
              isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-card" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: c.time })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs truncate ${c.typing ? "text-[var(--neon)]" : "text-muted-foreground"}`, children: c.typing ? "typing…" : c.lastMessage || "Start a conversation" }),
                c.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center", children: c.unread })
              ] })
            ] })
          ] }, c.id);
        })
      ] })
    ) })
  ] });
}
export {
  ChatListPanel,
  AppLayout as component
};
