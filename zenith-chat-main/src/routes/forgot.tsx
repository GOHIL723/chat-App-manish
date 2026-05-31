import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field, PrimaryButton } from "@/components/auth-shell";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "Reset password — MajaniChat" }, { name: "description", content: "Reset your password" }] }),
  component: Forgot,
});

function Forgot() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your email and we'll send a recovery link."
      footer={<><Link to="/login" className="text-[var(--neon)] hover:underline">Back to sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <Field label="Email" type="email" placeholder="you@example.com" required />
        <PrimaryButton type="submit">Send recovery link</PrimaryButton>
      </form>
    </AuthShell>
  );
}
