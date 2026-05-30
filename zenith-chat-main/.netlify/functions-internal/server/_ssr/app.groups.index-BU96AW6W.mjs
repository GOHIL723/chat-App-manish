import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as axios } from "../_libs/axios.mjs";
import { a as useSocket } from "./router-B-OB1NeJ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/socket.io-client.mjs";
import { a4 as Plus, U as Users, L as LoaderCircle, I as Lock, J as Globe, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/engine.io-client.mjs";
import "../_libs/xmlhttprequest-ssl.mjs";
import "child_process";
import "../_libs/engine.io-parser.mjs";
import "../_libs/socket.io__component-emitter.mjs";
import "../_libs/ws.mjs";
import "buffer";
import "../_libs/socket.io-parser.mjs";
function CreateGroupModal({ onClose, allUsers }) {
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const nav = useNavigate();
  const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Group name is required");
    setLoading(true);
    try {
      const res = await axios.post("/groups", { name: name.trim(), description, members: selected });
      toast.success("Group created!");
      onClose();
      nav({ to: "/app/groups/$id", params: { id: res.data._id } });
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slide-up", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-[var(--neon)]" }),
        " New Group"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "h-8 w-8 rounded-full hover:bg-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: name,
          onChange: (e) => setName(e.target.value),
          placeholder: "Group name *",
          className: "w-full h-10 px-3 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: description,
          onChange: (e) => setDescription(e.target.value),
          placeholder: "Description (optional)",
          rows: 2,
          className: "w-full px-3 py-2 rounded-xl bg-input/50 border border-border focus:border-[var(--neon)] focus:outline-none text-sm resize-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Add Members" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto scrollbar-thin space-y-1 mb-4", children: allUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer hover:bg-accent/30 rounded-xl p-2 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selected.includes(u.id), onChange: () => toggle(u.id), className: "accent-[var(--neon)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u.avatar, className: "h-8 w-8 rounded-full", alt: "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: u.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "@",
          u.username
        ] })
      ] })
    ] }, u.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleCreate,
        disabled: loading || !name.trim(),
        className: "w-full h-11 rounded-xl bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white font-medium disabled:opacity-40 flex items-center justify-center gap-2",
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Create Group"
        ] })
      }
    )
  ] }) });
}
function GroupsPage() {
  const [groups, setGroups] = reactExports.useState([]);
  const [allUsers, setAllUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const {
    onlineUsers,
    socket
  } = useSocket();
  const fetchGroups = async () => {
    try {
      const res = await axios.get("/groups");
      setGroups(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchGroups();
    axios.get("/users").then((r) => setAllUsers(r.data)).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    if (!socket) return;
    const onCreated = () => fetchGroups();
    const onUpdated = () => fetchGroups();
    socket.on("groupCreated", onCreated);
    socket.on("groupUpdated", onUpdated);
    return () => {
      socket.off("groupCreated", onCreated);
      socket.off("groupUpdated", onUpdated);
    };
  }, [socket]);
  const featuredGroup = groups[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 overflow-y-auto scrollbar-thin", children: [
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateGroupModal, { onClose: () => {
      setShowCreate(false);
      fetchGroups();
    }, allUsers }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-6 md:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Groups" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Spaces for teams, friends, and communities." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowCreate(true), className: "inline-flex h-11 items-center gap-2 px-5 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm glow-primary hover:scale-105 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New Group"
        ] })
      ] }),
      featuredGroup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl overflow-hidden glass-strong p-8 md:p-10 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-mesh opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col md:flex-row md:items-end gap-6 justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[var(--neon)] uppercase tracking-wider font-semibold", children: "Your latest group" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mt-2", children: featuredGroup.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-2 max-w-md", children: [
              featuredGroup.description || "A group chat space.",
              " · ",
              featuredGroup.members?.length || 0,
              " members ·",
              " ",
              featuredGroup.members?.filter((m) => onlineUsers.includes(m._id || m)).length || 0,
              " online"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2 mt-4", children: [
              featuredGroup.members?.slice(0, 5).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`, className: "h-9 w-9 rounded-full ring-2 ring-card", alt: "" }, m._id || m)),
              (featuredGroup.members?.length || 0) > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-9 w-9 rounded-full glass ring-2 ring-card flex items-center justify-center text-xs", children: [
                "+",
                featuredGroup.members.length - 5
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/groups/$id", params: {
            id: featuredGroup._id
          }, className: "inline-flex h-11 items-center gap-2 px-5 rounded-full bg-foreground text-background text-sm hover:scale-105 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
            " Open Group"
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-[var(--neon)]" }) }) : groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "No groups yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Create your first group to get started!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowCreate(true), className: "mt-5 inline-flex h-11 items-center gap-2 px-6 rounded-full bg-gradient-to-r from-[var(--neon)] to-[var(--primary)] text-white text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Create Group"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: groups.map((g) => {
        const onlineCount = g.members?.filter((m) => onlineUsers.includes(m._id || m)).length || 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/groups/$id", params: {
          id: g._id
        }, className: "glass rounded-2xl p-5 hover:glow-neon transition group block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[var(--neon)]/40 to-[var(--neon-2)]/40 flex items-center justify-center font-bold text-lg text-white shrink-0", children: g.name?.[0]?.toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: g.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: g.lastMessage || g.description || "No messages yet" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
              " ",
              g.members?.length || 0
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              g.isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3" }),
              g.isPrivate ? "Private" : "Public"
            ] }),
            onlineCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[var(--success)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--success)]" }),
              " ",
              onlineCount,
              " online"
            ] })
          ] })
        ] }, g._id);
      }) })
    ] })
  ] });
}
export {
  GroupsPage as component
};
