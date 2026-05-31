import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ArrowRight, MessageSquare, Phone, Video, Shield, Zap, Users, Sparkles,
  Lock, Globe, ChevronRight, Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MajaniChat — Real-time chat, reimagined" },
      { name: "description", content: "A premium real-time messaging platform with voice, video, and group collaboration." },
      { property: "og:title", content: "MajaniChat — Real-time chat, reimagined" },
      { property: "og:description", content: "A premium real-time messaging platform with voice, video, and group collaboration." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* animated mesh background */}
      <div className="pointer-events-none fixed inset-0 gradient-mesh opacity-60 -z-10" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,transparent,var(--color-background)_70%)]" />

      {/* Nav */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
            <Logo />
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition">Features</a>
              <a href="#showcase" className="hover:text-foreground transition">Showcase</a>
              <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
              <Link to="/admin" className="hover:text-foreground transition">Admin</Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {!user ? (
                <>
                  <Link to="/login" className="hidden sm:inline-flex h-9 items-center px-4 rounded-full text-sm hover:bg-accent transition">
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex h-9 items-center gap-1.5 px-4 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white glow-primary hover:scale-[1.02] transition-transform"
                  >
                    Launch app <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/app"
                  className="inline-flex h-9 items-center gap-1.5 px-4 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white glow-primary hover:scale-[1.02] transition-transform"
                >
                  Go to App <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-[var(--neon)]" />
          Now with AI-powered smart replies
          <ChevronRight className="h-3 w-3" />
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05] animate-slide-up">
          The future of <span className="text-gradient">real-time</span><br />
          conversation is here.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
          MajaniChat blends crystal-clear voice & video, secure group spaces, and a
          beautifully crafted interface that feels alive.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 animate-slide-up">
          {!user ? (
            <>
              <Link
                to="/signup"
                className="group inline-flex h-12 items-center gap-2 px-6 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary animate-pulse-glow"
              >
                Get started free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                to="/app"
                className="inline-flex h-12 items-center gap-2 px-6 rounded-full text-sm font-medium glass hover:glow-neon transition"
              >
                See it live
              </Link>
            </>
          ) : (
            <Link
              to="/app"
              className="group inline-flex h-12 items-center gap-2 px-8 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary animate-pulse-glow"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
          )}
        </div>

        {/* Hero preview card */}
        <div className="relative mt-20 mx-auto max-w-5xl animate-slide-up">
          <div className="absolute -inset-4 bg-gradient-to-r from-[var(--neon)]/20 via-[var(--primary)]/20 to-[var(--neon-2)]/20 blur-3xl -z-10" />
          <div className="glass-strong rounded-3xl p-2 shadow-2xl">
            <div className="rounded-2xl bg-card/80 overflow-hidden grid grid-cols-12 min-h-[420px]">
              <div className="col-span-3 border-r border-border/50 p-4 hidden md:block">
                <div className="space-y-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--neon)]/40 to-[var(--neon-2)]/40" />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="h-2.5 w-20 rounded bg-foreground/20 mb-1.5" />
                        <div className="h-2 w-28 rounded bg-foreground/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 md:col-span-9 p-6 flex flex-col justify-end gap-3 text-left">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--primary)]" />
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-md">
                    <p className="text-sm">Hey! Loving how smooth the new chat feels ✨</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-md bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white">
                    <p className="text-sm">Right? The animations are buttery 🧈</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--primary)]" />
                  <div className="glass rounded-full px-4 py-2 inline-flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-typing" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold">Everything you need.<br />Nothing you don't.</h2>
          <p className="mt-4 text-muted-foreground">Designed for teams, friends, and creators who care about how it feels.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: MessageSquare, title: "Real-time messaging", desc: "Instant delivery with seen, typing, and reactions." },
            { icon: Phone, title: "Crystal voice calls", desc: "HD audio with noise suppression built in." },
            { icon: Video, title: "Group video", desc: "Up to 50 people with screen sharing." },
            { icon: Shield, title: "End-to-end encrypted", desc: "Your conversations stay yours." },
            { icon: Users, title: "Smart groups", desc: "Roles, permissions, polls, and shared media." },
            { icon: Zap, title: "Lightning fast", desc: "Optimized edge network in 30+ regions." },
          ].map((f, i) => (
            <div key={i} className="group glass rounded-2xl p-6 hover:glow-neon transition-all duration-300 hover:-translate-y-1">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--neon)]/20 to-[var(--primary)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <f.icon className="h-5 w-5 text-[var(--neon)]" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="showcase" className="mx-auto max-w-7xl px-6 py-12">
        <div className="glass-strong rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: "12M+", l: "Messages / day" },
            { v: "200K", l: "Active users" },
            { v: "99.99%", l: "Uptime" },
            { v: "30ms", l: "Avg latency" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-gradient">{s.v}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground">Free forever. Upgrade when you need more.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { name: "Free", price: "$0", features: ["Unlimited 1-on-1", "Groups up to 10", "5GB storage", "Voice calls"] },
            { name: "Pro", price: "$8", featured: true, features: ["Everything in Free", "Groups up to 200", "100GB storage", "HD video", "Custom themes"] },
            { name: "Team", price: "$24", features: ["Everything in Pro", "Unlimited members", "1TB storage", "Admin controls", "Priority support"] },
          ].map((p, i) => (
            <div key={i} className={`relative rounded-3xl p-8 flex flex-col ${p.featured ? "glass-strong glow-primary" : "glass"}`}>
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Star className="h-3 w-3" /> Most popular
                </div>
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--neon)]" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-7 inline-flex w-full justify-center h-11 items-center px-5 rounded-full text-sm font-medium transition ${
                  p.featured
                    ? "bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white"
                    : "glass hover:glow-neon"
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative glass-strong rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to chat in style?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join hundreds of thousands of teams already using MajaniChat.</p>
            <Link
              to="/signup"
              className="mt-8 inline-flex h-12 items-center gap-2 px-7 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-10 border-t border-border/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> SOC 2 compliant</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> 30+ regions</span>
          </div>
          <div>© 2026 MajaniChat</div>
        </div>
      </footer>
    </div>
  );
}
