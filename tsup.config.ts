import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: {
    "main": "src/FileTreeGenerator.ts"
  },
  noExternal: [
    "ignore"
  ],
  minify: !options.watch,
  format: "cjs",
  outDir: "./"
}));