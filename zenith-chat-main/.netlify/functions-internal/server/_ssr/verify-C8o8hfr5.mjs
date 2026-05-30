import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AuthShell, P as PrimaryButton } from "./auth-shell-dEMHg7_o.mjs";
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
import "./logo-BCHQzBYa.mjs";
import "../_libs/lucide-react.mjs";
import "./theme-toggle-Do2BfjFB.mjs";
function Verify() {
  const nav = useNavigate();
  const [code, setCode] = reactExports.useState(["", "", "", "", "", ""]);
  const refs = reactExports.useRef([]);
  const submit = (e) => {
    e.preventDefault();
    nav({
      to: "/app"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthShell, { title: "Verify your email", subtitle: "We sent a 6-digit code to your inbox.", footer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-[var(--neon)] hover:underline", children: "Use a different email" }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between gap-2", children: code.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: (el) => {
      refs.current[i] = el;
    }, value: c, maxLength: 1, inputMode: "numeric", onChange: (e) => {
      const v = e.target.value.replace(/\D/g, "");
      const next = [...code];
      next[i] = v;
      setCode(next);
      if (v && i < 5) refs.current[i + 1]?.focus();
    }, className: "h-14 w-12 text-center text-xl font-semibold rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:ring-2 focus:ring-[var(--neon)]/30 focus:outline-none transition" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryButton, { type: "submit", children: "Verify & continue" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
      "Didn't receive it? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "text-[var(--neon)] hover:underline", children: "Resend code" })
    ] })
  ] }) });
}
export {
  Verify as component
};
