/**
 * Generates versioned JSON Schema files from all TypeBox schema definitions.
 *
 * Output layout (mirrors the schema.sparkium.org repository structure):
 *   dist/schemas/{version}/course.json
 *   dist/schemas/{version}/module.json
 *   dist/schemas/{version}/material.json
 *
 * Each schema's $id is rewritten to its canonical public URL:
 *   https://schema.sparkium.org/{version}/{name}.json
 *
 * Run via:
 *   pnpm exec nx run @sparkium/types:generate-schemas
 */

import { writeFileSync, mkdirSync, rmSync, symlinkSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CourseSchema, ModuleSchema, MaterialSchema } from "../src/index.js";
import packageJson from "../package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://schema.sparkium.org";
const { version } = packageJson;

const schemas = [CourseSchema, ModuleSchema, MaterialSchema];

const schemasDir = join(__dirname, "..", "dist", "schemas");
const outDir = join(schemasDir, version);
const latestLink = join(schemasDir, "latest");
mkdirSync(outDir, { recursive: true });

for (const schema of schemas) {
  const name = schema.$id as string;
  const filename = `${name}.json`;
  const canonicalId = `${BASE_URL}/${version}/${filename}`;

  const output = { ...schema, $id: canonicalId };

  writeFileSync(join(outDir, filename), JSON.stringify(output, null, 2) + "\n");
  console.log(`  ✓ dist/schemas/${version}/${filename}`);
}

// Point latest/ symlink at the current version folder
if (existsSync(latestLink)) {
  rmSync(latestLink, { recursive: true });
}
symlinkSync(version, latestLink);
console.log(`  ✓ dist/schemas/latest → ${version} (symlink)`);

console.log(`\nGenerated ${schemas.length} schemas → dist/schemas/${version}/`);
