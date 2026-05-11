import { resolve } from "node:path";

export const config = {
  PORT: parseInt(process.env["PORT"] ?? "3000", 10),
  /** Absolute path to the directory where Git repos are cached. */
  CACHE_DIR: resolve(process.env["CACHE_DIR"] ?? ".cache"),
  /**
   * Path within the cloned repo that contains courses, relative to the repo
   * root. Defaults to the repo root itself.
   * Example: "examples/courses"
   */
  CONTENT_ROOT: process.env["CONTENT_ROOT"] ?? ".",
} as const;
