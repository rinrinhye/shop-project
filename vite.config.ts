import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import postcssSprites from "postcss-sprites";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [
        mode === "production" &&
          (postcssSprites as unknown as (opts: any) => any)({
            spritePath: "public/sprites",
            retina: true,
          }),
      ].filter(Boolean),
    },
  },
}));
