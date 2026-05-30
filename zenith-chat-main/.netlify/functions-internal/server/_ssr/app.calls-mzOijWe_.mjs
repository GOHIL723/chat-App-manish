import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { W as Mic, V as Video, Y as ScreenShare, _ as MicOff, $ as VideoOff, a0 as PhoneOff, a1 as PhoneMissed, a2 as PhoneIncoming, a3 as PhoneOutgoing, P as Phone } from "../_libs/lucide-react.mjs";
const av = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
const chats = [
  { id: "1", name: "Aurora Lin", avatar: av("aurora"), lastMessage: "Just sent the design files ✨", time: "2m", unread: 3, online: true, type: "dm", typing: true },
  { id: "2", name: "Design Crew", avatar: av("crew"), lastMessage: "Mira: Loving the new gradient system", time: "8m", unread: 12, online: true, type: "group" },
  { id: "3", name: "Kai Nakamura", avatar: av("kai"), lastMessage: "Voice message", time: "1h", unread: 0, online: true, type: "dm" },
  { id: "4", name: "Product Standup", avatar: av("product"), lastMessage: "Meeting starts in 15", time: "3h", unread: 0, online: false, type: "group" },
  { id: "5", name: "Sienna Park", avatar: av("sienna"), lastMessage: "Catch up tomorrow?", time: "1d", unread: 0, online: false, type: "dm" },
  { id: "6", name: "Engineering", avatar: av("eng"), lastMessage: "Deploy successful 🚀", time: "1d", unread: 0, online: true, type: "group" },
  { id: "7", name: "Theo Castillo", avatar: av("theo"), lastMessage: "Thanks!", time: "2d", unread: 0, online: false, type: "dm" },
  { id: "8", name: "Late Night Lounge", avatar: av("lounge"), lastMessage: "🎵 sharing tunes", time: "3d", unread: 0, online: true, type: "group" }
];
const history = [{
  name: "Aurora Lin",
  type: "incoming",
  time: "Today, 10:04",
  duration: "12m",
  missed: false
}, {
  name: "Design Crew",
  type: "outgoing",
  time: "Yesterday, 17:30",
  duration: "48m",
  missed: false,
  group: true
}, {
  name: "Kai Nakamura",
  type: "missed",
  time: "Yesterday, 09:12",
  duration: "—",
  missed: true
}, {
  name: "Sienna Park",
  type: "outgoing",
  time: "Mon, 14:22",
  duration: "8m",
  missed: false
}];
function CallsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-6 md:p-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Calls" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Voice and video conversations." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 relative rounded-3xl overflow-hidden glass-strong", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-mesh opacity-60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[var(--neon)] uppercase tracking-wider font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-[var(--neon)] animate-pulse" }),
              " Live · 12:34"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mt-1", children: "Design Crew · Weekly sync" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex -space-x-2", children: chats.slice(0, 4).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.avatar, className: "h-8 w-8 rounded-full ring-2 ring-card", alt: "" }, c.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: chats.slice(0, 6).map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video rounded-2xl bg-card overflow-hidden relative ring-1 ring-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${i % 2 === 0 ? "from-[var(--neon)]/30 to-[var(--primary)]/30" : "from-[var(--neon-2)]/30 to-[var(--primary)]/30"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.avatar, className: "absolute inset-0 m-auto h-16 w-16 rounded-full ring-4 ring-card/40", alt: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "glass-strong px-2 py-1 rounded-md", children: c.name }),
            i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-strong rounded-md p-1.5 flex items-end gap-0.5 h-7", children: Array.from({
              length: 5
            }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-0.5 bg-[var(--neon)] rounded-full animate-wave", style: {
              height: `${30 + j * 12}%`,
              animationDelay: `${j * 0.1}s`
            } }, j)) })
          ] })
        ] }, c.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-full p-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CallBtn, { icon: Mic }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CallBtn, { icon: Video }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CallBtn, { icon: ScreenShare }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CallBtn, { icon: MicOff, muted: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CallBtn, { icon: VideoOff, muted: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-12 w-12 rounded-full bg-destructive text-white flex items-center justify-center hover:scale-105 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-5 w-5" }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-3", children: "Recent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl divide-y divide-border/50 overflow-hidden", children: history.map((h, i) => {
        const Icon = h.missed ? PhoneMissed : h.type === "incoming" ? PhoneIncoming : PhoneOutgoing;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 hover:bg-accent/50 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${h.name}`, className: "h-11 w-11 rounded-full", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: h.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-3 w-3 ${h.missed ? "text-destructive" : ""}` }),
              " ",
              h.time,
              " · ",
              h.duration
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-full glass hover:glow-neon transition flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-full glass hover:glow-neon transition flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4" }) })
        ] }, i);
      }) })
    ] })
  ] }) });
}
function CallBtn({
  icon: Icon,
  muted
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `h-12 w-12 rounded-full flex items-center justify-center transition hover:scale-105 ${muted ? "bg-destructive/20 text-destructive" : "glass text-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) });
}
export {
  CallsPage as component
};
