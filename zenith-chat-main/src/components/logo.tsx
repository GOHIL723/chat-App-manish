import { Link } from "@tanstack/react-router";

export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
        <img src="/logo.jpg" alt="MajaniChat Logo" className="h-full w-full object-cover" />
        <div className="absolute inset-0 rounded-xl blur-md opacity-60 bg-gradient-to-br from-[var(--neon)] to-[var(--neon-2)] -z-10" />
      </div>
      {withText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Majani<span className="text-gradient">Chat</span>
        </span>
      )}
    </Link>
  );
}
