import { useState } from "react";
import { Users, Crown, X, UserPlus, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Props {
  group: any;
  currentUser: any;
  onlineUsers: string[];
  onUpdated: (g: any) => void;
  allUsers: any[];
}

export function GroupMembersPanel({ group, currentUser, onlineUsers, onUpdated, allUsers }: Props) {
  const [adding, setAdding] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const isAdmin = group?.admin?._id === currentUser?._id || group?.admin === currentUser?._id;

  const nonMembers = allUsers.filter(u => !group?.members?.some((m: any) => (m._id || m) === u.id));

  const handleAddMembers = async () => {
    if (!selectedToAdd.length) return;
    setLoading(true);
    try {
      const res = await axios.post(`/groups/${group._id}/members`, { memberIds: selectedToAdd });
      onUpdated(res.data);
      setAdding(false);
      setSelectedToAdd([]);
      toast.success("Members added");
    } catch { toast.error("Failed to add members"); }
    finally { setLoading(false); }
  };

  const handleRemove = async (userId: string) => {
    try {
      const res = await axios.delete(`/groups/${group._id}/members/${userId}`);
      onUpdated(res.data);
      toast.success("Member removed");
    } catch { toast.error("Failed to remove member"); }
  };

  return (
    <div className="p-5 border-t border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> Members ({group?.members?.length || 0})
        </div>
        {isAdmin && (
          <button onClick={() => setAdding(v => !v)} className="text-xs text-[var(--neon)] hover:underline flex items-center gap-1">
            <UserPlus className="h-3 w-3" /> Add
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-3 glass rounded-xl p-3">
          <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin">
            {nonMembers.length === 0 && <div className="text-xs text-muted-foreground text-center py-2">All users are members</div>}
            {nonMembers.map(u => (
              <label key={u.id} className="flex items-center gap-2 cursor-pointer hover:bg-accent/30 rounded-lg p-1.5 text-sm">
                <input type="checkbox" checked={selectedToAdd.includes(u.id)}
                  onChange={e => setSelectedToAdd(p => e.target.checked ? [...p, u.id] : p.filter(id => id !== u.id))}
                  className="accent-[var(--neon)]" />
                <img src={u.avatar} className="h-7 w-7 rounded-full" alt="" />
                <span className="truncate">{u.name}</span>
              </label>
            ))}
          </div>
          <button onClick={handleAddMembers} disabled={loading || !selectedToAdd.length}
            className="mt-2 w-full h-8 rounded-lg bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-xs disabled:opacity-40 flex items-center justify-center gap-1">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add Selected"}
          </button>
        </div>
      )}

      <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin">
        {group?.members?.map((m: any) => {
          const id = m._id || m;
          const isOnline = onlineUsers.includes(id);
          const memberIsAdmin = (group.admin?._id || group.admin) === id;
          return (
            <div key={id} className="flex items-center gap-2.5 py-1.5 px-1 rounded-lg hover:bg-accent/30 group/member">
              <div className="relative shrink-0">
                <img src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username || id}`} className="h-8 w-8 rounded-full" alt="" />
                {isOnline && <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[var(--success)] ring-1 ring-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate flex items-center gap-1">
                  {m.name || id}
                  {memberIsAdmin && <Crown className="h-3 w-3 text-yellow-400 shrink-0" />}
                </div>
              </div>
              {isAdmin && !memberIsAdmin && id !== currentUser?._id && (
                <button onClick={() => handleRemove(id)}
                  className="opacity-0 group-hover/member:opacity-100 h-6 w-6 rounded-full hover:bg-destructive/20 text-destructive flex items-center justify-center transition">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
