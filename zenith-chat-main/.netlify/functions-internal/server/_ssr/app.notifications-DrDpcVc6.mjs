import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Bell, g as MessageCircle, Q as AtSign, P as Phone, U as Users } from "../_libs/lucide-react.mjs";
const items = [{
  icon: MessageCircle,
  title: "Aurora Lin sent you a message",
  body: "Just sent the design files ✨",
  time: "2m",
  color: "from-[var(--neon)] to-[var(--primary)]"
}, {
  icon: AtSign,
  title: "Mira mentioned you in Design Crew",
  body: "@you can you check the latest export?",
  time: "12m",
  color: "from-[var(--neon-2)] to-[var(--neon)]"
}, {
  icon: Phone,
  title: "Missed call from Kai",
  body: "Tap to call back",
  time: "1h",
  color: "from-destructive to-[var(--neon)]"
}, {
  icon: Users,
  title: "Theo joined Engineering",
  body: "Welcome to the team!",
  time: "3h",
  color: "from-[var(--primary)] to-[var(--neon-2)]"
}];
function NotificationsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto p-6 md:p-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-7 w-7" }),
        " Notifications"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-sm text-[var(--neon)] hover:underline", children: "Mark all read" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4 flex items-start gap-4 hover:glow-neon transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-11 w-11 rounded-xl bg-gradient-to-br ${it.color} text-white flex items-center justify-center shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: it.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-0.5", children: it.body })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: it.time })
    ] }, i)) })
  ] }) });
}
export {
  NotificationsPage as component
};
