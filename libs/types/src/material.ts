import { Type, type Static } from "@sinclair/typebox";
import { BaseSchema } from "./base.js";

/**
 * Front-matter schema for individual eLearning materials (lessons, exercises, etc.).
 */
export const MaterialSchema = Type.Composite(
  [
    BaseSchema,
    Type.Object({
      type: Type.Optional(
        Type.Union([Type.Literal("lesson"), Type.Literal("exercise"), Type.Literal("quiz"), Type.Literal("resource")], {
          description: "Semantic type of the material.",
        }),
      ),
      tags: Type.Optional(Type.Array(Type.String(), { description: "Free-form tags for categorization and search." })),
    }),
  ],
  {
    $id: "material",
    title: "Material",
    description: "Front-matter schema for a Sparkium eLearning material (lesson, exercise, etc.).",
    additionalProperties: false,
  },
);

export type Material = Static<typeof MaterialSchema>;
