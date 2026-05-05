import { Type, type Static } from "@sinclair/typebox";

/**
 * Front-matter schema for individual eLearning materials (lessons, exercises, etc.).
 */
export const MaterialSchema = Type.Object(
  {
    $schema: Type.Optional(Type.String({ description: "JSON Schema reference URI." })),
    title: Type.String({ minLength: 1, description: "Human-readable title of the material." }),
    description: Type.Optional(Type.String({ description: "Short summary shown in navigation and previews." })),
    type: Type.Optional(
      Type.Union([Type.Literal("lesson"), Type.Literal("exercise"), Type.Literal("quiz"), Type.Literal("resource")], {
        description: "Semantic type of the material.",
      }),
    ),
    order: Type.Optional(
      Type.Integer({
        minimum: 0,
        description: "Explicit sort order within the parent module. Lower numbers appear first.",
      }),
    ),
    duration: Type.Optional(
      Type.Integer({
        minimum: 1,
        description: "Estimated reading/viewing time in minutes.",
      }),
    ),
    tags: Type.Optional(Type.Array(Type.String(), { description: "Free-form tags for categorization and search." })),
  },
  {
    $id: "material",
    title: "Material",
    description: "Front-matter schema for a Sparkium eLearning material (lesson, exercise, etc.).",
    additionalProperties: false,
  },
);

export type Material = Static<typeof MaterialSchema>;
