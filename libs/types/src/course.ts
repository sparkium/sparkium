import { Type, type Static } from "@sinclair/typebox";
import { BaseSchema } from "./base.js";

/**
 * A person who has been involved in creating or maintaining this course.
 * Can be a plain string (e.g. "Alice <alice@example.com> (https://example.com)")
 * or an object with structured fields — mirrors the `person` definition in package.json.
 */
export const PersonSchema = Type.Union(
  [
    Type.String({
      description: 'Shorthand form: "Name <email> (url)".',
    }),
    Type.Object(
      {
        name: Type.String({ description: "Full name of the person." }),
        email: Type.Optional(Type.String({ format: "email", description: "Email address." })),
        url: Type.Optional(Type.String({ format: "uri", description: "Personal or profile URL." })),
      },
      { additionalProperties: false },
    ),
  ],
  { description: "A person who has been involved in creating or maintaining this course." },
);

export type Person = Static<typeof PersonSchema>;

/**
 * A Sparkium eLearning course — the root of the content hierarchy.
 * Maps to a `course.config.json` at the root of a course folder.
 */
export const CourseSchema = Type.Composite(
  [
    BaseSchema,
    Type.Object({
      version: Type.Optional(Type.String({ description: "Version must be parseable by node-semver." })),
      authors: Type.Optional(Type.Array(PersonSchema, { description: "List of people who authored this course." })),
      homepage: Type.Optional(Type.String({ format: "uri", description: "The URL to the course homepage." })),
      repository: Type.Optional(
        Type.Union([
          Type.String({ description: "Shorthand repository URL." }),
          Type.Object(
            {
              type: Type.Optional(Type.String({ description: 'Version control type, e.g. "git".' })),
              url: Type.Optional(Type.String({ description: "Repository URL." })),
              directory: Type.Optional(Type.String({ description: "Path to the course within the repository." })),
            },
            { additionalProperties: false },
          ),
        ]),
      ),
      language: Type.Optional(
        Type.String({
          pattern: "^[a-z]{2,3}(-[A-Z]{2,3})?$",
          description: 'BCP 47 language tag, e.g. "en", "de-CH".',
          examples: ["en", "de", "de-CH", "fr"],
        }),
      ),
    }),
  ],
  {
    $id: "course",
    title: "Course",
    description: "Configuration schema for a Sparkium eLearning course.",
    additionalProperties: false,
  },
);

export type Course = Static<typeof CourseSchema>;
