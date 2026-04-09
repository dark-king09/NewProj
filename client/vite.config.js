import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const githubPagesBase = repositoryName.endsWith(".github.io")
  ? "/"
  : repositoryName
    ? `/${repositoryName}/`
    : "/";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? githubPagesBase : "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      }
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  }
});
