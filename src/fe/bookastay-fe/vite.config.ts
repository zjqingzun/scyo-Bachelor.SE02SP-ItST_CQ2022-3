import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    plugins: [react()],
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./src"), // Thêm alias để hỗ trợ "~"
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        css: true,
        reporters: ["verbose"],
        coverage: {
            reporter: ["text", "json", "html"],
            include: ["src/**/*"],
            exclude: [],
        },
    },
    assetsInclude: ["**/*.m4v"],
});
