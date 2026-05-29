import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, PrimaryButton } from "@/components/auth-shell";
import { FormEvent, useRef, useState } from "react";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify — NebulaChat" }, { name: "description", content: "Verify your account" }] }),
  component: Verify,
});

function Verify() {
  const nav = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const submit = (e: FormEvent) => { e.preventDefault(); nav({ to: "/app" }); };
  return (
    <AuthShell
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox."
      footer={<><Link to="/login" className="text-[var(--neon)] hover:underline">Use a different email</Link></>}
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="flex justify-between gap-2">
          {code.map((c, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              value={c}
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                const next = [...code]; next[i] = v; setCode(next);
                if (v && i < 5) refs.current[i + 1]?.focus();
              }}
              className="h-14 w-12 text-center text-xl font-semibold rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/30 focus:outline-none transition"
            />
          ))}
        </div>
        <PrimaryButton type="submit">Verify & continue</PrimaryButton>
        <p className="text-center text-xs text-muted-foreground">
          Didn't receive it? <button type="button" className="text-[var(--neon)] hover:underline">Resend code</button>
        </p>
      </form>
    </AuthShell>
  );
}
