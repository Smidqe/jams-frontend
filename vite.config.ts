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
    plugins: [vue(), vueDevTools(), basicSsl(), tailwindcss(), visualizer()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/ws": { target: backend, ws: true },
        "/stream": backend,
        "/artwork": backend,
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
