import { Type, type Static } from "@sinclair/typebox";

/**
 * Common metadata fields shared by course, module, and material schemas.
 */
export const BaseSchema = Type.Object({
  $schema: Type.Optional(Type.String({ description: "JSON Schema reference URI." })),
  title: Type.String({ minLength: 1, description: "Human-readable title." }),
  description: Type.Optional(Type.String({ description: "This helps people discover your content." })),
  keywords: Type.Optional(Type.Array(Type.String(), { description: "This helps people discover your content." })),
});

export type Base = Static<typeof BaseSchema>;
