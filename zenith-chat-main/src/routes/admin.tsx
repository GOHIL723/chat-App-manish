import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, FormEvent } from "react";
import { Shield, Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Login · MajaniChat" },
      { name: "description", content: "Secure admin login for MajaniChat" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { adminLogin, isAdminAuthenticated, adminLoading } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If already authenticated as admin, redirect to dashboard
  useEffect(() => {
    if (!adminLoading && isAdminAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAdminAuthenticated, adminLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(email.trim(), password);
      navigate({ to: "/admin/dashboard" });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking session
  if (adminLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--neon)]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated mesh background */}
      <div className="pointer-events-none fixed inset-0 gradient-mesh opacity-40 -z-10" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_60%)]" />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <Logo />
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md px-4">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] shadow-lg mx-auto mb-4 glow-primary">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Restricted area — authorised personnel only
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  disabled={isSubmitting}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  disabled={isSubmitting}
                  className="w-full h-11 pl-10 pr-12 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 text-sm transition disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 glow-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Sign in to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 flex items-center gap-2 text-center justify-center">
            <div className="h-px flex-1 bg-border/50" />
            <p className="text-[11px] text-muted-foreground/70 px-2">
              🔒 Secured with JWT · Admin role required
            </p>
            <div className="h-px flex-1 bg-border/50" />
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center mt-4 text-xs text-muted-foreground">
          <a href="/" className="hover:text-foreground transition underline underline-offset-4">
            ← Back to MajaniChat
          </a>
        </p>
      </div>
    </div>
  );
}
