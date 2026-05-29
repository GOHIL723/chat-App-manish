import { r as reactExports, V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { u as useNavigate, a as useAuth, L as Link } from "./router-IDBMxkhe.mjs";
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
function Signup() {
  const nav = useNavigate();
  const {
    signup
  } = useAuth();
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
