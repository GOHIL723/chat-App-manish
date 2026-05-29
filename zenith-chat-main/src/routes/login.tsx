import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, GoogleButton, PrimaryButton } from "@/components/auth-shell";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
  head: () => ({ meta: [{ title: "Sign in — NebulaChat" }, { name: "description", content: "Sign in to NebulaChat" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const search = Route.useSearch();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      nav({ to: "/app" });
    }
  }, [user, loading, nav]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setFormErrors({});
      await login(username, password);
      const targetPath = search.redirect || "/app";
      nav({ to: targetPath as any });
    } catch (error: any) {
      const msg = error.response?.data?.error || "Login failed. Please try again.";
      if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("username") || msg.toLowerCase().includes("invalid")) {
        setFormErrors({ password: msg });
      } else if (msg.toLowerCase().includes("banned") || msg.toLowerCase().includes("suspended")) {
        setFormErrors({ _general: msg });
      } else {
        setFormErrors({ _general: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={<>New here? <Link to="/signup" className="text-foreground font-medium hover:text-[var(--neon)]">Create account</Link></>}
    >
      <GoogleButton />
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        {formErrors._general && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
            {formErrors._general}
          </div>
        )}
        <Field 
          label="Username" 
          type="text" 
          placeholder="your_username" 
          required 
          value={username}
          onChange={(e: any) => { setUsername(e.target.value); setFormErrors({}); }}
          error={formErrors.username}
        />
        <Field 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          required 
          value={password}
          onChange={(e: any) => { setPassword(e.target.value); setFormErrors({}); }}
          error={formErrors.password}
        />
        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="h-3.5 w-3.5 rounded accent-[var(--neon)]" /> Remember me
          </label>
          <Link to="/forgot" className="text-[var(--neon)] hover:underline">Forgot password?</Link>
        </div>
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
