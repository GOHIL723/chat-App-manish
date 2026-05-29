import { r as reactExports, V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { c as createLucideIcon } from "./router-IDBMxkhe.mjs";
import { B as Bell } from "./bell-SfRXRTzI.mjs";
import { L as Lock, G as Globe } from "./lock-DJw3g9Y3.mjs";
import { S as Smartphone } from "./smartphone-B2phBtp8.mjs";
import { C as ChevronRight } from "./chevron-right-EwS0buAi.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "net";
import "tls";
import "assert";
import "./index.mjs";
import "node:events";
import "os";
import "events";
import "http2";
import "zlib";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const sections = [{
  id: "profile",
  icon: User,
  label: "Profile"
}, {
  id: "notifications",
  icon: Bell,
  label: "Notifications"
}, {
  id: "privacy",
  icon: Lock,
  label: "Privacy & Security"
}, {
  id: "appearance",
  icon: Palette,
  label: "Appearance"
}, {
  id: "language",
  icon: Globe,
  label: "Language & Region"
}, {
  id: "devices",
  icon: Smartphone,
  label: "Devices"
}];
function SettingsPage() {
  const [active, setActive] = reactExports.useState("profile");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto p-6 md:p-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Personalize your NebulaChat experience." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid md:grid-cols-[260px_1fr] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "glass rounded-2xl p-2 h-fit", children: sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActive(s.id), className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active === s.id ? "bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/20 text-foreground" : "text-muted-foreground hover:bg-accent/50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" }),
        " ",
        s.label,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 ml-auto" })
      ] }, s.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-6 md:p-8", children: [
        active === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=me", className: "h-20 w-20 rounded-2xl ring-4 ring-[var(--neon)]/30", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "inline-flex h-9 items-center px-4 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm", children: "Change photo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "PNG, JPG, max 5MB" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Display name", defaultValue: "Alex Rivera" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Username", defaultValue: "@alex" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", defaultValue: "alex@nebula.chat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", defaultValue: "+1 (555) 010-2024" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Bio", defaultValue: "Building the future of conversations · he/him", multiline: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-10 px-5 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm", children: "Save changes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-10 px-5 rounded-xl glass text-sm", children: "Cancel" })
          ] })
        ] }),
        active === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleList, { items: ["Direct messages", "Group mentions", "Calls", "Reactions", "Marketing emails"] }),
        active === "privacy" && /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleList, { items: ["Read receipts", "Typing indicators", "Last seen", "Two-factor auth", "End-to-end encryption"] }),
        active === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsx(Appearance, {}),
        active === "language" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Language", defaultValue: "English (US)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Time zone", defaultValue: "GMT-08:00 Pacific" })
        ] }),
        active === "devices" && /* @__PURE__ */ jsxRuntimeExports.jsx(Devices, {})
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  defaultValue,
  multiline
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label }),
    multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { defaultValue, rows: 3, className: "mt-1.5 w-full px-4 py-2.5 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 transition text-sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue, className: "mt-1.5 w-full h-10 px-4 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]/30 transition text-sm" })
  ] });
}
function ToggleList({
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 glass rounded-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "Manage ",
        label.toLowerCase(),
        " preference"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { defaultOn: i % 2 === 0 })
  ] }, label)) });
}
function Toggle({
  defaultOn
}) {
  const [on, setOn] = reactExports.useState(!!defaultOn);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOn((o) => !o), className: `relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-to-r from-[var(--neon)] to-[var(--primary)]" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}` }) });
}
function Appearance() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "Theme accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["from-purple-500 to-fuchsia-500", "from-cyan-500 to-blue-500", "from-emerald-500 to-teal-500", "from-orange-500 to-pink-500", "from-rose-500 to-red-500"].map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `h-10 w-10 rounded-full bg-gradient-to-br ${g} ring-2 ring-transparent hover:ring-foreground transition` }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-3", children: "Chat density" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["Comfortable", "Cozy", "Compact"].map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `px-4 h-9 rounded-full text-sm ${i === 0 ? "bg-foreground text-background" : "glass"}`, children: d }, d)) })
    ] })
  ] });
}
function Devices() {
  const devs = [{
    name: "MacBook Pro 16″",
    loc: "San Francisco, US",
    last: "Active now",
    current: true
  }, {
    name: "iPhone 16 Pro",
    loc: "San Francisco, US",
    last: "2h ago"
  }, {
    name: "iPad Air",
    loc: "Lisbon, PT",
    last: "3d ago"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: devs.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 glass rounded-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-sm flex items-center gap-2", children: [
        d.name,
        " ",
        d.current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-[var(--success)]/20 text-[var(--success)] px-2 py-0.5 rounded-full", children: "Current" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        d.loc,
        " · ",
        d.last
      ] })
    ] }),
    !d.current && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs text-destructive hover:underline", children: "Sign out" })
  ] }, i)) });
}
export {
  SettingsPage as component
};
