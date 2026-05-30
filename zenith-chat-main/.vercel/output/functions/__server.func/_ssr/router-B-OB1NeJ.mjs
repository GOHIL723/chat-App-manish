import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as axios } from "../_libs/axios.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as lookup } from "../_libs/socket.io-client.mjs";
import { S as Search, X, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
const BACKEND_URL = "https://chat-app-manish.onrender.com";
axios.defaults.baseURL = `${BACKEND_URL}/api`;
axios.defaults.withCredentials = true;
const AuthContext = reactExports.createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);
  const login = async (username, password) => {
    try {
      const res = await axios.post("/auth/login", { username, password });
      setUser(res.data);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  };
  const signup = async (userData) => {
    try {
      const res = await axios.post("/auth/signup", userData);
      setUser(res.data);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
      throw error;
    }
  };
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, loading, login, signup, logout }, children });
};
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
const SOCKET_URL = "https://chat-app-manish.onrender.com";
const SocketContext = reactExports.createContext({
  socket: null,
  onlineUsers: []
});
const useSocket = () => reactExports.useContext(SocketContext);
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = reactExports.useState(null);
  const [onlineUsers, setOnlineUsers] = reactExports.useState([]);
  const { user, loading } = useAuth();
  reactExports.useEffect(() => {
    if (user && !loading) {
      const newSocket = lookup(SOCKET_URL, {
        query: {
          userId: user._id
        }
      });
      setSocket(newSocket);
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, loading]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SocketContext.Provider, { value: { socket, onlineUsers }, children });
};
const appCss = "/assets/styles-2laPtQzN.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message || "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$h = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌌</text></svg>"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$h.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SocketProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) }) });
}
const $$splitComponentImporter$g = () => import("./verify-C8o8hfr5.mjs");
const Route$g = createFileRoute("/verify")({
  head: () => ({
    meta: [{
      title: "Verify — NebulaChat"
    }, {
      name: "description",
      content: "Verify your account"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./signup-BM79UjE8.mjs");
const Route$f = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Create account — NebulaChat"
    }, {
      name: "description",
      content: "Join NebulaChat"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./preview-5O_bE6es.mjs");
const Route$e = createFileRoute("/preview")({
  head: () => ({
    meta: [{
      title: "Responsive Device Preview — NebulaChat"
    }, {
      name: "description",
      content: "Interactive device sandbox to preview NebulaChat in Mobile, Tablet, Laptop, and Desktop screens."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./login-DFp_sJua.mjs");
const Route$d = createFileRoute("/login")({
  validateSearch: (search) => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : void 0
    };
  },
  head: () => ({
    meta: [{
      title: "Sign in — NebulaChat"
    }, {
      name: "description",
      content: "Sign in to NebulaChat"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./forgot-BLVVYb24.mjs");
const Route$c = createFileRoute("/forgot")({
  head: () => ({
    meta: [{
      title: "Reset password — NebulaChat"
    }, {
      name: "description",
      content: "Reset your password"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app-czYRXynd.mjs");
const Route$b = createFileRoute("/app")({
  head: () => ({
    meta: [{
      title: "NebulaChat"
    }, {
      name: "description",
      content: "Your conversations"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
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
const $$splitComponentImporter$a = () => import("./admin-CS5lgH7n.mjs");
const Route$a = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin · NebulaChat"
    }, {
      name: "description",
      content: "Admin dashboard"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-D1VwPXbD.mjs");
const Route$9 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "NebulaChat — Real-time chat, reimagined"
    }, {
      name: "description",
      content: "A premium real-time messaging platform with voice, video, and group collaboration."
    }, {
      property: "og:title",
      content: "NebulaChat — Real-time chat, reimagined"
    }, {
      property: "og:description",
      content: "A premium real-time messaging platform with voice, video, and group collaboration."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./app.index-BYabtNwS.mjs");
const Route$8 = createFileRoute("/app/")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.settings-QhCs4Ndf.mjs");
const Route$7 = createFileRoute("/app/settings")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.notifications-DrDpcVc6.mjs");
const Route$6 = createFileRoute("/app/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.groups-CFFCbW3S.mjs");
const Route$5 = createFileRoute("/app/groups")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./app.calls-mzOijWe_.mjs");
const Route$4 = createFileRoute("/app/calls")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./app.groups.index-BU96AW6W.mjs");
const Route$3 = createFileRoute("/app/groups/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./app.chats.index-RJ3sP7IT.mjs");
const Route$2 = createFileRoute("/app/chats/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./app.groups._id-tZvCqMW8.mjs");
const Route$1 = createFileRoute("/app/groups/$id")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.chats._id-BYxjEnt1.mjs");
const Route = createFileRoute("/app/chats/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VerifyRoute = Route$g.update({
  id: "/verify",
  path: "/verify",
  getParentRoute: () => Route$h
});
const SignupRoute = Route$f.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$h
});
const PreviewRoute = Route$e.update({
  id: "/preview",
  path: "/preview",
  getParentRoute: () => Route$h
});
const LoginRoute = Route$d.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$h
});
const ForgotRoute = Route$c.update({
  id: "/forgot",
  path: "/forgot",
  getParentRoute: () => Route$h
});
const AppRoute = Route$b.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$h
});
const AdminRoute = Route$a.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$h
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$h
});
const AppIndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const AppSettingsRoute = Route$7.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppNotificationsRoute = Route$6.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AppRoute
});
const AppGroupsRoute = Route$5.update({
  id: "/groups",
  path: "/groups",
  getParentRoute: () => AppRoute
});
const AppCallsRoute = Route$4.update({
  id: "/calls",
  path: "/calls",
  getParentRoute: () => AppRoute
});
const AppGroupsIndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppGroupsRoute
});
const AppChatsIndexRoute = Route$2.update({
  id: "/chats/",
  path: "/chats/",
  getParentRoute: () => AppRoute
});
const AppGroupsIdRoute = Route$1.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AppGroupsRoute
});
const AppChatsIdRoute = Route.update({
  id: "/chats/$id",
  path: "/chats/$id",
  getParentRoute: () => AppRoute
});
const AppGroupsRouteChildren = {
  AppGroupsIdRoute,
  AppGroupsIndexRoute
};
const AppGroupsRouteWithChildren = AppGroupsRoute._addFileChildren(
  AppGroupsRouteChildren
);
const AppRouteChildren = {
  AppCallsRoute,
  AppGroupsRoute: AppGroupsRouteWithChildren,
  AppNotificationsRoute,
  AppSettingsRoute,
  AppIndexRoute,
  AppChatsIdRoute,
  AppChatsIndexRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  AppRoute: AppRouteWithChildren,
  ForgotRoute,
  LoginRoute,
  PreviewRoute,
  SignupRoute,
  VerifyRoute
};
const routeTree = Route$h._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ChatListPanel as C,
  Route$d as R,
  useSocket as a,
  Route$1 as b,
  Route as c,
  router as r,
  useAuth as u
};
