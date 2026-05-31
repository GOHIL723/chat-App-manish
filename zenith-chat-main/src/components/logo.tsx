import { Link } from "@tanstack/react-router";

export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
        <img
          src="/logo.jpg"
          alt="MajaniChat Logo"
          className="h-full w-full object-cover"
        />
      </div>
      {withText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Majani<span className="text-gradient">Chat</span>
        </span>
      )}
    </Link>
  );
}

