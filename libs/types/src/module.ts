import { Type, type Static } from "@sinclair/typebox";

/**
 * A module is a top-level grouping of materials inside a course (maps to a sub-folder).
 * Optionally configured via a `module.config.json` inside the module folder.
 */
export const ModuleSchema = Type.Object(
  {
    $schema: Type.Optional(Type.String({ description: "JSON Schema reference URI." })),
    title: Type.String({ minLength: 1, description: "Human-readable title of the module." }),
    description: Type.Optional(Type.String({ description: "Short summary of the module." })),
    order: Type.Optional(
      Type.Integer({
        minimum: 0,
        description: "Explicit sort order. Lower numbers appear first.",
      }),
    ),
  },
  {
    $id: "module",
    title: "Module",
    description: "Optional configuration schema for a Sparkium course module (folder).",
    additionalProperties: false,
  },
);

export type Module = Static<typeof ModuleSchema>;
