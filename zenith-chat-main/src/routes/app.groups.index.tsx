import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Plus, Hash, Lock, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { CreateGroupModal } from "../components/CreateGroupModal";

export const Route = createFileRoute("/app/groups/")({
  component: GroupsPage,
});

function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { onlineUsers, socket } = useSocket();

  const fetchGroups = async () => {
    try {
      const res = await axios.get("/groups");
      setGroups(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchGroups();
    axios.get("/users").then(r => setAllUsers(r.data)).catch(() => {});
  }, []);

  // Real-time: refresh groups list when a group is created/updated
  useEffect(() => {
    if (!socket) return;
    const onCreated = () => fetchGroups();
    const onUpdated = () => fetchGroups();
    socket.on("groupCreated", onCreated);
    socket.on("groupUpdated", onUpdated);
    return () => { socket.off("groupCreated", onCreated); socket.off("groupUpdated", onUpdated); };
  }, [socket]);

  const featuredGroup = groups[0];

  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin">
      {showCreate && <CreateGroupModal onClose={() => { setShowCreate(false); fetchGroups(); }} allUsers={allUsers} />}

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <p className="text-muted-foreground mt-1">Spaces for teams, friends, and communities.</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm glow-primary hover:scale-105 transition">
            <Plus className="h-4 w-4" /> New Group
          </button>
        </div>

        {/* Featured banner */}
        {featuredGroup && (
          <div className="relative rounded-3xl overflow-hidden glass-strong p-8 md:p-10 mb-8">
            <div className="absolute inset-0 gradient-mesh opacity-50" />
            <div className="relative flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div>
                <div className="text-xs text-[var(--neon)] uppercase tracking-wider font-semibold">Your latest group</div>
                <h2 className="text-3xl font-bold mt-2">{featuredGroup.name}</h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                  {featuredGroup.description || "A group chat space."} · {featuredGroup.members?.length || 0} members ·{" "}
                  {featuredGroup.members?.filter((m: any) => onlineUsers.includes(m._id || m)).length || 0} online
                </p>
                <div className="flex -space-x-2 mt-4">
                  {featuredGroup.members?.slice(0, 5).map((m: any) => (
                    <img key={m._id || m} src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                      className="h-9 w-9 rounded-full ring-2 ring-card" alt="" />
                  ))}
                  {(featuredGroup.members?.length || 0) > 5 && (
                    <div className="h-9 w-9 rounded-full glass ring-2 ring-card flex items-center justify-center text-xs">
                      +{featuredGroup.members.length - 5}
                    </div>
                  )}
                </div>
              </div>
              <Link to="/app/groups/$id" params={{ id: featuredGroup._id }}
                className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-foreground text-background text-sm hover:scale-105 transition">
                <Users className="h-4 w-4" /> Open Group
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--neon)]" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No groups yet</p>
            <p className="text-sm mt-1">Create your first group to get started!</p>
            <button onClick={() => setShowCreate(true)}
              className="mt-5 inline-flex h-11 items-center gap-2 px-6 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm">
              <Plus className="h-4 w-4" /> Create Group
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(g => {
              const onlineCount = g.members?.filter((m: any) => onlineUsers.includes(m._id || m)).length || 0;
              return (
                <Link key={g._id} to="/app/groups/$id" params={{ id: g._id }}
                  className="glass rounded-2xl p-5 hover:glow-neon transition group block">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[var(--neon)]/40 to-[var(--neon-2)]/40 flex items-center justify-center font-bold text-lg text-white shrink-0">
                      {g.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{g.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{g.lastMessage || g.description || "No messages yet"}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {g.members?.length || 0}</span>
                    <span className="inline-flex items-center gap-1">
                      {g.isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                      {g.isPrivate ? "Private" : "Public"}
                    </span>
                    {onlineCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[var(--success)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> {onlineCount} online
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
