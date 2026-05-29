import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Users, MessageSquare, AlertTriangle, Activity, TrendingUp, TrendingDown,
  Search, MoreVertical, Shield, Ban, Trash2, Eye, MapPin, Smartphone,
  LayoutDashboard, UserCog, Flag, FileWarning, ScrollText, ArrowUpRight, Loader2, Check,
  LogOut, Key, Crown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useSocket } from "../context/SocketContext";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · NebulaChat" }, { name: "description", content: "Admin dashboard" }] }),
  component: Admin,
});

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "users", icon: UserCog, label: "Users" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "reports", icon: Flag, label: "Reports" },
  { id: "moderation", icon: Shield, label: "Moderation" },
  { id: "logs", icon: ScrollText, label: "Login logs" },
  { id: "spam", icon: FileWarning, label: "Spam detection" },
];

function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const { socket, onlineUsers } = useSocket();
  const [chatSearch, setChatSearch] = useState("");
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [adminChatInput, setAdminChatInput] = useState("");
  const adminChatEndRef = useRef<HTMLDivElement>(null);

  // Debounced search for chat users (excl. ourselves)
  useEffect(() => {
    if (!user) return;
    const delayDebounceFn = setTimeout(() => {
      axios.get(`/admin/users?query=${chatSearch}&limit=100`).then(res => {
        const filtered = res.data.users.filter((u: any) => u._id !== user._id);
        setChatUsers(filtered);
      }).catch(console.error);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [chatSearch, user]);

  // Fetch message history with selected user
  useEffect(() => {
    if (!selectedChatUser) return;
    axios.get(`/messages/${selectedChatUser._id}?page=1&limit=100`).then(res => {
      const data = res.data;
      const msgs = Array.isArray(data) ? data : data.messages;
      setChatMessages(msgs || []);
    }).catch(console.error);

    // Mark messages as seen
    axios.post(`/messages/seen/${selectedChatUser._id}`).then(() => {
      if (socket) socket.emit("markedSeen", { senderId: selectedChatUser._id });
    }).catch(console.error);
  }, [selectedChatUser, socket]);

  // Auto scroll chat to bottom
  useEffect(() => {
    adminChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Listen to socket newMessage in real-time
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (msg: any) => {
      if (!selectedChatUser) return;

      const msgSenderId = String(msg.senderId);
      const msgReceiverId = String(msg.receiverId);
      const activeChatId = String(selectedChatUser._id);
      const myId = String(user._id);

      const isFromSelected = msgSenderId === activeChatId && msgReceiverId === myId;
      const isFromMe = msgSenderId === myId && msgReceiverId === activeChatId;

      if (isFromSelected || isFromMe) {
        setChatMessages(prev => {
          if (prev.some(m => String(m._id) === String(msg._id))) return prev;
          return [...prev, msg];
        });

        if (isFromSelected) {
          axios.post(`/messages/seen/${selectedChatUser._id}`).then(() => {
            socket.emit("markedSeen", { senderId: selectedChatUser._id });
          }).catch(console.error);
        }
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChatUser, user]);

  const handleSendAdminChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim() || !selectedChatUser) return;
    try {
      const res = await axios.post(`/messages/send/${selectedChatUser._id}`, { message: adminChatInput });
      setChatMessages(prev => [...prev, res.data]);
      setAdminChatInput("");
      if (socket) socket.emit("stopTyping", { receiverId: selectedChatUser._id });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    }
  };

  const handleSelectChatUser = (u: any) => {
    setSelectedChatUser(u);
  };

  const [changePasswordModal, setChangePasswordModal] = useState<{
    isOpen: boolean;
    userId: string;
    username: string;
  }>({ isOpen: false, userId: "", username: "" });
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (err) {
      toast.error("Failed to sign out.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setUpdatingPassword(true);
    try {
      await axios.patch(`/admin/users/${changePasswordModal.userId}/password`, { password: newPassword });
      toast.success(`Password for ${changePasswordModal.username} updated successfully.`);
      setChangePasswordModal({ isOpen: false, userId: "", username: "" });
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const [section, setSection] = useState("overview");
  const [query, setQuery] = useState("");

  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Authentication Check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/login', search: { redirect: '/admin' } });
    }
  }, [user, authLoading, navigate]);

  // Fetch Dashboard Stats
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) return;
    
    axios.get('/admin/stats').then(res => {
      setStats(res.data.stats);
      setChartData(res.data.chartData);
      setLoadingStats(false);
    }).catch(err => {
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
    axios.get('/admin/users?limit=50').then(res => {
      setUsers(res.data.users);
      setLoadingUsers(false);
    }).catch(err => {
      console.error(err);
      toast.error("Failed to load users.");
      setLoadingUsers(false);
    });
  };

  const fetchReports = () => {
    setLoadingReports(true);
    axios.get('/admin/reports').then(res => {
      setReports(res.data);
      setLoadingReports(false);
    }).catch(err => {
      console.error(err);
      toast.error("Failed to load reports.");
      setLoadingReports(false);
    });
  };

  const fetchLogs = () => {
    setLoadingLogs(true);
    axios.get('/admin/logs/logins').then(res => {
      setLogs(res.data);
      setLoadingLogs(false);
    }).catch(err => {
      console.error(err);
      toast.error("Failed to load logs.");
      setLoadingLogs(false);
    });
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    try {
      await axios.patch(`/admin/users/${id}/status`, { role });
      toast.success(`User role changed to ${role}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update user role.");
    }
  };

  const handleUpdateUserStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/admin/users/${id}/status`, { status });
      toast.success(`User marked as ${status}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user status.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const handleUpdateReport = async (id: string, status: string) => {
    try {
      await axios.patch(`/admin/reports/${id}/status`, { status });
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch (err) {
      toast.error("Failed to update report status.");
    }
  };

  if (authLoading || !user) {
    return <div className="h-screen w-screen flex items-center justify-center text-muted-foreground"><Loader2 className="animate-spin h-6 w-6 mr-2" /> Authenticating admin...</div>;
  }

  if (user.role !== 'admin' && user.role !== 'moderator') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background px-4">
        <Shield className="h-16 w-16 text-destructive mb-4 opacity-80" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-sm mb-8">
          You are currently logged in as <span className="font-semibold text-foreground">{user.username}</span>, which does not have administrator privileges.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate({ to: '/app' })}
            className="px-6 py-2.5 rounded-full glass hover:bg-accent transition text-sm font-medium"
          >
            Return to App
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate({ to: '/login', search: { redirect: '/admin' } });
            }}
            className="px-6 py-2.5 rounded-full bg-destructive text-white hover:bg-destructive/90 transition text-sm font-medium"
          >
            Sign in as Admin
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total users", value: stats?.totalUsers || 0, delta: "+Active", up: true, icon: Users, color: "from-[var(--neon)] to-[var(--primary)]" },
    { label: "Active now", value: stats?.activeUsers || 0, delta: "Active", up: true, icon: Activity, color: "from-[var(--neon-2)] to-[var(--neon)]" },
    { label: "Messages today", value: stats?.messagesToday || 0, delta: "Today", up: true, icon: MessageSquare, color: "from-[var(--primary)] to-[var(--neon-2)]" },
    { label: "Open reports", value: stats?.openReports || 0, delta: "Pending", up: false, icon: AlertTriangle, color: "from-destructive to-[var(--neon)]" },
  ];

  return (
    <div className="relative min-h-screen flex">
      <div className="pointer-events-none fixed inset-0 gradient-mesh opacity-30 -z-10" />

      <aside className="hidden md:flex w-64 flex-col glass border-r border-border/50 p-5 sticky top-0 h-screen">
        <Logo />
        <div className="mt-2 text-xs text-[var(--neon)] font-medium bg-[var(--neon)]/10 px-2 py-1 rounded w-max inline-block">Admin Console</div>
        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map(n => (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                section === n.id ? "bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/20 text-foreground" : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </button>
          ))}
        </nav>
        <div className="space-y-3 pt-4 border-t border-border/50">
          <Link to="/" className="block text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition text-left"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 glass border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold capitalize">{section}</h1>
            <p className="text-xs text-muted-foreground">Real-time view of platform health.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search users, reports…"
                className="h-9 w-64 pl-9 pr-3 rounded-full bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm"
              />
            </div>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="h-9 w-9 rounded-full ring-2 ring-[var(--neon)]" alt="" />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats */}
          {section === "overview" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(s => (
                <div key={s.label} className="glass rounded-2xl p-5 hover:glow-neon transition">
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs inline-flex items-center gap-1 ${s.up ? "text-[var(--success)]" : "text-destructive"}`}>
                      {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {s.delta}
                    </span>
                  </div>
                  <div className="mt-4 text-2xl font-bold">
                    {loadingStats ? <Loader2 className="h-5 w-5 animate-spin mt-1 mb-1 text-muted-foreground" /> : s.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Charts */}
          {section === "overview" && (
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Message volume</h3>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                  </div>
                  <button className="text-xs text-[var(--neon)] inline-flex items-center gap-1 hover:underline">View report <ArrowUpRight className="h-3 w-3" /></button>
                </div>
                {loadingStats ? <div className="h-44 flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div> : <AreaChart data={chartData.length ? chartData : [0,0,0,0,0,0,0]} />}
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold">Active users</h3>
                <p className="text-xs text-muted-foreground mb-4">By status</p>
                <div className="space-y-3">
                  {[
                    { region: "Active", v: stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0, c: "from-[var(--neon)] to-[var(--primary)]" },
                    { region: "Online", v: stats ? Math.round((stats.onlineUsers / stats.totalUsers) * 100) : 0, c: "from-[var(--neon-2)] to-[var(--neon)]" },
                  ].map(r => (
                    <div key={r.region}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{r.region}</span>
                        <span className="font-medium">{r.v}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${r.c}`} style={{ width: `${r.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users table */}
          {(section === "overview" || section === "users") && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div>
                  <h3 className="font-semibold">User management</h3>
                  <p className="text-xs text-muted-foreground">Manage accounts, roles, and access.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground bg-muted/30">
                    <tr>
                      <Th>User</Th><Th>Role</Th><Th>Status</Th><Th>Device / IP</Th><Th>Joined</Th><Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr><td colSpan={6} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No users found.</td></tr>
                    ) : users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())).map(u => (
                      <tr key={u.email} className="border-t border-border/50 hover:bg-accent/30 transition">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="h-9 w-9 rounded-full" alt="" />
                            <div>
                              <div className="font-medium">{u.name} {u.isOnline && <span className="inline-block w-2 h-2 rounded-full bg-[var(--success)] ml-1"></span>}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3"><span className="text-xs glass rounded-full px-2 py-1 uppercase tracking-wider">{u.role}</span></td>
                        <td className="px-5 py-3"><StatusPill status={u.status} /></td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">
                           <div>{u.ip || 'Unknown'}</div>
                           <div className="truncate max-w-[150px]">{u.device || 'Unknown'}</div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1">
                            <IconAction icon={Key} onClick={() => setChangePasswordModal({ isOpen: true, userId: u._id, username: u.username })} title="Change Password" />
                            {u.role === 'user' && <IconAction icon={Crown} onClick={() => handleUpdateUserRole(u._id, 'admin')} title="Promote to Admin" />}
                            {u.role === 'admin' && <IconAction icon={UserCog} onClick={() => handleUpdateUserRole(u._id, 'user')} title="Demote to User" />}
                            {u.status !== 'Active' && <IconAction icon={Check} onClick={() => handleUpdateUserStatus(u._id, 'Active')} title="Activate" />}
                            {u.status !== 'Banned' && <IconAction icon={Ban} onClick={() => handleUpdateUserStatus(u._id, 'Banned')} title="Ban" />}
                            <IconAction icon={Trash2} danger onClick={() => handleDeleteUser(u._id)} title="Delete" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chat Section */}
          {section === "chat" && (
            <div className="glass rounded-2xl h-[calc(100vh-140px)] flex overflow-hidden border border-border/50">
              {/* User List Panel (Left) */}
              <div className="w-80 border-r border-border/50 flex flex-col h-full bg-accent/5">
                <div className="p-4 border-b border-border/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={chatSearch}
                      onChange={e => setChatSearch(e.target.value)}
                      placeholder="Search users to chat…"
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm text-foreground"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
                  {chatUsers.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs">No users found</div>
                  ) : (
                    chatUsers.map((u: any) => {
                      const isOnline = onlineUsers.includes(u._id);
                      const isSelected = selectedChatUser?._id === u._id;
                      return (
                        <button
                          key={u._id}
                          onClick={() => handleSelectChatUser(u)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${isSelected ? 'bg-gradient-to-r from-[var(--neon)]/15 to-[var(--primary)]/15 border border-[var(--neon)]/30' : 'hover:bg-accent/40'}`}
                        >
                          <div className="relative">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="h-10 w-10 rounded-full" alt="" />
                            {isOnline && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-card" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-foreground">{u.name}</div>
                            <div className="text-xs text-muted-foreground truncate">@{u.username}</div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Window Panel (Right) */}
              <div className="flex-1 flex flex-col h-full bg-accent/2">
                {selectedChatUser ? (
                  <>
                    {/* Header */}
                    <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-accent/5">
                      <div className="flex items-center gap-3">
                        <img src={selectedChatUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChatUser.username}`} className="h-10 w-10 rounded-full" alt="" />
                        <div>
                          <div className="font-semibold text-sm text-foreground">{selectedChatUser.name}</div>
                          <div className="text-xs flex items-center gap-1.5 mt-0.5">
                            {onlineUsers.includes(selectedChatUser._id) ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-[var(--success)] inline-block animate-pulse" />
                                <span className="text-[var(--success)]">Online</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">Offline</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4">
                      {chatMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          No messages yet. Say hello! 👋
                        </div>
                      ) : (
                        chatMessages.map((msg: any) => {
                          const isMe = msg.senderId === user?._id;
                          const msgTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-md px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isMe ? 'bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white rounded-br-sm' : 'glass rounded-bl-sm text-foreground'}`}>
                                <div>{msg.message}</div>
                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-muted-foreground'}`}>{msgTime}</div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={adminChatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendAdminChatMessage} className="p-4 border-t border-border/50 bg-accent/5">
                      <div className="flex gap-2">
                        <input
                          value={adminChatInput}
                          onChange={e => setAdminChatInput(e.target.value)}
                          placeholder="Type a message…"
                          className="flex-1 h-11 px-4 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm text-foreground"
                        />
                        <button
                          type="submit"
                          disabled={!adminChatInput.trim()}
                          className="h-11 px-5 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center disabled:opacity-50 font-medium"
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 opacity-25 mb-3" />
                    <p className="text-sm">Select a user from the list to start chatting.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports + login logs */}
          {(section === "overview" || section === "reports" || section === "logs") && (
            <div className="grid lg:grid-cols-2 gap-4">
              
              {(section === "overview" || section === "reports") && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-semibold mb-1">Recent reports</h3>
                  <p className="text-xs text-muted-foreground mb-4">Content moderation queue</p>
                  <div className="space-y-2">
                    {loadingReports ? (
                      <div className="py-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
                    ) : reports.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground">No reports found.</div>
                    ) : reports.map((r, i) => (
                      <div key={r._id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          r.severity === "high" ? "bg-destructive/20 text-destructive" :
                          r.severity === "medium" ? "bg-[var(--neon-2)]/20 text-[var(--neon-2)]" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          <Flag className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">Target: {r.targetUser?.username || r.targetGroup?.name || "System"}</div>
                          <div className="text-xs text-muted-foreground truncate">{r.reason} · {new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        {r.status === 'Pending' ? (
                          <button onClick={() => handleUpdateReport(r._id, 'Reviewed')} className="text-xs px-3 py-1.5 rounded-full glass hover:bg-accent">Review</button>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider bg-accent px-2 py-1 rounded-full">{r.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(section === "overview" || section === "logs") && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-semibold mb-1">Login logs & devices</h3>
                  <p className="text-xs text-muted-foreground mb-4">Recent sign-ins · IP tracking</p>
                  <div className="space-y-2">
                    {loadingLogs ? (
                      <div className="py-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
                    ) : logs.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground">No logs found.</div>
                    ) : logs.map((l, i) => (
                      <div key={l._id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${l.suspicious ? "bg-destructive/20 text-destructive" : "bg-accent"}`}>
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{l.user?.email || 'Unknown User'}</div>
                          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 truncate w-full">
                            <MapPin className="h-3 w-3 shrink-0" /> {l.location} · {l.ip} · {l.device}
                          </div>
                        </div>
                        {l.suspicious && <span className="text-[10px] uppercase tracking-wider bg-destructive/20 text-destructive px-2 py-1 rounded-full">Flagged</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Moderation Section */}
          {section === "moderation" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Content Moderation</h3>
                    <p className="text-xs text-muted-foreground">Manage banned & suspended accounts</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Active Users", val: users.filter(u => u.status === 'Active').length, color: "text-[var(--success)]" },
                    { label: "Suspended", val: users.filter(u => u.status === 'Suspended').length, color: "text-[var(--neon-2)]" },
                    { label: "Banned", val: users.filter(u => u.status === 'Banned').length, color: "text-destructive" },
                  ].map(s => (
                    <div key={s.label} className="glass rounded-xl p-4 text-center">
                      <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Restricted Accounts</h4>
                <div className="space-y-2">
                  {loadingUsers ? (
                    <div className="py-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
                  ) : users.filter(u => u.status !== 'Active').length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Shield className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No restricted accounts. Platform is clean! 🎉</p>
                    </div>
                  ) : users.filter(u => u.status !== 'Active').map(u => (
                    <div key={u._id} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="h-9 w-9 rounded-full" alt="" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                      <StatusPill status={u.status} />
                      <div className="flex gap-1">
                        <IconAction icon={Key} onClick={() => setChangePasswordModal({ isOpen: true, userId: u._id, username: u.username })} title="Change Password" />
                        <IconAction icon={Check} onClick={() => handleUpdateUserStatus(u._id, 'Active')} title="Restore Access" />
                        {u.status !== 'Banned' && <IconAction icon={Ban} danger onClick={() => handleUpdateUserStatus(u._id, 'Banned')} title="Ban permanently" />}
                        <IconAction icon={Trash2} danger onClick={() => handleDeleteUser(u._id)} title="Delete account" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Spam Detection Section */}
          {section === "spam" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-destructive to-[var(--neon-2)] text-white flex items-center justify-center">
                    <FileWarning className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Automated Spam Detection</h3>
                    <p className="text-xs text-muted-foreground">Real-time pattern analysis & threat monitoring</p>
                  </div>
                  <span className="ml-auto text-xs bg-[var(--success)]/20 text-[var(--success)] px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" /> Active
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Threats Blocked", val: "0", icon: Shield, color: "from-[var(--success)] to-[var(--neon)]" },
                    { label: "Flagged Messages", val: reports.length.toString(), icon: Flag, color: "from-[var(--neon-2)] to-[var(--neon)]" },
                    { label: "Suspicious Logins", val: logs.filter((l: any) => l.suspicious).length.toString(), icon: Activity, color: "from-destructive to-[var(--neon-2)]" },
                    { label: "Banned Accounts", val: users.filter(u => u.status === 'Banned').length.toString(), icon: Ban, color: "from-destructive to-[var(--primary)]" },
                  ].map(s => (
                    <div key={s.label} className="glass rounded-xl p-4">
                      <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="text-2xl font-bold">{s.val}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[var(--neon)]" /> Detection Rules
                    </h4>
                    <div className="space-y-3">
                      {[
                        { rule: "Rapid message flooding", status: "Active", desc: ">10 msgs in 30s" },
                        { rule: "Phishing link detection", status: "Active", desc: "URL pattern analysis" },
                        { rule: "Offensive content filter", status: "Active", desc: "NLP keyword matching" },
                        { rule: "Duplicate message spam", status: "Active", desc: "Hash-based deduplication" },
                        { rule: "Account takeover detection", status: "Active", desc: "IP anomaly detection" },
                      ].map(r => (
                        <div key={r.rule} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/30 transition">
                          <div>
                            <div className="text-sm font-medium">{r.rule}</div>
                            <div className="text-xs text-muted-foreground">{r.desc}</div>
                          </div>
                          <span className="text-[10px] bg-[var(--success)]/20 text-[var(--success)] px-2 py-1 rounded-full uppercase tracking-wider">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-[var(--neon-2)]" /> Suspicious Logins
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                      {logs.filter((l: any) => l.suspicious).length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">No suspicious activity detected</p>
                        </div>
                      ) : logs.filter((l: any) => l.suspicious).map((l: any, i: number) => (
                        <div key={l._id || i} className="flex items-center gap-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                          <Smartphone className="h-4 w-4 text-destructive shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{l.user?.email}</div>
                            <div className="text-xs text-muted-foreground truncate">{l.ip} · {l.device}</div>
                          </div>
                          <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-1 rounded-full">Flagged</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {changePasswordModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass border border-border/50 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-foreground">Change Password</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Reset password for user <span className="text-[var(--neon)] font-semibold">@{changePasswordModal.username}</span>
            </p>
            <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium">New Password</label>
                <input
                  type="password"
                  placeholder="Enter at least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="mt-1 w-full h-10 px-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm text-foreground"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordModal({ isOpen: false, userId: "", username: "" });
                    setNewPassword("");
                  }}
                  className="h-10 px-4 rounded-xl text-sm font-medium hover:bg-accent transition text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="h-10 px-5 rounded-xl text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white hover:glow-primary transition flex items-center justify-center gap-2"
                >
                  {updatingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-medium px-5 py-3">{children}</th>;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-[var(--success)]/20 text-[var(--success)]",
    Suspended: "bg-[var(--neon-2)]/20 text-[var(--neon-2)]",
    Banned: "bg-destructive/20 text-destructive",
  };
  return <span className={`text-xs rounded-full px-2.5 py-1 ${map[status] ?? "glass"}`}>{status}</span>;
}

function IconAction({ icon: Icon, danger, onClick, title }: { icon: any; danger?: boolean; onClick?: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title} className={`h-8 w-8 rounded-lg hover:bg-accent transition flex items-center justify-center ${danger ? "text-destructive hover:bg-destructive/20" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function AreaChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 10);
  const w = 600, h = 180, pad = 16;
  const step = (w - pad * 2) / (data.length - 1 || 1);
  const points = data.map((v, i) => `${pad + i * step},${h - pad - (v / max) * (h - pad * 2)}`);
  const path = `M ${points[0]} ${points.map(p => `L ${p}`).join(" ")}`;
  const area = `${path} L ${pad + (data.length - 1) * step},${h - pad} L ${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.22 295)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.78 0.22 295)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={path} fill="none" stroke="oklch(0.78 0.22 295)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const [x, y] = p.split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="oklch(0.14 0.02 270)" stroke="oklch(0.78 0.22 295)" strokeWidth="2" />;
      })}
      {["7d", "6d", "5d", "4d", "3d", "2d", "1d"].map((d, i) => (
        <text key={i} x={pad + i * step} y={h - 2} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">{d}</text>
      ))}
    </svg>
  );
}
