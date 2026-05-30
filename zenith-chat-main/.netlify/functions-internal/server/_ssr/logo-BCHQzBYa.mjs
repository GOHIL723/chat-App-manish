import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as MessageCircle } from "../_libs/lucide-react.mjs";
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
export {
  Logo as L
};
