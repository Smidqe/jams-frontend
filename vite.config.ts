import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  //dev only, in production nginx proxies these paths
  const backend = loadEnv(mode, process.cwd(), "").JAMS_BACKEND_URL || "http://localhost:8080";

  return {
    //relative urls, so the same build works at the root and under a sub-path like /jams/
    base: "./",
    plugins: [
      //everything uses <script setup>, so the Options API code can be dropped from the bundle
      vue({ features: { optionsAPI: false } }),
      vueDevTools(),
      basicSsl(),
      tailwindcss(),
      visualizer(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      //same /api/ prefix as production, stripped before it reaches the backend
      proxy: {
        "/api/": {
          target: backend,
          ws: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      rolldownOptions: {
        treeshake: true,
        output: {
          minify: true,
        },
      },
    },
  };
});
