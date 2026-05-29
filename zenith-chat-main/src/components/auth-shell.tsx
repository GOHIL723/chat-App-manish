import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Eye, EyeOff } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 gradient-mesh opacity-60 -z-10" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent,var(--color-background)_70%)]" />
      <div className="absolute top-6 left-6"><Logo /></div>
      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7 space-y-4">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our <Link to="/" className="underline">Terms</Link> & <Link to="/" className="underline">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}

export function Field({ label, type, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative mt-1.5">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...props}
          className={`w-full h-11 px-4 pr-10 rounded-xl bg-input/50 border focus:outline-none focus:ring-2 transition placeholder:text-muted-foreground/60 ${
            error ? "border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/30" : "border-border focus:border-[var(--neon)] focus:ring-[var(--neon)]/30"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-[10px] text-[var(--destructive)] mt-1.5 block font-medium">{error}</span>}
    </label>
  );
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full h-11 rounded-xl bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white font-medium glow-primary hover:scale-[1.01] active:scale-[0.99] transition"
    >
      {children}
    </button>
  );
}

export function GoogleButton() {
  return (
    <button className="w-full h-11 rounded-xl glass hover:bg-accent/50 transition flex items-center justify-center gap-2.5 text-sm font-medium">
      <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.3 14.5l-.8 3-3 .1A11 11 0 011 12c0-1.8.4-3.5 1.2-5l2.7.5 1.2 2.7a6.6 6.6 0 00-.8 3.3c0 .4.2.8.3 1.2z"/><path fill="#FBBC05" d="M22.6 9.8a11 11 0 010 4.5l-3.4-.3a6.6 6.6 0 000-3.9z"/><path fill="#34A853" d="M21.4 18.4a11 11 0 01-9.4 5.1 11 11 0 01-9.5-5.4l3.7-3a6.6 6.6 0 005.8 3.6c1.5 0 2.8-.4 3.9-1.1z"/><path fill="#4285F4" d="M21.6 18.6L18 15.7a6.6 6.6 0 002.8-2.7l3.4.3a11 11 0 01-2.6 5.3z"/><path fill="#4285F4" d="M22.6 9.8h-10.6v4.5h6.1a5.2 5.2 0 01-2.3 3.4l3.6 2.9a11 11 0 003.2-10.8z"/></svg>
      Continue with Google
    </button>
  );
}
