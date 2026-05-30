import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Camera, Shield, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-8 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <header className="flex items-center gap-4 mb-8">
          <Link to="/app" className="h-10 w-10 rounded-xl glass hover:glow-neon flex items-center justify-center transition text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your personal information</p>
          </div>
        </header>

        <div className="glass-strong rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--neon)]/10 to-[var(--primary)]/10 blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            <div className="relative group/avatar">
              <img 
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                alt={user.name} 
                className="w-32 h-32 rounded-full ring-4 ring-[var(--neon)]/20 group-hover/avatar:ring-[var(--neon)]/50 transition-all duration-300" 
              />
              <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[var(--neon)] text-white flex items-center justify-center hover:scale-110 shadow-lg shadow-[var(--neon)]/30 transition-transform">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 w-full text-center md:text-left">
              <div>
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <div className="text-[var(--neon)] font-medium mt-1">@{user.username}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-2xl flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Full Name</div>
                    <div className="font-medium text-sm">{user.name}</div>
                  </div>
                </div>

                <div className="glass p-4 rounded-2xl flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Email Address</div>
                    <div className="font-medium text-sm">{user.email}</div>
                  </div>
                </div>
                
                <div className="glass p-4 rounded-2xl flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-muted-foreground">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Account Role</div>
                    <div className="font-medium text-sm capitalize">{user.role || 'User'}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8 mt-6 text-center text-muted-foreground text-sm">
          Settings page controls additional preferences like themes, notifications, and privacy.
          <div className="mt-4">
            <Link to="/app/settings" className="inline-block px-6 py-2.5 rounded-full bg-[var(--neon)]/10 text-[var(--neon)] hover:bg-[var(--neon)]/20 transition font-medium">
              Go to Settings
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
