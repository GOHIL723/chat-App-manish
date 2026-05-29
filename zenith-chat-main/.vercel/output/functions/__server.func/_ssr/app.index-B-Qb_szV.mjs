import { V as jsxRuntimeExports } from "./server-BNoWUpMU.mjs";
import { C as ChatListPanel, L as Link } from "./router-IDBMxkhe.mjs";
import { M as MessageSquare } from "./message-square-DaxSIMG5.mjs";
import { S as Sparkles } from "./sparkles-D0VnYmi_.mjs";
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
function AppHome() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatListPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex flex-1 flex-col items-center justify-center p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-10 bg-gradient-to-br from-[var(--neon)]/30 to-[var(--neon-2)]/30 blur-3xl -z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-[var(--neon)] via-[var(--primary)] to-[var(--neon-2)] flex items-center justify-center glow-primary animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-9 w-9 text-white" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-8 text-3xl font-bold", children: [
        "Welcome to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "NebulaChat" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground max-w-sm", children: "Pick a conversation from the left, or start something new." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/chats/$id", params: {
        id: "1"
      }, className: "inline-flex h-11 items-center gap-2 px-5 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
        " Open featured chat"
      ] }) })
    ] })
  ] });
}
export {
  AppHome as component
};
