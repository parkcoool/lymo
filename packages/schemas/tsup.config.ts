import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/database/index.ts",
    "src/functions/index.ts",
    "src/shared/index.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
