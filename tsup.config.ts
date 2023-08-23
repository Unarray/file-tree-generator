import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: {
    "main": "src/FileTreeGenerator.ts"
  },
  minify: !options.watch,
  format: "cjs",
  outDir: "./"
}));