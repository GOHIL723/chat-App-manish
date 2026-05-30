import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Logo } from "./logo-BCHQzBYa.mjs";
import { T as ThemeToggle } from "./theme-toggle-Do2BfjFB.mjs";
import { u as useAuth } from "./router-B-OB1NeJ.mjs";
import "../_libs/sonner.mjs";
import "../_libs/socket.io-client.mjs";
import { y as ArrowRight, z as Sparkles, D as ChevronRight, m as MessageSquare, P as Phone, V as Video, i as Shield, U as Users, Z as Zap, G as Star, I as Lock, J as Globe } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "util";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/axios.mjs";
import "../_libs/form-data.mjs";
import "url";
import "fs";
import "../_libs/combined-stream.mjs";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/asynckit.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/proxy-from-env.mjs";
import "../_libs/https-proxy-agent.mjs";
import "net";
import "tls";
import "assert";
import "../_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "../_libs/agent-base.mjs";
import "events";
import "http2";
import "../_libs/follow-redirects.mjs";
import "zlib";
import "../_libs/engine.io-client.mjs";
import "../_libs/xmlhttprequest-ssl.mjs";
import "child_process";
import "../_libs/engine.io-parser.mjs";
import "../_libs/socket.io__component-emitter.mjs";
import "../_libs/ws.mjs";
import "buffer";
import "../_libs/socket.io-parser.mjs";
function Landing() {
  const {
    user
  } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 gradient-mesh opacity-60 -z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,transparent,var(--color-background)_70%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "glass rounded-2xl px-5 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-8 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#features", className: "hover:text-foreground transition", children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#showcase", className: "hover:text-foreground transition", children: "Showcase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#pricing", className: "hover:text-foreground transition", children: "Pricing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "hover:text-foreground transition", children: "Admin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hidden sm:inline-flex h-9 items-center px-4 rounded-full text-sm hover:bg-accent transition", children: "Sign in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "inline-flex h-9 items-center gap-1.5 px-4 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white glow-primary hover:scale-[1.02] transition-transform", children: [
            "Launch app ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "inline-flex h-9 items-center gap-1.5 px-4 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white glow-primary hover:scale-[1.02] transition-transform", children: [
          "Go to App ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-7xl px-6 pt-16 pb-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-[var(--neon)]" }),
        "Now with AI-powered smart replies",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05] animate-slide-up", children: [
        "The future of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "real-time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "conversation is here."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up", children: "NebulaChat blends crystal-clear voice & video, secure group spaces, and a beautifully crafted interface that feels alive." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex items-center justify-center gap-3 animate-slide-up", children: !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "group inline-flex h-12 items-center gap-2 px-6 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary animate-pulse-glow", children: [
          "Get started free",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-0.5 transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app", className: "inline-flex h-12 items-center gap-2 px-6 rounded-full text-sm font-medium glass hover:glow-neon transition", children: "See it live" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "group inline-flex h-12 items-center gap-2 px-8 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary animate-pulse-glow", children: [
        "Go to Dashboard",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-0.5 transition" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-20 mx-auto max-w-5xl animate-slide-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 bg-gradient-to-r from-[var(--neon)]/20 via-[var(--primary)]/20 to-[var(--neon-2)]/20 blur-3xl -z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-strong rounded-3xl p-2 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card/80 overflow-hidden grid grid-cols-12 min-h-[420px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 border-r border-border/50 p-4 hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-gradient-to-br from-[var(--neon)]/40 to-[var(--neon-2)]/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-20 rounded bg-foreground/20 mb-1.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-28 rounded bg-foreground/10" })
            ] })
          ] }, i)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-12 md:col-span-9 p-6 flex flex-col justify-end gap-3 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--primary)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Hey! Loving how smooth the new chat feels ✨" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-md bg-gradient-to-br from-[var(--neon)] to-[var(--primary)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Right? The animations are buttery 🧈" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-[var(--neon)] to-[var(--primary)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-full px-4 py-2 inline-flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-foreground/60 animate-typing", style: {
                animationDelay: `${i * 0.15}s`
              } }, i)) })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "features", className: "mx-auto max-w-7xl px-6 py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl font-bold", children: [
          "Everything you need.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Nothing you don't."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Designed for teams, friends, and creators who care about how it feels." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: [{
        icon: MessageSquare,
        title: "Real-time messaging",
        desc: "Instant delivery with seen, typing, and reactions."
      }, {
        icon: Phone,
        title: "Crystal voice calls",
        desc: "HD audio with noise suppression built in."
      }, {
        icon: Video,
        title: "Group video",
        desc: "Up to 50 people with screen sharing."
      }, {
        icon: Shield,
        title: "End-to-end encrypted",
        desc: "Your conversations stay yours."
      }, {
        icon: Users,
        title: "Smart groups",
        desc: "Roles, permissions, polls, and shared media."
      }, {
        icon: Zap,
        title: "Lightning fast",
        desc: "Optimized edge network in 30+ regions."
      }].map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group glass rounded-2xl p-6 hover:glow-neon transition-all duration-300 hover:-translate-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--neon)]/20 to-[var(--primary)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-5 w-5 text-[var(--neon)]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-1.5", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: f.desc })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "showcase", className: "mx-auto max-w-7xl px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-strong rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: [{
      v: "12M+",
      l: "Messages / day"
    }, {
      v: "200K",
      l: "Active users"
    }, {
      v: "99.99%",
      l: "Uptime"
    }, {
      v: "30ms",
      l: "Avg latency"
    }].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-bold text-gradient", children: s.v }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: s.l })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "pricing", className: "mx-auto max-w-7xl px-6 py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-bold", children: "Simple, transparent pricing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Free forever. Upgrade when you need more." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5 max-w-5xl mx-auto", children: [{
        name: "Free",
        price: "$0",
        features: ["Unlimited 1-on-1", "Groups up to 10", "5GB storage", "Voice calls"]
      }, {
        name: "Pro",
        price: "$8",
        featured: true,
        features: ["Everything in Free", "Groups up to 200", "100GB storage", "HD video", "Custom themes"]
      }, {
        name: "Team",
        price: "$24",
        features: ["Everything in Pro", "Unlimited members", "1TB storage", "Admin controls", "Priority support"]
      }].map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-3xl p-8 flex flex-col ${p.featured ? "glass-strong glow-primary" : "glass"}`, children: [
        p.featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-xs px-3 py-1 rounded-full inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3" }),
          " Most popular"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-bold", children: p.price }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "/month" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-2.5 text-sm flex-1", children: p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-[var(--neon)]" }),
          " ",
          f
        ] }, f)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: `mt-7 inline-flex w-full justify-center h-11 items-center px-5 rounded-full text-sm font-medium transition ${p.featured ? "bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white" : "glass hover:glow-neon"}`, children: "Get started" })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative glass-strong rounded-3xl p-12 md:p-16 text-center overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-mesh opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "Ready to chat in style?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-xl mx-auto", children: "Join hundreds of thousands of teams already using NebulaChat." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "mt-8 inline-flex h-12 items-center gap-2 px-7 rounded-full text-sm font-medium bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white glow-primary", children: [
          "Start free ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mx-auto max-w-7xl px-6 py-10 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
          " SOC 2 compliant"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
          " 30+ regions"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "© 2026 NebulaChat" })
    ] }) })
  ] });
}
export {
  Landing as component
};
