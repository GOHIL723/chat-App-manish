import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
        <MessageCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-xl blur-md opacity-60 bg-gradient-to-br from-[var(--neon)] to-[var(--neon-2)] -z-10" />
      </div>
      {withText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Nebula<span className="text-gradient">Chat</span>
        </span>
      )}
    </Link>
  );
}
