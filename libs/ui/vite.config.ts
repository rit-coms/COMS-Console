import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import { dependencies as peerDependencies } from "./package.json"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import postcssNesting from "postcss-nesting"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    dts({
      include: ["src"],
      outDir: "dist",
      tsconfigPath: "./tsconfig.app.json",
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "quackbox-design-system",
      fileName: (format) => `quackbox-design-system.${format}.js`,
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      output: { 
        globals: { react: "React", "react-dom": "ReactDOM" }
      } 
    }
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]_[local]_[hash:base64:6]"
    },
    postcss: {
      plugins: [postcssNesting()]
    }
  }

})
