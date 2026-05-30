import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Logo } from "./logo-BCHQzBYa.mjs";
import { T as ThemeToggle } from "./theme-toggle-Do2BfjFB.mjs";
import { a as axios } from "../_libs/axios.mjs";
import { u as useAuth, a as useSocket } from "./router-B-OB1NeJ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/socket.io-client.mjs";
import { L as LoaderCircle, i as Shield, U as Users, l as Activity, m as MessageSquare, n as TriangleAlert, k as LayoutDashboard, o as UserCog, F as Flag, p as ScrollText, q as FileExclamationPoint, j as LogOut, S as Search, r as TrendingUp, s as TrendingDown, t as ArrowUpRight, K as Key, C as Crown, u as Check, v as Ban, w as Trash2, a as Smartphone, x as MapPin } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "util";
import "crypto";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/engine.io-client.mjs";
import "../_libs/xmlhttprequest-ssl.mjs";
import "child_process";
import "../_libs/engine.io-parser.mjs";
import "../_libs/socket.io__component-emitter.mjs";
import "../_libs/ws.mjs";
import "buffer";
import "../_libs/socket.io-parser.mjs";
const navItems = [{
  id: "overview",
  icon: LayoutDashboard,
  label: "Overview"
}, {
  id: "users",
  icon: UserCog,
  label: "Users"
}, {
  id: "chat",
  icon: MessageSquare,
  label: "Chat"
}, {
  id: "reports",
  icon: Flag,
  label: "Reports"
}, {
  id: "moderation",
  icon: Shield,
  label: "Moderation"
}, {
  id: "logs",
  icon: ScrollText,
  label: "Login logs"
}, {
  id: "spam",
  icon: FileExclamationPoint,
  label: "Spam detection"
}];
function Admin() {
  const {
    user,
    loading: authLoading,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const {
    socket,
    onlineUsers
  } = useSocket();
  const [chatSearch, setChatSearch] = reactExports.useState("");
  const [chatUsers, setChatUsers] = reactExports.useState([]);
  const [selectedChatUser, setSelectedChatUser] = reactExports.useState(null);
  const [chatMessages, setChatMessages] = reactExports.useState([]);
  const [adminChatInput, setAdminChatInput] = reactExports.useState("");
  const adminChatEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) return;
    const delayDebounceFn = setTimeout(() => {
      axios.get(`/admin/users?query=${chatSearch}&limit=100`).then((res) => {
        const filtered = res.data.users.filter((u) => u._id !== user._id);
        setChatUsers(filtered);
      }).catch(console.error);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [chatSearch, user]);
  reactExports.useEffect(() => {
    if (!selectedChatUser) return;
    axios.get(`/messages/${selectedChatUser._id}?page=1&limit=100`).then((res) => {
      const data = res.data;
      const msgs = Array.isArray(data) ? data : data.messages;
      setChatMessages(msgs || []);
    }).catch(console.error);
    axios.post(`/messages/seen/${selectedChatUser._id}`).then(() => {
      if (socket) socket.emit("markedSeen", {
        senderId: selectedChatUser._id
      });
    }).catch(console.error);
  }, [selectedChatUser, socket]);
  reactExports.useEffect(() => {
    adminChatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chatMessages]);
  reactExports.useEffect(() => {
    if (!socket || !user) return;
    const handleNewMessage = (msg) => {
      if (!selectedChatUser) return;
      const msgSenderId = String(msg.senderId);
      const msgReceiverId = String(msg.receiverId);
      const activeChatId = String(selectedChatUser._id);
      const myId = String(user._id);
      const isFromSelected = msgSenderId === activeChatId && msgReceiverId === myId;
      const isFromMe = msgSenderId === myId && msgReceiverId === activeChatId;
      if (isFromSelected || isFromMe) {
        setChatMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(msg._id))) return prev;
          return [...prev, msg];
        });
        if (isFromSelected) {
          axios.post(`/messages/seen/${selectedChatUser._id}`).then(() => {
            socket.emit("markedSeen", {
              senderId: selectedChatUser._id
            });
          }).catch(console.error);
        }
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChatUser, user]);
  const handleSendAdminChatMessage = async (e) => {
    e.preventDefault();
    if (!adminChatInput.trim() || !selectedChatUser) return;
    try {
      const res = await axios.post(`/messages/send/${selectedChatUser._id}`, {
        message: adminChatInput
      });
      setChatMessages((prev) => [...prev, res.data]);
      setAdminChatInput("");
      if (socket) socket.emit("stopTyping", {
        receiverId: selectedChatUser._id
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    }
  };
  const handleSelectChatUser = (u) => {
    setSelectedChatUser(u);
  };
  const [changePasswordModal, setChangePasswordModal] = reactExports.useState({
    isOpen: false,
    userId: "",
    username: ""
  });
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [updatingPassword, setUpdatingPassword] = reactExports.useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      navigate({
        to: "/login"
      });
    } catch (err) {
      toast.error("Failed to sign out.");
    }
  };
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setUpdatingPassword(true);
    try {
      await axios.patch(`/admin/users/${changePasswordModal.userId}/password`, {
        password: newPassword
      });
      toast.success(`Password for ${changePasswordModal.username} updated successfully.`);
      setChangePasswordModal({
        isOpen: false,
        userId: "",
        username: ""
      });
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };
  const [section, setSection] = reactExports.useState("overview");
  const [query, setQuery] = reactExports.useState("");
  const [stats, setStats] = reactExports.useState(null);
  const [chartData, setChartData] = reactExports.useState([]);
  const [users, setUsers] = reactExports.useState([]);
  const [reports, setReports] = reactExports.useState([]);
  const [logs, setLogs] = reactExports.useState([]);
  const [loadingStats, setLoadingStats] = reactExports.useState(true);
  const [loadingUsers, setLoadingUsers] = reactExports.useState(true);
  const [loadingReports, setLoadingReports] = reactExports.useState(true);
  const [loadingLogs, setLoadingLogs] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!authLoading && !user) {
      navigate({
        to: "/login",
        search: {
          redirect: "/admin"
        }
      });
    }
  }, [user, authLoading, navigate]);
  reactExports.useEffect(() => {
    if (!user || user.role !== "admin" && user.role !== "moderator") return;
    axios.get("/admin/stats").then((res) => {
      setStats(res.data.stats);
      setChartData(res.data.chartData);
      setLoadingStats(false);
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to load dashboard stats.");
      setLoadingStats(false);
    });
    fetchUsers();
    fetchReports();
    fetchLogs();
  }, [user]);
  const fetchUsers = () => {
    setLoadingUsers(true);
    axios.get("/admin/users?limit=50").then((res) => {
      setUsers(res.data.users);
      setLoadingUsers(false);
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to load users.");
      setLoadingUsers(false);
    });
  };
  const fetchReports = () => {
    setLoadingReports(true);
    axios.get("/admin/reports").then((res) => {
      setReports(res.data);
      setLoadingReports(false);
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to load reports.");
      setLoadingReports(false);
    });
  };
  const fetchLogs = () => {
    setLoadingLogs(true);
    axios.get("/admin/logs/logins").then((res) => {
      setLogs(res.data);
      setLoadingLogs(false);
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to load logs.");
      setLoadingLogs(false);
    });
  };
  const handleUpdateUserRole = async (id, role) => {
    try {
      await axios.patch(`/admin/users/${id}/status`, {
        role
      });
      toast.success(`User role changed to ${role}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update user role.");
    }
  };
  const handleUpdateUserStatus = async (id, status) => {
    try {
      await axios.patch(`/admin/users/${id}/status`, {
        status
      });
      toast.success(`User marked as ${status}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user status.");
    }
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete user.");
    }
  };
  const handleUpdateReport = async (id, status) => {
    try {
      await axios.patch(`/admin/reports/${id}/status`, {
        status
      });
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch (err) {
      toast.error("Failed to update report status.");
    }
  };
  if (authLoading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen w-screen flex items-center justify-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin h-6 w-6 mr-2" }),
      " Authenticating admin..."
    ] });
  }
  if (user.role !== "admin" && user.role !== "moderator") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen w-screen flex flex-col items-center justify-center bg-background px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-16 w-16 text-destructive mb-4 opacity-80" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-center max-w-sm mb-8", children: [
        "You are currently logged in as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: user.username }),
        ", which does not have administrator privileges."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
          to: "/app"
        }), className: "px-6 py-2.5 rounded-full glass hover:bg-accent transition text-sm font-medium", children: "Return to App" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          await logout();
          navigate({
            to: "/login",
            search: {
              redirect: "/admin"
            }
          });
        }, className: "px-6 py-2.5 rounded-full bg-destructive text-white hover:bg-destructive/90 transition text-sm font-medium", children: "Sign in as Admin" })
      ] })
    ] });
  }
  const statCards = [{
    label: "Total users",
    value: stats?.totalUsers || 0,
    delta: "+Active",
    up: true,
    icon: Users,
    color: "from-[var(--neon)] to-[var(--primary)]"
  }, {
    label: "Active now",
    value: stats?.activeUsers || 0,
    delta: "Active",
    up: true,
    icon: Activity,
    color: "from-[var(--neon-2)] to-[var(--neon)]"
  }, {
    label: "Messages today",
    value: stats?.messagesToday || 0,
    delta: "Today",
    up: true,
    icon: MessageSquare,
    color: "from-[var(--primary)] to-[var(--neon-2)]"
  }, {
    label: "Open reports",
    value: stats?.openReports || 0,
    delta: "Pending",
    up: false,
    icon: TriangleAlert,
    color: "from-destructive to-[var(--neon)]"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 gradient-mesh opacity-30 -z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-64 flex-col glass border-r border-border/50 p-5 sticky top-0 h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-[var(--neon)] font-medium bg-[var(--neon)]/10 px-2 py-1 rounded w-max inline-block", children: "Admin Console" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "mt-8 flex-1 space-y-1", children: navItems.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSection(n.id), className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${section === n.id ? "bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/20 text-foreground" : "text-muted-foreground hover:bg-accent/50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: "h-4 w-4" }),
        " ",
        n.label
      ] }, n.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4 border-t border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "block text-xs text-muted-foreground hover:text-foreground", children: "← Back to site" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Sign out"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 glass border-b border-border/50 px-6 py-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold capitalize", children: section }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Real-time view of platform health." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search users, reports…", className: "h-9 w-64 pl-9 pr-3 rounded-full bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleLogout, title: "Sign out", className: "p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`, className: "h-9 w-9 rounded-full ring-2 ring-[var(--neon)]", alt: "" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
        section === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: statCards.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 hover:glow-neon transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs inline-flex items-center gap-1 ${s.up ? "text-[var(--success)]" : "text-destructive"}`, children: [
              s.up ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
              " ",
              s.delta
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-2xl font-bold", children: loadingStats ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mt-1 mb-1 text-muted-foreground" }) : s.value.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: s.label })
        ] }, s.label)) }),
        section === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Message volume" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Last 7 days" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-xs text-[var(--neon)] inline-flex items-center gap-1 hover:underline", children: [
                "View report ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3" })
              ] })
            ] }),
            loadingStats ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AreaChart, { data: chartData.length ? chartData : [0, 0, 0, 0, 0, 0, 0] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Active users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "By status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [{
              region: "Active",
              v: stats ? Math.round(stats.activeUsers / stats.totalUsers * 100) : 0,
              c: "from-[var(--neon)] to-[var(--primary)]"
            }, {
              region: "Online",
              v: stats ? Math.round(stats.onlineUsers / stats.totalUsers * 100) : 0,
              c: "from-[var(--neon-2)] to-[var(--neon)]"
            }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: r.region }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  r.v,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full bg-gradient-to-r ${r.c}`, style: {
                width: `${r.v}%`
              } }) })
            ] }, r.region)) })
          ] })
        ] }),
        (section === "overview" || section === "users") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between p-5 border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "User management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage accounts, roles, and access." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Role" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Device / IP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Joined" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loadingUsers ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "text-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto text-muted-foreground" }) }) }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "text-center py-10 text-muted-foreground", children: "No users found." }) }) : users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())).map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/50 hover:bg-accent/30 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`, className: "h-9 w-9 rounded-full", alt: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                    u.name,
                    " ",
                    u.isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-[var(--success)] ml-1" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: u.email })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs glass rounded-full px-2 py-1 uppercase tracking-wider", children: u.role }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: u.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-muted-foreground text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: u.ip || "Unknown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate max-w-[150px]", children: u.device || "Unknown" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground text-xs", children: new Date(u.createdAt).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Key, onClick: () => setChangePasswordModal({
                  isOpen: true,
                  userId: u._id,
                  username: u.username
                }), title: "Change Password" }),
                u.role === "user" && /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Crown, onClick: () => handleUpdateUserRole(u._id, "admin"), title: "Promote to Admin" }),
                u.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: UserCog, onClick: () => handleUpdateUserRole(u._id, "user"), title: "Demote to User" }),
                u.status !== "Active" && /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Check, onClick: () => handleUpdateUserStatus(u._id, "Active"), title: "Activate" }),
                u.status !== "Banned" && /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Ban, onClick: () => handleUpdateUserStatus(u._id, "Banned"), title: "Ban" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Trash2, danger: true, onClick: () => handleDeleteUser(u._id), title: "Delete" })
              ] }) })
            ] }, u.email)) })
          ] }) })
        ] }),
        section === "chat" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl h-[calc(100vh-140px)] flex overflow-hidden border border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-80 border-r border-border/50 flex flex-col h-full bg-accent/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: chatSearch, onChange: (e) => setChatSearch(e.target.value), placeholder: "Search users to chat…", className: "w-full h-10 pl-9 pr-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm text-foreground" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1", children: chatUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-muted-foreground text-xs", children: "No users found" }) : chatUsers.map((u) => {
              const isOnline = onlineUsers.includes(u._id);
              const isSelected = selectedChatUser?._id === u._id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleSelectChatUser(u), className: `w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${isSelected ? "bg-gradient-to-r from-[var(--neon)]/15 to-[var(--primary)]/15 border border-[var(--neon)]/30" : "hover:bg-accent/40"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`, className: "h-10 w-10 rounded-full", alt: "" }),
                  isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-card" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold truncate text-foreground", children: u.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                    "@",
                    u.username
                  ] })
                ] })
              ] }, u._id);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col h-full bg-accent/2", children: selectedChatUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 px-6 border-b border-border/50 flex items-center justify-between bg-accent/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedChatUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChatUser.username}`, className: "h-10 w-10 rounded-full", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: selectedChatUser.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs flex items-center gap-1.5 mt-0.5", children: onlineUsers.includes(selectedChatUser._id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-[var(--success)] inline-block animate-pulse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--success)]", children: "Online" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Offline" }) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4", children: [
              chatMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground text-sm", children: "No messages yet. Say hello! 👋" }) : chatMessages.map((msg) => {
                const isMe = msg.senderId === user?._id;
                const msgTime = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${isMe ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-md px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isMe ? "bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white rounded-br-sm" : "glass rounded-bl-sm text-foreground"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: msg.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] mt-1 text-right ${isMe ? "text-white/70" : "text-muted-foreground"}`, children: msgTime })
                ] }) }, msg._id);
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: adminChatEndRef })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSendAdminChatMessage, className: "p-4 border-t border-border/50 bg-accent/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: adminChatInput, onChange: (e) => setAdminChatInput(e.target.value), placeholder: "Type a message…", className: "flex-1 h-11 px-4 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm text-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !adminChatInput.trim(), className: "h-11 px-5 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center disabled:opacity-50 font-medium", children: "Send" })
            ] }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-12 w-12 opacity-25 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Select a user from the list to start chatting." })
          ] }) })
        ] }),
        (section === "overview" || section === "reports" || section === "logs") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
          (section === "overview" || section === "reports") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: "Recent reports" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Content moderation queue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: loadingReports ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto text-muted-foreground" }) }) : reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-muted-foreground", children: "No reports found." }) : reports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-9 w-9 rounded-lg flex items-center justify-center ${r.severity === "high" ? "bg-destructive/20 text-destructive" : r.severity === "medium" ? "bg-[var(--neon-2)]/20 text-[var(--neon-2)]" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium truncate", children: [
                  "Target: ",
                  r.targetUser?.username || r.targetGroup?.name || "System"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                  r.reason,
                  " · ",
                  new Date(r.createdAt).toLocaleDateString()
                ] })
              ] }),
              r.status === "Pending" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleUpdateReport(r._id, "Reviewed"), className: "text-xs px-3 py-1.5 rounded-full glass hover:bg-accent", children: "Review" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider bg-accent px-2 py-1 rounded-full", children: r.status })
            ] }, r._id || i)) })
          ] }),
          (section === "overview" || section === "logs") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1", children: "Login logs & devices" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Recent sign-ins · IP tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: loadingLogs ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto text-muted-foreground" }) }) : logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-muted-foreground", children: "No logs found." }) : logs.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-9 w-9 rounded-lg flex items-center justify-center ${l.suspicious ? "bg-destructive/20 text-destructive" : "bg-accent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: l.user?.email || "Unknown User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground inline-flex items-center gap-1.5 truncate w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
                  " ",
                  l.location,
                  " · ",
                  l.ip,
                  " · ",
                  l.device
                ] })
              ] }),
              l.suspicious && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider bg-destructive/20 text-destructive px-2 py-1 rounded-full", children: "Flagged" })
            ] }, l._id || i)) })
          ] })
        ] }),
        section === "moderation" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Content Moderation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage banned & suspended accounts" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-4 mb-6", children: [{
            label: "Active Users",
            val: users.filter((u) => u.status === "Active").length,
            color: "text-[var(--success)]"
          }, {
            label: "Suspended",
            val: users.filter((u) => u.status === "Suspended").length,
            color: "text-[var(--neon-2)]"
          }, {
            label: "Banned",
            val: users.filter((u) => u.status === "Banned").length,
            color: "text-destructive"
          }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold ${s.color}`, children: s.val }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: s.label })
          ] }, s.label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider", children: "Restricted Accounts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: loadingUsers ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto text-muted-foreground" }) }) : users.filter((u) => u.status !== "Active").length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No restricted accounts. Platform is clean! 🎉" })
          ] }) : users.filter((u) => u.status !== "Active").map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 glass rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`, className: "h-9 w-9 rounded-full", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: u.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: u.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: u.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Key, onClick: () => setChangePasswordModal({
                isOpen: true,
                userId: u._id,
                username: u.username
              }), title: "Change Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Check, onClick: () => handleUpdateUserStatus(u._id, "Active"), title: "Restore Access" }),
              u.status !== "Banned" && /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Ban, danger: true, onClick: () => handleUpdateUserStatus(u._id, "Banned"), title: "Ban permanently" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconAction, { icon: Trash2, danger: true, onClick: () => handleDeleteUser(u._id), title: "Delete account" })
            ] })
          ] }, u._id)) })
        ] }) }),
        section === "spam" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-destructive to-[var(--neon-2)] text-white flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileExclamationPoint, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Automated Spam Detection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Real-time pattern analysis & threat monitoring" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs bg-[var(--success)]/20 text-[var(--success)] px-3 py-1 rounded-full flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" }),
              " Active"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [{
            label: "Threats Blocked",
            val: "0",
            icon: Shield,
            color: "from-[var(--success)] to-[var(--neon)]"
          }, {
            label: "Flagged Messages",
            val: reports.length.toString(),
            icon: Flag,
            color: "from-[var(--neon-2)] to-[var(--neon)]"
          }, {
            label: "Suspicious Logins",
            val: logs.filter((l) => l.suspicious).length.toString(),
            icon: Activity,
            color: "from-destructive to-[var(--neon-2)]"
          }, {
            label: "Banned Accounts",
            val: users.filter((u) => u.status === "Banned").length.toString(),
            icon: Ban,
            color: "from-destructive to-[var(--primary)]"
          }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-9 w-9 rounded-lg bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: s.val }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: s.label })
          ] }, s.label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-[var(--neon)]" }),
                " Detection Rules"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [{
                rule: "Rapid message flooding",
                status: "Active",
                desc: ">10 msgs in 30s"
              }, {
                rule: "Phishing link detection",
                status: "Active",
                desc: "URL pattern analysis"
              }, {
                rule: "Offensive content filter",
                status: "Active",
                desc: "NLP keyword matching"
              }, {
                rule: "Duplicate message spam",
                status: "Active",
                desc: "Hash-based deduplication"
              }, {
                rule: "Account takeover detection",
                status: "Active",
                desc: "IP anomaly detection"
              }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/30 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: r.rule }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.desc })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-[var(--success)]/20 text-[var(--success)] px-2 py-1 rounded-full uppercase tracking-wider", children: r.status })
              ] }, r.rule)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-[var(--neon-2)]" }),
                " Suspicious Logins"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto scrollbar-thin", children: logs.filter((l) => l.suspicious).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No suspicious activity detected" })
              ] }) : logs.filter((l) => l.suspicious).map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 text-destructive shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: l.user?.email }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                    l.ip,
                    " · ",
                    l.device
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-destructive/20 text-destructive px-2 py-1 rounded-full", children: "Flagged" })
              ] }, l._id || i)) })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    changePasswordModal.isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md glass border border-border/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground", children: "Change Password" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
        "Reset password for user ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--neon)] font-semibold", children: [
          "@",
          changePasswordModal.username
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdatePassword, className: "mt-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-medium", children: "New Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "Enter at least 6 characters", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "mt-1 w-full h-10 px-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm text-foreground", required: true, minLength: 6 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            setChangePasswordModal({
              isOpen: false,
              userId: "",
              username: ""
            });
            setNewPassword("");
          }, className: "h-10 px-4 rounded-xl text-sm font-medium hover:bg-accent transition text-muted-foreground", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: updatingPassword, className: "h-10 px-5 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white hover:glow-primary transition flex items-center justify-center gap-2", children: updatingPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save Password" })
        ] })
      ] })
    ] }) })
  ] });
}
function Th({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-medium px-5 py-3", children });
}
function StatusPill({
  status
}) {
  const map = {
    Active: "bg-[var(--success)]/20 text-[var(--success)]",
    Suspended: "bg-[var(--neon-2)]/20 text-[var(--neon-2)]",
    Banned: "bg-destructive/20 text-destructive"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs rounded-full px-2.5 py-1 ${map[status] ?? "glass"}`, children: status });
}
function IconAction({
  icon: Icon,
  danger,
  onClick,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, title, className: `h-8 w-8 rounded-lg hover:bg-accent transition flex items-center justify-center ${danger ? "text-destructive hover:bg-destructive/20" : "text-muted-foreground hover:text-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) });
}
function AreaChart({
  data
}) {
  const max = Math.max(...data, 10);
  const w = 600, h = 180, pad = 16;
  const step = (w - pad * 2) / (data.length - 1 || 1);
  const points = data.map((v, i) => `${pad + i * step},${h - pad - v / max * (h - pad * 2)}`);
  const path = `M ${points[0]} ${points.map((p) => `L ${p}`).join(" ")}`;
  const area = `${path} L ${pad + (data.length - 1) * step},${h - pad} L ${pad},${h - pad} Z`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${w} ${h}`, className: "w-full h-44", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "g", x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.78 0.22 295)", stopOpacity: "0.6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.78 0.22 295)", stopOpacity: "0" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: area, fill: "url(#g)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: path, fill: "none", stroke: "oklch(0.78 0.22 295)", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    points.map((p, i) => {
      const [x, y] = p.split(",").map(Number);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x, cy: y, r: "3.5", fill: "oklch(0.14 0.02 270)", stroke: "oklch(0.78 0.22 295)", strokeWidth: "2" }, i);
    }),
    ["7d", "6d", "5d", "4d", "3d", "2d", "1d"].map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: pad + i * step, y: h - 2, textAnchor: "middle", fontSize: "10", fill: "currentColor", opacity: "0.5", children: d }, i))
  ] });
}
export {
  Admin as component
};
