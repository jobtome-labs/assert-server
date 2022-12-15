import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  format: ["cjs"],
  dts: false,
  clean: true,
});
