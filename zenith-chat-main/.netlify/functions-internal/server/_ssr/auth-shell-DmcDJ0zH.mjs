import { V as jsxRuntimeExports, r as reactExports } from "./server-BNoWUpMU.mjs";
import { L as Link } from "./router-IDBMxkhe.mjs";
import { L as Logo, T as ThemeToggle } from "./theme-toggle-CycuRVv7.mjs";
import { E as EyeOff, a as Eye } from "./eye-B02W7Mst.mjs";
function AuthShell({ title, subtitle, children, footer }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen flex items-center justify-center px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 gradient-mesh opacity-60 -z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent,var(--color-background)_70%)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-6 left-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-6 right-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md animate-slide-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-8 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: subtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-7 space-y-4", children }),
        footer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center text-sm text-muted-foreground", children: footer })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: [
        "By continuing you agree to our ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "underline", children: "Terms" }),
        " & ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "underline", children: "Privacy" }),
        "."
      ] })
    ] })
  ] });
}
function Field({ label, type, error, ...props }) {
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const isPassword = type === "password";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: isPassword ? showPassword ? "text" : "password" : type,
          ...props,
          className: `w-full h-11 px-4 pr-10 rounded-xl bg-input/50 border focus:outline-none focus:ring-2 transition placeholder:text-muted-foreground/60 ${error ? "border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/30" : "border-border focus:border-[var(--neon)] focus:ring-[var(--neon)]/30"}`
        }
      ),
      isPassword && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            setShowPassword(!showPassword);
          },
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
          children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[var(--destructive)] mt-1.5 block font-medium", children: error })
  ] });
}
function PrimaryButton({ children, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      ...props,
      className: "w-full h-11 rounded-xl bg-gradient-to-r from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] text-white font-medium glow-primary hover:scale-[1.01] active:scale-[0.99] transition",
      children
    }
  );
}
function GoogleButton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full h-11 rounded-xl glass hover:bg-accent/50 transition flex items-center justify-center gap-2.5 text-sm font-medium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M5.3 14.5l-.8 3-3 .1A11 11 0 011 12c0-1.8.4-3.5 1.2-5l2.7.5 1.2 2.7a6.6 6.6 0 00-.8 3.3c0 .4.2.8.3 1.2z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FBBC05", d: "M22.6 9.8a11 11 0 010 4.5l-3.4-.3a6.6 6.6 0 000-3.9z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#34A853", d: "M21.4 18.4a11 11 0 01-9.4 5.1 11 11 0 01-9.5-5.4l3.7-3a6.6 6.6 0 005.8 3.6c1.5 0 2.8-.4 3.9-1.1z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M21.6 18.6L18 15.7a6.6 6.6 0 002.8-2.7l3.4.3a11 11 0 01-2.6 5.3z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4285F4", d: "M22.6 9.8h-10.6v4.5h6.1a5.2 5.2 0 01-2.3 3.4l3.6 2.9a11 11 0 003.2-10.8z" })
    ] }),
    "Continue with Google"
  ] });
}
export {
  AuthShell as A,
  Field as F,
  GoogleButton as G,
  PrimaryButton as P
};
