import { useState } from "react";
import { X, Settings, LogOut, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  group: any;
  currentUser: any;
  onClose: () => void;
  onUpdated: (g: any) => void;
}

export function GroupSettingsModal({ group, currentUser, onClose, onUpdated }: Props) {
  const [name, setName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");
  const [isPrivate, setIsPrivate] = useState<boolean>(group?.isPrivate ?? true);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const isAdmin = (group?.admin?._id || group?.admin) === currentUser?._id;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`/groups/${group._id}`, { name, description, isPrivate });
      onUpdated(res.data);
      toast.success("Group updated");
      onClose();
    } catch { toast.error("Failed to update group"); }
    finally { setLoading(false); }
  };

  const handleLeave = async () => {
    if (!confirm("Leave this group?")) return;
    try {
      await axios.post(`/groups/${group._id}/leave`);
      toast.success("Left group");
      nav({ to: "/app/groups" });
    } catch (e: any) { toast.error(e.response?.data?.error || "Failed to leave"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Settings className="h-5 w-5 text-[var(--neon)]" /> Group Settings
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        {isAdmin ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Group Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm resize-none" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-10 h-6 rounded-full transition ${isPrivate ? "bg-[var(--neon)]" : "bg-muted"}`}
                onClick={() => setIsPrivate(v => !v)}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPrivate ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <span className="text-sm">Private group</span>
            </label>
            <button onClick={handleSave} disabled={loading || !name.trim()}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm disabled:opacity-40 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Only the group admin can edit settings.</p>
        )}

        <button onClick={handleLeave}
          className="mt-3 w-full h-10 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 text-sm flex items-center justify-center gap-2 transition">
          <LogOut className="h-4 w-4" /> Leave Group
        </button>
      </div>
    </div>
  );
}
