import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AuthShell, G as GoogleButton, F as Field, P as PrimaryButton } from "./auth-shell-dEMHg7_o.mjs";
import { u as useAuth } from "./router-B-OB1NeJ.mjs";
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
function Signup() {
  const nav = useNavigate();
  const {
    signup,
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
  const [formData, setFormData] = reactExports.useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const handleChange = (e, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
    setFormErrors((prev) => ({
      ...prev,
      [field]: void 0
    }));
  };
  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signup({
        name: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      nav({
        to: "/app"
      });
    } catch (error) {
      const msg = error.response?.data?.error || "";
      const newErrors = {};
      if (msg.includes("Username")) newErrors.username = msg;
      else if (msg.includes("Email")) newErrors.email = msg;
      else if (msg.includes("Password must")) newErrors.password = msg;
      else if (msg.includes("Passwords don't")) newErrors.confirmPassword = msg;
      setFormErrors(newErrors);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthShell, { title: "Create your account", subtitle: "Start chatting in under 30 seconds.", footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "Already have one? ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-foreground font-medium hover:text-[var(--neon)]", children: "Sign in" })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleButton, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
      " or ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First name", placeholder: "Aurora", required: true, value: formData.firstName, onChange: (e) => handleChange(e, "firstName") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last name", placeholder: "Lin", required: true, value: formData.lastName, onChange: (e) => handleChange(e, "lastName") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Username", placeholder: "aurora_lin", required: true, value: formData.username, onChange: (e) => handleChange(e, "username"), error: formErrors.username }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", placeholder: "you@example.com", required: true, value: formData.email, onChange: (e) => handleChange(e, "email"), error: formErrors.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", type: "password", placeholder: "At least 6 characters", required: true, value: formData.password, onChange: (e) => handleChange(e, "password"), error: formErrors.password }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Confirm Password", type: "password", placeholder: "Confirm your password", required: true, value: formData.confirmPassword, onChange: (e) => handleChange(e, "confirmPassword"), error: formErrors.confirmPassword }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryButton, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Creating account..." : "Create account" })
    ] })
  ] });
}
export {
  Signup as component
};
