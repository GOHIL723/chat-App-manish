import { createFileRoute } from "@tanstack/react-router";
import { User, Bell, Lock, Palette, Globe, Smartphone, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const sections = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "privacy", icon: Lock, label: "Privacy & Security" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "language", icon: Globe, label: "Language & Region" },
  { id: "devices", icon: Smartphone, label: "Devices" },
];

function SettingsPage() {
  const [active, setActive] = useState("profile");
  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize your NebulaChat experience.</p>

        <div className="mt-8 grid md:grid-cols-[260px_1fr] gap-6">
          <nav className="glass rounded-2xl p-2 h-fit">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active === s.id ? "bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/20 text-foreground" : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                <s.icon className="h-4 w-4" /> {s.label}
                <ChevronRight className="h-3.5 w-3.5 ml-auto" />
              </button>
            ))}
          </nav>

          <div className="glass-strong rounded-2xl p-6 md:p-8">
            {active === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Profile</h2>
                <div className="flex items-center gap-5">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=me" className="h-20 w-20 rounded-2xl ring-4 ring-[var(--neon)]/30" alt="" />
                  <div>
                    <button className="inline-flex h-9 items-center px-4 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm">Change photo</button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG, max 5MB</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Display name" defaultValue="Alex Rivera" />
                  <Field label="Username" defaultValue="@alex" />
                  <Field label="Email" defaultValue="alex@nebula.chat" />
                  <Field label="Phone" defaultValue="+1 (555) 010-2024" />
                </div>
                <Field label="Bio" defaultValue="Building the future of conversations · he/him" multiline />
                <div className="flex gap-3">
                  <button className="h-10 px-5 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm">Save changes</button>
                  <button className="h-10 px-5 rounded-xl glass text-sm">Cancel</button>
                </div>
              </div>
            )}
            {active === "notifications" && <ToggleList items={["Direct messages", "Group mentions", "Calls", "Reactions", "Marketing emails"]} />}
            {active === "privacy" && <ToggleList items={["Read receipts", "Typing indicators", "Last seen", "Two-factor auth", "End-to-end encryption"]} />}
            {active === "appearance" && <Appearance />}
            {active === "language" && <div className="space-y-4"><Field label="Language" defaultValue="English (US)" /><Field label="Time zone" defaultValue="GMT-08:00 Pacific" /></div>}
            {active === "devices" && <Devices />}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, defaultValue, multiline }: { label: string; defaultValue?: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea defaultValue={defaultValue} rows={3} className="mt-1.5 w-full px-4 py-2.5 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 transition text-sm" />
      ) : (
        <input defaultValue={defaultValue} className="mt-1.5 w-full h-10 px-4 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 transition text-sm" />
      )}
    </label>
  );
}

function ToggleList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((label, i) => (
        <div key={label} className="flex items-center justify-between p-4 glass rounded-xl">
          <div>
            <div className="font-medium text-sm">{label}</div>
            <div className="text-xs text-muted-foreground">Manage {label.toLowerCase()} preference</div>
          </div>
          <Toggle defaultOn={i % 2 === 0} />
        </div>
      ))}
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button onClick={() => setOn(o => !o)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-to-r from-[var(--neon)] to-[var(--primary)]" : "bg-muted"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Appearance() {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-sm font-semibold mb-3">Theme accent</div>
        <div className="flex gap-3">
          {["from-purple-500 to-fuchsia-500", "from-cyan-500 to-blue-500", "from-emerald-500 to-teal-500", "from-orange-500 to-pink-500", "from-rose-500 to-red-500"].map((g, i) => (
            <button key={i} className={`h-10 w-10 rounded-full bg-gradient-to-br ${g} ring-2 ring-transparent hover:ring-foreground transition`} />
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold mb-3">Chat density</div>
        <div className="flex gap-2">
          {["Comfortable", "Cozy", "Compact"].map((d, i) => (
            <button key={d} className={`px-4 h-9 rounded-full text-sm ${i === 0 ? "bg-foreground text-background" : "glass"}`}>{d}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Devices() {
  const devs = [
    { name: "MacBook Pro 16″", loc: "San Francisco, US", last: "Active now", current: true },
    { name: "iPhone 16 Pro", loc: "San Francisco, US", last: "2h ago" },
    { name: "iPad Air", loc: "Lisbon, PT", last: "3d ago" },
  ];
  return (
    <div className="space-y-3">
      {devs.map((d, i) => (
        <div key={i} className="flex items-center gap-4 p-4 glass rounded-xl">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center"><Smartphone className="h-4 w-4" /></div>
          <div className="flex-1">
            <div className="font-medium text-sm flex items-center gap-2">{d.name} {d.current && <span className="text-[10px] bg-[var(--success)]/20 text-[var(--success)] px-2 py-0.5 rounded-full">Current</span>}</div>
            <div className="text-xs text-muted-foreground">{d.loc} · {d.last}</div>
          </div>
          {!d.current && <button className="text-xs text-destructive hover:underline">Sign out</button>}
        </div>
      ))}
    </div>
  );
}
