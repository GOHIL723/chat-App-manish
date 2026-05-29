import { createFileRoute } from "@tanstack/react-router";
import { Bell, MessageCircle, Users, Phone, AtSign } from "lucide-react";

export const Route = createFileRoute("/app/notifications")({
  component: NotificationsPage,
});

const items = [
  { icon: MessageCircle, title: "Aurora Lin sent you a message", body: "Just sent the design files ✨", time: "2m", color: "from-[var(--neon)] to-[var(--primary)]" },
  { icon: AtSign, title: "Mira mentioned you in Design Crew", body: "@you can you check the latest export?", time: "12m", color: "from-[var(--neon-2)] to-[var(--neon)]" },
  { icon: Phone, title: "Missed call from Kai", body: "Tap to call back", time: "1h", color: "from-destructive to-[var(--neon)]" },
  { icon: Users, title: "Theo joined Engineering", body: "Welcome to the team!", time: "3h", color: "from-[var(--primary)] to-[var(--neon-2)]" },
];

function NotificationsPage() {
  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3"><Bell className="h-7 w-7" /> Notifications</h1>
          <button className="text-sm text-[var(--neon)] hover:underline">Mark all read</button>
        </div>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="glass rounded-2xl p-4 flex items-start gap-4 hover:glow-neon transition">
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${it.color} text-white flex items-center justify-center shrink-0`}>
                <it.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{it.body}</div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{it.time}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
