import { r as reactExports, V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { u as useNavigate, L as Link } from "./router-IDBMxkhe.mjs";
import { A as AuthShell, P as PrimaryButton } from "./auth-shell-DmcDJ0zH.mjs";
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
import "./theme-toggle-CycuRVv7.mjs";
import "./message-circle-CTi_Z0gQ.mjs";
import "./eye-B02W7Mst.mjs";
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
