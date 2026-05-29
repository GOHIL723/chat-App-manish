import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  onClose: () => void;
  allUsers: any[];
}

export function CreateGroupModal({ onClose, allUsers }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const toggle = (id: string) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Group name is required");
    setLoading(true);
    try {
      const res = await axios.post("/groups", { name: name.trim(), description, members: selected });
      toast.success("Group created!");
      onClose();
      nav({ to: "/app/groups/$id", params: { id: res.data._id } });
    } catch (e: any) { toast.error(e.response?.data?.error || "Failed to create group"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Plus className="h-5 w-5 text-[var(--neon)]" /> New Group
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-3 mb-4">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Group name *"
            className="w-full h-10 px-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" rows={2}
            className="w-full px-3 py-2 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm resize-none" />
        </div>

        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Add Members</div>
        <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-1 mb-4">
          {allUsers.map(u => (
            <label key={u.id} className="flex items-center gap-3 cursor-pointer hover:bg-accent/30 rounded-xl p-2 transition">
              <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} className="accent-[var(--neon)]" />
              <img src={u.avatar} className="h-8 w-8 rounded-full" alt="" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{u.name}</div>
                <div className="text-xs text-muted-foreground">@{u.username}</div>
              </div>
            </label>
          ))}
        </div>

        <button onClick={handleCreate} disabled={loading || !name.trim()}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white font-medium disabled:opacity-40 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Create Group</>}
        </button>
      </div>
    </div>
  );
}
