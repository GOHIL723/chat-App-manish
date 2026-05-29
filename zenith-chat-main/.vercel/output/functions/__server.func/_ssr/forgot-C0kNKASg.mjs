import { V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { L as Link } from "./router-IDBMxkhe.mjs";
import { A as AuthShell, F as Field, P as PrimaryButton } from "./auth-shell-DmcDJ0zH.mjs";
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
function Forgot() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthShell, { title: "Reset password", subtitle: "Enter your email and we'll send a recovery link.", footer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-[var(--neon)] hover:underline", children: "Back to sign in" }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", placeholder: "you@example.com", required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryButton, { type: "submit", children: "Send recovery link" })
  ] }) });
}
export {
  Forgot as component
};
