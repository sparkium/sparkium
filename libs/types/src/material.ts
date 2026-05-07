import { Type, type Static } from "@sinclair/typebox";
import { BaseSchema } from "./base.js";

const BodySchema = Type.Object({
  body: Type.Optional(
    Type.String({
      format: "uri-reference",
      description: "Relative path or URL to a Markdown (.md) or HTML (.html) file used as the body content.",
    }),
  ),
});

const FileResultSchema = Type.Object(
  {
    type: Type.Literal("file"),
    allowedFileTypes: Type.Optional(
      Type.Array(Type.String(), {
        description: 'Accepted MIME types or file extensions (e.g. "image/png", ".pdf").',
      }),
    ),
    maxFileSize: Type.Optional(Type.Integer({ minimum: 1, description: "Maximum allowed file size in bytes." })),
  },
  { additionalProperties: false },
);

const LinkResultSchema = Type.Object(
  {
    type: Type.Literal("link"),
  },
  { additionalProperties: false },
);

const TextResultSchema = Type.Object(
  {
    type: Type.Literal("text"),
    minLength: Type.Optional(Type.Integer({ minimum: 0, description: "Minimum number of characters required." })),
    maxLength: Type.Optional(Type.Integer({ minimum: 1, description: "Maximum number of characters allowed." })),
  },
  { additionalProperties: false },
);

export const ExerciseResultSchema = Type.Union([FileResultSchema, LinkResultSchema, TextResultSchema], {
  discriminator: "type",
  description: "Expected result type for the exercise.",
});

export type ExerciseResult = Static<typeof ExerciseResultSchema>;

export const PageMaterialSchema = Type.Composite(
  [BaseSchema, BodySchema, Type.Object({ type: Type.Literal("page") })],
  {
    additionalProperties: false,
  },
);

export const ExerciseMaterialSchema = Type.Composite(
  [
    BaseSchema,
    BodySchema,
    Type.Object({
      type: Type.Literal("exercise"),
      result: Type.Optional(ExerciseResultSchema),
    }),
  ],
  { additionalProperties: false },
);

export const LinkMaterialSchema = Type.Composite(
  [
    BaseSchema,
    Type.Object({
      type: Type.Literal("link"),
      href: Type.String({ format: "uri", description: "URL this material links to." }),
    }),
  ],
  { additionalProperties: false },
);

export type PageMaterial = Static<typeof PageMaterialSchema>;
export type ExerciseMaterial = Static<typeof ExerciseMaterialSchema>;
export type LinkMaterial = Static<typeof LinkMaterialSchema>;

// ---------------------------------------------------------------------------
// Material union
// ---------------------------------------------------------------------------

/**
 * Discriminated union of all Sparkium material types.
 * Use the `type` field to determine the variant.
 */
export const MaterialSchema = Type.Union([PageMaterialSchema, ExerciseMaterialSchema, LinkMaterialSchema], {
  $id: "material",
  title: "Material",
  description: "Front-matter schema for a Sparkium eLearning material.",
  discriminator: "type",
});

export type Material = Static<typeof MaterialSchema>;
