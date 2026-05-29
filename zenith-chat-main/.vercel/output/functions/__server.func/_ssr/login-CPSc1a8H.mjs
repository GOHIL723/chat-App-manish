import { r as reactExports, V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { u as useNavigate, R as Route$d, a as useAuth, L as Link } from "./router-IDBMxkhe.mjs";
import { A as AuthShell, G as GoogleButton, F as Field, P as PrimaryButton } from "./auth-shell-DmcDJ0zH.mjs";
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
function Login() {
  const nav = useNavigate();
  const search = Route$d.useSearch();
  const {
    login
  } = useAuth();
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setFormErrors({});
      await login(username, password);
      const targetPath = search.redirect || "/app";
      nav({
        to: targetPath
      });
    } catch (error) {
      const msg = error.response?.data?.error || "Login failed. Please try again.";
      if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("username") || msg.toLowerCase().includes("invalid")) {
        setFormErrors({
          password: msg
        });
      } else if (msg.toLowerCase().includes("banned") || msg.toLowerCase().includes("suspended")) {
        setFormErrors({
          _general: msg
        });
      } else {
        setFormErrors({
          _general: msg
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthShell, { title: "Welcome back", subtitle: "Sign in to pick up where you left off.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "New here? ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-foreground font-medium hover:text-[var(--neon)]", children: "Create account" })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleButton, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
      " or ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      formErrors._general && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive", children: formErrors._general }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Username", type: "text", placeholder: "your_username", required: true, value: username, onChange: (e) => {
        setUsername(e.target.value);
        setFormErrors({});
      }, error: formErrors.username }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", type: "password", placeholder: "••••••••", required: true, value: password, onChange: (e) => {
        setPassword(e.target.value);
        setFormErrors({});
      }, error: formErrors.password }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "h-3.5 w-3.5 rounded accent-[var(--neon)]" }),
          " Remember me"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/forgot", className: "text-[var(--neon)] hover:underline", children: "Forgot password?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryButton, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Signing in..." : "Sign in" })
    ] })
  ] });
}
export {
  Login as component
};
