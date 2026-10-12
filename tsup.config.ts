import { defineConfig } from "tsup";

// ESM build with type declarations for the published package; the monorepo imports the source.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  // tsup sets baseUrl for the declaration build, which TypeScript 6 deprecates.
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  clean: true,
});
