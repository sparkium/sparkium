import { Type, type Static } from "@sinclair/typebox";

/**
 * A Sparkium eLearning course — the root of the content hierarchy.
 * Maps to a `course.config.json` at the root of a course folder.
 */
export const CourseSchema = Type.Object(
  {
    title: Type.String({ minLength: 1, description: "Human-readable title of the course." }),
    description: Type.Optional(Type.String({ description: "Short summary of what the course covers." })),
    version: Type.Optional(Type.String({ description: "Semantic version of the course content." })),
    authors: Type.Optional(Type.Array(Type.String(), { description: "List of author names or identifiers." })),
    tags: Type.Optional(Type.Array(Type.String(), { description: "Free-form tags for categorization and search." })),
    language: Type.Optional(
      Type.String({
        pattern: "^[a-z]{2,3}(-[A-Z]{2,3})?$",
        description: 'BCP 47 language tag, e.g. "en", "de-CH".',
        examples: ["en", "de", "de-CH", "fr"],
      }),
    ),
  },
  {
    $id: "course",
    title: "Course",
    description: "Configuration schema for a Sparkium eLearning course.",
  },
);

export type Course = Static<typeof CourseSchema>;
