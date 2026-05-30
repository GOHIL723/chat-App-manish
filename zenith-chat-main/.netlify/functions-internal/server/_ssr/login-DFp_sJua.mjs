import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AuthShell, G as GoogleButton, F as Field, P as PrimaryButton } from "./auth-shell-dEMHg7_o.mjs";
import { R as Route$d, u as useAuth } from "./router-B-OB1NeJ.mjs";
import "../_libs/sonner.mjs";
import "../_libs/socket.io-client.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/axios.mjs";
import "../_libs/form-data.mjs";
import "url";
import "fs";
import "../_libs/combined-stream.mjs";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/asynckit.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/proxy-from-env.mjs";
import "../_libs/https-proxy-agent.mjs";
import "net";
import "tls";
import "assert";
import "../_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "../_libs/agent-base.mjs";
import "events";
import "http2";
import "../_libs/follow-redirects.mjs";
import "zlib";
import "../_libs/engine.io-client.mjs";
import "../_libs/xmlhttprequest-ssl.mjs";
import "child_process";
import "../_libs/engine.io-parser.mjs";
import "../_libs/socket.io__component-emitter.mjs";
import "../_libs/ws.mjs";
import "buffer";
import "../_libs/socket.io-parser.mjs";
function Login() {
  const nav = useNavigate();
  const search = Route$d.useSearch();
  const {
    login,
    user,
    loading
  } = useAuth();
  reactExports.useEffect(() => {
    if (!loading && user) {
      nav({
        to: "/app"
      });
    }
  }, [user, loading, nav]);
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
