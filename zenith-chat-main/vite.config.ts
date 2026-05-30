// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Detect deployment platform
const isCloudflare = !!process.env.CF_PAGES;
const isVercel = process.env.VERCEL === "1";
const isNetlify = !!process.env.NETLIFY;
// Render, local, or any other node-based environment
const isNodeServer = !isCloudflare && !isVercel && !isNetlify;

// Determine Nitro preset
const nitroPreset = process.env.NITRO_PRESET
  || (isNetlify ? "netlify" : isVercel ? "vercel" : isNodeServer ? "node-server" : undefined);

export default defineConfig({
  // Disable Cloudflare plugin unless actually deploying to Cloudflare Pages
  cloudflare: isCloudflare ? undefined : false,
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [
    nitro({
      preset: nitroPreset,
    }),
  ],
  vite: {
    server: {
      proxy: {
        // Dev mein /api/* requests port 5000 (backend) pe forward karo — CORS bypass
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  },
});
