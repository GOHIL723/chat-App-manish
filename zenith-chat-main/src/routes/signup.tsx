import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, GoogleButton, PrimaryButton } from "@/components/auth-shell";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — NebulaChat" }, { name: "description", content: "Join NebulaChat" }] }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const { signup, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      nav({ to: "/app" });
    }
  }, [user, loading, nav]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any, field: string) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setFormErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signup({
        name: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      nav({ to: "/app" });
    } catch (error: any) {
      const msg = error.response?.data?.error || "";
      const newErrors: any = {};
      if (msg.includes("Username")) newErrors.username = msg;
      else if (msg.includes("Email")) newErrors.email = msg;
      else if (msg.includes("Password must")) newErrors.password = msg;
      else if (msg.includes("Passwords don't")) newErrors.confirmPassword = msg;
      setFormErrors(newErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start chatting in under 30 seconds."
      footer={<>Already have one? <Link to="/login" className="text-foreground font-medium hover:text-[var(--neon)]">Sign in</Link></>}
    >
      <GoogleButton />
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field 
            label="First name" 
            placeholder="Aurora" 
            required 
            value={formData.firstName}
            onChange={(e: any) => handleChange(e, 'firstName')}
          />
          <Field 
            label="Last name" 
            placeholder="Lin" 
            required 
            value={formData.lastName}
            onChange={(e: any) => handleChange(e, 'lastName')}
          />
        </div>
        <Field 
          label="Username" 
          placeholder="aurora_lin" 
          required 
          value={formData.username}
          onChange={(e: any) => handleChange(e, 'username')}
          error={formErrors.username}
        />
        <Field 
          label="Email" 
          type="email" 
          placeholder="you@example.com" 
          required 
          value={formData.email}
          onChange={(e: any) => handleChange(e, 'email')}
          error={formErrors.email}
        />
        <Field 
          label="Password" 
          type="password" 
          placeholder="At least 6 characters" 
          required 
          value={formData.password}
          onChange={(e: any) => handleChange(e, 'password')}
          error={formErrors.password}
        />
        <Field 
          label="Confirm Password" 
          type="password" 
          placeholder="Confirm your password" 
          required 
          value={formData.confirmPassword}
          onChange={(e: any) => handleChange(e, 'confirmPassword')}
          error={formErrors.confirmPassword}
        />
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
