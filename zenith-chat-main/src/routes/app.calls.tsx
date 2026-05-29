import { createFileRoute } from "@tanstack/react-router";
import { Phone, Video, PhoneIncoming, PhoneMissed, PhoneOutgoing, MicOff, Mic, VideoOff, ScreenShare, PhoneOff } from "lucide-react";
import { chats } from "@/lib/mock-data";

export const Route = createFileRoute("/app/calls")({
  component: CallsPage,
});

const history = [
  { name: "Aurora Lin", type: "incoming", time: "Today, 10:04", duration: "12m", missed: false },
  { name: "Design Crew", type: "outgoing", time: "Yesterday, 17:30", duration: "48m", missed: false, group: true },
  { name: "Kai Nakamura", type: "missed", time: "Yesterday, 09:12", duration: "—", missed: true },
  { name: "Sienna Park", type: "outgoing", time: "Mon, 14:22", duration: "8m", missed: false },
];

function CallsPage() {
  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold">Calls</h1>
        <p className="text-muted-foreground mt-1">Voice and video conversations.</p>

        {/* Active call mockup */}
        <div className="mt-8 relative rounded-3xl overflow-hidden glass-strong">
          <div className="absolute inset-0 gradient-mesh opacity-60" />
          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-[var(--neon)] uppercase tracking-wider font-semibold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--neon)] animate-pulse" /> Live · 12:34
                </div>
                <h2 className="text-xl font-bold mt-1">Design Crew · Weekly sync</h2>
              </div>
              <div className="hidden md:flex -space-x-2">
                {chats.slice(0, 4).map(c => (
                  <img key={c.id} src={c.avatar} className="h-8 w-8 rounded-full ring-2 ring-card" alt="" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {chats.slice(0, 6).map((c, i) => (
                <div key={c.id} className="aspect-video rounded-2xl bg-card overflow-hidden relative ring-1 ring-border">
                  <div className={`absolute inset-0 bg-gradient-to-br ${i % 2 === 0 ? "from-[var(--neon)]/30 to-[var(--primary)]/30" : "from-[var(--neon-2)]/30 to-[var(--primary)]/30"}`} />
                  <img src={c.avatar} className="absolute inset-0 m-auto h-16 w-16 rounded-full ring-4 ring-card/40" alt={c.name} />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                    <span className="glass-strong px-2 py-1 rounded-md">{c.name}</span>
                    {i === 0 && (
                      <div className="glass-strong rounded-md p-1.5 flex items-end gap-0.5 h-7">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span key={j} className="w-0.5 bg-[var(--neon)] rounded-full animate-wave" style={{ height: `${30 + j * 12}%`, animationDelay: `${j * 0.1}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <div className="glass-strong rounded-full p-2 flex items-center gap-2">
                <CallBtn icon={Mic} />
                <CallBtn icon={Video} />
                <CallBtn icon={ScreenShare} />
                <CallBtn icon={MicOff} muted />
                <CallBtn icon={VideoOff} muted />
                <button className="h-12 w-12 rounded-full bg-destructive text-white flex items-center justify-center hover:scale-105 transition">
                  <PhoneOff className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-semibold mb-3">Recent</h2>
          <div className="glass rounded-2xl divide-y divide-border/50 overflow-hidden">
            {history.map((h, i) => {
              const Icon = h.missed ? PhoneMissed : h.type === "incoming" ? PhoneIncoming : PhoneOutgoing;
              return (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-accent/50 transition">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${h.name}`} className="h-11 w-11 rounded-full" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{h.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Icon className={`h-3 w-3 ${h.missed ? "text-destructive" : ""}`} /> {h.time} · {h.duration}
                    </div>
                  </div>
                  <button className="h-9 w-9 rounded-full glass hover:glow-neon transition flex items-center justify-center"><Phone className="h-4 w-4" /></button>
                  <button className="h-9 w-9 rounded-full glass hover:glow-neon transition flex items-center justify-center"><Video className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function CallBtn({ icon: Icon, muted }: { icon: typeof Mic; muted?: boolean }) {
  return (
    <button className={`h-12 w-12 rounded-full flex items-center justify-center transition hover:scale-105 ${muted ? "bg-destructive/20 text-destructive" : "glass text-foreground"}`}>
      <Icon className="h-5 w-5" />
    </button>
  );
}
