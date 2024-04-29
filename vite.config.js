import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/js/app.tsx",
                "resources/js/Pages/Dashboard.tsx",
                "resources/js/Pages/Settings/Settings.tsx",
                "resources/js/Pages/Auth/Login.tsx",
            ],
            refresh: true,
        }),
        react(),
    ],
});
