import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useEffect, useState } from "react";
import {
  Users, MessageSquare, AlertTriangle, Activity, Shield,
  LayoutDashboard, UserCog, Flag, FileWarning, ScrollText,
  LogOut, Loader2, TrendingUp, ArrowUpRight, Search,
  Check, Ban, Trash2, Key, Crown, Smartphone, MapPin,
  MoreVertical, ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import axios from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · MajaniChat" },
      { name: "description", content: "MajaniChat admin dashboard" },
    ],
  }),
  component: AdminDashboard,
});

// Helper to get admin axios headers
function adminHeaders() {
  const token = localStorage.getItem("admin_token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "users",    icon: UserCog,         label: "Users" },
  { id: "reports",  icon: Flag,            label: "Reports" },
  { id: "logs",     icon: ScrollText,      label: "Login Logs" },
  { id: "spam",     icon: FileWarning,     label: "Spam Detection" },
];

function AdminDashboard() {
  const { adminUser, adminLoading, isAdminAuthenticated, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [query, setQuery] = useState("");

  // Data state
  const [stats, setStats]     = useState<any>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [users, setUsers]     = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [logs, setLogs]       = useState<any[]>([]);

  // Loading states
  const [loadingStats,   setLoadingStats]   = useState(true);
  const [loadingUsers,   setLoadingUsers]   = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingLogs,    setLoadingLogs]    = useState(true);

  // Password change modal
  const [pwModal, setPwModal] = useState<{ open: boolean; userId: string; username: string }>({ open: false, userId: "", username: "" });
  const [newPassword, setNewPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // Guard — redirect to login if not admin
  useEffect(() => {
    if (!adminLoading && !isAdminAuthenticated) {
      navigate({ to: "/admin" });
    }
  }, [adminLoading, isAdminAuthenticated, navigate]);

  // Fetch all data on mount
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    fetchStats();
    fetchUsers();
    fetchReports();
    fetchLogs();
  }, [isAdminAuthenticated]);

  const fetchStats = () => {
    setLoadingStats(true);
    axios.get("/admin/stats", adminHeaders())
      .then((res) => { setStats(res.data.stats); setChartData(res.data.chartData); })
      .catch(() => toast.error("Failed to load stats"))
      .finally(() => setLoadingStats(false));
  };

  const fetchUsers = () => {
    setLoadingUsers(true);
    axios.get("/admin/users?limit=100", adminHeaders())
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoadingUsers(false));
  };

  const fetchReports = () => {
    setLoadingReports(true);
    axios.get("/admin/reports", adminHeaders())
      .then((res) => setReports(res.data))
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoadingReports(false));
  };

  const fetchLogs = () => {
    setLoadingLogs(true);
    axios.get("/admin/logs/logins", adminHeaders())
      .then((res) => setLogs(res.data))
      .catch(() => toast.error("Failed to load logs"))
      .finally(() => setLoadingLogs(false));
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate({ to: "/admin" });
  };

  const handleUpdateUserStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/admin/users/${id}/status`, { status }, adminHeaders());
      toast.success(`User marked as ${status}`);
      fetchUsers();
    } catch { toast.error("Failed to update status"); }
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    try {
      await axios.patch(`/admin/users/${id}/status`, { role }, adminHeaders());
      toast.success(`User role changed to ${role}`);
      fetchUsers();
    } catch { toast.error("Failed to update role"); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`, adminHeaders());
      toast.success("User deleted");
      fetchUsers();
    } catch { toast.error("Failed to delete user"); }
  };

  const handleUpdateReport = async (id: string, status: string) => {
    try {
      await axios.patch(`/admin/reports/${id}/status`, { status }, adminHeaders());
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch { toast.error("Failed to update report"); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPw(true);
    try {
      await axios.patch(`/admin/users/${pwModal.userId}/password`, { password: newPassword }, adminHeaders());
      toast.success(`Password updated for ${pwModal.username}`);
      setPwModal({ open: false, userId: "", username: "" });
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally { setSavingPw(false); }
  };

  if (adminLoading || !isAdminAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--neon)]" />
      </div>
    );
  }

  const statCards = [
    { label: "Total users",     value: stats?.totalUsers   || 0, icon: Users,         color: "from-[var(--neon)] to-[var(--primary)]",   delta: "All time" },
    { label: "Active now",      value: stats?.onlineUsers  || 0, icon: Activity,      color: "from-[var(--neon-2)] to-[var(--neon)]",    delta: "Online" },
    { label: "Messages today",  value: stats?.messagesToday|| 0, icon: MessageSquare, color: "from-[var(--primary)] to-[var(--neon-2)]", delta: "Today" },
    { label: "Open reports",    value: stats?.openReports  || 0, icon: AlertTriangle, color: "from-destructive to-[var(--neon)]",         delta: "Pending" },
  ];

  const filteredUsers = users.filter(
    (u) =>
      (u.name?.toLowerCase() || "").includes(query.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(query.toLowerCase())
  );

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <div className="pointer-events-none fixed inset-0 gradient-mesh opacity-30 -z-10" />

      {/* ── SIDEBAR ───────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-col glass border-r border-border/50 p-5 sticky top-0 h-screen">
        <Logo />
        <div className="mt-2 text-xs text-[var(--neon)] font-semibold bg-[var(--neon)]/10 px-2.5 py-1 rounded-full w-max">
          Admin Console
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                section === n.id
                  ? "bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/20 text-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
              {section === n.id && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Admin user info */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <img
              src={adminUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminUser?.username}`}
              className="h-8 w-8 rounded-full ring-2 ring-[var(--neon)]"
              alt=""
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{adminUser?.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{adminUser?.email}</div>
            </div>
          </div>
          <Link to="/" className="block text-xs text-muted-foreground hover:text-foreground transition">
            ← Back to site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────── */}
      <main className="flex-1 min-w-0">
        {/* Header */}
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
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, reports…"
                className="h-9 w-60 pl-9 pr-3 rounded-full bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm"
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
            <img
              src={adminUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminUser?.username}`}
              className="h-9 w-9 rounded-full ring-2 ring-[var(--neon)]"
              alt=""
            />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* ── STATS ── */}
          {section === "overview" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-5 hover:glow-neon transition">
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-[var(--neon)] flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {s.delta}
                    </span>
                  </div>
                  <div className="mt-4 text-2xl font-bold">
                    {loadingStats ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : s.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── CHART ── */}
          {section === "overview" && !loadingStats && chartData.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Message volume</h3>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </div>
                <button className="text-xs text-[var(--neon)] inline-flex items-center gap-1 hover:underline">
                  View report <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              <MiniBarChart data={chartData} />
            </div>
          )}

          {/* ── USERS TABLE ── */}
          {(section === "overview" || section === "users") && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div>
                  <h3 className="font-semibold">User Management</h3>
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
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No users found.</td></tr>
                    ) : filteredUsers.map((u) => (
                      <tr key={u._id} className="border-t border-border/50 hover:bg-accent/30 transition">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="h-9 w-9 rounded-full" alt="" />
                            <div>
                              <div className="font-medium">{u.name} {u.isOnline && <span className="inline-block w-2 h-2 rounded-full bg-[var(--success)] ml-1" />}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3"><span className="text-xs glass rounded-full px-2 py-1 uppercase tracking-wider">{u.role}</span></td>
                        <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">
                          <div>{u.ip || "Unknown"}</div>
                          <div className="truncate max-w-[150px]">{u.device || "Unknown"}</div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1">
                            <IconBtn icon={Key} title="Change Password" onClick={() => setPwModal({ open: true, userId: u._id, username: u.username })} />
                            {u.role === "user" && <IconBtn icon={Crown} title="Promote to Admin" onClick={() => handleUpdateUserRole(u._id, "admin")} />}
                            {u.role === "admin" && <IconBtn icon={UserCog} title="Demote to User" onClick={() => handleUpdateUserRole(u._id, "user")} />}
                            {u.status !== "Active"  && <IconBtn icon={Check} title="Activate" onClick={() => handleUpdateUserStatus(u._id, "Active")} />}
                            {u.status !== "Banned"  && <IconBtn icon={Ban}   title="Ban"      onClick={() => handleUpdateUserStatus(u._id, "Banned")} />}
                            <IconBtn icon={Trash2} title="Delete" danger onClick={() => handleDeleteUser(u._id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {(section === "overview" || section === "reports") && (
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold mb-1">Recent Reports</h3>
              <p className="text-xs text-muted-foreground mb-4">Content moderation queue</p>
              <div className="space-y-2">
                {loadingReports ? (
                  <div className="py-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
                ) : reports.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">No reports found.</div>
                ) : reports.map((r, i) => (
                  <div key={r._id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${r.severity === "high" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}>
                      <Flag className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">Target: {r.targetUser?.username || "System"}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.reason} · {new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    {r.status === "Pending" ? (
                      <button onClick={() => handleUpdateReport(r._id, "Reviewed")} className="text-xs px-3 py-1.5 rounded-full glass hover:bg-accent">Review</button>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider bg-accent px-2 py-1 rounded-full">{r.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LOGIN LOGS ── */}
          {(section === "overview" || section === "logs") && (
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold mb-1">Login Logs & Devices</h3>
              <p className="text-xs text-muted-foreground mb-4">Recent sign-ins · IP tracking</p>
              <div className="space-y-2">
                {loadingLogs ? (
                  <div className="py-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
                ) : logs.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">No logs found.</div>
                ) : logs.map((l, i) => (
                  <div key={l._id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${l.suspicious ? "bg-destructive/20 text-destructive" : "bg-accent"}`}>
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{l.user?.email || "Unknown"}</div>
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

          {/* ── SPAM DETECTION ── */}
          {section === "spam" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Spam Detection Rules</h3>
              <div className="space-y-2">
                {[
                  { rule: "Rapid message flooding", status: "Active", desc: ">10 msgs in 30s" },
                  { rule: "Phishing link detection", status: "Active", desc: "URL pattern analysis" },
                  { rule: "Offensive content filter", status: "Active", desc: "NLP keyword matching" },
                  { rule: "Duplicate message spam",   status: "Active", desc: "Hash-based deduplication" },
                  { rule: "Account takeover detection", status: "Active", desc: "IP anomaly detection" },
                ].map((r) => (
                  <div key={r.rule} className="flex items-center justify-between p-3 glass rounded-xl">
                    <div>
                      <div className="text-sm font-medium">{r.rule}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                    <span className="text-[10px] bg-[var(--success)]/20 text-[var(--success)] px-2 py-1 rounded-full uppercase">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── CHANGE PASSWORD MODAL ──────────────────── */}
      {pwModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-border/50">
            <h2 className="font-semibold mb-1">Change Password</h2>
            <p className="text-xs text-muted-foreground mb-4">Set a new password for <span className="font-medium text-foreground">@{pwModal.username}</span></p>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-10 px-4 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={savingPw} className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm font-medium disabled:opacity-60">
                  {savingPw ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save"}
                </button>
                <button type="button" onClick={() => { setPwModal({ open: false, userId: "", username: "" }); setNewPassword(""); }} className="flex-1 h-10 rounded-xl glass text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small reusable components ──────────────────────────────────
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-left font-medium">{children}</th>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active:    "bg-[var(--success)]/20 text-[var(--success)]",
    Suspended: "bg-[var(--neon-2)]/20 text-[var(--neon-2)]",
    Banned:    "bg-destructive/20 text-destructive",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function IconBtn({ icon: Icon, title, onClick, danger = false }: { icon: any; title: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition hover:scale-110 ${danger ? "text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:bg-accent"}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-[var(--neon)] to-[var(--primary)] opacity-80 transition-all duration-300 hover:opacity-100"
            style={{ height: `${Math.max(4, (v / max) * 100)}%` }}
            title={`${v} messages`}
          />
          <span className="text-[9px] text-muted-foreground">{days[i % 7]}</span>
        </div>
      ))}
    </div>
  );
}
