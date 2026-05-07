import { Type, type Static } from "@sinclair/typebox";
import { BaseSchema } from "./base.js";

/**
 * A module is a top-level grouping of materials inside a course (maps to a sub-folder).
 * Optionally configured via a `module.config.json` inside the module folder.
 */
export const ModuleSchema = Type.Composite([BaseSchema], {
  $id: "module",
  title: "Module",
  description: "Optional configuration schema for a Sparkium course module (folder).",
  additionalProperties: false,
});

export type Module = Static<typeof ModuleSchema>;
