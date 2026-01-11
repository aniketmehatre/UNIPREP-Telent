import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000, // default is 500 KB
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings about dynamic imports in third-party libraries (PDF.js, QuickJS)
        if (
          warning.code === "DYNAMIC_IMPORT" ||
          warning.message?.includes("dynamic import") ||
          warning.message?.includes("cannot be analyzed by Vite")
        ) {
          return;
        }
        // Use default warning handler for other warnings
        warn(warning);
      },
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
});
