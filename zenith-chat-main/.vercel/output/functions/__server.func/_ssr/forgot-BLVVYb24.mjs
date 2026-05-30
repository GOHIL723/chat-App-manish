import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AuthShell, F as Field, P as PrimaryButton } from "./auth-shell-dEMHg7_o.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "crypto";
import "async_hooks";
import "util";
import "stream";
import "../_libs/isbot.mjs";
import "./logo-BCHQzBYa.mjs";
import "../_libs/lucide-react.mjs";
import "./theme-toggle-Do2BfjFB.mjs";
function Forgot() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthShell, { title: "Reset password", subtitle: "Enter your email and we'll send a recovery link.", footer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-[var(--neon)] hover:underline", children: "Back to sign in" }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", placeholder: "you@example.com", required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryButton, { type: "submit", children: "Send recovery link" })
  ] }) });
}
export {
  Forgot as component
};
