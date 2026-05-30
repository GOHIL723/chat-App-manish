import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Logo } from "./logo-BCHQzBYa.mjs";
import { a as Smartphone, T as Tablet, b as Laptop, M as Monitor, A as ArrowLeft, R as RotateCw, c as Sun, d as Moon, S as Search, e as RefreshCw, E as Eye } from "../_libs/lucide-react.mjs";
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
const presets = [{
  id: "iphone-15",
  name: "iPhone 15 Pro",
  type: "phone",
  width: 393,
  height: 852,
  icon: Smartphone,
  description: "Super Retina XDR (xs)"
}, {
  id: "galaxy-s24",
  name: "Galaxy S24",
  type: "phone",
  width: 360,
  height: 800,
  icon: Smartphone,
  description: "Dynamic AMOLED (xs)"
}, {
  id: "ipad-pro-11",
  name: 'iPad Pro 11"',
  type: "tablet",
  width: 834,
  height: 1194,
  icon: Tablet,
  description: "Liquid Retina (sm/md)"
}, {
  id: "ipad-pro-12",
  name: 'iPad Pro 12.9"',
  type: "tablet",
  width: 1024,
  height: 1366,
  icon: Tablet,
  description: "Liquid Retina XDR (md/lg)"
}, {
  id: "macbook-air",
  name: 'MacBook Air 13"',
  type: "laptop",
  width: 1280,
  height: 800,
  icon: Laptop,
  description: "Retina Display (lg/xl)"
}, {
  id: "studio-display",
  name: 'Studio Display 27"',
  type: "monitor",
  width: 1920,
  height: 1080,
  icon: Monitor,
  description: "5K Retina Display (2xl)"
}];
function DevicePreviewer() {
  const [selectedId, setSelectedId] = reactExports.useState("iphone-15");
  const [orientation, setOrientation] = reactExports.useState("portrait");
  const [scale, setScale] = reactExports.useState(1);
  const [currentUrl, setCurrentUrl] = reactExports.useState("/");
  const [inputUrl, setInputUrl] = reactExports.useState("/");
  const [deviceTheme, setDeviceTheme] = reactExports.useState("dark");
  const iframeRef = reactExports.useRef(null);
  const selectedPreset = presets.find((p) => p.id === selectedId) || presets[0];
  const isLandscape = orientation === "landscape";
  const simulatedWidth = isLandscape ? selectedPreset.height : selectedPreset.width;
  const simulatedHeight = isLandscape ? selectedPreset.width : selectedPreset.height;
  reactExports.useEffect(() => {
    const handleAutoResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const neededWidth = simulatedWidth + 400;
      const neededHeight = simulatedHeight + 200;
      if (windowWidth < neededWidth || windowHeight < neededHeight) {
        const scaleW = (windowWidth - 420) / simulatedWidth;
        const scaleH = (windowHeight - 160) / simulatedHeight;
        const newScale = Math.max(0.3, Math.min(1, Math.min(scaleW, scaleH)));
        setScale(parseFloat(newScale.toFixed(2)));
      } else {
        setScale(1);
      }
    };
    handleAutoResize();
    window.addEventListener("resize", handleAutoResize);
    return () => window.removeEventListener("resize", handleAutoResize);
  }, [selectedId, orientation, simulatedWidth, simulatedHeight]);
  const applyThemeToIframe = () => {
    if (iframeRef.current) {
      try {
        const iframeDoc = iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          const rootElement = iframeDoc.documentElement;
          if (deviceTheme === "dark") {
            rootElement.classList.add("dark");
          } else {
            rootElement.classList.remove("dark");
          }
        }
      } catch (e) {
        console.warn("Could not access iframe document for theme sync", e);
      }
    }
  };
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      try {
        const path = iframeRef.current.contentWindow?.location.pathname || "/";
        const search = iframeRef.current.contentWindow?.location.search || "";
        const fullPath = path + search;
        setCurrentUrl(fullPath);
        setInputUrl(fullPath);
        applyThemeToIframe();
      } catch (e) {
        console.warn("Cross-origin or internal navigation read prevented.", e);
      }
    }
  };
  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (iframeRef.current) {
      let targetPath = inputUrl;
      if (!targetPath.startsWith("/")) {
        targetPath = "/" + targetPath;
      }
      iframeRef.current.src = targetPath;
      setCurrentUrl(targetPath);
    }
  };
  const navigateIframeTo = (path) => {
    if (iframeRef.current) {
      iframeRef.current.src = path;
      setCurrentUrl(path);
      setInputUrl(path);
    }
  };
  const getBreakpoint = (w) => {
    if (w < 640) return "xs";
    if (w < 768) return "sm";
    if (w < 1024) return "md";
    if (w < 1280) return "lg";
    if (w < 1536) return "xl";
    return "2xl";
  };
  const currentBreakpoint = getBreakpoint(simulatedWidth);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen w-screen flex overflow-hidden bg-[oklch(0.08_0.015_270)] text-foreground relative font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 gradient-mesh opacity-20 -z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-80 flex-shrink-0 glass border-r border-border/50 flex flex-col h-full z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "h-8 px-3 rounded-full text-xs glass hover:bg-accent/50 transition inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
            " Back to App"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold mt-4 tracking-tight", children: "Responsive Sandbox" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Test layouts and flows inside real-time responsive frames." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1", children: "Device Presets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: presets.map((p) => {
            const Icon = p.icon;
            const active = p.id === selectedId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedId(p.id), className: `w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition ${active ? "bg-gradient-to-r from-[var(--neon)]/20 to-[var(--primary)]/10 text-foreground border-l-2 border-[var(--neon)]" : "hover:bg-accent/40 text-muted-foreground hover:text-foreground border-l-2 border-transparent"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-8 w-8 rounded-lg flex items-center justify-center transition shrink-0 ${active ? "bg-[var(--neon)]/25 text-[var(--neon)]" : "bg-accent/60"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground truncate", children: p.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[10px] font-mono text-muted-foreground", children: [
                p.width,
                "x",
                p.height
              ] })
            ] }, p.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1", children: "Interactive Page Links" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: [{
            name: "Landing",
            path: "/"
          }, {
            name: "Login",
            path: "/login"
          }, {
            name: "Register",
            path: "/signup"
          }, {
            name: "Chats List",
            path: "/app/chats"
          }, {
            name: "Group List",
            path: "/app/groups"
          }, {
            name: "Settings",
            path: "/app/settings"
          }].map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigateIframeTo(link.path), className: `text-[11px] font-medium p-2 rounded-xl text-center glass hover:glow-neon transition duration-200 border border-border/50 truncate ${currentUrl === link.path ? "border-[var(--neon)]/60 text-[var(--neon)] bg-[var(--neon)]/5" : ""}`, children: link.name }, link.path)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-4 border border-border/50 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Tailwind Breakpoints" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-[var(--neon)] bg-[var(--neon)]/15 px-2 py-0.5 rounded-full uppercase", children: currentBreakpoint })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1 text-[9px] font-mono font-bold text-center", children: [{
            name: "xs",
            range: "<640"
          }, {
            name: "sm",
            range: "640+"
          }, {
            name: "md",
            range: "768+"
          }, {
            name: "lg",
            range: "1024+"
          }, {
            name: "xl",
            range: "1280+"
          }, {
            name: "2xl",
            range: "1536+"
          }].map((bp) => {
            const active = bp.name === currentBreakpoint;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `py-1 rounded transition duration-200 ${active ? "bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/40 shadow" : "bg-accent/40 text-muted-foreground/55"}`, title: `Active screen width: ${bp.range}px`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: bp.name }) }, bp.name);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-border/50 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Zoom Scale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-[var(--neon)]", children: [
              Math.round(scale * 100),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "0.3", max: "1.5", step: "0.05", value: scale, onChange: (e) => setScale(parseFloat(e.target.value)), className: "w-full h-1.5 bg-accent rounded-lg appearance-none cursor-pointer accent-[var(--neon)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOrientation((o) => o === "portrait" ? "landscape" : "portrait"), className: "flex-1 py-2 glass hover:bg-accent rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "h-3.5 w-3.5" }),
            " Rotate View"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeviceTheme((t) => t === "dark" ? "light" : "dark"), className: "px-3 py-2 glass hover:bg-accent rounded-xl flex items-center justify-center transition active:scale-95 text-muted-foreground hover:text-foreground", title: "Toggle Device Theme", children: deviceTheme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col h-full bg-[oklch(0.05_0.01_270)] relative overflow-hidden select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 px-6 border-b border-border/50 glass flex items-center justify-between z-10 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUrlSubmit, className: "flex-1 max-w-xl relative flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 h-4 w-4 text-muted-foreground/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: inputUrl, onChange: (e) => setInputUrl(e.target.value), placeholder: "Simulate path, e.g. /app/chats", className: "w-full h-9 pl-9 pr-24 rounded-full bg-[oklch(0.03_0.005_270)] border border-border/50 text-xs font-mono tracking-wide focus:border-[var(--neon)] focus:outline-none focus:ring-1 focus:ring-[var(--neon)]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "absolute right-1.5 h-6.5 px-3 rounded-full bg-accent text-[10px] font-semibold hover:bg-accent-foreground/10 transition active:scale-95", children: "Go" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-mono", children: [
            "Viewport: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              simulatedWidth,
              "px × ",
              simulatedHeight,
              "px"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reloadIframe, className: "h-9 w-9 rounded-xl glass hover:bg-accent/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition active:scale-95", title: "Refresh simulator", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto flex items-center justify-center p-8 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
      }, className: "flex items-center justify-center relative flex-col", children: [
        selectedPreset.type === "monitor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: `${simulatedWidth + 40}px`,
            height: `${simulatedHeight + 40}px`
          }, className: "bg-zinc-800 rounded-[24px] p-4 shadow-2xl relative border-4 border-zinc-700/60 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-black rounded-full ring-1 ring-zinc-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 rounded-[12px] bg-black overflow-hidden relative border border-black/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { ref: iframeRef, src: currentUrl, onLoad: handleIframeLoad, className: "w-full h-full border-none select-text" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-gradient-to-b from-zinc-700 to-zinc-500 rounded-b-xl relative -mt-1 shadow-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 h-3 w-40 bg-zinc-600 rounded-full shadow" }) })
        ] }),
        selectedPreset.type === "laptop" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: `${simulatedWidth + 30}px`,
            height: `${simulatedHeight + 30}px`
          }, className: "bg-zinc-800 rounded-t-[20px] rounded-b-[4px] p-3 shadow-2xl relative border-2 border-zinc-700 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-4.5 w-28 bg-zinc-800 rounded-b-md flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 bg-black rounded-full ring-1 ring-zinc-700" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 rounded-[8px] bg-black overflow-hidden relative border border-black/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { ref: iframeRef, src: currentUrl, onLoad: handleIframeLoad, className: "w-full h-full border-none select-text" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: `${simulatedWidth + 120}px`
          }, className: "h-4.5 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-b-[14px] shadow-2xl relative flex justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 w-24 h-1.5 bg-zinc-900 rounded-b-md" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1 bg-zinc-700/50" })
          ] })
        ] }),
        (selectedPreset.type === "phone" || selectedPreset.type === "tablet") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            width: `${simulatedWidth + 24}px`,
            height: `${simulatedHeight + 24}px`
          }, className: `bg-zinc-800 p-3 shadow-2xl border-[5px] border-zinc-700 relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${selectedPreset.type === "phone" ? "rounded-[48px]" : "rounded-[28px]"}`, children: [
            selectedPreset.id === "iphone-15" && !isLandscape && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4.5 left-1/2 -translate-x-1/2 w-28 h-6.5 bg-black rounded-full flex items-center justify-center z-50 animate-pulse-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 bg-zinc-900 rounded-full ml-auto mr-4" }) }),
            selectedPreset.id === "galaxy-s24" && !isLandscape && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-1 bg-zinc-900 rounded-full" }) }),
            selectedPreset.type === "phone" && !isLandscape && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-1 bg-zinc-950 rounded-full z-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 bg-black overflow-hidden relative border border-black/40 ${selectedPreset.type === "phone" ? "rounded-[38px]" : "rounded-[18px]"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { ref: iframeRef, src: currentUrl, onLoad: handleIframeLoad, className: "w-full h-full border-none select-text" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-[-8px] top-28 w-2 h-14 bg-zinc-700 rounded-l-md border border-zinc-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-[-8px] top-48 w-2 h-14 bg-zinc-700 rounded-l-md border border-zinc-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-[-8px] top-36 w-2 h-16 bg-zinc-700 rounded-r-md border border-zinc-800" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "h-10 px-6 border-t border-border/50 glass flex items-center justify-between text-[10px] text-muted-foreground z-10 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sandbox Mode · Rendered using direct viewport simulation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 text-[var(--neon)]" }),
          " Fully interactive: click, type, and swipe as normal."
        ] })
      ] })
    ] })
  ] });
}
export {
  DevicePreviewer as component
};
