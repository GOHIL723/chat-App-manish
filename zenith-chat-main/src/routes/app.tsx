import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Home, MessageCircle, Users, Phone, Bell, Settings, LogOut, Search, X, Loader2, Shield, LayoutDashboard, User
} from "lucide-react";
import { toast } from "sonner";


export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "MajaniChat" }, { name: "description", content: "Your conversations" }] }),
  component: AppLayout,
});

type NavItem = { to: string; icon: typeof Home; label: string; exact?: boolean };
const navItems: NavItem[] = [
  { to: "/app", icon: Home, label: "Home", exact: true },
  { to: "/app/chats", icon: MessageCircle, label: "Chats" },
  { to: "/app/groups", icon: Users, label: "Groups" },
  { to: "/app/calls", icon: Phone, label: "Calls" },
  { to: "/app/notifications", icon: Bell, label: "Alerts" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

function AppLayout() {
  const path = useRouterState({ select: s => s.location.pathname });
  const isChatRoom = /^\/app\/chats\/.+/.test(path) || /^\/app\/groups\/.+/.test(path);
  const { user, loading, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login" });
    }
  }, [user, loading, nav]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center glass">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--neon)]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative h-screen flex overflow-hidden">
      <div className="pointer-events-none fixed inset-0 gradient-mesh opacity-30 -z-10" />

      {/* Left rail */}
      <aside className="hidden md:flex w-[76px] flex-col items-center py-5 glass border-r border-border/50 z-20">
        <Logo withText={false} />
        <nav className="mt-8 flex-1 flex flex-col gap-2">
          {navItems.map(item => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`group relative h-11 w-11 flex items-center justify-center rounded-xl transition-all ${
                  active ? "bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white glow-primary" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs glass-strong opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
          {(user?.role === "admin" || user?.role === "moderator") && (
            <Link
              to="/admin"
              className="group relative h-11 w-11 flex items-center justify-center rounded-xl transition-all hover:bg-accent/50 text-muted-foreground hover:text-foreground border border-[var(--neon)]/20 hover:border-[var(--neon)]"
            >
              <Shield className="h-5 w-5 text-[var(--neon)]" />
              <span className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs glass-strong opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
                Admin Panel
              </span>
            </Link>
          )}
        </nav>
        <div className="flex flex-col gap-2 items-center">
          <ThemeToggle />
          <button
            onClick={() => { logout(); nav({ to: "/login" }); }}
            className="h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-5 w-5" />
          </button>
          {/* Clickable profile avatar with dropdown */}
          <ProfileDropdown user={user} logout={logout} nav={nav} />
        </div>
      </aside>

      <Outlet />

      {/* Mobile bottom nav */}
      {!isChatRoom && (
        <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-2xl px-2 py-2 flex justify-around">
          {navItems.slice(0, 5).map(item => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to as any} className={`h-10 w-10 rounded-xl flex items-center justify-center transition ${active ? "bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white" : "text-muted-foreground"}`}>
                <item.icon className="h-5 w-5" />
              </Link>
            );
          })}
          {(user?.role === "admin" || user?.role === "moderator") && (
            <Link to="/admin" className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-[var(--neon)] transition">
              <Shield className="h-5 w-5 text-[var(--neon)]" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

// ── Profile avatar dropdown ──────────────────────────────────────────────────
function ProfileDropdown({ user, logout, nav }: { user: any; logout: () => void; nav: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative group focus:outline-none"
        title="Profile options"
      >
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
          alt={user.name}
          className="h-9 w-9 rounded-full ring-2 ring-[var(--neon)] bg-muted group-hover:ring-4 transition-all duration-200"
        />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-background" />
      </button>

      {/* Dropdown popup — appears to the right of the sidebar */}
      {open && (
        <div className="absolute bottom-0 left-full ml-3 z-50 w-64 glass-strong rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in slide-in-from-left-2 fade-in duration-150">
          {/* Profile header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.name}
                  className="h-11 w-11 rounded-full ring-2 ring-[var(--neon)]"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">@{user.username}</div>
              </div>
            </div>
            {/* Role badge */}
            <div className="mt-3">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/20 text-[var(--neon)] border border-[var(--neon)]/30">
                  <Shield className="h-3 w-3" />
                  {user.role === "moderator" ? "Moderator" : "Administrator"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-muted-foreground">
                  User
                </span>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2 space-y-0.5">
            {/* My Profile */}
            <Link
              to="/app/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent/50 transition group"
            >
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-105 transition">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">My Profile</div>
                <div className="text-[10px] text-muted-foreground">View your information</div>
              </div>
            </Link>
            {/* Admin Dashboard — only for admin/moderator */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--neon)] hover:bg-[var(--neon)]/10 transition group"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Admin Dashboard</div>
                  <div className="text-[10px] text-muted-foreground">Manage users & platform</div>
                </div>
              </Link>
            )}

            {/* Settings */}
            <Link
              to="/app/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent/50 transition group"
            >
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-105 transition">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">Settings</div>
                <div className="text-[10px] text-muted-foreground">Profile, privacy & more</div>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-border/50">
            <button
              onClick={() => { logout(); nav({ to: "/login" }); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition group"
            >
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:scale-105 transition">
                <LogOut className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">Sign out</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import axios from "@/lib/api";
import { useSocket } from "../context/SocketContext";

export function ChatListPanel({ active }: { active?: string }) {
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [messageResults, setMessageResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"All" | "Unread">("All");
  const { onlineUsers, socket } = useSocket();
  const { user: currentUser } = useAuth();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Fetch recent chat list (users we've talked to) ────────────────────────
  const fetchRecentChats = useCallback(async () => {
    try {
      const res = await axios.get("/users/chats");
      setRecentChats(res.data);
    } catch (error) {
      console.error("Failed to fetch recent chats", error);
    }
  }, []);

  useEffect(() => {
    fetchRecentChats();
  }, [fetchRecentChats]);

  // ── Request browser notification permission ────────────────────────────────
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ── Debounced server-side search ──────────────────────────────────────────
  useEffect(() => {
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
        const [usersRes, msgsRes] = await Promise.all([
          axios.get(`/users/search?q=${encodeURIComponent(search.trim())}`),
          axios.get(`/messages/search-all?q=${encodeURIComponent(search.trim())}`)
        ]);
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

  // ── Socket: real-time sidebar updates ────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      const senderId = typeof newMessage.senderId === 'object' && newMessage.senderId !== null ? String(newMessage.senderId._id) : String(newMessage.senderId);

      setRecentChats(prev => {
        const existingIdx = prev.findIndex(u => String(u.id) === senderId);
        const isActiveChat = String(active) === senderId;

        if (existingIdx === -1) {
          // New sender not in list yet – re-fetch
          fetchRecentChats();
          return prev;
        }

        const updated = prev.map(u => {
          if (String(u.id) === senderId) {
            return {
              ...u,
              lastMessage: newMessage.messageType === "text"
                ? newMessage.message
                : `Sent a ${newMessage.messageType}`,
              time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              unread: isActiveChat ? 0 : (u.unread || 0) + 1,
            };
          }
          return u;
        });

        // Move sender to top
        const senderEntry = updated.find(u => String(u.id) === senderId);
        const rest = updated.filter(u => String(u.id) !== senderId);
        return senderEntry ? [senderEntry, ...rest] : updated;
      });

      // Browser notification if tab not focused
      const notificationsEnabled = localStorage.getItem("chat_notifications_enabled") !== "false";
      
      if (notificationsEnabled && (document.hidden || String(active) !== senderId)) {
        const sender = recentChats.find(u => String(u.id) === senderId);
        if (sender && "Notification" in window && Notification.permission === "granted") {
          new Notification(`New message from ${sender.name}`, {
            body: newMessage.message || "Sent an attachment",
            icon: sender.avatar,
            tag: senderId,
          });
        }
      }
    };

    const handleMarkedSeen = ({ senderId }: { senderId: string }) => {
      setRecentChats(prev => prev.map(u => u.id === senderId ? { ...u, unread: 0 } : u));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("markedSeen", handleMarkedSeen);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("markedSeen", handleMarkedSeen);
    };
  }, [socket, active, recentChats, fetchRecentChats]);

  // Clear unread when we open a chat
  useEffect(() => {
    if (active) {
      setRecentChats(prev => prev.map(u => u.id === active ? { ...u, unread: 0 } : u));
    }
  }, [active]);

  // ── Filtered display list (when not searching) ────────────────────────────
  const displayChats = activeFilter === "Unread"
    ? recentChats.filter(u => u.unread > 0)
    : recentChats;

  const isSearchMode = search.trim().length > 0;

  return (
    <div className="w-full md:w-[340px] flex-shrink-0 glass border-r border-border/50 flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold">Messages</h2>
          <button className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white flex items-center justify-center text-lg leading-none">+</button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people, messages…"
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {!isSearchMode && (
          <div className="flex gap-2 mt-3 text-xs">
            {(["All", "Unread"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`px-3 py-1.5 rounded-full transition ${activeFilter === t ? "bg-foreground text-background" : "glass hover:bg-accent/50"}`}
              >
                {t}
                {t === "Unread" && recentChats.some(u => u.unread > 0) && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] bg-[var(--neon)] text-white rounded-full">
                    {recentChats.reduce((acc, u) => acc + (u.unread || 0), 0)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* ── Search mode ───────────────────────────────────────────────── */}
        {isSearchMode ? (
          <div>
            {isSearching ? (
              <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching…
              </div>
            ) : (
              <>
                {/* People results */}
                {searchResults.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      People
                    </div>
                    {searchResults.map(u => {
                      const isOnline = onlineUsers.includes(u.id);
                      return (
                        <Link
                          key={u.id}
                          to="/app/chats/$id"
                          params={{ id: u.id }}
                          onClick={() => setSearch("")}
                          className={`flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition border-l-2 ${active === u.id ? "bg-accent/50 border-[var(--neon)]" : "border-transparent"}`}
                        >
                          <div className="relative shrink-0">
                            <img src={u.avatar} alt={u.name} className="h-11 w-11 rounded-full bg-muted" />
                            {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-card" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{u.name}</div>
                            <div className="text-xs text-muted-foreground truncate">@{u.username}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Message results */}
                {messageResults.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Messages
                    </div>
                    {messageResults.map((msg: any) => {
                      const otherId = String(msg.senderId?._id || msg.senderId) === String(currentUser?._id)
                        ? String(msg.receiverId?._id || msg.receiverId)
                        : String(msg.senderId?._id || msg.senderId);
                      const otherUser = msg.senderId?._id ? (
                        String(msg.senderId._id) === String(currentUser?._id) ? msg.receiverId : msg.senderId
                      ) : null;

                      return (
                        <Link
                          key={msg._id}
                          to="/app/chats/$id"
                          params={{ id: otherId }}
                          onClick={() => setSearch("")}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition border-l-2 border-transparent"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username || otherId}`}
                              alt={otherUser?.name || "User"}
                              className="h-11 w-11 rounded-full bg-muted"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate text-sm">{otherUser?.name || "User"}</div>
                            <div className="text-xs text-muted-foreground truncate">{msg.message}</div>
                            <div className="text-[10px] text-muted-foreground/60">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {searchResults.length === 0 && messageResults.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No results found for "<span className="text-foreground">{search}</span>"
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* ── Recent chats list ─────────────────────────────────────── */
          <>
            {displayChats.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {activeFilter === "Unread" ? "No unread messages." : "No chats yet. Search to start one!"}
              </div>
            )}
            {displayChats.map(c => {
              const isOnline = onlineUsers.includes(c.id);
              return (
                <Link
                  key={c.id}
                  to="/app/chats/$id"
                  params={{ id: c.id }}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition border-l-2 ${active === c.id ? "bg-accent/50 border-[var(--neon)]" : "border-transparent"}`}
                >
                  <div className="relative shrink-0">
                    <img src={c.avatar} alt={c.name} className="h-12 w-12 rounded-full bg-muted" />
                    {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-card" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className={`text-xs truncate ${c.typing ? "text-[var(--neon)]" : "text-muted-foreground"}`}>
                        {c.typing ? "typing…" : (c.lastMessage || "Start a conversation")}
                      </span>
                      {c.unread > 0 && (
                        <span className="text-[10px] font-semibold bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
