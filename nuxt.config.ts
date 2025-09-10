import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["shadcn-nuxt", "@vueuse/nuxt"],
  devtools: { enabled: true },
  css: ["@/app/assets/css/main.css"],
  plugins: ["@/app/plugins/ssr-width.ts"],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
    plugins: [tailwindcss()],
  },
  alias: {
    "@": path.resolve(__dirname, "./"),
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
    componentDir: "@/app/components/ui",
  },
});
