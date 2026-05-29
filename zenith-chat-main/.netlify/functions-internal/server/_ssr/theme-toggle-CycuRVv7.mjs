import { V as jsxRuntimeExports, r as reactExports } from "./server-BNoWUpMU.mjs";
import { L as Link, c as createLucideIcon } from "./router-IDBMxkhe.mjs";
import { M as MessageCircle } from "./message-circle-CTi_Z0gQ.mjs";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode);
function Logo({ withText = true }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-white", strokeWidth: 2.5 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-xl blur-md opacity-60 bg-gradient-to-br from-[var(--neon)] to-[var(--neon-2)] -z-10" })
    ] }),
    withText && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg font-bold tracking-tight", children: [
      "Nebula",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Chat" })
    ] })
  ] });
}
function ThemeToggle({ className = "" }) {
  const [dark, setDark] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: toggle,
      "aria-label": "Toggle theme",
      className: `relative h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:glow-neon transition-all duration-300 ${className}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: `h-4 w-4 absolute transition-all ${dark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: `h-4 w-4 absolute transition-all ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}` })
      ]
    }
  );
}
export {
  Logo as L,
  ThemeToggle as T
};
