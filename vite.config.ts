import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: { allowedHosts: true, host: "0.0.0.0" },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes("node_modules")) return;
                    if (/three|@react-three/.test(id)) return "three";
                    return "vendor";
                },
            },
        },
    },
});
