import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as Sun, d as Moon } from "../_libs/lucide-react.mjs";
function ThemeToggle({ className = "" }) {
  const [dark, setDark] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: toggle,
      "aria-label": "Toggle theme",
      className: `relative h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:glow-neon transition-all duration-300 ${className}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: `h-4 w-4 absolute transition-all ${dark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: `h-4 w-4 absolute transition-all ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}` })
      ]
    }
  );
}
export {
  ThemeToggle as T
};
