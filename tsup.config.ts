import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/vite-plugin/index.ts"
  ],

  format: ["esm", "cjs"],

  dts: true,

  splitting: true,

  sourcemap: true,

  clean: true,

  external: [
    "react",
    "react-dom",
    "vite"
  ]
});