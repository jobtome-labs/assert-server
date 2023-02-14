import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  splitting: false,
  sourcemap: true,
  external: ["react", "react-dom"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
});
